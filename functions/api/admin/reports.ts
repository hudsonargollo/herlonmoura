// Cloudflare Pages Function: /api/admin/reports
// Detailed operational reports for the admin panel.
//
//   GET /api/admin/reports                — summary block + per-lead list + recent activity
//   GET /api/admin/reports/leads          — paginated lead list with full detail fields
//   GET /api/admin/reports/visitors       — per-visitor timeline (page views, leads, conversions)
//   GET /api/admin/reports/procedures     — procedure-level breakdown (engagement + leads)


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

// ── Auth ─────────────────────────────────────────────────────────────

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

// ── GET /api/admin/reports ───────────────────────────────────────────

export const onRequestGet: PagesFunction<Env> = async (request, env) => {
  const user = await requireEditor(request, env);
  if (!user) return json(401, { error: 'Unauthorized' });
  try {
    const db = env.CRM_DB;
    const days = Math.min(Math.max(parseInt((request.url.split('?days=')?.[1] ?? '30'), 10) || 30, 1), 365);
    const since = `-${days} days`;

    // ── leads: full list with detail ───────────────────────────────────
    const leadsRows = await db.prepare(
      `SELECT id, name, email, whatsapp, source, source_detail, status, score, tags,
              notes, interest, next_action, visitor_id, created_at, updated_at
       FROM leads
       WHERE created_at >= datetime(?, ?)
       ORDER BY created_at DESC
       LIMIT 200`
    ).bind('now', since).all();
    const leads = (leadsRows?.results ?? []).map((r: any) => ({
      id: r.id, name: r.name, email: r.email, whatsapp: r.whatsapp,
      source: r.source, source_detail: r.source_detail, status: r.status,
      score: r.score, tags: r.tags, notes: r.notes,
      interest: r.interest, next_action: r.next_action,
      visitor_id: r.visitor_id, created_at: r.created_at, updated_at: r.updated_at,
    }));

    // ── per-lead stat counters ─────────────────────────────────────────
    const total = leads.length;
    const byStatus = { new: 0, contacted: 0, qualified: 0, appointment: 0, converted: 0, lost: 0 };
    const contacts = { new: 0, contacted: 0, qualified: 0, appointment: 0, converted: 0, lost: 0 };
    for (const l of leads) {
      byStatus[l.status] = (byStatus[l.status] ?? 0) + 1;
    }

    // ── recent interactions (activity log) ─────────────────────────────
    const activityRows = await db.prepare(
      `SELECT i.id, i.type, i.metadata, i.created_at, l.name as lead_name, l.status as lead_status
       FROM interactions i
       LEFT JOIN leads l ON l.id = i.lead_id
       WHERE i.created_at >= datetime(?, ?)
       ORDER BY i.created_at DESC
       LIMIT 50`
    ).bind('now', since).all();
    const activity = (activityRows?.results ?? []).map((r: any) => ({
      id: r.id, type: r.type, metadata: r.metadata,
      created_at: r.created_at, lead_name: r.lead_name, lead_status: r.lead_status,
    }));

    // ── visitors ───────────────────────────────────────────────────────
    const visitorRows = await db.prepare(
      `SELECT id, email, name, first_seen, last_seen, total_visits, utm_source, utm_campaign, tags, notes
       FROM visitors
       ORDER BY last_seen DESC
       LIMIT 100`
    ).all();

    // ── procedure breakdown (engagement + leads) ───────────────────────
    const procedureRows = await db.prepare(
      `SELECT label, COUNT(*) as clicks
       FROM analytics_events
       WHERE created_at >= datetime(?, ?)
         AND event_type IN ('cta_click', 'modal_submit', 'whatsapp_click')
         AND label IS NOT NULL
       GROUP BY label
       ORDER BY clicks DESC
       LIMIT 50`
    ).bind('now', since).all();

    const procedureEngagement: Record<string, { clicks: number; leads: number }> = {};
    for (const row of (procedureRows?.results ?? []) as any[]) {
      const proc = classifyProcedure(row.label);
      if (proc) {
        if (!procedureEngagement[proc]) procedureEngagement[proc] = { clicks: 0, leads: 0 };
        procedureEngagement[proc].clicks += row.clicks;
      }
    }
    const leadInterestRows = await db.prepare(
      `SELECT interest, COUNT(*) as c
       FROM leads
       WHERE created_at >= datetime(?, ?) AND interest IS NOT NULL
       GROUP BY interest`
    ).bind('now', since).all();
    for (const row of (leadInterestRows?.results ?? []) as any[]) {
      const proc = classifyProcedure(row.interest);
      if (proc && procedureEngagement[proc]) procedureEngagement[proc].leads += row.c;
    }
    const procedures = Object.entries(procedureEngagement)
      .map(([name, data]) => ({ name, ...data }))
      .sort((a, b) => b.clicks - a.clicks);

    return json(200, {
      generated_at: new Date().toISOString(),
      window_days: days,
      leads: { total, byStatus, contacts },
      activity,
      visitors: (visitorRows?.results ?? []).map((r: any) => ({
        id: r.id, email: r.email, name: r.name, first_seen: r.first_seen,
        last_seen: r.last_seen, total_visits: r.total_visits,
        utm_source: r.utm_source, utm_campaign: r.utm_campaign,
        tags: r.tags, notes: r.notes,
      })),
      procedures,
    });
  } catch (e: any) {
    return json(500, { error: e.message });
  }
};

// ── GET /api/admin/reports/leads ─────────────────────────────────────

export const onRequestGetLeads: PagesFunction<Env> = async (request, env) => {
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
    const totalRows = await db.prepare(`SELECT COUNT(*) as c FROM leads WHERE 1=1` + (search ? ` AND (name LIKE ? OR whatsapp LIKE ? OR email LIKE ?)` : '') + (status ? ` AND status = ?` : '') + (source ? ` AND source = ?` : ''))
      .bind(...params.slice(0, params.length - 2), ...[...params.slice(params.length - 2)].map((v: string) => `%${v}%`)).first() as any;

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
      hasMore: offset + (rows?.results?.length ?? 0) < totalRows?.c,
    });
  } catch (e: any) {
    return json(500, { error: e.message });
  }
};

// ── GET /api/admin/reports/visitors ──────────────────────────────────

export const onRequestGetVisitors: PagesFunction<Env> = async (request, env) => {
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
    });
  } catch (e: any) {
    return json(500, { error: e.message });
  }
};

// ── GET /api/admin/reports/procedures ────────────────────────────────

export const onRequestGetProcedures: PagesFunction<Env> = async (request, env) => {
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
    });
  } catch (e: any) {
    return json(500, { error: e.message });
  }
};

// ── classifyProcedure (shared) ──────────────────────────────────────

const PROCEDURE_KEYWORDS = [
  'varizes', 'trombose', 'dvt', 'laser', 'cirurgia', 'angiografia',
  'eco-doppler', 'linfedema', 'raynaud', 'endovascular', 'arterial',
  'procedimento', 'consulta', 'exame',
];

function classifyProcedure(label: string): string | null {
  const lower = label.toLowerCase();
  for (const kw of PROCEDURE_KEYWORDS) {
    if (lower.includes(kw)) return kw;
  }
  return null;
}
