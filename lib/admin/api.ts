const API_BASE = process.env.CRM_API_URL || '';

async function request<T>(path: string, opts?: RequestInit): Promise<T> {
  const token = localStorage.getItem('admin_token');
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(opts?.headers as Record<string, string> || {}),
  };
  if (token) headers['Authorization'] = `Bearer ${token}`;

  const url = `${API_BASE}${path}`;
  const res = await fetch(url, { ...opts, headers });
  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw new Error(body.error || `HTTP ${res.status}`);
  }
  return res.json();
}

export const api = {
  get: <T>(path: string) => request<T>(path),
  post: <T>(path: string, body?: object) => request<T>(path, { method: 'POST', body: JSON.stringify(body) }),
  put: <T>(path: string, body?: object) => request<T>(path, { method: 'PUT', body: JSON.stringify(body) }),
  delete: <T>(path: string) => request<T>(path, { method: 'DELETE' }),
};

// Blog helpers (map to correct API paths)
export async function createBlogPost(body: object) {
  return api.post<any>('/api/blog', body);
}

export async function updateBlogPost(slug: string, body: object) {
  return api.put<any>(`/api/blog/${slug}`, body);
}

// Auth
export async function login(email: string, password: string) {
  const res = await fetch(`${API_BASE}/api/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
  });
  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw new Error(body.error || 'Login falhou');
  }
  const data = await res.json();
  localStorage.setItem('admin_token', data.token);
  localStorage.setItem('admin_user', JSON.stringify(data.user));
  return data;
}

export function logout() {
  localStorage.removeItem('admin_token');
  localStorage.removeItem('admin_user');
}

export function getToken(): string | null {
  return localStorage.getItem('admin_token');
}

export function getUser(): object | null {
  const raw = localStorage.getItem('admin_user');
  return raw ? JSON.parse(raw) : null;
}

// Leads
export function listLeads(params?: Record<string, string>) {
  const q = params && Object.keys(params).length ? '?' + new URLSearchParams(params).toString() : '';
  return api.get<{ leads: any[] }>(`/api/crm/leads${q}`);
}

export function getLead(id: string) {
  return api.get<{ lead: any; interactions: any[] }>(`/api/crm/leads/${id}`);
}

export function updateLead(id: string, body: object) {
  return api.put<any>(`/api/crm/leads/${id}`, body);
}

export interface BlogPost {
  slug: string;
  title: string;
  excerpt: string;
  date: string;
  category: string;
  author: string;
  status: 'draft' | 'approval' | 'published' | 'archived';
  readingTime: string;
  content: string;
  meta_title: string;
  meta_description: string;
  questionnaire_enabled: boolean;
  freebie_name: string | null;
}
export function listPosts(params?: Record<string, string>) {
  const q = params && Object.keys(params).length ? '?' + new URLSearchParams(params).toString() : '';
  return api.get<{ posts: BlogPost[] }>(`/api/blog${q}`);
}

export function getPost(slug: string) {
  return api.get<{ post: any }>(`/api/blog/${slug}`);
}

export function createPost(body: object) {
  return api.post<any>('/api/blog', body);
}

export function updatePost(slug: string, body: object) {
  return api.put<any>(`/api/blog/${slug}`, body);
}

export function deletePost(slug: string) {
  return api.delete<any>(`/api/blog/${slug}`);
}

export function approvalQueue() {
  return api.get<{ posts: any[] }>('/api/blog/approval-queue');
}

// Dashboard stats
export function dashboardStats() {
  return api.get<any>('/api/dashboard/stats');
}
