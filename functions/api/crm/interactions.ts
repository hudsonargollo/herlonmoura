// Cloudflare Pages Function: /api/crm/interactions
// POST — add an interaction to a lead's timeline
// GET  — list interactions for a lead (used by CRMLeadDetail)
// DELETE — remove an interaction

interface Env {
  CRM_DB: D1Database;
  JWT_SECRET: string;
}

interface Interaction {
  id: string;
  lead_id: string;
  visitor_id?: string | null;
  type: string;
  metadata: string;
  created_at: string;
}

function json(status: number, data: unknown): Response {
  return new Response(JSON.stringify(data), {
    status,
    headers: {
      "Content-Type": "application/json",
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET, POST, DELETE, OPTIONS",
      "Access-Control-Allow-Headers": "Authorization, Content-Type",
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

export const onRequestOptions: PagesFunction<Env> = async () => json(204, {});

// POST /api/crm/interactions - add interaction
export const onRequestPost: PagesFunction<Env> = async ({ request, env }) => {
  const user = await verifyAuth(request, env);
  if (!user) return json(401, { error: "Unauthorized" });

  try {
    const body = (await request.json()) as Partial<Interaction>;
    if (!body.lead_id || !body.type) {
      return json(400, { error: "lead_id and type are required" });
    }

    const db = env.CRM_DB;
    const id = crypto.randomUUID();
    const now = new Date().toISOString();

    await db
      .prepare(
        "INSERT INTO interactions (id, lead_id, visitor_id, type, metadata, created_at) VALUES (?, ?, ?, ?, ?, ?)"
      )
      .bind(
        id,
        body.lead_id,
        body.visitor_id ?? null,
        body.type,
        JSON.stringify(body.metadata ?? {}),
        now
      )
      .run();

    // Also add to lead's status_history if it's a status_change
    if (body.type === "status_change" && body.metadata) {
      const meta: any = JSON.parse(typeof body.metadata === "string" ? body.metadata : "{}");
      const lead = await db
        .prepare("SELECT status_history FROM leads WHERE id = ?")
        .bind(body.lead_id)
        .first<{ status_history: string }>();

      if (lead) {
        const history = JSON.parse(lead.status_history || "[]");
        history.push({
          status: meta.to ?? body.type,
          timestamp: now,
          note: meta.note
        });
        await db
          .prepare("UPDATE leads SET status_history = ?, status_changed_at = ? WHERE id = ?")
          .bind(JSON.stringify(history), now, body.lead_id)
          .run();
      }
    }

    return json(201, { ok: true, id });
  } catch (e: any) {
    return json(500, { error: e.message });
  }
};

// GET /api/crm/interactions?lead_id=xxx - list interactions for a lead
export const onRequestGet: PagesFunction<Env> = async ({ request, env }) => {
  const user = await verifyAuth(request, env);
  if (!user) return json(401, { error: "Unauthorized" });

  try {
    const url = new URL(request.url);
    const leadId = url.searchParams.get("lead_id");
    if (!leadId) return json(400, { error: "lead_id is required" });

    const db = env.CRM_DB;
    const interactions = await db
      .prepare("SELECT * FROM interactions WHERE lead_id = ? ORDER BY created_at DESC")
      .bind(leadId)
      .all();

    return json(200, { interactions: interactions.results ?? [] });
  } catch (e: any) {
    return json(500, { error: e.message });
  }
};

// DELETE /api/crm/interactions/:id
export const onRequestDelete: PagesFunction<Env> = async ({ request, env, params }) => {
  const user = await verifyAuth(request, env);
  if (!user) return json(401, { error: "Unauthorized" });

  try {
    const id = String(params.id);
    const db = env.CRM_DB;
    await db.prepare("DELETE FROM interactions WHERE id = ?").bind(id).run();
    return json(200, { ok: true });
  } catch (e: any) {
    return json(500, { error: e.message });
  }
};
