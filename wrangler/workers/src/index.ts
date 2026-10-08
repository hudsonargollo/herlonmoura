declare var D1Database: any;
declare var KVNamespace: any;
declare var AI: any;
declare global {
  interface D1Database {}
  interface KVNamespace {}
  interface Env {
    DB: D1Database;
    KV: KVNamespace;
    AI: any;
    JWT_SECRET: string;
    ADMIN_EMAIL: string;
  }
}

// --- JWT helpers ---
function base64url(input: string | ArrayBuffer): string {
  const str = typeof input === 'string' ? input : String.fromCharCode(...new Uint8Array(input));
  return btoa(str)
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=/g, '');
}

async function signJWT(payload: object, secret: string): Promise<string> {
  const header = base64url(JSON.stringify({ alg: 'HS256', typ: 'JWT' }));
  const body = base64url(JSON.stringify({ ...payload, iat: Math.floor(Date.now() / 1000) }));
  const data = `${header}.${body}`;
  const key = await crypto.subtle.importKey('raw', new TextEncoder().encode(secret), { name: 'HMAC', hash: 'SHA-256' }, false, ['sign']);
  const sig = await crypto.subtle.sign('HMAC', key, new TextEncoder().encode(data));
  return `${data}.${base64url(sig)}`;
}

async function verifyJWT(token: string, secret: string): Promise<object | null> {
  const parts = token.split('.');
  if (parts.length !== 3) return null;
  const key = await crypto.subtle.importKey('raw', new TextEncoder().encode(secret), { name: 'HMAC', hash: 'SHA-256' }, false, ['verify']);
  const sig = Uint8Array.from(atob(parts[2].replace(/-/g, '+').replace(/_/g, '/')), c => c.charCodeAt(0));
  const valid = await crypto.subtle.verify('HMAC', key, sig, new TextEncoder().encode(`${parts[0]}.${parts[1]}`));
  if (!valid) return null;
  return JSON.parse(atob(parts[1].replace(/-/g, '+').replace(/_/g, '/')));
}

// --- UUID helper ---
function uid(): string {
  return crypto.randomUUID();
}

// --- Visitor helpers ---
async function getOrCreateVisitor(env: Env, email: string | null, name: string | null, utm: Record<string, string | null>): Promise<string> {
  if (!email) return uid(); // anonymous — no visitor record
  const existing = await env.DB.prepare('SELECT id, total_visits FROM visitors WHERE email = ?').bind(email).first<any>();
  if (existing) {
    const updates: string[] = ['last_seen = CURRENT_TIMESTAMP', 'total_visits = total_visits + 1'];
    const binds: any[] = [];
    if (utm.source) { updates.push('utm_source = CASE WHEN utm_source IS NULL THEN ? ELSE utm_source END'); binds.push(utm.source); }
    if (utm.medium) { updates.push('utm_medium = CASE WHEN utm_medium IS NULL THEN ? ELSE utm_medium END'); binds.push(utm.medium); }
    if (utm.campaign) { updates.push('utm_campaign = CASE WHEN utm_campaign IS NULL THEN ? ELSE utm_campaign END'); binds.push(utm.campaign); }
    if (utm.term) { updates.push('utm_term = CASE WHEN utm_term IS NULL THEN ? ELSE utm_term END'); binds.push(utm.term); }
    if (utm.content) { updates.push('utm_content = CASE WHEN utm_content IS NULL THEN ? ELSE utm_content END'); binds.push(utm.content); }
    if (name) { updates.push('name = ?'); binds.push(name); }
    binds.push(email);
    await env.DB.prepare(`UPDATE visitors SET ${updates.join(', ')}, updated_at = CURRENT_TIMESTAMP WHERE email = ?`).bind(...binds).run();
    return existing.id;
  }
  const id = uid();
  await env.DB.prepare(
    `INSERT INTO visitors (id, email, name, utm_source, utm_medium, utm_campaign, utm_term, utm_content, tags) VALUES (?, ?, ?, ?, ?, ?, ?, ?, '[]')`
  ).bind(id, email, name || null, utm.source || null, utm.medium || null, utm.campaign || null, utm.term || null, utm.content || null).run();
  return id;
}
async function seedSequences(env: Env): Promise<void> {
  const defaults = [
    { name: "Welcome Series", trigger: "welcome", delay_hours: 0, subject: "Bem-vindo! Confira seu material gratuito", body: "Olá! Agradecemos seu interesse. Baixe seu guia completo aqui." },
    { name: "DVT Risk Follow-up", trigger: "freebie_download", delay_hours: 24, subject: "Sua avaliação de risco TVP está pronta", body: "Olá! Conforme combinado, segue o resultado da sua avaliação de risco." },
    { name: "Appointment Nudge", trigger: "appointment_nudge", delay_hours: 48, subject: "Lembrete: sua consulta está próxima", body: "Não esqueça da sua consulta marcada. Responda este e-mail para confirmar." },
    { name: "Weekly Digest", trigger: "weekly_digest", delay_hours: 168, subject: "Resumo semanal de saúde vascular", body: "Confira os principais artigos da semana no blog do Dr. Herlon Moura." },
    { name: "Re-engagement", trigger: "reengagement", delay_hours: 72, subject: "Faz tempo! Veja o que mudou", body: "Olá! Separamos conteúdos novos sobre saúde vascular para você." },
  ];

  for (const seq of defaults) {
    const exists = await env.DB.prepare("SELECT id FROM email_sequences WHERE trigger = ?").bind(seq.trigger).first<any>();
    if (!exists) {
      await env.DB.prepare("INSERT INTO email_sequences (id, name, trigger, delay_hours, subject, body, is_active) VALUES (?, ?, ?, ?, ?, ?, 1)")
        .bind(crypto.randomUUID(), seq.name, seq.trigger, seq.delay_hours, seq.subject, seq.body).run();
    }
  }
}

// --- Routes ---
export default {
  async fetch(request: Request, env: Env, ctx: ExecutionContext): Promise<Response> {
    // Seed email sequences on cold start
    if (!(ctx as any)._seeded) {
      (ctx as any)._seeded = true;
      await seedSequences(env).catch(() => {});
    }
    const url = new URL(request.url);
    const method = request.method;
    const path = url.pathname.replace('/api', '');

    // Auth middleware (skip public routes)
    const publicRoutes = ['/auth/login', '/auth/register', '/health'];
    if (!publicRoutes.some(r => path === r || path.startsWith(r + '/'))) {
      const auth = request.headers.get('authorization');
      if (!auth?.startsWith('Bearer ')) return json(401, { error: 'unauthorized' });
      const token = auth.slice(7);
      const payload = await verifyJWT(token, env.JWT_SECRET);
      if (!payload) return json(401, { error: 'invalid token' });
      (request as any).user = payload;
    }

    // Auth routes
    if (path === '/auth/login' && method === 'POST') return handleLogin(request, env);
    if (path === '/auth/register' && method === 'POST') return handleRegister(request, env);
    if (path === '/health') return json(200, { ok: true });

    // Leads
    if (path === '/leads' && method === 'GET') return listLeads(request, env);
    if (path === '/leads' && method === 'POST') return createLead(request, env);
    if (path.match(/^\/leads\/[^/]+$/) && method === 'GET') return getLead(path, env);
    if (path.match(/^\/leads\/[^/]+$/) && method === 'PUT') return updateLead(request, path, env);
    if (path.match(/^\/leads\/[^/]+$/) && method === 'DELETE') return deleteLead(path, env);

    // Interactions
    if (path === '/interactions' && method === 'GET') return listInteractions(request, env);
    if (path === '/interactions' && method === 'POST') return createInteraction(request, env);

    // Blog posts
    if (path === '/blog' && method === 'GET') return listPosts(request, env);
    if (path === '/blog' && method === 'POST') return createPost(request, env);
    if (path.match(/^\/blog\/[^/]+$/) && method === 'GET') return getPost(path, env);
    if (path.match(/^\/blog\/[^/]+$/) && method === 'PUT') return updatePost(request, path, env);
    if (path.match(/^\/blog\/[^/]+$/) && method === 'DELETE') return deletePost(path, env);
    if (path === '/blog/approval-queue' && method === 'GET') return approvalQueue(env);
    if (path === '/blog/generate' && method === 'POST') return generatePosts(request, env);

    // Freebies
    if (path === '/freebies' && method === 'POST') return claimFreebie(request, env);

    // Email sequences - list, create, update, trigger, log
    if (path === '/emails/sequences' && method === 'GET') return listSequences(env);
    if (path === '/emails/sequences' && method === 'POST') return createSequence(request, env);
    if (path.match(/^\/emails\/sequences\/[^/]+$/) && method === 'PUT') return updateSequence(request, path, env);
    if (path === '/emails/trigger' && method === 'POST') return triggerSequence(request, env);
    if (path === '/emails/logs' && method === 'GET') return listEmailLogs(request, env);

    // Dashboard stats
    if (path === '/dashboard/stats' && method === 'GET') return dashboardStats(env);

    // Visitors (global tracking)
    if (path === '/visitors' && method === 'GET') return listVisitors(env, request);
    if (path === '/visitors/me' && method === 'GET') return getVisitor(env, request);
    if (path === '/visitors/page-view' && method === 'POST') return recordPageView(env, request);

    return json(404, { error: 'not found' });
  },
};

// --- Auth handlers ---
async function handleLogin(req: Request, env: Env): Promise<Response> {
  const { email, password } = await req.json();
  const row = await env.DB.prepare('SELECT * FROM users WHERE email = ?').bind(email).first<{id:string,email:string,name:string,role:string,password_hash:string}>();
  if (!row) return json(401, { error: 'invalid credentials' });
  // In production use bcrypt; for now simple check
  const valid = await crypto.subtle.importKey('raw', new TextEncoder().encode(password), 'SHA-256', false, ['digest'])
    .then(k => crypto.subtle.digest('SHA-256', k))
    .then(h => {
      const hash = Array.from(new Uint8Array(h)).map(b => b.toString(16).padStart(2,'0')).join('');
      return hash === row.password_hash;
    });
  if (!valid) return json(401, { error: 'invalid credentials' });
  const token = await signJWT({ sub: row.id, email: row.email, role: row.role }, env.JWT_SECRET);
  return json(200, { token, user: { id: row.id, name: row.name, email: row.email, role: row.role } });
}

async function handleRegister(req: Request, env: Env): Promise<Response> {
  const { name, email, password, role } = await req.json();
  const hash = await crypto.subtle.importKey('raw', new TextEncoder().encode(password), 'SHA-256', false, ['digest'])
    .then(k => crypto.subtle.digest('SHA-256', k))
    .then(h => Array.from(new Uint8Array(h)).map(b => b.toString(16).padStart(2,'0')).join(''));
  const id = uid();
  await env.DB.prepare('INSERT INTO users (id, name, email, password_hash, role) VALUES (?,?,?,?,?)')
    .bind(id, name, email, hash, role || 'editor').run();
  const token = await signJWT({ sub: id, email, role }, env.JWT_SECRET);
  return json(201, { token, user: { id, name, email, role } });
}

// --- Lead handlers ---
async function listLeads(req: Request, env: Env): Promise<Response> {
  const url = new URL(req.url);
  const status = url.searchParams.get('status');
  const source = url.searchParams.get('source');
  let query = 'SELECT * FROM leads WHERE 1=1';
  const binds: any[] = [];
  if (status) { query += ' AND status = ?'; binds.push(status); }
  if (source) { query += ' AND source = ?'; binds.push(source); }
  query += ' ORDER BY created_at DESC LIMIT 100';
  const rows = await env.DB.prepare(query).bind(...binds).all<any>();
  return json(200, { leads: rows.results });
}

async function createLead(req: Request, env: Env): Promise<Response> {
  const body = await req.json();
  const { name, whatsapp, email, source, source_detail, tags, visitor_id, utm_source, utm_medium, utm_campaign, utm_term, utm_content } = body as Record<string, any>;
  const id = uid();
  await env.DB.prepare('INSERT INTO leads (id, name, whatsapp, email, visitor_id, source, source_detail, tags, utm_source, utm_medium, utm_campaign, utm_term, utm_content) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?)')
    .bind(id, name, whatsapp, email || null, visitor_id || null, source || 'blog', source_detail || null, JSON.stringify(tags || []), utm_source || null, utm_medium || null, utm_campaign || null, utm_term || null, utm_content || null).run();
  // Log interaction
  await env.DB.prepare('INSERT INTO interactions (id, lead_id, type) VALUES (?,?,?)')
    .bind(uid(), id, 'lead_created').run();
  return json(201, { id });
}

async function getLead(path: string, env: Env): Promise<Response> {
  const id = path.split('/').pop();
  const lead = await env.DB.prepare('SELECT * FROM leads WHERE id = ?').bind(id).first<any>();
  if (!lead) return json(404, { error: 'not found' });
  const interactions = await env.DB.prepare('SELECT * FROM interactions WHERE lead_id = ? ORDER BY created_at DESC').bind(id).all<any>();
  return json(200, { lead, interactions: interactions.results });
}

async function updateLead(req: Request, path: string, env: Env): Promise<Response> {
  const id = path.split('/').pop();
  const body = await req.json();
  const fields = Object.keys(body).filter(k => !['id'].includes(k));
  const setClause = fields.map(f => `${f} = ?`).join(', ');
  const values = fields.map(f => body[f]);
  values.push(id);
  await env.DB.prepare(`UPDATE leads SET ${setClause}, updated_at = CURRENT_TIMESTAMP WHERE id = ?`).bind(...values).run();
  return json(200, { ok: true });
}

async function deleteLead(path: string, env: Env): Promise<Response> {
  const id = path.split('/').pop();
  await env.DB.prepare('DELETE FROM leads WHERE id = ?').bind(id).run();
  return json(200, { ok: true });
}

// --- Interaction handlers ---
async function listInteractions(req: Request, env: Env): Promise<Response> {
  const url = new URL(req.url);
  const lead_id = url.searchParams.get('lead_id');
  const type = url.searchParams.get('type');
  let query = 'SELECT * FROM interactions WHERE 1=1';
  const binds: any[] = [];
  if (lead_id) { query += ' AND lead_id = ?'; binds.push(lead_id); }
  if (type) { query += ' AND type = ?'; binds.push(type); }
  query += ' ORDER BY created_at DESC LIMIT 500';
  const rows = await env.DB.prepare(query).bind(...binds).all<any>();
  return json(200, { interactions: rows.results });
}

async function createInteraction(req: Request, env: Env): Promise<Response> {
  const body = await req.json();
  const { lead_id, type, metadata } = body as { lead_id?: string; type: string; metadata?: any };
  const id = uid();
  await env.DB.prepare('INSERT INTO interactions (id, lead_id, type, metadata) VALUES (?,?,?,?)')
    .bind(id, lead_id, type, JSON.stringify(metadata || {})).run();
  return json(201, { id });
}

// --- Visitor handlers ---
async function getVisitor(env: Env, req: Request): Promise<Response> {
  const url = new URL(req.url);
  const email = url.searchParams.get('email');
  if (!email) return json(400, { error: 'email required' });
  const row = await env.DB.prepare('SELECT * FROM visitors WHERE email = ?').bind(email).first<any>();
  if (!row) return json(404, { error: 'visitor not found' });
  return json(200, { visitor: row });
}

async function listVisitors(env: Env, req: Request): Promise<Response> {
  const url = new URL(req.url);
  const source = url.searchParams.get('utm_source');
  const limitn = Math.min(parseInt(url.searchParams.get('limit') || '100', 10), 500);
  let query = 'SELECT * FROM visitors WHERE 1=1';
  const binds: any[] = [];
  if (source) { query += ' AND utm_source = ?'; binds.push(source); }
  query += ' ORDER BY last_seen DESC LIMIT ?';
  binds.push(limitn);
  const rows = await env.DB.prepare(query).bind(...binds).all<any>();
  return json(200, { visitors: rows.results });
}

async function recordPageView(env: Env, req: Request): Promise<Response> {
  const body = await req.json().catch(() => ({}));
  const { email, name, url: pageUrl, referrer, utm_source, utm_medium, utm_campaign, utm_term, utm_content, gclid } = body as Record<string, any>;
  const visitorId = await getOrCreateVisitor(env, email || null, name || null, { source: utm_source, medium: utm_medium, campaign: utm_campaign, term: utm_term, content: utm_content });
  const id = uid();
  await env.DB.prepare(
    'INSERT INTO interactions (id, visitor_id, type, metadata) VALUES (?, ?, ?, ?)'
  ).bind(id, visitorId, 'page_view', JSON.stringify({ url: pageUrl, referrer, utm_source, utm_medium, utm_campaign, utm_term, utm_content, gclid })).run();
  return json(201, { visitor_id: visitorId });
}

// --- Blog post handlers ---
async function listPosts(req: Request, env: Env): Promise<Response> {
  const url = new URL(req.url);
  const status = url.searchParams.get('status') || 'published';
  const category = url.searchParams.get('category');
  let query = 'SELECT * FROM blog_posts WHERE status = ?';
  const binds: any[] = [status];
  if (category) { query += ' AND category = ?'; binds.push(category); }
  query += ' ORDER BY created_at DESC';
  const rows = await env.DB.prepare(query).bind(...binds).all<any>();
  return json(200, { posts: rows.results });
}

async function createPost(req: Request, env: Env): Promise<Response> {
  const body = await req.json();
  const id = uid();
  await env.DB.prepare(`INSERT INTO blog_posts (id, slug, title, meta_title, meta_description, excerpt, content, category, status, freebie_name, requires_email, questionnaire_enabled, questionnaire_data, author) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?)`)
    .bind(id, body.slug, body.title, body.meta_title, body.meta_description, body.excerpt, body.content, body.category || 'Geral', body.status || 'draft', body.freebie_name || null, body.requires_email || false, body.questionnaire_enabled || false, JSON.stringify(body.questionnaire_data || []), body.author || 'AI').run();
  return json(201, { id });
}

async function getPost(path: string, env: Env): Promise<Response> {
  const slug = path.split('/').pop();
  const row = await env.DB.prepare('SELECT * FROM blog_posts WHERE slug = ?').bind(slug).first<any>();
  if (!row) return json(404, { error: 'not found' });
  return json(200, { post: row });
}

async function updatePost(req: Request, path: string, env: Env): Promise<Response> {
  const slug = path.split('/').pop();
  const body = await req.json();
  const fields = Object.keys(body).filter(k => !['id','slug','created_at'].includes(k));
  const setClause = fields.map(f => `${f} = ?`).join(', ');
  const values = fields.map(f => body[f]);
  values.push(slug);
  await env.DB.prepare(`UPDATE blog_posts SET ${setClause}, updated_at = CURRENT_TIMESTAMP WHERE slug = ?`).bind(...values).run();
  return json(200, { ok: true });
}

async function deletePost(path: string, env: Env): Promise<Response> {
  const slug = path.split('/').pop();
  await env.DB.prepare('DELETE FROM blog_posts WHERE slug = ?').bind(slug).run();
  return json(200, { ok: true });
}

async function approvalQueue(env: Env): Promise<Response> {
  const rows = await env.DB.prepare("SELECT * FROM blog_posts WHERE status IN ('draft', 'approval') ORDER BY created_at ASC").all<any>();
  return json(200, { posts: rows.results });
}

// --- Freebie handlers ---
async function claimFreebie(req: Request, env: Env): Promise<Response> {
  const { name, lead_id, file_url, requires_email, email } = await req.json();
  const id = uid();
  await env.DB.prepare('INSERT INTO freebies (id, name, lead_id, file_url, requires_email) VALUES (?,?,?,?,?)')
    .bind(id, name, lead_id, file_url, requires_email || false).run();
  // If requires email, update lead's email
  if (requires_email && email) {
    await env.DB.prepare("UPDATE leads SET email = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?").bind(email, lead_id).run();
  }
  return json(201, { id });
}

// --- Email sequence handlers ---
async function listSequences(env: Env): Promise<Response> {
  const rows = await env.DB.prepare('SELECT * FROM email_sequences WHERE is_active = 1 ORDER BY trigger').all<any>();
  return json(200, { sequences: rows.results });
}

async function createSequence(req: Request, env: Env): Promise<Response> {
  const { name, trigger, delay_hours, subject, body } = await req.json();
  const id = uid();
  await env.DB.prepare('INSERT INTO email_sequences (id, name, trigger, delay_hours, subject, body) VALUES (?,?,?,?,?,?)')
    .bind(id, name, trigger, delay_hours || 0, subject, body).run();
  return json(201, { id });
}

async function updateSequence(req: Request, path: string, env: Env): Promise<Response> {
  const id = path.split('/').pop();
  const body = await req.json();
  const fields = Object.keys(body).filter(k => !['id'].includes(k));
  const setClause = fields.map(f => `${f} = ?`).join(', ');
  const values = fields.map(f => body[f]);
  values.push(id);
  await env.DB.prepare(`UPDATE email_sequences SET ${setClause} WHERE id = ?`).bind(...values).run();
  return json(200, { ok: true });
}

// --- Email sequence handlers (extended) ---
async function triggerSequence(req: Request, env: Env): Promise<Response> {
  const { lead_id, sequence_id } = await req.json();
  if (!lead_id || !sequence_id) return json(400, { error: 'lead_id and sequence_id required' });

  const seq = await env.DB.prepare('SELECT * FROM email_sequences WHERE id = ? AND is_active = 1').bind(sequence_id).first<any>();
  if (!seq) return json(404, { error: 'sequence not found' });

  const lead = await env.DB.prepare('SELECT * FROM leads WHERE id = ?').bind(lead_id).first<any>();
  if (!lead) return json(404, { error: 'lead not found' });

  const logId = uid();
  await env.DB.prepare(
    'INSERT INTO email_logs (id, lead_id, sequence_id, subject, status) VALUES (?, ?, ?, ?, ?)'
  ).bind(logId, lead_id, sequence_id, seq.subject, 'sent').run();

  return json(201, { log_id: logId, sequence: seq.name, lead_id, status: 'sent' });
}

async function listEmailLogs(req: Request, env: Env): Promise<Response> {
  const url = new URL(req.url);
  const lead_id = url.searchParams.get('lead_id');
  let query = 'SELECT * FROM email_logs';
  const binds: any[] = [];
  if (lead_id) { query += ' WHERE lead_id = ?'; binds.push(lead_id); }
  query += ' ORDER BY sent_at DESC LIMIT 500';
  const rows = await env.DB.prepare(query).bind(...binds).all<any>();
  return json(200, { logs: rows.results });
}

// --- Dashboard stats ---
async function dashboardStats(env: Env): Promise<Response> {
  const totalLeads = await env.DB.prepare('SELECT COUNT(*) as c FROM leads').first<{c:number}>();
  const newLeads = await env.DB.prepare("SELECT COUNT(*) as c FROM leads WHERE status = 'new'").first<{c:number}>();
  const pendingPosts = await env.DB.prepare("SELECT COUNT(*) as c FROM blog_posts WHERE status IN ('draft', 'approval')").first<{c:number}>();
  const publishedPosts = await env.DB.prepare("SELECT COUNT(*) as c FROM blog_posts WHERE status = 'published'").first<{c:number}>();
  const interactions = await env.DB.prepare('SELECT COUNT(*) as c FROM interactions').first<{c:number}>();
  const totalVisitors = await env.DB.prepare('SELECT COUNT(*) as c FROM visitors').first<{c:number}>();
  const uniqueEmails = await env.DB.prepare('SELECT COUNT(DISTINCT email) as c FROM visitors WHERE email IS NOT NULL').first<{c:number}>();

  // Top sources from visitors
  const sourceRows = await env.DB.prepare(`
    SELECT utm_source, COUNT(*) as c FROM visitors
    WHERE utm_source IS NOT NULL
    GROUP BY utm_source ORDER BY c DESC LIMIT 10
  `).all<any>();
  const sources: Record<string, number> = {};
  for (const r of (sourceRows?.results || [])) { sources[r.utm_source] = r.c; }

  return json(200, {
    leads: { total: totalLeads?.c || 0, new: newLeads?.c || 0 },
    posts: { pending: pendingPosts?.c || 0, published: publishedPosts?.c || 0 },
    interactions: interactions?.c || 0,
    visitors: { total: totalVisitors?.c || 0, unique: uniqueEmails?.c || 0 },
    sources,
  });
}

// --- Blog generation via Cloudflare AI ---
function slugify(text: string): string {
  return text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/-+/g, '-')
    .trim()
    .slice(0, 80);
}

async function generatePosts(request: Request, env: Env): Promise<Response> {
  const { topics, count = 5 } = await request.json();

  if (!topics || !Array.isArray(topics) || topics.length === 0) {
    return json(400, { error: 'topics array is required' });
  }

  const categoryPool = [
    'Varizes', 'Trombose', 'Doenças Arteriais', 'Laser Vascular', 'Cirurgia Vascular',
    'Linfedema', 'Doenças Raynaud', 'Angiologia Geral', 'Endovascular', 'Diagnóstico Vascular',
  ];

  const generated: any[] = [];

  for (let i = 0; i < count; i++) {
    const topic = topics[i % topics.length];
    const category = categoryPool[i % categoryPool.length];

    let prompt = `Gere um artigo de blog em português brasileiro sobre: ${topic}. `;
    prompt += `Use tom profissional e acessível, voltado para pacientes. `;
    prompt += `Estruture com título, meta_description, excerpt, conteúdo com subtítulos H2/H3. `;
    prompt += `Inclua: causas, sintomas, diagnóstico, tratamentos, prevenção, quando procurar médico. `;
    prompt += `Não inclua chamada para ação no final. `;
    prompt += `Retorne APENAS JSON válido com: title, meta_title, meta_description, excerpt, content, slug, questionnaire (array de perguntas se aplicável, senão vazio), freebie (objeto com name/description se aplicável, senão null).`;

    try {
      const response = await env.AI.run('@cf/meta/llama-3.1-8b-instruct', {
        prompt,
        max_tokens: 2048,
        temperature: 0.7,
      });

      const result = JSON.parse(response.response);
      const slug = slugify(result.title || topic);
      const id = crypto.randomUUID();
      const questionnaireEnabled = Array.isArray(result.questionnaire) && result.questionnaire.length > 0;
      const freebieName = result.freebie?.name || null;

      await env.DB.prepare(
        `INSERT INTO blog_posts (id, slug, title, meta_title, meta_description, excerpt, content, category, status, freebie_name, requires_email, questionnaire_enabled, questionnaire_data, author) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?)`
      ).bind(
        id, slug, result.title, result.meta_title, result.meta_description, result.excerpt,
        result.content, category, 'draft', freebieName, !!freebieName, questionnaireEnabled,
        JSON.stringify(result.questionnaire || []), 'AI'
      ).run();

      generated.push({ id, slug, title: result.title });
    } catch (e: any) {
      generated.push({ topic, error: e.message });
    }
  }

  return json(200, { generated });
}

// --- Utils ---
function json(status: number, data: object): Response {
  return new Response(JSON.stringify(data), {
    status,
    headers: {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
      'Access-Control-Allow-Headers': 'Authorization, Content-Type',
    },
  });
}
