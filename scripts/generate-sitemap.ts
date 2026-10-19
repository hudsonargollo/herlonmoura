import fs from 'fs';
import path from 'path';
import { loadBlogPosts } from '../lib/blog';

const posts = loadBlogPosts();
const baseUrl = 'https://herlonmoura.clubemkt.digital';
const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:news="http://www.google.com/schemas/sitemap-news/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml" xmlns:image="http://www.google.com/schemas/sitemap-image/1.1" xmlns:video="http://www.google.com/schemas/sitemap-video/1.1">
${posts.map((p) => `  <url>
    <loc>${baseUrl}/${p.slug}</loc>
    <changefreq>weekly</changefreq>
    <priority>0.7</priority>
    <news:news>
      <news:publication>
        <news:headline>${p.title}</news:headline>
        <news:source>Dr. Herlon Moura</news:source>
        <news:publication_date>${p.date}</news:publication_date>
      </news:publication>
    </news:news>
  </url>`).join('\n')}
</urlset>
`;

const target = path.join(process.cwd(), 'public', 'sitemap.xml');
fs.writeFileSync(target, sitemap, 'utf-8');
console.log(`Generated sitemap.xml with ${posts.length} blog posts`);
