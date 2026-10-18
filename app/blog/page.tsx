'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Header } from '@/components/Header';
import { ArticleCard } from '@/components/ArticleCard';
import type { BlogPost } from '@/lib/blog';
import { BLOG_POSTS } from '@/lib/blog-data.generated';
import { blogPostingSchema } from '@/lib/structured-data';

// Derive unique categories from the data (sorted by post count desc, then name).
const CATEGORY_MAP = new Map<string, number>();
BLOG_POSTS.forEach((p) => {
  CATEGORY_MAP.set(p.category, (CATEGORY_MAP.get(p.category) ?? 0) + 1);
});
const CATEGORIES = Array.from(CATEGORY_MAP.entries())
  .sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0]))
  .map(([name]) => name);

export default function BlogPage() {
  const [category, setCategory] = useState('Todas');
  const [query, setQuery] = useState('');
  const allPosts: BlogPost[] = BLOG_POSTS;

  const filtered = allPosts.filter((p: BlogPost) => {
    const matchCat = category !== 'Todas' ? p.category === category : true;
    const matchQ = query
      ? p.title.toLowerCase().includes(query.toLowerCase()) || p.excerpt.toLowerCase().includes(query.toLowerCase())
      : true;
    return matchCat && matchQ;
  });

  return (
    <>
      <Header />
      <main className="min-h-screen bg-surface text-primary">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(blogPostingSchema()) }}
      />
      <section className="relative overflow-hidden bg-surface">
        <div
          className="pointer-events-none absolute inset-0"
          style={{ backgroundImage: 'url(/images/dr-herlon-moura.png)', backgroundSize: 'cover', backgroundPosition: 'center 35%' }}
        >
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-black/10" />
        </div>
        <div className="relative mx-auto w-full max-w-6xl px-4 py-14 sm:px-6 lg:px-8 lg:py-20">
          <div className="mx-auto max-w-2xl text-center text-white">
            <span className="inline-block rounded-full border border-white/20 bg-white/10 px-3 py-1 text-xs font-semibold">
              Blog
            </span>
            <h1 className="text-3xl font-extrabold sm:text-4xl lg:text-5xl" style={{ color: 'var(--s-color-content-heading)' }}>
              Saúde Vascular em Dia
            </h1>
            <p className="mt-3 text-base leading-relaxed" style={{ color: 'var(--s-color-content-muted)' }}>
              Artigos, dicas e orientações do Dr. Herlon Moura sobre angiologia, cirurgia vascular
              e prevenção de doenças circulatórias.
            </p>
          </div>
        </div>
      </section>

            {/* Topics / Tags section */}
      <section className="py-10 sm:py-14 bg-surface">
        <div className="mx-auto w-full max-w-6xl px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-heading-2 font-bold" style={{ color: 'var(--s-color-content-heading)' }}>
              Explore por tema
            </h2>
            <p className="text-sm" style={{ color: 'var(--s-color-content-muted)' }}>
              Clique em uma categoria para filtrar os artigos
            </p>
          </div>
          <div className="flex flex-wrap justify-center gap-2">
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                onClick={() => setCategory(cat)}
                className={`rounded-full border px-4 py-2 text-xs font-semibold transition-all duration-200 hover:scale-105 ${
                  category === cat
                    ? 'border-surgical-teal/40 bg-surgical-teal/15 text-surgical-teal shadow-sm'
                    : 'border-default bg-white/5 text-secondary hover:border-surgical-teal/40 hover:text-primary'
                }`}
              >
                {cat} ({CATEGORY_MAP.get(cat)})
              </button>
            ))}
          </div>
        </div>
      </section>

<section className="py-12 sm:py-16 bg-surface">
        <div className="mx-auto w-full max-w-6xl px-4 sm:px-6 lg:px-8">
          {filtered.length === 0 ? (
            <p className="text-center text-secondary">Nenhum artigo encontrado.</p>
          ) : (
            <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
              {filtered.map((post: BlogPost) => (
                <ArticleCard key={post.slug} post={post} />
              ))}
            </div>
          )}
        </div>
      </section>
      </main>
    </>
  );
}
