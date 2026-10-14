// Cloudflare Pages Function: /api/analytics/funnels
// GET — conversion funnels, cohort analysis, per-procedure engagement

interface Env {
  CRM_DB: D1Database;
  JWT_SECRET: string;
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

async function verifyAuth(request: Request, env: Env): Promise<{ sub: string; role: string } | null> {
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
    return payload;
  } catch {
    return null;
  }
}

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

export const onRequestGet: PagesFunction<Env> = async ({ request, env }) => {
  const user = await verifyAuth(request, env);
  if (!user) return json(401, { error: 'Unauthorized' });
  try {
    const url = new URL(request.url);
    const days = Math.min(Math.max(parseInt(url.searchParams.get('days') || '30', 10) || 30, 1), 365);
    const since = `-${days} days`;

    const db = env.CRM_DB;

    // ── Conversion Funnel ──────────────────────────────────────────────
    const uniqueVisitors = (await db.prepare(
      'SELECT COUNT(DISTINCT visitor_id) as c FROM analytics_events WHERE created_at >= datetime(?, ?)'
    ).bind('now', since).first()) as any;

    const engagedVisitors = (await db.prepare(
      `SELECT COUNT(DISTINCT visitor_id) as c FROM analytics_events
       WHERE created_at >= datetime(?, ?)
       AND event_type IN ('cta_click', 'modal_submit', 'whatsapp_click')`
    ).bind('now', since).first()) as any;

    const totalLeads = (await db.prepare(
      'SELECT COUNT(*) as c FROM leads WHERE created_at >= datetime(?, ?)'
    ).bind('now', since).first()) as any;

    const appointmentLeads = (await db.prepare(
      `SELECT COUNT(*) as c FROM leads
       WHERE created_at >= datetime(?, ?) AND status IN ('appointment', 'converted')`
    ).bind('now', since).first()) as any;

    const convertedLeads = (await db.prepare(
      `SELECT COUNT(*) as c FROM leads
       WHERE created_at >= datetime(?, ?) AND status = 'converted'`
    ).bind('now', since).first()) as any;

    const funnel = [
      { stage: 'Visitantes únicos', count: uniqueVisitors?.c ?? 0 },
      { stage: 'Visitantes engajados', count: engagedVisitors?.c ?? 0 },
      { stage: 'Leads capturados', count: totalLeads?.c ?? 0 },
      { stage: 'Consultas agendadas', count: appointmentLeads?.c ?? 0 },
      { stage: 'Convertidos', count: convertedLeads?.c ?? 0 },
    ];

    // Add conversion rates between stages
    for (let i = 0; i < funnel.length; i++) {
      funnel[i].rate = i === 0 ? 100 : Math.round((funnel[i].count / funnel[0].count) * 100);
    }

    // ── Cohort Analysis (weekly) ────────────────────────────────────────
    const cohortRows = await db.prepare(`
      SELECT
        strftime('%Y-%W', created_at) as cohort_week,
        COUNT(*) as total_leads,
        SUM(CASE WHEN status = 'converted' THEN 1 ELSE 0 END) as converted,
        SUM(CASE WHEN status = 'lost' THEN 1 ELSE 0 END) as lost
      FROM leads
      WHERE created_at >= datetime(?, ?)
      GROUP BY cohort_week
      ORDER BY cohort_week DESC
      LIMIT 12
    `).bind('now', since).all();

    const cohorts = (cohortRows?.results ?? []).map((r: any) => ({
      week: r.cohort_week,
      total: r.total_leads,
      converted: r.converted,
      lost: r.lost,
      conversionRate: r.total_leads > 0 ? Math.round((r.converted / r.total_leads) * 100) : 0,
    }));

    // ── Per-Procedure Engagement ────────────────────────────────────────
    const interestRows = await db.prepare(`
      SELECT label, COUNT(*) as clicks
      FROM analytics_events
      WHERE created_at >= datetime(?, ?)
        AND event_type IN ('cta_click', 'modal_submit', 'whatsapp_click')
        AND label IS NOT NULL
      GROUP BY label
      ORDER BY clicks DESC
      LIMIT 50
    `).bind('now', since).all();

    const procedureEngagement: Record<string, { clicks: number; leads: number }> = {};
    for (const row of (interestRows?.results ?? []) as any[]) {
      const proc = classifyProcedure(row.label);
      if (proc) {
        if (!procedureEngagement[proc]) procedureEngagement[proc] = { clicks: 0, leads: 0 };
        procedureEngagement[proc].clicks += row.clicks;
      }
    }

    // Match leads to procedures via interest field
    const leadInterestRows = await db.prepare(`
      SELECT interest, COUNT(*) as c
      FROM leads
      WHERE created_at >= datetime(?, ?) AND interest IS NOT NULL
      GROUP BY interest
    `).bind('now', since).all();

    for (const row of (leadInterestRows?.results ?? []) as any[]) {
      const proc = classifyProcedure(row.interest);
      if (proc && procedureEngagement[proc]) {
        procedureEngagement[proc].leads += row.c;
      }
    }

    const procedures = Object.entries(procedureEngagement)
      .map(([name, data]) => ({ name, ...data }))
      .sort((a, b) => b.clicks - a.clicks);

    return json(200, {
      window_days: days,
      funnel,
      cohorts,
      procedures,
    });
  } catch (e: any) {
    return json(500, { error: e.message });
  }
};
