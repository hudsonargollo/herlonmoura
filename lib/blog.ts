import fs from 'fs';
import path from 'path';

export interface BlogPost {
  slug: string;
  title: string;
  excerpt: string;
  date: string;
  readingTime: string;
  category: string;
  image: string;
  author: string;
}

const CONTENT_DIR = path.join(process.cwd(), 'content', 'blog');

function parseFrontmatter(raw: string): Record<string, string> {
  const data: Record<string, string> = {};
  if (raw.startsWith('---')) {
    const end = raw.indexOf('---', 3);
    if (end !== -1) {
      const block = raw.slice(3, end);
      for (const line of block.split('\n')) {
        const idx = line.indexOf(':');
        if (idx > 0) {
          const key = line.slice(0, idx).trim();
          let val = line.slice(idx + 1).trim();
          val = val.replace(/^["']|["']$/g, '');
          data[key] = val;
        }
      }
    }
  }
  return data;
}

export function loadBlogPosts(): BlogPost[] {
  if (!fs.existsSync(CONTENT_DIR)) return [];

  const files = fs.readdirSync(CONTENT_DIR).filter((f) => f.endsWith('.md'));
  const posts: BlogPost[] = [];

  for (const file of files) {
    const raw = fs.readFileSync(path.join(CONTENT_DIR, file), 'utf-8');
    const frontmatter = parseFrontmatter(raw);
    const content = raw.replace(/^---[\s\S]*?---/, '').trim();
    const wordCount = content.split(/\s+/).length;
    const readTime = Math.max(1, Math.ceil(wordCount / 200));
    const excerpt =
      frontmatter.excerpt ??
      content
        .replace(/^#+\s+.*/gm, '')
        .replace(/!\[.*?\]\(.*?\)/, '')
        .trim()
        .slice(0, 220);
    const image = frontmatter.image ?? `/images/blog/${path.basename(file, '.md')}.png`;

    posts.push({
      slug: frontmatter.slug ?? path.basename(file, '.md'),
      title: frontmatter.title ?? path.basename(file, '.md').replace(/-/g, ' '),
      excerpt,
      date: frontmatter.date ?? '',
      readingTime: `${readTime} min`,
      category: frontmatter.category ?? 'Geral',
      image,
      author: frontmatter.author ?? 'Dr. Herlon Moura',
    });
  }

  posts.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  return posts;
}

export function getPostBySlug(slug: string): BlogPost | null {
  const posts = loadBlogPosts();
  return posts.find((p) => p.slug === slug) ?? null;
}