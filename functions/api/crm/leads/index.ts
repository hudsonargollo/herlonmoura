// Cloudflare Pages Function: /api/crm/leads
// Handles GET (list) and POST (create) for CRM leads

interface Env {
  CRM_DB: D1Database;
}

export const onRequestGet: PagesFunction<Env> = async ({ request, env }) => {
  try {
    const db = env.CRM_DB;
    const url = new URL(request.url);
    const status = url.searchParams.get("status");

    let results;
    if (status && status !== "all") {
      results = await db
        .prepare("SELECT * FROM leads WHERE status = ? ORDER BY created_at DESC")
        .bind(status)
        .all();
    } else {
      results = await db
        .prepare("SELECT * FROM leads ORDER BY created_at DESC")
        .all();
    }
    const leads = results.results ?? [];

    const totalR = (await db.prepare("SELECT COUNT(*) as c FROM leads").first()) as any;
    const newR = (await db
      .prepare("SELECT COUNT(*) as c FROM leads WHERE status = 'new'")
      .first()) as any;

    return Response.json({
      leads,
      stats: { total: totalR?.c ?? 0, new: newR?.c ?? 0 },
    });
  } catch (e: any) {
    return Response.json({ error: e.message }, { status: 500 });
  }
};

export const onRequestPost: PagesFunction<Env> = async ({ request, env }) => {
  try {
    const db = env.CRM_DB;
    const body = (await request.json()) as any;
    const id = crypto.randomUUID();
    const now = new Date().toISOString();

    await db
      .prepare(
        "INSERT INTO leads (id, name, whatsapp, email, source, source_detail, status, score, tags, notes, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)"
      )
      .bind(
        id,
        body.name ?? "",
        body.whatsapp ?? body.phone ?? "",
        body.email ?? null,
        body.source ?? "contact",
        body.source_detail ?? body.subject ?? null,
        body.status ?? "new",
        body.score ?? body.riskScore ?? 0,
        JSON.stringify(body.tags ?? []),
        body.notes ?? "",
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

    return Response.json({ id, created_at: now }, { status: 201 });
  } catch (e: any) {
    return Response.json({ error: e.message }, { status: 500 });
  }
};
