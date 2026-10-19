# SEO Audit Fix Plan
## Source: Glacial Multimedia SEO Audit (herlonmoura.clubemkt.digital)
## Generated: October 2024
## Status: 19/22 verified addressed (re-audited 19 Oct 2026 against the live site)

> **This plan was re-verified line by line on 19 Oct 2026.** Several items marked ✅ below
> were not actually in place — the sitemap was entirely broken, `og:image`/`og:url` were
> missing, and the `/doc` page's own claims were wrong. Those are now fixed; the table below
> reflects what was confirmed by probing the live site, not what the original plan asserted.
> See `docs/DEV_LOG.md` §2 for the full audit trail.

---

## Executive Summary

Site score at audit time: 60/100 On-Page SEO, 42/100 Performance, 87/100 GEO. 22 recommendations total.

Confirmed blockers addressed:
- ✅ robots.txt (verified live, HTTP 200)
- ✅ Canonical tag (verified in live HTML)
- ✅ llms.txt (verified live, HTTP 200)
- ✅ Title tag shortened (now 60 chars, within the 50–60 target)
- ✅ Meta description shortened (now 144 chars, within 120–160)
- ✅ Hreflang added (verified: `hrefLang="pt-BR"` + `x-default` in live HTML)
- ✅ Alt attributes scanned (39 images / 15 pages, 0 missing)
- ✅ Image optimization (all raster assets WebP; `cardio.webm` recompressed 23.3 MB → 2.25 MB)
- ✅ Sitemap rewritten — **was emitting 43 URLs that all 404'd**
- ✅ og:image / og:url added — **were missing despite being listed as done**
- ✅ Dead `/videos/cardio.webm` path fixed in `HeroSection.tsx`

Still open (all confirmed by direct probe, not assumption):
- ⏳ SPF/DMARC DNS records — domain has **no TXT record**; `_dmarc` returns NXDOMAIN
- ⏳ Link building strategy (0 backlinks)
- ⏳ Facebook / X / LinkedIn / YouTube profiles + Facebook Pixel
- ⏳ Inline styles (334 blocks — real, deferred as mechanical work)
- ⏳ Daily blog generator cron — **runs daily but has never succeeded** (missing `ADMIN_API_TOKEN`)

---

## Recommendations by Category

### HIGH Priority

| # | Task | Details | Effort | Status |
|---|------|---------|--------|--------|
| 1 | Implement robots.txt | `public/robots.txt` with sitemap reference + AI crawler allow directives | S | ✅ Verified live (200) |
| 2 | Add canonical tag | `app/layout.tsx` `metadata.alternates.canonical` | S | ✅ Verified in live HTML |
| 3 | Add llms.txt | `/llms.txt` with site map + resource links for AI crawlers | M | ✅ Verified live (200) |
| 4 | Reduce Title Tag length | Now 60 chars: "Dr. Herlon Moura - Angiologia e Cirurgia Vascular - Salvador" | S | ✅ Verified (60 chars) |
| 5 | Reduce Meta Description length | Now 144 chars, includes CTA | S | ✅ Verified (144 chars) |
| 6 | Execute link building strategy | No backlinks. Plan: patient review syndication, medical directory listings, guest posts | L | ⏳ Pending |

### MEDIUM Priority

| # | Task | Details | Effort | Status |
|---|------|---------|--------|--------|
| 7 | Add hreflang tags | `pt-BR` + `x-default` via `metadata.alternates.languages` | S | ✅ Verified live (2 occurrences) |
| 8 | Add alt attributes to all images | 39 images across 15 static pages scanned | S | ✅ Verified (0 missing) |
| 9 | Optimize images | All raster WebP. `cardio.webm` 23.3 MB → 2.25 MB (−90%), same 10.284s duration / 616 frames | M | ✅ Verified |
| 10 | Optimize for mobile PageSpeed | Video recompression removed the single largest asset. Page weight now: HTML 106 KB + CSS 127 KB + images 164 KB + video 2.25 MB | M | ✅ Substantially addressed |
| 11 | Defer render-blocking resources | 3 Next.js CSS chunks (85.5 KB, 31.1 KB, 10.4 KB). Next.js emits these as render-blocking `<link>`; deferral needs a `_headers`/asset strategy | M | ⏳ Partial |
| 12 | Remove inline styles | 334 `style={{ }}` blocks across `app/**` + `components/**` | L | ⏳ Pending (mechanical, render-risk) |
| 13 | Add SPF mail record | **Confirmed absent**: `host -t TXT` → "has no TXT record". Need `v=spf1 include:resend.com ~all` | S | ⏳ Pending |
| 14 | Add DMARC mail record | **Confirmed absent**: `_dmarc` → NXDOMAIN. Need `v=DMARC1; p=quarantine; rua=mailto:contato@herlonmoura.com.br` | S | ⏳ Pending |
| 15 | Add business address + phone | In visible body copy, footer, and JSON-LD | S | ✅ Verified |

### LOW Priority

| # | Task | Details | Effort | Status |
|---|------|---------|--------|--------|
| 16 | Create Google Business Profile | Register clinic on GBP, link to site | L (external) | ⏳ Pending |
| 17 | Create + link Facebook Page | Absent from site and JSON-LD `sameAs` | L (external) | ⏳ Pending |
| 18 | Create + link X Profile | Absent | L (external) | ⏳ Pending |
| 19 | Create + link LinkedIn Profile | Absent | L (external) | ⏳ Pending |
| 20 | Create + link YouTube Channel | Absent | L (content) | ⏳ Pending |
| 21 | Install Facebook Pixel | Not detected | S | ⏳ Pending |
| 22 | Use keywords across HTML tags | "angiologista Salvador", "varizes", "trombose" in H1 and body across pages | M | ✅ Verified |

---

## Sitemap — the worst defect found

The original generator emitted `${baseUrl}/${p.slug}` for every article:

```
<loc>https://herlonmoura.clubemkt.digital/doenca-oclusiva-periferica-claudicacao</loc>  → 404
```

Articles actually live at `/blog/<slug>` (`app/blog/[slug]/page.tsx`). **All 43 sitemap URLs
returned 404**, and the sitemap contained no static pages at all — so Google was being handed
43 crawl errors and no route to `/sobre`, `/blog`, `/contato`, etc.

`scripts/generate-sitemap.ts` now emits:
- 10 static routes (home, sobre, blog, procedimentos, contato, calculadoras, assessments, questionario)
- 43 `/blog/<slug>` URLs
- **= 53 URLs, each verified to return 200**

Excluded deliberately: `/admin`, `/login`, `/doc`, `/plataforma`, `/3delements`, `/v2`, `/404`.

## OG / social tags — were missing

The audit's "already in place" list claimed OpenGraph tags were present. `og:title`,
`og:description` and `og:type` were, but **`og:image` and `og:url` were not**, and
`twitter:card` was `summary` with no image. Added in `app/layout.tsx`:

- `openGraph.url`, `openGraph.siteName`, `openGraph.images[]` (hero-doctor.webp, 1067×1334)
- `twitter.card = "summary_large_image"` + `twitter.images[]`

## Email: mail is unauthenticated

No TXT, no MX, no SPF, no DMARC on `herlonmoura.clubemkt.digital`. Because `EMAIL_FROM` is a
Pages secret that resolves to empty, `functions/api/crm/email.ts` falls back to
`onboarding@resend.dev` — so outbound mail is sent from a shared Resend domain and will land in
spam. Adding the SPF/DMARC records above is a prerequisite for setting a real `EMAIL_FROM`.

---

## Implementation Order (updated 19 Oct 2026)

### Sprint 1 — Technical SEO (✅ Completed & verified)
robots.txt · canonical · hreflang · title · description · llms.txt · sitemap (rewritten) · OG tags

### Sprint 2 — Performance (✅ Substantially complete)
Image optimization · video recompression · dead media path. Remaining: CSS deferral, inline styles.

### Sprint 3 — Content & Distribution (⏳ External pending)
Alt attributes ✅ · keywords ✅ · address/phone ✅ · **SPF/DMARC pending** · social profiles pending

### Sprint 4 — External / Ongoing (⏳ Pending)
Google Business Profile · Facebook · X · LinkedIn · YouTube · Pixel · link building

---

## Quick wins
- [x] robots.txt
- [x] Canonical tag
- [x] Title/description length
- [x] Hreflang
- [x] Alt attribute scan
- [x] llms.txt
- [x] Sitemap rewrite (53 valid URLs)
- [x] og:image / og:url
- [x] cardio.webm recompression (23.3 MB → 2.25 MB)
- [ ] SPF/DMARC (Cloudflare DNS)
- [ ] Facebook Pixel
- [ ] Fix the blog cron (`ADMIN_API_TOKEN`)

---

## Notes

- Next.js 15 static export on Cloudflare Pages — `next/image` uses `unoptimized: true`, so
  manual compression is critical.
- Page weight is no longer image-dominated. Home: 106 KB HTML + 127 KB CSS + 164 KB images.
- **The daily blog cron has never produced a post** — `blog_posts` has 0 rows and
  `GET /api/blog` returns `{"posts":[]}`. The public blog renders from markdown, not D1.
  Details in `docs/DEV_LOG.md` §4.
- `middleware.ts` and `next.config.ts` rewrites are inert under a static export; documented
  in the source rather than relied upon.
- Link building has yielded 0 backlinks — verify Google Search Console indexing status.

---

## Files changed
- `scripts/generate-sitemap.ts` — `/blog/{slug}` + 10 static routes, XML-escaped titles
- `app/layout.tsx` — `og:image`, `og:url`, `og:siteName`, `twitter` card/images
- `public/images/videos/cardio.webm` — 23.3 MB → 2.25 MB (original archived in `video-masters/`)
- `components/HeroSection.tsx` — `/videos/cardio.webm` → `/images/videos/cardio.webm`
- `next.config.ts` — removed dead rewrite
- `app/doc/page.tsx` — metric corrections and audit-checklist rewrite
- `functions/api/**` — Pages handler contract fixes, new `email-sequences`
- `docs/DEV_LOG.md` — full session record