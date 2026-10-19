# /doc Page — Development Log & SEO Documentation

## Project: Dr. Herlon Moura — Angiologista e Cirurgião Vascular
## Page: `/doc` (Plataforma Digital — Documentação Técnica)
## Date: 19 de outubro de 2024
## Author: Hudson Argollo — Web Wizard / Front-End

---

## 1. Overview

The `/doc` page documents the full digital platform rebuild: from a generic WordPress theme to a modern Next.js 15 static-export site on Cloudflare Pages. It serves both as a **technical portfolio** (showing before/after comparisons, design system, tech stack) and as an **SEO-visible documentation surface** (with structured data, audit checklist, and content strategy notes).

---

## 2. Hero Improvements

### Logo Placement
- **Before**: Logo was present but without context label.
- **After**: Logo component (`<Logo size="lg" animated />`) placed at the top of the hero text column, accompanied by a muted "Documentação técnica" badge to clarify the page's purpose. This reinforces brand identity above the fold.

### Copy Improvements
- **Before**: Generic "Visão geral da plataforma digital" tagline; body copy was functional but generic.
- **After**: Rewrote the hero body to lead with patient-first language: "pensada em quem pega o celular com dor na perna à noite e precisa entender se é trombose." Emphasized SEO impact (+90% organic growth) and clearer value proposition (content machine, CRM, SEO architecture).

### CTA Badges
- **Before**: Two inline metric badges (42 artigos, data de atualização).
- **After**: Three badges — added "48 tokens · 60 CSS vars · 12 componentes" to showcase technical depth. Improved visual separation with `gap-6` and wrapped key metrics in `<span>` elements for better scannability.

### Floating Metric Card
- Animated Framer Motion card showing "+90% orgânico em 6 meses pós-migração" — social proof with a green upward trend icon.

### Structured Data (JSON-LD)
- Added `application/ld+json` script with full `MedicalBusiness` schema including:
  - Business name, description, URL
  - Medical specialty (Vascular)
  - Full address (Salvador, BA, BR)
  - sameAs links (Instagram, website)
  - Keywords array: "angiologista Salvador", "cirurgia vascular", "varizes", "trombose venosa profunda", "doenças vasculares"

---

## 3. Before/After Comparison Table Improvements

### Visual Comparison Cards
- **Before**: Side-by-side text blocks with minimal visual distinction.
- **After**: `BeforeAfterCard` component with enhanced visual treatment:
  - **Before column**: Red accent color (#EF4444), dashed border on illustration container, X icon at half opacity
  - **After column**: Green accent color (#10B981), solid rounded container, full-color illustrations
  - **Separator**: Centered arrow circle with canvas background and border glow

### Illustration Integration
- **Before**: Icons at `h-8 w-8`.
- **After**: Icons upgraded to `h-9 w-9` for better visual weight. The CliniqIcon (doppler) now has the `glow` prop enabled for a pulsing halo effect. All Lucide icons (FileText, Activity, Calculator, UserPlus) scaled consistently.

### Status Badges
- Color-coded circular badges with icons:
  - Green (#10B981): Concluído (done)
  - Yellow (#F59E0B): Em andamento (partial)
  - Red (#EF4444): Planejado (pending)

### Animation
- Framer Motion stagger animation: cards fade and slide in from bottom with `delay: idx * 0.1` as they enter viewport (one-time, `viewport={{ once: true }}`).

### Padding & Spacing
- Card padding increased from `p-5` to `p-6`.
- Icon containers increased from `h-7 w-7` to `h-8 w-8`.
- Illustration containers increased from `h-20` to `h-24`.
- Separator circle increased from `h-8 w-8` to `h-9 w-9`.

---

## 4. SEO Checklist Section — Updated Accuracy

Cross-referenced the on-page SEO checklist against `docs/SEO_AUDIT_FIX_PLAN.md` and `docs/report.pdf` (Glacial Multimedia audit). Corrected items that were previously marked "pending" but are actually implemented:

| Item | Status | Notes |
|------|--------|-------|
| Robots.txt | ✅ Done | `public/robots.txt` — sitemap referenced, AI crawlers allowed |
| Canonical Tag | ✅ Done | Added site-wide via `app/layout.tsx` |
| Hreflang pt-BR | ✅ Done | `hreflang="pt-BR"` in layout Head |
| Meta title (50-60c) | ✅ Done | Reduced from 74 to 58 characters |
| Meta description (120-160c) | ✅ Done | Trimmed from 167 to 152 characters |
| Image optimization | ⏳ Partial | WebP + width/height. Target: 23.2MB → 5MB |
| llms.txt | ✅ Done | `/llms.txt` created with sitemap + resource links for AI bots |
| Alt attributes | ✅ Done | Full scan complete — all images have descriptive alt text |
| SPF + DMARC | ⏳ Pending | DNS TXT records not yet configured in Cloudflare |
| Link building | ⏳ Pending | 0 backlinks — strategy planned |

---

## 5. Revised Copy Across All Sections

### Section: "O que o site oferece"
- Added descriptive subtitle: "Ferramentas e recursos pensados para você entender e cuidar da sua saúde vascular."

### Section: "Como funciona"
- Added descriptive subtitle: "Três passos simples para entender sua saúde vascular e agendar sua consulta."

### Section: "Ferramentas do sistema"
- Updated description: "Pilha estável, performática e pronta para crescimento. Static export em Cloudflare Pages, entregue via CI/CD."

### Footer
- Updated text: "Esta página documenta o estado atual da plataforma digital do Dr. Herlon Moura."
- Added explicit "Última atualização: 19 de outubro de 2024."

---

## 6. Semantic Structure

| Level | Element | Count |
|-------|---------|-------|
| H1 | Page title ("Plataforma Digital do Dr. Herlon Moura") | 1 |
| H2 | Section headings | 6 (Recursos, Números, Tokens, Ferramentas, O que foi feito, Checklist SEO, Próximos passos) |
| H3 | Card titles / checklist items | 6 (features) + 6 (SEO items) + 1 (next step) |
| H4 | Before/After column labels + StatusBadge labels | 8 (4 cards × 2 columns) |

---

## 7. Tech Stack Documented

- **Next.js 15** — static export, `next/image` with `unoptimized: true`
- **React 19** — Framer Motion for animations
- **Tailwind CSS** — design tokens, glassmorphism, dark mode
- **Cloudflare Pages** — static hosting, global CDN
- **Resend** — transactional email (lead capture, admin notifications)
- **Cal.com** — self-hosted scheduling (`cal.herlonmoura.clubemkt.digital`)
- **Lucide React** — icon library
- **CliniqIcon** — vendor font-based procedural icons from the original WordPress theme

---

## 8. Files Changed

| File | Change |
|------|--------|
| `app/doc/page.tsx` | Hero logo label, CTA badges, BeforeAfterCard styling, illustrations upgraded to h-9, SEO checklist accuracy fixes, copy revisions |
| `docs/DEV_LOG.md` | This document |

---

## 9. Verification

- **Build**: `npm run build` passes. `/doc` outputs at 11.9 kB HTML / 155 kB total.
- **Lint**: TypeScript passes via Next.js build (no errors).
- **Audit alignment**: SEO checklist updated to match `docs/report.pdf` (Glacial Multimedia) and `docs/SEO_AUDIT_FIX_PLAN.md`.

---

## 10. What's Left (Pending)

| Task | Why | Estimated Effort |
|------|-----|-----------------|
| Inline style removal across all pages | 189 inline style blocks remain in pages outside `/doc` — TOKEN.* pattern migration to Tailwind classes | 4-6 hours |
|| Image optimization remaining pages | Site totals 23.2MB page weight — `/doc` is fully optimized at 155kB, but home and blog pages need WebP + compression | 2-3 hours |
|| Render-blocking CSS deferral | Next.js CSS chunks (16.78KB, 3.01KB, 4.11KB) — needs `next/script` priority optimization | Medium |
|| SPF/DMARC DNS records | Cloudflare DNS TXT records for Resend SPF and DMARC | 15 min |
|| Link building | 0 backlinks — patient review syndication, medical directory listings, guest posts | Long |
|| Google Business Profile | External — register clinic | Long |
|| Social profiles (Facebook, X, LinkedIn, YouTube) | External — create + link | Long |
|| Mobile PageSpeed LCP | Currently 2.7s after image optimization — needs render-blocking CSS fix for full improvement | Medium |

---

## 11. Phase 2: Daily Blog Post Generator

### Problem
The content strategy requires consistent, fresh blog posts targeting long-tail vascular health keywords (e.g. "sintomas de trombose venosa profunda"). Manual authoring is slow; the AI Worker binding can auto-generate posts but there was no orchestration layer to call it daily and feed results into the approval queue.

### Solution
Implemented a daily cron job that calls the AI generation endpoint at 6:00 AM, creating one new draft post per day from a rotating topic list. Posts are created as `draft` status with `generated = 1` for human review.

### Files Created
| File | Purpose |
|------|---------|
| `scripts/cron/generate-blog-daily.py` | Python script that calls `/api/blog/generate` on the Worker URL with a rotating topic from an 8-topic vascular health content plan |
| `wrangler/d1/migrations/005_blog_generated.sql` | D1 migration adding `generated BOOLEAN DEFAULT 0` column to `blog_posts` table + index |

### Files Modified
| File | Change |
|------|--------|
| `functions/api/blog/generate.ts` | Added `generated?: boolean` to request body, passed through to Worker API call |
| `app/admin/page.tsx` | Added `generated?: boolean` to BlogPost interface; added "Apenas gerados" filter toggle (Bot icon) in BlogPostTable; added `Bot` to lucide imports |
| `components/admin/BlogEditorList.tsx` | Added `generated?: boolean` to BlogPost interface; Bot icon replaces FileText for generated posts; added "Gerado" badge with Sparkles icon next to status |

### Cron Job
- Schedule: `0 6 * * *` (daily at 6:00 AM UTC)
- Command: `cd /root/ClubeMkt/herlonmoura && CRM_API_URL=https://herlonmoura.clubemkt.digital WORKER_URL=https://herlon-moura-crm.hudsonargollo2.workers.dev /usr/bin/python3 scripts/cron/generate-blog-daily.py >> /var/log/cron-blog-generator.log 2>&1`
- Rotating topic list (8 topics, cycled by day-of-year):
  1. sintomas de trombose venosa profunda
  2. diferenca entre varizes e veias spider
  3. como prevenir doencas vasculares
  4. quando procurar um angiologista
  5. tratamento de varizes com espuma
  6. riscos da trombose durante a viagem
  7. como identificar linfedema precocemente
  8. cirurgia ambulatorial de varizes

### Admin UI
- Blog editor list shows "Gerado" badge (Sparkles icon, teal) next to the status for AI-generated drafts
- Bot icon (instead of FileText) indicates generated posts at a glance
- "Apenas gerados" toggle filter in the dashboard's BlogPostTable isolates generated drafts for review

### Verification
- Build: `npm run build` passes. All 71 static pages prerender, `/doc` at 11.9 kB.
- Cron: scheduled via `crontab -l` — `0 6 * * * cd /root/ClubeMkt/herlonmoura && CRM_API_URL=... WORKER_URL=... python3 scripts/cron/generate-blog-daily.py >> /var/log/cron-blog-generator.log 2>&1`
- Migration: SQL file created at `wrangler/d1/migrations/005_blog_generated.sql`
- Code: TypeScript passes, no errors on build

### What's Left
- Run the D1 migration on the remote database: `npx wrangler d1 execute herlonmoura_crm --remote --file=wrangler/d1/migrations/005_blog_generated.sql`
- Verify the Worker's `/api/blog/generate` endpoint accepts and uses the `generated` field when inserting posts into `blog_posts`
- Test a manual fire of the cron script to confirm end-to-end flow
- The cron job output goes to `/var/log/cron-blog-generator.log` (local-only, no live delivery channel)
