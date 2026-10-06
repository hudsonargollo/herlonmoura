-- D1 Schema — herlonmoura CRM
-- Run: npx wrangler d1 execute herlonmoura_crm --file=schema.sql

-- Users (staff access to dashboard)
CREATE TABLE IF NOT EXISTS users (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL UNIQUE,
  password_hash TEXT NOT NULL,
  role TEXT NOT NULL DEFAULT 'editor', -- admin | editor | viewer
  created_at TEXT DEFAULT (datetime('now'))
);

-- Leads (from blog questionnaires, freebies, contact)
CREATE TABLE IF NOT EXISTS leads (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  whatsapp TEXT NOT NULL,
  email TEXT,
  source TEXT NOT NULL DEFAULT 'blog', -- blog | freebie | contact | whatsapp
  source_detail TEXT, -- which post / which freebie
  status TEXT NOT NULL DEFAULT 'new', -- new | contacted | qualified | appointment | converted | lost
  score INTEGER DEFAULT 0, -- 0-100 qualification score
  tags TEXT DEFAULT '[]', -- JSON array
  notes TEXT DEFAULT '',
  created_at TEXT DEFAULT (datetime('now')),
  updated_at TEXT DEFAULT (datetime('now'))
);

-- Interactions (every touchpoint)
CREATE TABLE IF NOT EXISTS interactions (
  id TEXT PRIMARY KEY,
  lead_id TEXT NOT NULL REFERENCES leads(id),
  type TEXT NOT NULL, -- page_view | quiz_start | quiz_complete | pdf_download | whatsapp_click | email_open | email_click | appointment_booked
  metadata TEXT DEFAULT '{}', -- JSON
  created_at TEXT DEFAULT (datetime('now'))
);

-- Blog posts (draft → approval → published)
CREATE TABLE IF NOT EXISTS blog_posts (
  id TEXT PRIMARY KEY,
  slug TEXT NOT NULL UNIQUE,
  title TEXT NOT NULL,
  meta_title TEXT,
  meta_description TEXT,
  excerpt TEXT,
  content TEXT NOT NULL,
  category TEXT DEFAULT 'Geral',
  status TEXT NOT NULL DEFAULT 'draft', -- draft | approval | published | archived
  freebie_name TEXT, -- name of PDF/list if applicable
  requires_email BOOLEAN DEFAULT FALSE,
  questionnaire_enabled BOOLEAN DEFAULT FALSE,
  questionnaire_data TEXT DEFAULT '[]', -- JSON array of questions
  author TEXT DEFAULT 'AI',
  published_at TEXT,
  created_at TEXT DEFAULT (datetime('now')),
  updated_at TEXT DEFAULT (datetime('now'))
);

-- Freebies (PDFs, lists, guides)
CREATE TABLE IF NOT EXISTS freebies (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  file_url TEXT,
  requires_email BOOLEAN DEFAULT TRUE,
  lead_id TEXT REFERENCES leads(id),
  created_at TEXT DEFAULT (datetime('now'))
);

-- Email sequences
CREATE TABLE IF NOT EXISTS email_sequences (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  trigger TEXT NOT NULL, -- welcome | freebie_download | appointment_nudge | weekly_digest | reengagement
  delay_hours INTEGER DEFAULT 0,
  subject TEXT NOT NULL,
  body TEXT NOT NULL,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TEXT DEFAULT (datetime('now'))
);

-- Email sends log
CREATE TABLE IF NOT EXISTS email_logs (
  id TEXT PRIMARY KEY,
  lead_id TEXT NOT NULL REFERENCES leads(id),
  sequence_id TEXT REFERENCES email_sequences(id),
  subject TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'sent', -- sent | opened | clicked | bounced
  sent_at TEXT DEFAULT (datetime('now'))
);

-- Appointments
CREATE TABLE IF NOT EXISTS appointments (
  id TEXT PRIMARY KEY,
  lead_id TEXT NOT NULL REFERENCES leads(id),
  date TEXT NOT NULL,
  status TEXT DEFAULT 'scheduled', -- scheduled | confirmed | cancelled | completed
  notes TEXT DEFAULT '',
  created_at TEXT DEFAULT (datetime('now'))
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_leads_status ON leads(status);
CREATE INDEX IF NOT EXISTS idx_leads_source ON leads(source);
CREATE INDEX IF NOT EXISTS idx_leads_created ON leads(created_at);
CREATE INDEX IF NOT EXISTS idx_interactions_lead ON interactions(lead_id);
CREATE INDEX IF NOT EXISTS idx_interactions_type ON interactions(type);
CREATE INDEX IF NOT EXISTS idx_blog_status ON blog_posts(status);
CREATE INDEX IF NOT EXISTS idx_blog_category ON blog_posts(category);
