/**
 * Cookie-based session helpers for the admin panel.
 * Uses httpOnly cookies to prevent XSS token theft.
 *
 * Server-only — call from Server Components / Route Handlers / Middleware.
 */

import { cookies } from 'next/headers';
import { createHmac, timingSafeEqual } from 'crypto';

/* ── base64url helpers ──────────────────────── */

function b64enc(buf: Buffer): string {
  return buf.toString('base64').replace(/\+/g, '-').replace(/\//g, '_').replace(/=/g, '');
}
function b64dec(input: string): Buffer {
  return Buffer.from(input.replace(/-/g, '+').replace(/_/g, '/'), 'base64');
}

const COOKIE_NAME = 'admin_token';
const JWT_SECRET = process.env.JWT_SECRET || 'dev-secret-change-me';

/* ── sign ──────────────────────────────────────────── */

export function signSessionToken(payload: { sub: string; email: string; role: string }): string {
  const header = b64enc(Buffer.from(JSON.stringify({ alg: 'HS256', typ: 'JWT' })));
  const iat = Math.floor(Date.now() / 1000);
  const body = b64enc(Buffer.from(JSON.stringify({ ...payload, iat })));
  const data = `${header}.${body}`;
  const sig = createHmac('sha256', JWT_SECRET).update(data).digest();
  return `${data}.${b64enc(sig)}`;
}

/* ── verify ────────────────────────────────────────── */

export interface SessionPayload {
  sub: string;
  email: string;
  role: string;
  iat: number;
  exp: number;
}

export async function verifySessionToken(token: string): Promise<SessionPayload | null> {
  const parts = token.split('.');
  if (parts.length !== 3) return null;
  try {
    const secret = JWT_SECRET;
    const signingInput = `${parts[0]}.${parts[1]}`;
    const expectedSig = b64dec(parts[2]);
    const computedSig = createHmac('sha256', secret).update(signingInput).digest();
    if (!timingSafeEqual(Buffer.from(expectedSig), Buffer.from(computedSig))) return null;
    const payload = JSON.parse(Buffer.from(parts[1], 'base64url').toString());
    if (payload.exp && payload.exp * 1000 < Date.now()) return null;
    return payload as SessionPayload;
  } catch {
    return null;
  }
}

/* ── cookie helpers ─────────────────────────────────── */

export async function setSessionCookie(token: string): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.set(COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: 8 * 60 * 60, // 8 hours
  });
}

export async function clearSessionCookie(): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.delete(COOKIE_NAME);
}

export async function getSessionToken(): Promise<string | null> {
  const cookieStore = await cookies();
  return cookieStore.get(COOKIE_NAME)?.value ?? null;
}

export async function getSession(): Promise<SessionPayload | null> {
  const token = await getSessionToken();
  if (!token) return null;
  return verifySessionToken(token);
}