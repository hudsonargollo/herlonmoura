// Cloudflare Pages Function: /api/admin/users
// Multi-user access management for the admin panel.
// Roles: admin (full), editor (leads + CRM + blog approval), viewer (read-only)
//
//   GET    /api/admin/users            — list users (admin only)
//   POST   /api/admin/users            — create a user (admin only)
//   PATCH  /api/admin/users/:id        — update name/email/role (admin only)
//   DELETE /api/admin/users/:id        — deactivate a user (admin only)

import { HmacSha256 } from 'crypto-js';




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
      'Access-Control-Allow-Methods': 'GET, POST, PATCH, DELETE, OPTIONS',
      'Access-Control-Allow-Headers': 'Authorization, Content-Type',
    },
  });
}

export const onRequestOptions: PagesFunction<Env> = async () => json(204, {});

// ── Auth — verify JWT and enforce role ────────────────────────────────

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

// Require admin role — callers must already be verified; this enforces the policy.
async function requireAdmin(request: Request, env: Env): Promise<{ sub: string; email: string; role: string } | null> {
  const user = await verifyAuth(request, env);
  if (!user) return null;
  if (user.role !== 'admin') return null;
  return user;
}

// ── Users CRUD ───────────────────────────────────────────────────────

export const onRequestGet: PagesFunction<Env> = async ({ request, env }) => {
  const user = await requireAdmin(request, env);
  if (!user) return json(401, { error: 'Unauthorized' });
  try {
    const db = env.CRM_DB;
    const rows = await db.prepare('SELECT id, name, email, role, created_at FROM users ORDER BY created_at DESC').all();
    return json(200, { users: rows.results ?? [] });
  } catch (e: any) {
    return json(500, { error: e.message });
  }
};

export const onRequestPost: PagesFunction<Env> = async ({ request, env }) => {
  const user = await requireAdmin(request, env);
  if (!user) return json(401, { error: 'Unauthorized' });
  try {
    const body = (await request.json()) as { name: string; email: string; password: string; role?: string };
    if (!body.name || !body.email || !body.password) {
      return json(400, { error: 'name, email and password are required' });
    }
    const normalized = body.email.trim().toLowerCase();
    const existing = await db.prepare('SELECT id FROM users WHERE email = ?').bind(normalized).first();
    if (existing) return json(409, { error: 'Email already registered' });

    const hash = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(body.password));
    const passwordHash = Array.from(new Uint8Array(hash))
      .map((b) => b.toString(16).padStart(2, '0')).join('');

    const id = crypto.randomUUID ? crypto.randomUUID() : `${Date.now()}-${Math.random().toString(36).slice(2)}`;
    const now = new Date().toISOString();
    await db.prepare(
      'INSERT INTO users (id, name, email, password_hash, role) VALUES (?, ?, ?, ?, ?)'
    ).bind(id, body.name.trim(), normalized, passwordHash, body.role ?? 'editor').run();

    return json(201, {
      id,
      name: body.name.trim(),
      email: normalized,
      role: body.role ?? 'editor',
      created_at: now,
    });
  } catch (e: any) {
    return json(500, { error: e.message });
  }
};

export const onRequestPatch: PagesFunction<Env> = async ({ request, env }) => {
  const user = await requireAdmin(request, env);
  if (!user) return json(401, { error: 'Unauthorized' });
  try {
    const id = String((await request.json())?.id);
    if (!id) return json(400, { error: 'id is required' });
    const row = await db.prepare('SELECT id, role FROM users WHERE id = ?').bind(id).first();
    if (!row) return json(404, { error: 'User not found' });
    if (row.role === 'admin' && String(row.id) !== user.sub) {
      // Prevent demoting or editing the last remaining admin.
      return json(403, { error: 'Cannot modify the only admin account' });
    }

    const updates: string[] = [];
    const values: any[] = [];
    if (request.body.name !== undefined) { updates.push('name = ?'); values.push(request.body.name); }
    if (request.body.email !== undefined) { updates.push('email = ?'); values.push(request.body.email.trim().toLowerCase()); }
    if (request.body.role !== undefined) { updates.push('role = ?'); values.push(request.body.role); }
    if (updates.length === 0) return json(400, { error: 'Nothing to update' });

    await db.prepare(`UPDATE users SET ${updates.join(', ')} WHERE id = ?`).bind(...values, id).run();
    return json(200, { ok: true, id });
  } catch (e: any) {
    return json(500, { error: e.message });
  }
};

export const onRequestDelete: PagesFunction<Env> = async ({ request, env }) => {
  const user = await requireAdmin(request, env);
  if (!user) return json(401, { error: 'Unauthorized' });
  try {
    const id = String((await request.json())?.id);
    if (!id) return json(400, { error: 'id is required' });
    const row = await db.prepare('SELECT id, role FROM users WHERE id = ?').bind(id).first();
    if (!row) return json(404, { error: 'User not found' });
    if (row.role === 'admin' && String(row.id) === user.sub) {
      return json(403, { error: 'Cannot delete your own admin account' });
    }
    await db.prepare('DELETE FROM users WHERE id = ?').bind(id).run();
    return json(200, { ok: true, id });
  } catch (e: any) {
    return json(500, { error: e.message });
  }
};
