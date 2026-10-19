// Cloudflare Pages Function: /api/admin/reports/visitors
// Per-visitor timeline (page views, leads, conversions over a rolling window).

interface Env {
  CRM_DB: D1Database;
  JWT_SECRET?: string;
}

function json(status: number, data: unknown): Response {
  return new Response(JSON.stringify(data), {
    status,
    headers: {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, OPTIONS',
      'Access-Control-Allow-Headers': 'Authorization, Content-Type',
    },
  });
}

export const onRequestOptions: PagesFunction<Env> = async () => json(204, {});

async function verifyAuth(request: Request, env: Env): Promise<{ sub: string; email: string; role: string } | null> {
  const auth = request.headers.get('Authorization');
  if (!auth?.startsWith('Bearer ')) return null;
  const token = auth.slice(7);
  try {
    const secret = env.JWT_SECRET || 'dev-secret-change-me';
    const parts = token.split('.');
    if (parts.length !== 3) return null;
    const encoder = new TextEncoder();
    const key = await crypto.subtle.importKey(
      'raw', encoder.encode(secret), { name: 'HMAC', hash: 'SHA-256' }, false, ['verify']
    );
    const sig = Uint8Array.from(
      atob(parts[2].replace(/-/g, '+').replace(/_/g, '/')), (c) => c.charCodeAt(0)
    );
    const valid = await crypto.subtle.verify('HMAC', key, sig, encoder.encode(`${parts[0]}.${parts[1]}`));
    if (!valid) return null;
    const payload = JSON.parse(atob(parts[1].replace(/-/g, '+').replace(/_/g, '/')));
    if (payload.exp && payload.exp * 1000 < Date.now()) return null;
    return { sub: payload.sub, email: payload.email, role: payload.role };
  } catch {
    return null;
  }
}

async function requireEditor(request: Request, env: Env): Promise<{ sub: string; email: string; role: string } | null> {
  const user = await verifyAuth(request, env);
  if (!user) return null;
  if (user.role !== 'admin' && user.role !== 'editor') return null;
  return user;
}

export const onRequestGet: PagesFunction<Env> = async ({ request, env }) => {
  const user = await requireEditor(request, env);
  if (!user) return json(401, { error: 'Unauthorized' });
  try {
    const db = env.CRM_DB;
    const days = Math.min(Math.max(parseInt(request.url.split('?days=')?.[1] ?? '30'), 1) ?? 30, 365);
    const since = `-${days} days`;
    const limit = Math.min(Math.max(parseInt(request.url.split('?limit=')?.[1] ?? '100'), 1) ?? 100, 500);

    const rows = await db.prepare(
      `SELECT id, email, name, first_seen, last_seen, total_visits, utm_source, utm_medium,
              utm_campaign, utm_term, utm_content, tags, notes
       FROM visitors
       WHERE last_seen >= datetime(?, ?)
       ORDER BY last_seen DESC
       LIMIT ?`
    ).bind('now', since, limit).all();

    return json(200, {
      visitors: (rows?.results ?? []).map((r: any) => ({
        id: r.id, email: r.email, name: r.name, first_seen: r.first_seen,
        last_seen: r.last_seen, total_visits: r.total_visits,
        utm_source: r.utm_source, utm_medium: r.utm_medium,
        utm_campaign: r.utm_campaign, utm_term: r.utm_term, utm_content: r.utm_content,
        tags: r.tags, notes: r.notes,
      })),
      count: (rows?.results ?? []).length,
      window_days: days,
    });
  } catch (e: any) {
    return json(500, { error: e.message });
  }
};
