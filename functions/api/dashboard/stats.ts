// Cloudflare Pages Function: /api/dashboard/stats
// Aggregated counters for the admin dashboard.

interface Env {
  CRM_DB: D1Database;
}

function json(status: number, data: unknown): Response {
  return new Response(JSON.stringify(data), {
    status,
    headers: {
      "Content-Type": "application/json",
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET, OPTIONS",
      "Access-Control-Allow-Headers": "Authorization, Content-Type",
    },
  });
}

export const onRequestOptions: PagesFunction<Env> = async () => json(204, {});

export const onRequestGet: PagesFunction<Env> = async ({ env }) => {
  try {
    const db = env.CRM_DB;

    const one = async (sql: string) => {
      const row = (await db.prepare(sql).first()) as any;
      return row?.c ?? 0;
    };

    const [total, newLeads, contacted, qualified, appointment, converted, lost] =
      await Promise.all([
        one("SELECT COUNT(*) as c FROM leads"),
        one("SELECT COUNT(*) as c FROM leads WHERE status = 'new'"),
        one("SELECT COUNT(*) as c FROM leads WHERE status = 'contacted'"),
        one("SELECT COUNT(*) as c FROM leads WHERE status = 'qualified'"),
        one("SELECT COUNT(*) as c FROM leads WHERE status = 'appointment'"),
        one("SELECT COUNT(*) as c FROM leads WHERE status = 'converted'"),
        one("SELECT COUNT(*) as c FROM leads WHERE status = 'lost'"),
      ]);

    const interactions = await one("SELECT COUNT(*) as c FROM interactions");
    const totalVisitors = await one("SELECT COUNT(*) as c FROM visitors");
    const uniqueEmails = await one(
      "SELECT COUNT(DISTINCT email) as c FROM visitors WHERE email IS NOT NULL"
    );

    const sourceRows = await db
      .prepare(
        `SELECT utm_source, COUNT(*) as c FROM visitors
         WHERE utm_source IS NOT NULL
         GROUP BY utm_source ORDER BY c DESC LIMIT 10`
      )
      .all();
    const sources: Record<string, number> = {};
    for (const r of (sourceRows.results ?? []) as any[]) sources[r.utm_source] = r.c;

    const conversionRate = total > 0 ? Math.round((converted / total) * 100) : 0;

    return json(200, {
      leads: {
        total,
        new: newLeads,
        byStatus: { new: newLeads, contacted, qualified, appointment, converted, lost },
        conversionRate,
      },
      interactions,
      visitors: { total: totalVisitors, unique: uniqueEmails },
      sources,
    });
  } catch (e: any) {
    return json(500, { error: e.message });
  }
};
