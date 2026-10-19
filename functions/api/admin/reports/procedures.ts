// Cloudflare Pages Function: /api/admin/reports/procedures
// Procedure-level breakdown (engagement + leads) with optional day window.

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

    const rows = await db.prepare(
      `SELECT label, COUNT(*) as clicks
       FROM analytics_events
       WHERE created_at >= datetime(?, ?)
         AND event_type IN ('cta_click', 'modal_submit', 'whatsapp_click')
         AND label IS NOT NULL
       GROUP BY label
       ORDER BY clicks DESC
       LIMIT 100`
    ).bind('now', since).all();

    const procedureEngagement: Record<string, { clicks: number; leads: number; lead_ids: string[] }> = {};
    for (const row of (rows?.results ?? []) as any[]) {
      const proc = classifyProcedure(row.label);
      if (proc) {
        if (!procedureEngagement[proc]) procedureEngagement[proc] = { clicks: 0, leads: 0, lead_ids: [] };
        procedureEngagement[proc].clicks += row.clicks;
      }
    }
    const leadRows = await db.prepare(
      `SELECT interest, id FROM leads WHERE created_at >= datetime(?, ?) AND interest IS NOT NULL`
    ).bind('now', since).all();
    for (const row of (leadRows?.results ?? []) as any[]) {
      const proc = classifyProcedure(row.interest);
      if (proc && procedureEngagement[proc]) {
        procedureEngagement[proc].leads += 1;
        if (procedureEngagement[proc].lead_ids.length < 20) procedureEngagement[proc].lead_ids.push(row.id);
      }
    }

    return json(200, {
      procedures: Object.entries(procedureEngagement)
        .map(([name, data]) => ({
          name,
          clicks: data.clicks,
          leads: data.leads,
          lead_ids: data.lead_ids,
        }))
        .sort((a, b) => b.clicks - a.clicks),
      count: Object.keys(procedureEngagement).length,
      window_days: days,
    });
  } catch (e: any) {
    return json(500, { error: e.message });
  }
};

function classifyProcedure(label: string): string | null {
  const lower = label.toLowerCase();
  const PROCEDURE_KEYWORDS = [
    'varizes', 'trombose', 'dvt', 'laser', 'cirurgia', 'angiografia',
    'eco-doppler', 'linfedema', 'raynaud', 'endovascular', 'arterial',
    'procedimento', 'consulta', 'exame',
  ];
  for (const kw of PROCEDURE_KEYWORDS) {
    if (lower.includes(kw)) return kw;
  }
  return null;
}
