import fs from 'fs';
import path from 'path';
import { loadBlogPosts } from '../lib/blog';

const posts = loadBlogPosts();
const baseUrl = 'https://herlonmoura.clubemkt.digital';

// Static routes that ship in the static export. Every one of these must
// actually resolve (200) — a sitemap entry that 404s is worse than no entry,
// because Google treats it as a crawl error.
//
// NOTE: blog articles live under /blog/<slug> (app/blog/[slug]/page.tsx), NOT
// at /<slug>. The previous generator emitted `${baseUrl}/${p.slug}`, so all 43
// blog URLs in the sitemap 404'd.
const STATIC_ROUTES = [
  { path: '/', priority: '1.0', changefreq: 'daily' },
  { path: '/sobre', priority: '0.8', changefreq: 'monthly' },
  { path: '/blog', priority: '0.9', changefreq: 'daily' },
  { path: '/consultas-e-procedimentos', priority: '0.8', changefreq: 'monthly' },
  { path: '/contato', priority: '0.7', changefreq: 'yearly' },
  { path: '/calculadora-dvt', priority: '0.8', changefreq: 'monthly' },
  { path: '/calculadora-de-risco-de-tvp', priority: '0.8', changefreq: 'monthly' },
  { path: '/varizes/assessment', priority: '0.7', changefreq: 'monthly' },
  { path: '/trombose/screening', priority: '0.7', changefreq: 'monthly' },
  { path: '/questionario', priority: '0.5', changefreq: 'yearly' },
  // Deliberately excluded: /admin, /login, /doc, /plataforma, /3delements,
  // /v2, /404 — not indexable or not patient-facing.
];

const staticUrls = STATIC_ROUTES.map(
  (r) => `  <url>
    <loc>${baseUrl}${r.path}</loc>
    <changefreq>${r.changefreq}</changefreq>
    <priority>${r.priority}</priority>
  </url>`
).join('\n');

const blogUrls = posts
  .map(
    (p) => `  <url>
    <loc>${baseUrl}/blog/${p.slug}</loc>
    <changefreq>weekly</changefreq>
    <priority>0.7</priority>
    <news:news>
      <news:publication>
        <news:headline>${escapeXml(p.title)}</news:headline>
        <news:source>Dr. Herlon Moura</news:source>
        <news:publication_date>${p.date}</news:publication_date>
      </news:publication>
    </news:news>
  </url>`
  )
  .join('\n');

function escapeXml(s: string): string {
  return s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:news="http://www.google.com/schemas/sitemap-news/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml" xmlns:image="http://www.google.com/schemas/sitemap-image/1.1" xmlns:video="http://www.google.com/schemas/sitemap-video/1.1">
${staticUrls}
${blogUrls}
</urlset>
`;

const target = path.join(process.cwd(), 'public', 'sitemap.xml');
fs.writeFileSync(target, sitemap, 'utf-8');

const locCount = (sitemap.match(/<loc>/g) || []).length;
console.log(
  `Generated sitemap.xml with ${posts.length} blog posts + ${STATIC_ROUTES.length} static pages = ${locCount} URLs`
);
