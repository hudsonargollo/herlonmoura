// Cloudflare Pages Function: /api/crm/leads
// GET  — list leads (optional ?status=, ?source=, ?limit=) + stats
// POST — create a lead from contact form / questionnaire / test / freebie

interface Env {
  CRM_DB: D1Database;
}

const VALID_STATUSES = [
  "new",
  "contacted",
  "qualified",
  "appointment",
  "converted",
  "lost",
] as const;

function json(status: number, data: unknown): Response {
  return new Response(JSON.stringify(data), {
    status,
    headers: {
      "Content-Type": "application/json",
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
      "Access-Control-Allow-Headers": "Authorization, Content-Type",
    },
  });
}

function parseHistory(raw: unknown): Array<{ status: string; timestamp: string; note?: string }> {
  if (typeof raw !== "string" || !raw.trim()) return [];
  try {
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export const onRequestOptions: PagesFunction<Env> = async () => json(204, {});

export const onRequestGet: PagesFunction<Env> = async ({ request, env }) => {
  try {
    const db = env.CRM_DB;
    const url = new URL(request.url);
    const status = url.searchParams.get("status");
    const source = url.searchParams.get("source");
    const limit = Math.min(parseInt(url.searchParams.get("limit") || "200", 10) || 200, 500);

    let query = "SELECT * FROM leads WHERE 1=1";
    const binds: any[] = [];
    if (status && status !== "all") {
      query += " AND status = ?";
      binds.push(status);
    }
    if (source && source !== "all") {
      query += " AND source = ?";
      binds.push(source);
    }
    query += " ORDER BY created_at DESC LIMIT ?";
    binds.push(limit);

    const results = await db.prepare(query).bind(...binds).all();
    const leads = (results.results ?? []).map((row: any) => ({
      ...row,
      status_history: parseHistory(row.status_history),
    }));

    const totalR = (await db.prepare("SELECT COUNT(*) as c FROM leads").first()) as any;
    const newR = (await db
      .prepare("SELECT COUNT(*) as c FROM leads WHERE status = 'new'")
      .first()) as any;

    // Per-status counts for the pipeline board
    const statusRows = await db
      .prepare("SELECT status, COUNT(*) as c FROM leads GROUP BY status")
      .all();
    const byStatus: Record<string, number> = {};
    for (const r of (statusRows.results ?? []) as any[]) byStatus[r.status] = r.c;

    return json(200, {
      leads,
      stats: { total: totalR?.c ?? 0, new: newR?.c ?? 0, byStatus },
    });
  } catch (e: any) {
    return json(500, { error: e.message });
  }
};

export const onRequestPost: PagesFunction<Env> = async ({ request, env }) => {
  try {
    const db = env.CRM_DB;
    const body = (await request.json()) as Record<string, any>;
    const id = crypto.randomUUID();
    const now = new Date().toISOString();

    const status = body.status ?? "new";
    if (!VALID_STATUSES.includes(status)) {
      return json(400, { error: `Invalid status: ${status}`, valid: VALID_STATUSES });
    }

    // First entry in the transition history is the creation itself
    const statusHistory = [{ status, timestamp: now, note: "lead created" }];

    await db
      .prepare(
        `INSERT INTO leads (
           id, name, whatsapp, email, visitor_id, source, source_detail,
           status, score, tags, notes, next_action, status_history, status_changed_at,
           utm_source, utm_medium, utm_campaign, utm_term, utm_content, landing_page,
           created_at, updated_at
         ) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)`
      )
      .bind(
        id,
        body.name ?? "",
        body.whatsapp ?? body.phone ?? "",
        body.email ?? null,
        body.visitor_id ?? null,
        body.source ?? "contact",
        body.source_detail ?? body.subject ?? null,
        status,
        body.score ?? body.riskScore ?? 0,
        JSON.stringify(body.tags ?? []),
        body.notes ?? "",
        body.next_action ?? "",
        JSON.stringify(statusHistory),
        now,
        body.utm_source ?? null,
        body.utm_medium ?? null,
        body.utm_campaign ?? null,
        body.utm_term ?? null,
        body.utm_content ?? null,
        body.landing_page ?? body.url ?? null,
        now,
        now
      )
      .run();

    const iid = crypto.randomUUID();
    await db
      .prepare(
        "INSERT INTO interactions (id, lead_id, type, metadata, created_at) VALUES (?, ?, ?, ?, ?)"
      )
      .bind(
        iid,
        id,
        body.source === "questionnaire" ? "quiz_complete" : "contact_form",
        JSON.stringify(body),
        now
      )
      .run();

    return json(201, { id, status, created_at: now });
  } catch (e: any) {
    return json(500, { error: e.message });
  }
};
