-- Migration 003 — reconcile remote schema with wrangler/d1/schema.sql
-- The deployed D1 predates the visitors/UTM work: `leads` lacks visitor_id and
-- the utm_* columns, `interactions` lacks visitor_id, and `visitors` is absent.
-- Run: npx wrangler d1 execute herlonmoura_crm --remote --file=wrangler/d1/migrations/003_reconcile_schema.sql

-- ── visitors (global unique-by-email tracking) ──────────────────────────────
CREATE TABLE IF NOT EXISTS visitors (
  id TEXT PRIMARY KEY,
  email TEXT UNIQUE,
  name TEXT,
  first_seen TEXT DEFAULT (datetime('now')),
  last_seen TEXT DEFAULT (datetime('now')),
  total_visits INTEGER DEFAULT 1,
  utm_source TEXT,
  utm_medium TEXT,
  utm_campaign TEXT,
  utm_term TEXT,
  utm_content TEXT,
  gclid TEXT,
  tags TEXT DEFAULT '[]',
  notes TEXT DEFAULT '',
  created_at TEXT DEFAULT (datetime('now')),
  updated_at TEXT DEFAULT (datetime('now'))
);

-- ── leads: visitor link + UTM attribution ──────────────────────────────────
ALTER TABLE leads ADD COLUMN visitor_id TEXT REFERENCES visitors(id);
ALTER TABLE leads ADD COLUMN utm_source TEXT;
ALTER TABLE leads ADD COLUMN utm_medium TEXT;
ALTER TABLE leads ADD COLUMN utm_campaign TEXT;
ALTER TABLE leads ADD COLUMN utm_term TEXT;
ALTER TABLE leads ADD COLUMN utm_content TEXT;

-- ── interactions: visitor link ─────────────────────────────────────────────
ALTER TABLE interactions ADD COLUMN visitor_id TEXT REFERENCES visitors(id);

-- ── blog_posts (referenced by the admin blog editor) ───────────────────────
CREATE TABLE IF NOT EXISTS blog_posts (
  id TEXT PRIMARY KEY,
  slug TEXT NOT NULL UNIQUE,
  title TEXT NOT NULL,
  meta_title TEXT,
  meta_description TEXT,
  excerpt TEXT,
  content TEXT NOT NULL,
  category TEXT DEFAULT 'Geral',
  status TEXT NOT NULL DEFAULT 'draft',
  freebie_name TEXT,
  requires_email BOOLEAN DEFAULT FALSE,
  questionnaire_enabled BOOLEAN DEFAULT FALSE,
  questionnaire_data TEXT DEFAULT '[]',
  author TEXT DEFAULT 'AI',
  published_at TEXT,
  created_at TEXT DEFAULT (datetime('now')),
  updated_at TEXT DEFAULT (datetime('now'))
);

-- ── freebies / email_sequences / email_logs / appointments / users ─────────
CREATE TABLE IF NOT EXISTS freebies (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  file_url TEXT,
  requires_email BOOLEAN DEFAULT TRUE,
  lead_id TEXT REFERENCES leads(id),
  created_at TEXT DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS email_sequences (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  trigger TEXT NOT NULL,
  delay_hours INTEGER DEFAULT 0,
  subject TEXT NOT NULL,
  body TEXT NOT NULL,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TEXT DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS email_logs (
  id TEXT PRIMARY KEY,
  lead_id TEXT REFERENCES leads(id),
  sequence_id TEXT REFERENCES email_sequences(id),
  subject TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'sent',
  sent_at TEXT DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS appointments (
  id TEXT PRIMARY KEY,
  lead_id TEXT REFERENCES leads(id),
  date TEXT NOT NULL,
  status TEXT DEFAULT 'scheduled',
  notes TEXT DEFAULT '',
  created_at TEXT DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS users (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL UNIQUE,
  password_hash TEXT NOT NULL,
  role TEXT NOT NULL DEFAULT 'editor',
  created_at TEXT DEFAULT (datetime('now'))
);

-- ── indexes ────────────────────────────────────────────────────────────────
CREATE INDEX IF NOT EXISTS idx_leads_status ON leads(status);
CREATE INDEX IF NOT EXISTS idx_leads_source ON leads(source);
CREATE INDEX IF NOT EXISTS idx_leads_created ON leads(created_at);
CREATE INDEX IF NOT EXISTS idx_leads_visitor ON leads(visitor_id);
CREATE INDEX IF NOT EXISTS idx_leads_email ON leads(email);
CREATE INDEX IF NOT EXISTS idx_interactions_lead ON interactions(lead_id);
CREATE INDEX IF NOT EXISTS idx_interactions_visitor ON interactions(visitor_id);
CREATE INDEX IF NOT EXISTS idx_interactions_type ON interactions(type);
CREATE INDEX IF NOT EXISTS idx_visitors_email ON visitors(email);
CREATE INDEX IF NOT EXISTS idx_blog_status ON blog_posts(status);
CREATE INDEX IF NOT EXISTS idx_blog_category ON blog_posts(category);
