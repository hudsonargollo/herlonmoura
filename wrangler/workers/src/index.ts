export interface Env {
  DB: D1Database;
  KV: KVNamespace;
  JWT_SECRET: string;
  ADMIN_EMAIL: string;
}

// --- JWT helpers ---
function base64url(input: ArrayBuffer): string {
  return btoa(String.fromCharCode(...new Uint8Array(input)))
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=/g, '');
}

async function signJWT(payload: object, secret: string): Promise<string> {
  const header = base64url(new TextEncoder().encode(JSON.stringify({ alg: 'HS256', typ: 'JWT' })));
  const body = base64url(new TextEncoder().encode(JSON.stringify({ ...payload, iat: Math.floor(Date.now() / 1000) })));
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

// --- Routes ---
export default {
  async fetch(request: Request, env: Env, ctx: ExecutionContext): Promise<Response> {
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

    // Freebies
    if (path === '/freebies' && method === 'POST') return claimFreebie(request, env);

    // Email sequences
    if (path === '/emails/sequences' && method === 'GET') return listSequences(env);
    if (path === '/emails/sequences' && method === 'POST') return createSequence(request, env);
    if (path.match(/^\/emails\/sequences\/[^/]+$/) && method === 'PUT') return updateSequence(request, path, env);

    // Dashboard stats
    if (path === '/dashboard/stats' && method === 'GET') return dashboardStats(env);

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
  const rows = await env.DB.prepare(query).bind(...binds).all<*>();
  return json(200, { leads: rows.results });
}

async function createLead(req: Request, env: Env): Promise<Response> {
  const { name, whatsapp, email, source, source_detail, tags } = await req.json();
  const id = uid();
  await env.DB.prepare('INSERT INTO leads (id, name, whatsapp, email, source, source_detail, tags) VALUES (?,?,?,?,?,?,?)')
    .bind(id, name, whatsapp, email || null, source || 'blog', source_detail || null, JSON.stringify(tags || [])).run();
  // Log interaction
  await env.DB.prepare('INSERT INTO interactions (id, lead_id, type) VALUES (?,?,?)')
    .bind(uid(), id, 'lead_created').run();
  return json(201, { id });
}

async function getLead(path: string, env: Env): Promise<Response> {
  const id = path.split('/').pop();
  const lead = await env.DB.prepare('SELECT * FROM leads WHERE id = ?').bind(id).first<*>();
  if (!lead) return json(404, { error: 'not found' });
  const interactions = await env.DB.prepare('SELECT * FROM interactions WHERE lead_id = ? ORDER BY created_at DESC').bind(id).all<*>();
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
  const rows = await env.DB.prepare(query).bind(...binds).all<*>();
  return json(200, { interactions: rows.results });
}

async function createInteraction(req: Request, env: Env): Promise<Response> {
  const { lead_id, type, metadata } = await req.json();
  const id = uid();
  await env.DB.prepare('INSERT INTO interactions (id, lead_id, type, metadata) VALUES (?,?,?,?)')
    .bind(id, lead_id, type, JSON.stringify(metadata || {})).run();
  return json(201, { id });
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
  const rows = await env.DB.prepare(query).bind(...binds).all<*>();
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
  const row = await env.DB.prepare('SELECT * FROM blog_posts WHERE slug = ?').bind(slug).first<*>();
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
  const rows = await env.DB.prepare("SELECT * FROM blog_posts WHERE status IN ('draft', 'approval') ORDER BY created_at ASC").all<*>();
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
  const rows = await env.DB.prepare('SELECT * FROM email_sequences WHERE is_active = 1 ORDER BY trigger').all<*>();
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

// --- Dashboard stats ---
async function dashboardStats(env: Env): Promise<Response> {
  const totalLeads = await env.DB.prepare('SELECT COUNT(*) as c FROM leads').first<{c:number}>();
  const newLeads = await env.DB.prepare("SELECT COUNT(*) as c FROM leads WHERE status = 'new'").first<{c:number}>();
  const pendingPosts = await env.DB.prepare("SELECT COUNT(*) as c FROM blog_posts WHERE status IN ('draft', 'approval')").first<{c:number}>();
  const publishedPosts = await env.DB.prepare("SELECT COUNT(*) as c FROM blog_posts WHERE status = 'published'").first<{c:number}>();
  const interactions = await env.DB.prepare('SELECT COUNT(*) as c FROM interactions').first<{c:number}>();
  return json(200, {
    leads: { total: totalLeads?.c || 0, new: newLeads?.c || 0 },
    posts: { pending: pendingPosts?.c || 0, published: publishedPosts?.c || 0 },
    interactions: interactions?.c || 0,
  });
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
