-- Migration 004 — Section analytics + lead interest attribution
--
-- Goal: capture which sections of the public site people actually look at,
-- and which procedure/section a lead came from, so conversion work can be
-- targeted instead of guessed.
--
-- Run:
--   npx wrangler d1 execute herlonmoura_crm --remote --file=wrangler/d1/migrations/004_analytics.sql

-- ── Section / CTA analytics events ──────────────────────────────────────────
-- Deliberately lead-independent: most visitors never submit a form, but their
-- section engagement is exactly the signal needed to improve conversion.
CREATE TABLE IF NOT EXISTS analytics_events (
  id TEXT PRIMARY KEY,
  visitor_id TEXT,                  -- anonymous, persisted in localStorage
  session_id TEXT,                  -- per-tab-session
  event_type TEXT NOT NULL,         -- section_view | cta_click | modal_open | modal_submit | whatsapp_click
  section_id TEXT,                  -- hero | procedimentos | sintomas | calculadora-tvp | sobre | contato | procedure:<slug>
  label TEXT,                       -- human-readable detail (button text, procedure title)
  page TEXT,                        -- pathname where it fired
  metadata TEXT DEFAULT '{}',       -- JSON: view duration, scroll depth, utm, referrer
  created_at TEXT DEFAULT (datetime('now'))
);

CREATE INDEX IF NOT EXISTS idx_events_created   ON analytics_events(created_at);
CREATE INDEX IF NOT EXISTS idx_events_type      ON analytics_events(event_type);
CREATE INDEX IF NOT EXISTS idx_events_section   ON analytics_events(section_id);
CREATE INDEX IF NOT EXISTS idx_events_visitor   ON analytics_events(visitor_id);
CREATE INDEX IF NOT EXISTS idx_events_session   ON analytics_events(session_id);

-- ── Lead interest attribution ───────────────────────────────────────────────
-- `interest` is the specific thing the visitor asked about (a procedure slug,
-- a section, a symptom group). `source_detail` stays as the broader context.
ALTER TABLE leads ADD COLUMN interest TEXT;

CREATE INDEX IF NOT EXISTS idx_leads_interest ON leads(interest);
