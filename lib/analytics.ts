'use client';

/* ============================================
   Section analytics — client side.

   Purpose: learn which sections and which procedures people actually engage
   with, so conversion work can be aimed at real interest rather than guesses.
   Most visitors never submit a form, so section engagement is the only signal
   available for them.

   Design notes:
   - Anonymous. A random `visitor_id` persists in localStorage; `session_id`
     lives in sessionStorage. No personal data is collected here.
   - Batched. Events queue and flush on an interval / on page hide, so a
     visitor scrolling the page does not fire dozens of requests.
   - Fire-and-forget. Analytics must never break the page or block a CTA.
   ============================================ */

const VISITOR_KEY = 'hm_visitor_id';
const SESSION_KEY = 'hm_session_id';
const ENDPOINT = '/api/analytics/events';
const FLUSH_INTERVAL_MS = 8000;
const MAX_QUEUE = 40;

export type AnalyticsEventType =
  | 'section_view'
  | 'cta_click'
  | 'modal_open'
  | 'modal_submit'
  | 'whatsapp_click';

export interface AnalyticsEvent {
  event_type: AnalyticsEventType;
  section_id?: string;
  label?: string;
  page?: string;
  metadata?: Record<string, unknown>;
}

function randomId(): string {
  if (typeof crypto !== 'undefined' && 'randomUUID' in crypto) return crypto.randomUUID();
  return `v-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 10)}`;
}

/** Anonymous, stable-across-visits id. Null when storage is unavailable. */
export function getVisitorId(): string | null {
  if (typeof window === 'undefined') return null;
  try {
    let id = localStorage.getItem(VISITOR_KEY);
    if (!id) {
      id = randomId();
      localStorage.setItem(VISITOR_KEY, id);
    }
    return id;
  } catch {
    return null;
  }
}

/** Per-tab-session id, so a returning visitor's two visits aren't merged. */
export function getSessionId(): string | null {
  if (typeof window === 'undefined') return null;
  try {
    let id = sessionStorage.getItem(SESSION_KEY);
    if (!id) {
      id = randomId();
      sessionStorage.setItem(SESSION_KEY, id);
    }
    return id;
  } catch {
    return null;
  }
}

/* ── Queue + flush ───────────────────────────────────────────────────────── */

let queue: AnalyticsEvent[] = [];
let timer: ReturnType<typeof setTimeout> | null = null;
let listenersBound = false;

function flush(useBeacon = false): void {
  if (queue.length === 0) return;
  const events = queue;
  queue = [];

  const payload = JSON.stringify({
    events,
    visitor_id: getVisitorId(),
    session_id: getSessionId(),
  });

  // On page hide, sendBeacon survives the unload where fetch() would be killed.
  if (useBeacon && typeof navigator !== 'undefined' && 'sendBeacon' in navigator) {
    try {
      navigator.sendBeacon(ENDPOINT, new Blob([payload], { type: 'application/json' }));
      return;
    } catch {
      /* fall through to fetch */
    }
  }

  try {
    void fetch(ENDPOINT, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: payload,
      keepalive: true,
    }).catch(() => {});
  } catch {
    /* never surface analytics failures */
  }
}

function scheduleFlush(): void {
  if (timer) return;
  timer = setTimeout(() => {
    timer = null;
    flush();
  }, FLUSH_INTERVAL_MS);
}

function bindLifecycle(): void {
  if (listenersBound || typeof window === 'undefined') return;
  listenersBound = true;
  // Flush what's pending when the page is being hidden or unloaded.
  document.addEventListener('visibilitychange', () => {
    if (document.visibilityState === 'hidden') flush(true);
  });
  window.addEventListener('pagehide', () => flush(true));
}

/** Record one engagement event. Safe to call from anywhere, never throws. */
export function track(event: AnalyticsEvent): void {
  if (typeof window === 'undefined') return;
  try {
    bindLifecycle();
    queue.push({
      ...event,
      page: event.page ?? window.location.pathname,
    });
    if (queue.length >= MAX_QUEUE) {
      flush();
      return;
    }
    scheduleFlush();
  } catch {
    /* ignore */
  }
}

/* ── Section view tracking ───────────────────────────────────────────────── */

const viewObserverRef: { current: IntersectionObserver | null } = { current: null };
const seenSections = new Set<string>();

/**
 * Observe elements marked with `data-analytics-section` and record a
 * `section_view` the first time each becomes meaningfully visible.
 *
 * Only the FIRST view per section per page load is recorded — repeat views
 * add noise without adding signal, and the `seenSections` guard keeps the
 * event volume proportional to real reach.
 */
export function initSectionTracking(): () => void {
  if (typeof window === 'undefined' || typeof IntersectionObserver === 'undefined') {
    return () => {};
  }

  // Tear down any previous observer (route changes, HMR).
  viewObserverRef.current?.disconnect();
  seenSections.clear();

  const observer = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        if (!entry.isIntersecting) continue;
        const sectionId = (entry.target as HTMLElement).dataset.analyticsSection;
        if (!sectionId || seenSections.has(sectionId)) continue;
        seenSections.add(sectionId);
        track({
          event_type: 'section_view',
          section_id: sectionId,
          label: (entry.target as HTMLElement).dataset.analyticsLabel || undefined,
          metadata: { ratio: Number(entry.intersectionRatio.toFixed(2)) },
        });
      }
    },
    // A section counts as "seen" at 40% visible — high enough that a section
    // merely scrolled past in one flick doesn't register as interest.
    { threshold: 0.4 }
  );

  viewObserverRef.current = observer;
  const attach = () => {
    document.querySelectorAll<HTMLElement>('[data-analytics-section]').forEach((el) => {
      observer.observe(el);
    });
  };
  attach();
  // Re-scan once after hydration settles, to catch late-mounted sections.
  const t = setTimeout(attach, 600);

  return () => {
    clearTimeout(t);
    observer.disconnect();
    viewObserverRef.current = null;
  };
}

/* ── Convenience wrappers ────────────────────────────────────────────────── */

export function trackCtaClick(sectionId: string, label: string, metadata?: Record<string, unknown>): void {
  track({ event_type: 'cta_click', section_id: sectionId, label, metadata });
}

export function trackModalOpen(sectionId: string, label?: string): void {
  track({ event_type: 'modal_open', section_id: sectionId, label });
}

export function trackModalSubmit(sectionId: string, label?: string, metadata?: Record<string, unknown>): void {
  track({ event_type: 'modal_submit', section_id: sectionId, label, metadata });
}

export function trackWhatsappClick(sectionId: string, label?: string): void {
  track({ event_type: 'whatsapp_click', section_id: sectionId, label });
}
