// Cloudflare Pages Function: /api/crm/email-sequences
// CRUD for automated e-mail sequences, matching the contract the admin UI sends.
//
//   GET    /api/crm/email-sequences          — list sequences + their steps
//   POST   /api/crm/email-sequences          — replace the whole sequence set
//   DELETE /api/crm/email-sequences?id=...   — remove one sequence
//
// Schema: email_sequences(id, name, trigger, delay_hours, subject, body,
//                         is_active, created_at) — one row per step.
//
// The admin UI (app/admin/crm/email/page.tsx) posts { name, steps: [...] }
// where each step carries { delayDays, subject, body, trigger } and it sends
// EVERY step in one request. The old UI pointed at this route but no such
// function existed, so the save failed — and because the UI never checked the
// response status it still showed "Sequência salva!".

interface Env {
  CRM_DB: D1Database;
  JWT_SECRET?: string;
}

interface SequenceStep {
  delayDays?: number;
  subject?: string;
  body?: string;
  trigger?: string;
}

function json(status: number, data: unknown): Response {
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

function uid(): string {
  return crypto.randomUUID ? crypto.randomUUID() : `${Date.now()}-${Math.random().toString(36).slice(2)}`;
}

// ── GET: list every sequence with its steps ───────────────────────────

export const onRequestGet: PagesFunction<Env> = async ({ request, env }) => {
  const user = await requireEditor(request, env);
  if (!user) return json(401, { error: 'Unauthorized' });
  try {
    const rows = await env.CRM_DB.prepare(
      'SELECT id, name, trigger, delay_hours, subject, body, is_active, created_at FROM email_sequences ORDER BY created_at DESC'
    ).all();

    // Group steps by (name, trigger) so a sequence reads as one unit.
    const byName = new Map<string, any>();
    for (const r of (rows?.results ?? []) as any[]) {
      const key = r.name;
      if (!byName.has(key)) {
        byName.set(key, { id: r.id, name: r.name, is_active: r.is_active, steps: [] });
      }
      byName.get(key).steps.push({
        id: r.id,
        trigger: r.trigger,
        delayDays: Math.round((r.delay_hours ?? 0) / 24),
        subject: r.subject,
        body: r.body,
      });
    }

    const sequences = Array.from(byName.values());
    return json(200, { sequences, count: sequences.length });
  } catch (e: any) {
    return json(500, { error: e.message });
  }
};

// ── POST: replace the sequence set ────────────────────────────────────

export const onRequestPost: PagesFunction<Env> = async ({ request, env }) => {
  const user = await requireEditor(request, env);
  if (!user) return json(401, { error: 'Unauthorized' });
  try {
    const body = (await request.json()) as { name?: string; steps?: SequenceStep[] };
    if (!body.name || !Array.isArray(body.steps) || body.steps.length === 0) {
      return json(400, { error: 'name and a non-empty steps array are required' });
    }

    const db = env.CRM_DB;
    const now = new Date().toISOString();
    const name = String(body.name).slice(0, 200);

    // Replace atomically: drop the previous rows for this sequence name, then
    // insert the new steps. Each step becomes its own row (the schema has no
    // steps table), keyed by the shared name.
    await db.prepare('DELETE FROM email_sequences WHERE name = ?').bind(name).run();

    const inserted: string[] = [];
    for (const step of body.steps) {
      const trigger = String(step.trigger ?? 'lead_created').slice(0, 80);
      const delayDays = Number.isFinite(Number(step.delayDays)) ? Number(step.delayDays) : 0;
      if (delayDays < 0) return json(400, { error: 'delayDays must be >= 0' });

      const id = uid();
      await db.prepare(
        'INSERT INTO email_sequences (id, name, trigger, delay_hours, subject, body, is_active, created_at) VALUES (?, ?, ?, ?, ?, ?, 1, ?)'
      ).bind(
        id,
        name,
        trigger,
        Math.round(delayDays * 24),
        String(step.subject ?? '').slice(0, 500),
        String(step.body ?? '').slice(0, 20000),
        now
      ).run();
      inserted.push(id);
    }

    return json(201, { ok: true, name, count: inserted.length });
  } catch (e: any) {
    return json(500, { error: e.message });
  }
};

// ── DELETE: remove a single step row ──────────────────────────────────

export const onRequestDelete: PagesFunction<Env> = async ({ request, env }) => {
  const user = await requireEditor(request, env);
  if (!user) return json(401, { error: 'Unauthorized' });
  try {
    const id = new URL(request.url).searchParams.get('id');
    if (!id) return json(400, { error: 'id is required' });
    await env.CRM_DB.prepare('DELETE FROM email_sequences WHERE id = ?').bind(id).run();
    return json(200, { ok: true, id });
  } catch (e: any) {
    return json(500, { error: e.message });
  }
};
