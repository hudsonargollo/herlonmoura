# CRM Development Notes

## What's wired
- **Login page**: `/login` — demo credentials `admin@herlonmoura.com.br` / `admin2026!`
- **Auth API**: `POST /api/auth/login` — returns JWT token + sets `admin_token` cookie (HttpOnly, 24h)
- **Multi-user admin**: `GET/POST/PATCH/DELETE /api/admin/users` — role-based access (admin | editor | viewer)
- **CRM page**: `/admin/crm` — lead table with filters (status, source, date range, search), score bars
- **Leads API**: `GET /api/crm/leads?status=xxx` — returns `{ leads, stats }`
- **Reports API**: `GET /api/admin/reports` — summary block + per-lead list + recent activity, visitors, procedures
- **ProtectedRoute**: redirects to `/admin/login` when unauthenticated

## Roles
| Role | Permissions |
|---|---|
| `admin` | Full access — users, leads, reports, all pages |
| `editor` | Leads, CRM, reports — no user management |
| `viewer` | Read-only dashboards and reports |

## Access control
- `/api/admin/users` and `/api/admin/reports` require `admin` or `editor` role (JWT verified server-side)
- The client `ProtectedRoute` enforces role thresholds: `admin` (4) > `editor` (3) > `reviewer` (2) > `viewer` (1)
- `viewer` role still reaches analytics and stats pages but cannot manage users

## Latest API surface added
- `GET  /api/admin/users`         — list users (admin only)
- `POST /api/admin/users`         — create user (admin only)
- `PATCH /api/admin/users/:id`    — update name/email/role (admin only)
- `DELETE /api/admin/users/:id`   — deactivate a user (admin only)
- `GET  /api/admin/reports`       — summary + leads + activity + visitors + procedures
- `GET  /api/admin/reports/leads` — paginated lead list with detail fields
- `GET  /api/admin/reports/visitors` — per-visitor timeline
- `GET  /api/admin/reports/procedures` — procedure engagement + lead attribution

## Deploy
- Pages: `npx wrangler pages deploy out --project-name=herlon-moura-website --commit-dirty=true`
- Workers: `cd wrangler/workers && npx wrangler deploy` (sets `JWT_SECRET` via `wrangler secret put`)

## Schema
- `wrangler/d1/schema.sql` — `users`, `visitors`, `leads`, `interactions`, `blog_posts`, `freebies`, `email_sequences`, `email_logs`, `appointments`
- Migrations: `wrangler/d1/migrations/002_lead_pipeline.sql`, `003_reconcile_schema.sql`, `004_analytics.sql`
- Run: `npx wrangler d1 execute herlonmoura_crm --remote --file=<migration>.sql`
