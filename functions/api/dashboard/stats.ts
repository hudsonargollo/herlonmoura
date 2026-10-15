// Cloudflare Pages Function: /api/dashboard/stats
// Aggregated counters for the admin dashboard.

interface Env {
  CRM_DB: D1Database;
  JWT_SECRET: string;
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

export const onRequestGet: PagesFunction<Env> = async ({ request, env }) => {
  const user = await verifyAuth(request, env);
  if (!user) return json(401, { error: "Unauthorized" });
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

    // Count blog posts (pending approval vs published) for the dashboard
    const [pendingPosts, publishedPosts] = await Promise.all([
      one("SELECT COUNT(*) as c FROM blog_posts WHERE status = 'approval'"),
      one("SELECT COUNT(*) as c FROM blog_posts WHERE status = 'published'"),
    ]);

    return json(200, {
      leads: {
        total,
        new: newLeads,
        byStatus: { new: newLeads, contacted, qualified, appointment, converted, lost },
        conversionRate,
      },
      interactions,
      posts: { pending: pendingPosts, published: publishedPosts },
      visitors: { total: totalVisitors, unique: uniqueEmails },
      sources,
    });
  } catch (e: any) {
    return json(500, { error: e.message });
  }
};
