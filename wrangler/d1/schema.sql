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

-- Visitors (unique by email, tracks all page views + UTM)
CREATE TABLE IF NOT EXISTS visitors (
  id TEXT PRIMARY KEY,
  email TEXT UNIQUE,                -- set when user submits a test/lead
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
  tags TEXT DEFAULT '[]',           -- JSON array
  notes TEXT DEFAULT '',
  created_at TEXT DEFAULT (datetime('now')),
  updated_at TEXT DEFAULT (datetime('now'))
);

-- Leads (from blog questionnaires, freebies, contact, tests)
CREATE TABLE IF NOT EXISTS leads (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  whatsapp TEXT NOT NULL,
  email TEXT,
  visitor_id TEXT REFERENCES visitors(id),  -- link to global visitor
  source TEXT NOT NULL DEFAULT 'blog', -- blog | freebie | contact | whatsapp | test | questionnaire | varizes-assessment | trombose-screening
  source_detail TEXT, -- which post / which freebie / which test
  status TEXT NOT NULL DEFAULT 'new', -- new | contacted | qualified | appointment | converted | lost
  score INTEGER DEFAULT 0, -- 0-100 qualification score
  tags TEXT DEFAULT '[]', -- JSON array
  notes TEXT DEFAULT '',
  utm_source TEXT,
  utm_medium TEXT,
  utm_campaign TEXT,
  utm_term TEXT,
  utm_content TEXT,
  created_at TEXT DEFAULT (datetime('now')),
  updated_at TEXT DEFAULT (datetime('now'))
);

-- Interactions (every touchpoint)
CREATE TABLE IF NOT EXISTS interactions (
  id TEXT PRIMARY KEY,
  lead_id TEXT REFERENCES leads(id),
  visitor_id TEXT REFERENCES visitors(id),
  type TEXT NOT NULL, -- page_view | quiz_start | quiz_complete | pdf_download | whatsapp_click | email_open | email_click | appointment_booked | test_start | test_submit
  metadata TEXT DEFAULT '{}', -- JSON (utm, url, answers snapshot, etc.)
  created_at TEXT DEFAULT (datetime('now'))
);

-- Blog posts (draft → approval → curated → published)
CREATE TABLE IF NOT EXISTS blog_posts (
  id TEXT PRIMARY KEY,
  slug TEXT NOT NULL UNIQUE,
  title TEXT NOT NULL,
  meta_title TEXT,
  meta_description TEXT,
  excerpt TEXT,
  content TEXT NOT NULL,
  category TEXT DEFAULT 'Geral',
  status TEXT NOT NULL DEFAULT 'draft', -- draft | approval | curated | published | archived
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
  lead_id TEXT REFERENCES leads(id),
  sequence_id TEXT REFERENCES email_sequences(id),
  subject TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'sent', -- sent | opened | clicked | bounced
  sent_at TEXT DEFAULT (datetime('now'))
);

-- Appointments
CREATE TABLE IF NOT EXISTS appointments (
  id TEXT PRIMARY KEY,
  lead_id TEXT REFERENCES leads(id),
  date TEXT NOT NULL,
  status TEXT DEFAULT 'scheduled', -- scheduled | confirmed | cancelled | completed
  notes TEXT DEFAULT '',
  created_at TEXT DEFAULT (datetime('now'))
);

-- Indexes
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
