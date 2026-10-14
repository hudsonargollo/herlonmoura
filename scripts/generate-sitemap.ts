/**
 * generate-sitemap.ts — Scans the app/ directory and generates:
 *   1. sitemap.xml  (all public routes, including resolved dynamic params)
 *   2. robots.txt   (allow all, disallow /admin, /login, /api, /_next)
 *
 * Run AFTER `next build` (output: 'export') so that out/ exists.
 * Usage: npx tsx scripts/generate-sitemap.ts
 */

import fs from 'fs';
import path from 'path';

const ROOT = process.cwd();
const APP_DIR = path.join(ROOT, 'app');
const OUT_DIR = path.join(ROOT, 'out');
const SITE_URL = 'https://herlonmoura.clubemkt.digital';

// Directories excluded from the sitemap (private / admin / auth).
const EXCLUDED_PREFIXES = ['admin', 'login', '_next'];

// Dynamic routes: read generateStaticParams to resolve concrete slugs.
// Key = route prefix (path relative to app/), Value = param name + resolver.
type DynamicResolver = () => string[];

const DYNAMIC_ROUTES: Record<string, { param: string; resolve: DynamicResolver }> = {
  // app/blog/[slug] → read slugs from content/blog/*.md
  // (blog detail is handled client-side, no physical [slug]/page.tsx)
  'blog/[slug]': {
    param: 'slug',
    resolve: () => {
      const blogDir = path.join(ROOT, 'content', 'blog');
      if (!fs.existsSync(blogDir)) return [];
      return fs
        .readdirSync(blogDir)
        .filter((f) => f.endsWith('.md'))
        .map((f) => f.replace(/\.md$/, ''));
    },
  },
  // app/freebies/[name] → generateStaticParams returns [{ name: '_' }]
  // Exclude from sitemap (private resource).
  // app/admin/crm/[id] → excluded (admin prefix).
};

/** Recursively find all page.tsx files under a directory. */
function findPages(dir: string, base = ''): string[] {
  const results: string[] = [];
  if (!fs.existsSync(dir)) return results;

  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const entry of entries) {
    const relPath = base ? `${base}/${entry.name}` : entry.name;
    if (entry.isDirectory()) {
      results.push(...findPages(path.join(dir, entry.name), relPath));
    } else if (entry.name === 'page.tsx') {
      results.push(relPath);
    }
  }
  return results;
}

/** Convert a page.tsx path (relative to app/) to a URL path. */
function pagePathToUrl(pageRelPath: string): string {
  // Strip "page.tsx" suffix
  let route = pageRelPath.replace(/\/page\.tsx$/, '');

  // app/page.tsx → /
  if (route === 'page.tsx' || route === '') return '/';

  // Remove leading slash if present
  route = route.replace(/^\//, '');

  // Dynamic segments: [slug] → resolved later; keep as marker
  // Group routes: (group) → remove
  route = route
    .replace(/\(([^)]+)\)/g, '') // remove (group) segments
    .replace(/\/{2,}/g, '/') // collapse double slashes
    .replace(/\/$/, '') || '/';

  // Handle dynamic [param] segments — return as {param} marker
  // We'll resolve them in a second pass.

  return route.startsWith('/') ? route : `/${route}`;
}

/** Check if a route is excluded (private). */
function isExcluded(route: string): boolean {
  const firstSegment = route.split('/').filter(Boolean)[0] ?? '';
  return EXCLUDED_PREFIXES.includes(firstSegment);
}

/** Resolve dynamic [param] segments in a route. */
function resolveDynamicRoute(route: string): string[] {
  // Check if route has dynamic segments
  const segments = route.split('/').filter(Boolean);
  const dynamicSegments = segments.filter((s) => s.startsWith('[') && s.endsWith(']'));

  if (dynamicSegments.length === 0) {
    return [route];
  }

  // Find the matching dynamic route handler
  for (const [routePattern, resolver] of Object.entries(DYNAMIC_ROUTES)) {
    const patternSegments = routePattern.split('/').filter(Boolean);
    if (patternSegments.length !== segments.length) continue;

    // Check if pattern matches (static segments match, dynamic are wildcards)
    let matches = true;
    for (let i = 0; i < patternSegments.length; i++) {
      const pat = patternSegments[i];
      const seg = segments[i];
      if (pat.startsWith('[') && pat.endsWith(']')) {
        continue; // wildcard
      }
      if (pat !== seg) {
        matches = false;
        break;
      }
    }

    if (matches) {
      const values = resolver.resolve();
      if (values.length === 0) return [];
      return values.map((v) => {
        // Replace [param] segments with actual values
        let resolved = route;
        for (const dynSeg of dynamicSegments) {
          resolved = resolved.replace(`/${dynSeg}`, `/${v}`);
        }
        return resolved;
      });
    }
  }

  // Unknown dynamic route — skip it
  return [];
}

/** Generate sitemap XML. */
function generateSitemap(urls: string[]): string {
  const now = new Date().toISOString();
  const urlEntries = urls
    .map((url) => {
      const fullUrl = `${SITE_URL}${url}`;
      return `  <url>\n    <loc>${fullUrl}</loc>\n    <lastmod>${now}</lastmod>\n    <changefreq>weekly</changefreq>\n    <priority>${url === '/' ? '1.0' : '0.8'}</priority>\n  </url>`;
    })
    .join('\n');

  return `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urlEntries}\n</urlset>\n`;
}

/** Generate robots.txt. */
function generateRobots(): string {
  return `# robots.txt for Herlon Moura — herlonmoura.clubemkt.digital
User-agent: *
Allow: /
Disallow: /admin
Disallow: /login
Disallow: /api
Disallow: /_next

Sitemap: ${SITE_URL}/sitemap.xml
`;
}

// ─── Main ───────────────────────────────────────────────────────────────────

function main() {
  console.log('🔍 Scanning app/ directory for pages...');

  const pageFiles = findPages(APP_DIR);
  console.log(`   Found ${pageFiles.length} page.tsx files`);

  // Convert to URL paths
  const rawRoutes = pageFiles.map(pagePathToUrl);

  // Also add known dynamic routes that may not have a physical page.tsx
  // (e.g., blog/[slug] handled client-side)
  for (const routePattern of Object.keys(DYNAMIC_ROUTES)) {
    const url = pagePathToUrl(`${routePattern}/page.tsx`);
    if (!rawRoutes.includes(url)) {
      rawRoutes.push(url);
      console.log(`   ➕ Added known dynamic route: ${url}`);
    }
  }

  // Resolve dynamic routes
  const resolvedRoutes: string[] = [];
  for (const route of rawRoutes) {
    if (isExcluded(route)) {
      console.log(`   ⛔ Excluded: ${route}`);
      continue;
    }

    // Check if it's a dynamic route (has [param] markers)
    const hasDynamic = route.includes('[') && route.includes(']');

    if (hasDynamic) {
      const resolved = resolveDynamicRoute(route);
      if (resolved.length === 0) {
        console.log(`   ⚠️  No static params for: ${route}`);
      } else {
        resolvedRoutes.push(...resolved);
        console.log(`   ✅ Resolved ${resolved.length} URLs for: ${route}`);
      }
    } else {
      resolvedRoutes.push(route);
    }
  }

  // Deduplicate and sort
  const uniqueRoutes = [...new Set(resolvedRoutes)].sort((a, b) => a.localeCompare(b));

  console.log(`\n📋 Total public routes: ${uniqueRoutes.length}`);
  for (const r of uniqueRoutes) {
    console.log(`   ${r}`);
  }

  // Ensure out/ directory exists
  if (!fs.existsSync(OUT_DIR)) {
    console.log(`\n⚠️  out/ directory not found — creating it...`);
    fs.mkdirSync(OUT_DIR, { recursive: true });
  }

  // Write sitemap.xml
  const sitemapXml = generateSitemap(uniqueRoutes);
  const sitemapPath = path.join(OUT_DIR, 'sitemap.xml');
  fs.writeFileSync(sitemapPath, sitemapXml);
  console.log(`\n📄 Sitemap written: ${sitemapPath}`);

  // Write robots.txt
  const robotsTxt = generateRobots();
  const robotsPath = path.join(OUT_DIR, 'robots.txt');
  fs.writeFileSync(robotsPath, robotsTxt);
  console.log(`📄 Robots written: ${robotsPath}`);

  console.log(`\n✅ Done! ${uniqueRoutes.length} URLs in sitemap.`);
}

main();
