// Cloudflare Pages Function: /api/analytics/events
// POST — record one or more section/CTA engagement events (public, anonymous)
// GET  — aggregate report for the admin dashboard (requires admin token)
//
// This is deliberately separate from the CRM leads table: the whole point is
// to measure interest from visitors who never submit a form.

interface Env {
  CRM_DB: D1Database;
  JWT_SECRET: string;
  ADMIN_TOKEN?: string;
}

function json(status: number, data: unknown): Response {
  return new Response(JSON.stringify(data), {
    status,
    headers: {
      "Content-Type": "application/json",
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type, Authorization",
    },
  });
}

async function verifyAuth(request: Request, env: Env): Promise<{ sub: string; role: string } | null> {
  const auth = request.headers.get("Authorization");
  if (!auth?.startsWith("Bearer ")) return null;
  const token = auth.slice(7);
  try {
    const secret = env.JWT_SECRET || "dev-secret-change-me";
    const parts = token.split(".");
    if (parts.length !== 3) return null;
    const encoder = new TextEncoder();
    const key = await crypto.subtle.importKey(
      "raw", encoder.encode(secret), { name: "HMAC", hash: "SHA-256" }, false, ["verify"]
    );
    const sig = Uint8Array.from(
      atob(parts[2].replace(/-/g, "+").replace(/_/g, "/")), (c) => c.charCodeAt(0)
    );
    const valid = await crypto.subtle.verify("HMAC", key, sig, encoder.encode(`${parts[0]}.${parts[1]}`));
    if (!valid) return null;
    const payload = JSON.parse(atob(parts[1].replace(/-/g, "+").replace(/_/g, "/")));
    if (payload.exp && payload.exp * 1000 < Date.now()) return null;
    return payload;
  } catch {
    return null;
  }
}

const VALID_EVENT_TYPES = [
  "section_view",
  "cta_click",
  "modal_open",
  "modal_submit",
  "whatsapp_click",
] as const;

/** Clamp strings so a hostile client can't stuff the table. */
function clamp(v: unknown, max = 200): string | null {
  if (typeof v !== "string" || !v.trim()) return null;
  return v.trim().slice(0, max);
}

export const onRequestOptions: PagesFunction = async () =>
  new Response(null, {
    status: 204,
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type, Authorization",
    },
  });

export const onRequestPost: PagesFunction<Env> = async ({ request, env }) => {
  try {
    const db = env.CRM_DB;
    const body = (await request.json()) as any;
    // Accept a single event or a batch.
    const events: any[] = Array.isArray(body?.events) ? body.events : [body];

    if (events.length === 0) return json(400, { error: "no events" });
    if (events.length > 50) return json(400, { error: "batch too large (max 50)" });

    const visitorId = clamp(body?.visitor_id, 64);
    const sessionId = clamp(body?.session_id, 64);

    const stmt = db.prepare(
      `INSERT INTO analytics_events
         (id, visitor_id, session_id, event_type, section_id, label, page, metadata, created_at)
       VALUES (?,?,?,?,?,?,?,?,?)`
    );

    const now = new Date().toISOString();
    const batch = [];

    for (const e of events) {
      const eventType = clamp(e?.event_type, 40);
      if (!eventType || !VALID_EVENT_TYPES.includes(eventType as any)) continue;

      batch.push(
        stmt.bind(
          crypto.randomUUID(),
          clamp(e?.visitor_id, 64) ?? visitorId,
          clamp(e?.session_id, 64) ?? sessionId,
          eventType,
          clamp(e?.section_id, 120),
          clamp(e?.label, 200),
          clamp(e?.page, 200),
          JSON.stringify(e?.metadata ?? {}).slice(0, 2000),
          now
        )
      );
    }

    if (batch.length === 0) return json(400, { error: "no valid events" });

    await db.batch(batch);
    return json(201, { ok: true, recorded: batch.length });
  } catch (e: any) {
    return json(500, { error: e.message });
  }
};

/**
 * GET — aggregated engagement report.
 * Query params: ?days=30
 */
export const onRequestGet: PagesFunction<Env> = async ({ request, env }) => {
  const user = await verifyAuth(request, env);
  if (!user) return json(401, { error: "Unauthorized" });
  try {
    const db = env.CRM_DB;
    const url = new URL(request.url);
    const days = Math.min(Math.max(parseInt(url.searchParams.get("days") || "30", 10) || 30, 1), 365);
    const since = `-${days} days`;

    const totals = (await db
      .prepare(
        `SELECT
           COUNT(*)                                             AS total_events,
           COUNT(DISTINCT visitor_id)                           AS unique_visitors,
           COUNT(DISTINCT session_id)                           AS sessions
         FROM analytics_events
         WHERE created_at >= datetime('now', ?)`
      )
      .bind(since)
      .first()) as any;

    // Which sections get seen, and how often they convert to a CTA click.
    const sections = await db
      .prepare(
        `SELECT
           section_id,
           SUM(CASE WHEN event_type = 'section_view' THEN 1 ELSE 0 END) AS views,
           SUM(CASE WHEN event_type = 'cta_click'    THEN 1 ELSE 0 END) AS cta_clicks,
           SUM(CASE WHEN event_type = 'modal_open'   THEN 1 ELSE 0 END) AS modal_opens,
           SUM(CASE WHEN event_type = 'modal_submit' THEN 1 ELSE 0 END) AS modal_submits,
           SUM(CASE WHEN event_type = 'whatsapp_click' THEN 1 ELSE 0 END) AS whatsapp_clicks
         FROM analytics_events
         WHERE created_at >= datetime('now', ?) AND section_id IS NOT NULL
         GROUP BY section_id
         ORDER BY views DESC`
      )
      .bind(since)
      .all();

    // Top interest labels (procedure titles, button texts).
    const interests = await db
      .prepare(
        `SELECT label, COUNT(*) AS clicks
         FROM analytics_events
         WHERE created_at >= datetime('now', ?)
           AND event_type IN ('cta_click','modal_submit','whatsapp_click')
           AND label IS NOT NULL
         GROUP BY label
         ORDER BY clicks DESC
         LIMIT 25`
      )
      .bind(since)
      .all();

    // Leads captured, broken down by the interest they declared.
    const leadInterests = await db
      .prepare(
        `SELECT COALESCE(interest, 'não informado') AS interest, COUNT(*) AS leads
         FROM leads
         WHERE created_at >= datetime('now', ?)
         GROUP BY COALESCE(interest, 'não informado')
         ORDER BY leads DESC
         LIMIT 25`
      )
      .bind(since)
      .all();

    // Daily trend so a change in conversion is visible over time.
    const daily = await db
      .prepare(
        `SELECT
           date(created_at) AS day,
           SUM(CASE WHEN event_type = 'section_view'  THEN 1 ELSE 0 END) AS views,
           SUM(CASE WHEN event_type = 'cta_click'     THEN 1 ELSE 0 END) AS cta_clicks,
           SUM(CASE WHEN event_type = 'modal_submit'  THEN 1 ELSE 0 END) AS submits
         FROM analytics_events
         WHERE created_at >= datetime('now', ?)
         GROUP BY date(created_at)
         ORDER BY day DESC
         LIMIT 60`
      )
      .bind(since)
      .all();

    return json(200, {
      window_days: days,
      totals: totals ?? { total_events: 0, unique_visitors: 0, sessions: 0 },
      sections: sections.results ?? [],
      interests: interests.results ?? [],
      lead_interests: leadInterests.results ?? [],
      daily: daily.results ?? [],
    });
  } catch (e: any) {
    return json(500, { error: e.message });
  }
};
