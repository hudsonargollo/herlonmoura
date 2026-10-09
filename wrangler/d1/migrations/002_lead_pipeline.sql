-- Migration 002 — lead pipeline: status history + next action
-- Run: npx wrangler d1 execute herlonmoura_crm --remote --file=wrangler/d1/migrations/002_lead_pipeline.sql

-- Status transition history: JSON array of {status, timestamp, note}
ALTER TABLE leads ADD COLUMN status_history TEXT DEFAULT '[]';

-- Free-text next action for the lead owner
ALTER TABLE leads ADD COLUMN next_action TEXT DEFAULT '';

-- Timestamp of the most recent status transition (separate from updated_at)
ALTER TABLE leads ADD COLUMN status_changed_at TEXT;

-- Landing page the lead converted on (UTM/visitor tracking)
ALTER TABLE leads ADD COLUMN landing_page TEXT;

CREATE INDEX IF NOT EXISTS idx_leads_next_action ON leads(next_action);
CREATE INDEX IF NOT EXISTS idx_leads_status_changed ON leads(status_changed_at);
