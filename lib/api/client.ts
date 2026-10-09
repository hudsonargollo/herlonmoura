/**
 * Typed fetch wrapper with JWT auth for the CRM Workers API.
 * Works in both server and client contexts:
 *   - Server: reads JWT from cookies (via cookies() next/headers)
 *   - Client: reads JWT from localStorage
 */

const API_BASE = process.env.CRM_API_URL || '';

export type Method = 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';

export interface ApiError {
  error: string;
  status: number;
}

export interface ApiResponse<T = unknown> {
  data: T | null;
  error: ApiError | null;
  ok: boolean;
  status: number;
}

/* ── token resolution ─────────────────────────────────────────── */

function resolveToken(): string | null {
  // Server context
  try {
    const { cookies } = require('next/headers');
    const cookieStore = cookies();
    return (cookieStore.get('admin_token')?.value as string) || null;
  } catch {
    // Client context
    if (typeof window !== 'undefined') {
      return localStorage.getItem('admin_token');
    }
    return null;
  }
}

/* ── core request ─────────────────────────────────────────────── */

async function request<T>(
  path: string,
  opts: { method?: Method; body?: unknown; params?: Record<string, string> } = {}
): Promise<ApiResponse<T>> {
  const { method = 'GET', body, params } = opts;

  const url = new URL(`${API_BASE}${path}`, 'http://localhost');
  if (params) {
    for (const [k, v] of Object.entries(params)) {
      if (v !== undefined && v !== null) url.searchParams.set(k, v);
    }
  }

  const token = resolveToken();
  const headers: Record<string, string> = { 'Content-Type': 'application/json' };
  if (token) headers['Authorization'] = `Bearer ${token}`;

  try {
    const res = await fetch(url.toString(), {
      method,
      headers,
      body: body ? JSON.stringify(body) : undefined,
    });

    const raw: any = await res.json().catch(() => ({}));

    if (!res.ok) {
      return {
        data: null,
        error: { error: raw.error || `HTTP ${res.status}`, status: res.status },
        ok: false,
        status: res.status,
      };
    }

    return { data: raw as T, error: null, ok: true, status: res.status };
  } catch (e: unknown) {
    const msg = e instanceof Error ? e.message : 'Network error';
    return {
      data: null,
      error: { error: msg, status: 0 },
      ok: false,
      status: 0,
    };
  }
}

/* ── typed helpers ────────────────────────────────────────────── */

export const api = {
  get: <T>(path: string, params?: Record<string, string>) =>
    request<T>(path, { method: 'GET', params }),

  post: <T>(path: string, body?: unknown) =>
    request<T>(path, { method: 'POST', body }),

  put: <T>(path: string, body?: unknown) =>
    request<T>(path, { method: 'PUT', body }),

  delete: <T>(path: string) =>
    request<T>(path, { method: 'DELETE' }),
};

/* ── domain models ────────────────────────────────────────────── */

export interface Lead {
  id: string;
  name: string;
  whatsapp: string;
  email: string | null;
  source: string;
  source_detail: string | null;
  status: string;
  score: number;
  tags: string;
  notes: string;
  created_at: string;
  updated_at: string;
}

export interface LeadDetail {
  lead: Lead;
  interactions: { id: string; lead_id: string; type: string; metadata: string; created_at: string }[];
}

export interface BlogPost {
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  category: string;
  status: 'draft' | 'approval' | 'published' | 'archived';
  author: string;
  meta_title: string;
  meta_description: string;
  date: string;
  readingTime: string;
  questionnaire_enabled: boolean;
  freebie_name: string | null;
}

export interface DashboardStats {
  leads: { total: number; new: number };
  posts: { pending: number; published: number };
  interactions: number;
}

/* ── lead endpoints ───────────────────────────────────────────── */

export function listLeads(params?: Record<string, string>) {
  return api.get<{ leads: Lead[] }>('/api/crm/leads', params);
}

export function getLead(id: string) {
  return api.get<LeadDetail>(`/api/crm/leads/${id}`);
}

export function updateLead(id: string, body: Partial<Lead>) {
  return api.put<any>(`/api/crm/leads/${id}`, body);
}

/* ── blog endpoints ───────────────────────────────────────────── */

export function listPosts(params?: Record<string, string>) {
  return api.get<{ posts: BlogPost[] }>('/api/blog', params);
}

export function getPost(slug: string) {
  return api.get<{ post: BlogPost }>(`/api/blog/${slug}`);
}

export function createPost(body: unknown) {
  return api.post<any>('/api/blog', body);
}

export function updatePost(slug: string, body: unknown) {
  return api.put<any>(`/api/blog/${slug}`, body);
}

export function deletePost(slug: string) {
  return api.delete<any>(`/api/blog/${slug}`);
}

/* ── auth endpoints ───────────────────────────────────────────── */

export interface AuthUser {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'editor';
}

export interface LoginResponse {
  token: string;
  user: AuthUser;
}

export async function login(email: string, password: string): Promise<ApiResponse<LoginResponse>> {
  const res = await request<LoginResponse>('/api/auth/login', {
    method: 'POST',
    body: { email, password },
  });
  if (res.ok && res.data) {
    // persist token for subsequent client requests
    if (typeof window !== 'undefined') {
      localStorage.setItem('admin_token', res.data.token);
      localStorage.setItem('admin_user', JSON.stringify(res.data.user));
    }
  }
  return res;
}

export function logout() {
  if (typeof window !== 'undefined') {
    localStorage.removeItem('admin_token');
    localStorage.removeItem('admin_user');
  }
}

/* ── dashboard ────────────────────────────────────────────────── */

export function dashboardStats() {
  return api.get<DashboardStats>('/api/dashboard/stats');
}

/* ── approval queue ───────────────────────────────────────────── */

export function approvalQueue() {
  return api.get<{ posts: BlogPost[] }>('/api/blog/approval-queue');
}