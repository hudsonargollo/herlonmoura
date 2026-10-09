/**
 * Lead pipeline client — typed wrapper over the CRM Pages Functions.
 *
 *   GET    /api/crm/leads            list + stats
 *   POST   /api/crm/leads            create
 *   GET    /api/crm/leads/:id        detail + interaction timeline
 *   PATCH  /api/crm/leads/:id        status transition
 *   DELETE /api/crm/leads/:id        remove
 *
 * Works from the browser (admin UI) and from server components.
 */

export const LEAD_STATUSES = [
  "new",
  "contacted",
  "qualified",
  "appointment",
  "converted",
  "lost",
] as const;

export type LeadStatus = (typeof LEAD_STATUSES)[number];

/** Allowed forward transitions — mirrors functions/api/crm/leads/[id].ts */
export const LEAD_TRANSITIONS: Record<LeadStatus, LeadStatus[]> = {
  new: ["contacted", "qualified", "appointment", "converted", "lost"],
  contacted: ["qualified", "appointment", "converted", "lost"],
  qualified: ["appointment", "converted", "lost"],
  appointment: ["converted", "lost"],
  converted: ["lost"],
  lost: ["contacted", "qualified", "appointment", "converted"],
};

export const LEAD_STATUS_LABELS: Record<LeadStatus, string> = {
  new: "Novo",
  contacted: "Contatado",
  qualified: "Qualificado",
  appointment: "Consulta",
  converted: "Convertido",
  lost: "Perdido",
};

export interface StatusHistoryEntry {
  status: LeadStatus;
  timestamp: string;
  note?: string;
}

export interface Lead {
  id: string;
  name: string;
  whatsapp: string;
  email: string | null;
  visitor_id: string | null;
  source: string;
  source_detail: string | null;
  status: LeadStatus;
  score: number;
  tags: string;
  notes: string;
  next_action: string;
  status_history: StatusHistoryEntry[];
  status_changed_at: string | null;
  utm_source: string | null;
  utm_medium: string | null;
  utm_campaign: string | null;
  utm_term: string | null;
  utm_content: string | null;
  landing_page: string | null;
  created_at: string;
  updated_at: string;
}

export interface Interaction {
  id: string;
  lead_id: string | null;
  visitor_id: string | null;
  type: string;
  metadata: string;
  created_at: string;
}

export interface LeadStats {
  total: number;
  new: number;
  byStatus: Record<string, number>;
}

export interface CreateLeadInput {
  name: string;
  whatsapp?: string;
  phone?: string;
  email?: string | null;
  source?: string;
  source_detail?: string | null;
  status?: LeadStatus;
  score?: number;
  riskScore?: number;
  tags?: string[];
  notes?: string;
  next_action?: string;
  visitor_id?: string | null;
  utm_source?: string | null;
  utm_medium?: string | null;
  utm_campaign?: string | null;
  utm_term?: string | null;
  utm_content?: string | null;
  landing_page?: string | null;
  [key: string]: unknown;
}

export interface UpdateLeadInput {
  status?: LeadStatus;
  note?: string;
  next_action?: string;
  tags?: string[] | string;
  notes?: string;
  score?: number;
  email?: string | null;
  whatsapp?: string;
}

/* ── UTM capture ───────────────────────────────────────────────── */

const UTM_KEYS = [
  "utm_source",
  "utm_medium",
  "utm_campaign",
  "utm_term",
  "utm_content",
] as const;

const UTM_STORAGE_KEY = "hm_utm";

export type UtmParams = Partial<Record<(typeof UTM_KEYS)[number], string>> & {
  landing_page?: string;
};

/**
 * Read UTM params from the current URL, falling back to the first-touch
 * values stored in sessionStorage so a lead attributed on /?utm_source=x
 * keeps that attribution when it converts on /contato.
 */
export function captureUtm(): UtmParams {
  if (typeof window === "undefined") return {};

  const params: UtmParams = {};
  const search = new URLSearchParams(window.location.search);
  for (const key of UTM_KEYS) {
    const value = search.get(key);
    if (value) params[key] = value;
  }

  let stored: UtmParams = {};
  try {
    stored = JSON.parse(sessionStorage.getItem(UTM_STORAGE_KEY) || "{}");
  } catch {
    stored = {};
  }

  const merged: UtmParams = { ...stored, ...params };
  if (!merged.landing_page) {
    merged.landing_page = stored.landing_page || window.location.pathname + window.location.search;
  }

  try {
    sessionStorage.setItem(UTM_STORAGE_KEY, JSON.stringify(merged));
  } catch {
    /* storage unavailable — attribution is best-effort */
  }

  return merged;
}

/* ── transport ─────────────────────────────────────────────────── */

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const res = await fetch(path, {
    ...init,
    headers: { "Content-Type": "application/json", ...(init?.headers || {}) },
  });
  const body: any = await res.json().catch(() => ({}));
  if (!res.ok) {
    const err: any = new Error(body.error || `HTTP ${res.status}`);
    err.status = res.status;
    err.body = body;
    throw err;
  }
  return body as T;
}

/* ── endpoints ─────────────────────────────────────────────────── */

export function listLeads(params?: {
  status?: LeadStatus | "all";
  source?: string;
  limit?: number;
}) {
  const q = new URLSearchParams();
  if (params?.status) q.set("status", params.status);
  if (params?.source) q.set("source", params.source);
  if (params?.limit) q.set("limit", String(params.limit));
  const qs = q.toString();
  return request<{ leads: Lead[]; stats: LeadStats }>(`/api/crm/leads${qs ? `?${qs}` : ""}`);
}

export function getLead(id: string) {
  return request<{ lead: Lead; interactions: Interaction[] }>(`/api/crm/leads/${id}`);
}

/** Create a lead. UTM params from the current URL are attached automatically. */
export function createLead(input: CreateLeadInput) {
  const utm = captureUtm();
  return request<{ id: string; status: LeadStatus; created_at: string }>("/api/crm/leads", {
    method: "POST",
    body: JSON.stringify({ ...utm, ...input }),
  });
}

/** Transition a lead's status. Records the change in status_history. */
export function updateLeadStatus(id: string, status: LeadStatus, note?: string) {
  return request<{ lead: Lead }>(`/api/crm/leads/${id}`, {
    method: "PATCH",
    body: JSON.stringify({ status, ...(note ? { note } : {}) }),
  });
}

export function updateLead(id: string, input: UpdateLeadInput) {
  return request<{ lead: Lead }>(`/api/crm/leads/${id}`, {
    method: "PATCH",
    body: JSON.stringify(input),
  });
}

export function deleteLead(id: string) {
  return request<{ ok: boolean; id: string }>(`/api/crm/leads/${id}`, { method: "DELETE" });
}

export function dashboardStats() {
  return request<{
    leads: { total: number; new: number; byStatus: Record<string, number>; conversionRate: number };
    interactions: number;
    visitors: { total: number; unique: number };
    sources: Record<string, number>;
  }>("/api/dashboard/stats");
}

/** True when `to` is a legal transition from `from`. */
export function canTransition(from: LeadStatus, to: LeadStatus): boolean {
  if (from === to) return false;
  return (LEAD_TRANSITIONS[from] ?? []).includes(to);
}
