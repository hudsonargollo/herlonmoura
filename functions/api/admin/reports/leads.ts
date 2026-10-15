// Cloudflare Pages Function: /api/admin/reports/leads
// Paginated lead list with full detail fields.

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

export const onRequestGet: PagesFunction<Env> = async (request, env) => {
  const user = await requireEditor(request, env);
  if (!user) return json(401, { error: 'Unauthorized' });
  try {
    const db = env.CRM_DB;
    const search = request.url.split('?search=')?.[1] ?? '';
    const status = request.url.split('?status=')?.[1] ?? '';
    const source = request.url.split('?source=')?.[1] ?? '';
    const limit = Math.min(Math.max(parseInt(request.url.split('?limit=')?.[1] ?? '50'), 1) ?? 50, 500);
    const offset = Math.max(parseInt(request.url.split('?offset=')?.[1] ?? '0'), 0) ?? 0;

    let sql = `SELECT id, name, email, whatsapp, source, source_detail, status, score, tags,
                       notes, interest, next_action, visitor_id, created_at, updated_at
               FROM leads WHERE 1=1`;
    const params: any[] = [];
    if (search) {
      sql += ` AND (name LIKE ? OR whatsapp LIKE ? OR email LIKE ?)`;
      params.push(`%${search}%`, `%${search}%`, `%${search}%`);
    }
    if (status) { sql += ` AND status = ?`; params.push(status); }
    if (source) { sql += ` AND source = ?`; params.push(source); }
    sql += ` ORDER BY created_at DESC LIMIT ? OFFSET ?`;
    params.push(limit, offset);

    const rows = await db.prepare(sql).bind(...params).all();
    const countSql = `SELECT COUNT(*) as c FROM leads WHERE 1=1` + (search ? ` AND (name LIKE ? OR whatsapp LIKE ? OR email LIKE ?)` : '') + (status ? ` AND status = ?` : '') + (source ? ` AND source = ?` : '');
    const countParams = params.slice(0, params.length - 2);
    const likeParams = params.slice(params.length - 2).map((v: string) => `%${v}%`);
    const totalRows = await db.prepare(countSql).bind(...countParams, ...likeParams).first() as any;

    return json(200, {
      leads: (rows?.results ?? []).map((r: any) => ({
        id: r.id, name: r.name, email: r.email, whatsapp: r.whatsapp,
        source: r.source, source_detail: r.source_detail, status: r.status,
        score: r.score, tags: r.tags, notes: r.notes,
        interest: r.interest, next_action: r.next_action,
        visitor_id: r.visitor_id, created_at: r.created_at, updated_at: r.updated_at,
      })),
      total: totalRows?.c ?? 0,
      limit, offset,
      hasMore: offset + (rows?.results?.length ?? 0) < (totalRows?.c ?? 0),
    });
  } catch (e: any) {
    return json(500, { error: e.message });
  }
};
