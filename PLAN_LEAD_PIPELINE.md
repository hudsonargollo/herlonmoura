# Plan: CRM Lead Pipeline API + Dashboard Status Transitions (t_93dcf7a9)

## Current state (verified live)
- Branch `main` @ 7bbf605 — static export (`next.config.mjs` output:"export") + Pages Functions.
- Live: https://herlon-moura-website.pages.dev (200), herlonmoura.com.br (200).
- D1 `herlonmoura_crm` (d2852878-3462-47f7-a799-71a07015814b) bound as `CRM_DB` in wrangler.toml.
- Working live: `GET /api/crm/leads` (200, list+stats), `POST /api/crm/leads` (201, creates lead).
- Broken live: `PATCH /api/crm/leads/[id]` → 405 (no `functions/api/crm/leads/[id].ts`).
  `GET /api/crm/leads/[id]` → 404. `GET /api/dashboard/stats` → 404.
- Status vocabulary mismatch: DB/UI use `new|contacted|qualified|appointment|converted|lost`;
  task body asks for `new_lead|contacted|qualified|demo_scheduled|converted|won|lost`.
  → Keep the existing DB vocabulary (schema + 3 UIs already use it); add `status_history` + `next_action`.

## Deliverables
1. `functions/api/crm/leads/[id].ts` — GET (lead + interactions), PATCH (status transition + history), DELETE.
2. `functions/api/crm/leads/index.ts` — accept `status`, return id, persist UTM fields.
3. `lib/leads.ts` — typed client for the pipeline API.
4. `wrangler/d1/migrations/002_lead_pipeline.sql` — `status_history`, `next_action` columns.
5. `lib/blog-data.ts` UTM tracking — verify/align.
6. Build + deploy + live verification of every endpoint.

## Status flow
new → contacted → qualified → appointment → converted
any → lost
