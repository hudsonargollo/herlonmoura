// Cloudflare Pages Function: /api/crm/leads/[id]
// GET    — lead detail + interaction timeline
// PATCH  — status transition (records status_history + status_changed_at)
// PUT    — alias of PATCH (the admin UI uses PUT)
// DELETE — remove a lead and its interactions

interface Env {
  CRM_DB: D1Database;
}

// Canonical pipeline vocabulary. Kept in sync with:
//   wrangler/d1/schema.sql, app/admin/crm/page.tsx, components/admin/*.tsx
const VALID_STATUSES = [
  "new",
  "contacted",
  "qualified",
  "appointment",
  "converted",
  "lost",
] as const;

type Status = (typeof VALID_STATUSES)[number];

// Allowed forward transitions. `lost` is reachable from anywhere.
const TRANSITIONS: Record<Status, Status[]> = {
  new: ["contacted", "qualified", "appointment", "converted", "lost"],
  contacted: ["qualified", "appointment", "converted", "lost"],
  qualified: ["appointment", "converted", "lost"],
  appointment: ["converted", "lost"],
  converted: ["lost"],
  lost: ["contacted", "qualified", "appointment", "converted"],
};

function parseHistory(raw: unknown): Array<{ status: string; timestamp: string; note?: string }> {
  if (Array.isArray(raw)) return raw as any;
  if (typeof raw !== "string" || !raw.trim()) return [];
  try {
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function json(status: number, data: unknown): Response {
  return new Response(JSON.stringify(data), {
    status,
    headers: {
      "Content-Type": "application/json",
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET, PATCH, PUT, DELETE, OPTIONS",
      "Access-Control-Allow-Headers": "Authorization, Content-Type",
    },
  });
}

export const onRequestOptions: PagesFunction<Env> = async () => json(204, {});

export const onRequestGet: PagesFunction<Env> = async ({ env, params }) => {
  try {
    const id = String(params.id);
    const db = env.CRM_DB;

    const lead = await db.prepare("SELECT * FROM leads WHERE id = ?").bind(id).first();
    if (!lead) return json(404, { error: "lead not found" });

    const interactions = await db
      .prepare("SELECT * FROM interactions WHERE lead_id = ? ORDER BY created_at DESC")
      .bind(id)
      .all();

    const row = lead as any;
    return json(200, {
      lead: { ...row, status_history: parseHistory(row.status_history) },
      interactions: interactions.results ?? [],
    });
  } catch (e: any) {
    return json(500, { error: e.message });
  }
};

async function applyUpdate(
  request: Request,
  env: Env,
  id: string
): Promise<Response> {
  try {
    const db = env.CRM_DB;
    const body = (await request.json()) as Record<string, any>;

    const existing = (await db
      .prepare("SELECT * FROM leads WHERE id = ?")
      .bind(id)
      .first()) as any;
    if (!existing) return json(404, { error: "lead not found" });

    const now = new Date().toISOString();
    const sets: string[] = [];
    const values: any[] = [];
    let historyChanged = false;
    let history = parseHistory(existing.status_history);

    if (body.status !== undefined) {
      const next = String(body.status) as Status;
      if (!VALID_STATUSES.includes(next)) {
        return json(400, {
          error: `Invalid status: ${body.status}`,
          valid: VALID_STATUSES,
        });
      }
      if (next !== existing.status) {
        const allowed = TRANSITIONS[existing.status as Status] ?? [];
        if (!allowed.includes(next)) {
          return json(409, {
            error: `Transition ${existing.status} -> ${next} not allowed`,
            allowed,
          });
        }
        history = [
          ...history,
          { status: next, timestamp: now, ...(body.note ? { note: String(body.note) } : {}) },
        ];
        historyChanged = true;
        sets.push("status = ?", "status_changed_at = ?", "status_history = ?");
        values.push(next, now, JSON.stringify(history));
      }
    }

    if (body.next_action !== undefined) {
      sets.push("next_action = ?");
      values.push(String(body.next_action));
    }
    if (body.tags !== undefined) {
      sets.push("tags = ?");
      values.push(typeof body.tags === "string" ? body.tags : JSON.stringify(body.tags));
    }
    if (body.notes !== undefined) {
      sets.push("notes = ?");
      values.push(String(body.notes));
    }
    if (body.score !== undefined) {
      sets.push("score = ?");
      values.push(Number(body.score));
    }
    if (body.email !== undefined) {
      sets.push("email = ?");
      values.push(body.email || null);
    }
    if (body.whatsapp !== undefined) {
      sets.push("whatsapp = ?");
      values.push(String(body.whatsapp));
    }

    if (sets.length === 0) {
      return json(400, { error: "No fields to update" });
    }

    sets.push("updated_at = ?");
    values.push(now);
    values.push(id);

    await db
      .prepare(`UPDATE leads SET ${sets.join(", ")} WHERE id = ?`)
      .bind(...values)
      .run();

    // Log the transition as an interaction so it shows in the timeline
    if (historyChanged) {
      await db
        .prepare(
          "INSERT INTO interactions (id, lead_id, type, metadata, created_at) VALUES (?, ?, ?, ?, ?)"
        )
        .bind(
          crypto.randomUUID(),
          id,
          "status_change",
          JSON.stringify({ from: existing.status, to: body.status, note: body.note ?? null }),
          now
        )
        .run();
    }

    const row = (await db.prepare("SELECT * FROM leads WHERE id = ?").bind(id).first()) as any;
    return json(200, { lead: { ...row, status_history: parseHistory(row.status_history) } });
  } catch (e: any) {
    return json(500, { error: e.message });
  }
}

export const onRequestPatch: PagesFunction<Env> = async ({ request, env, params }) =>
  applyUpdate(request, env, String(params.id));

export const onRequestPut: PagesFunction<Env> = async ({ request, env, params }) =>
  applyUpdate(request, env, String(params.id));

export const onRequestDelete: PagesFunction<Env> = async ({ env, params }) => {
  try {
    const id = String(params.id);
    const db = env.CRM_DB;
    await db.prepare("DELETE FROM interactions WHERE lead_id = ?").bind(id).run();
    await db.prepare("DELETE FROM leads WHERE id = ?").bind(id).run();
    return json(200, { ok: true, id });
  } catch (e: any) {
    return json(500, { error: e.message });
  }
};
