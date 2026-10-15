# Admin Panel — Multi-User Access & Reports

## Multi-user access (`/api/admin/users`, new)
- D1 `users` table: `id, name, email (unique), password_hash, role (admin|editor|viewer), created_at`
- Roles: `admin` (full) > `editor` (leads + CRM + reports, no users) > `viewer` (read-only)
- Endpoints:
  - `GET  /api/admin/users`          — list users (admin only)
  - `POST /api/admin/users`          — create user (admin only)
  - `PATCH /api/admin/users/:id`     — update name/email/role (admin only; cannot modify the only admin)
  - `DELETE /api/admin/users/:id`    — deactivate a user (admin only)
- Every request goes through `verifyAuth` (JWT HS256, 8h expiry) + role enforcement on the server.
- Client: `ProtectedRoute` blocks on role threshold; `viewer` can see analytics/stats but not user pages.

## Detailed reports (`/api/admin/reports`, new)
- `GET /api/admin/reports` — summary + leads list + recent activity + visitors + procedure breakdown
- `GET /api/admin/reports/leads?search=&status=&source=&limit=&offset=` — paginated full-detail lead list
- `GET /api/admin/reports/visitors?days=&limit=` — per-visitor timeline (page views, leads, conversions)
- `GET /api/admin/reports/procedures?days=` — procedure engagement + lead attribution
- Data source: D1 `leads`, `visitors`, `analytics_events`, `interactions` (server-side, no client caching)

## What's already there
- `/api/dashboard/stats` — aggregated counters (leads by status, visitors, sources)
- `/api/analytics/funnels?days=` — conversion funnel + cohort + per-procedure engagement
