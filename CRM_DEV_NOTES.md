# CRM Development Notes

## What's wired
- **Login page**: `/login` — demo credentials `admin@herlonmoura.com.br` / `admin2026!`
- **Auth API**: `POST /api/auth/login` — returns JWT token + sets `admin_token` cookie (HttpOnly, 24h)
- **CRM page**: `/admin/crm` — lead table with filters (status, source, date range, search), score bars
- **Leads API**: `GET /api/crm/leads?status=xxx` — returns `{ leads, stats }`
- **ProtectedRoute**: redirects to `/admin/login` when unauthenticated

## What's missing / broken
- **D1 binding `CRM_DB`** not available locally — dev server returns "D1 binding not available" for `/api/crm/leads`
- Fix: set `CRM_DB` env or deploy to Cloudflare Pages where the binding is in `wrangler.toml`

## Deploy
```bash
npx wrangler pages deploy out --project-name=herlon-moura-website --commit-dirty=true
```

## Files changed (b0374ba)
- `app/api/auth/login/route.ts` — login endpoint
- `app/api/crm/leads/route.ts` — leads CRUD endpoint (moved from root `/api/crm`)