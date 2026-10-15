'use client';

import React, { useState } from 'react';
import Link from 'next/link';
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
    <main className="min-h-screen bg-surface text-primary">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(blogPostingSchema()) }}
      />
      <section className="py-16 sm:py-24 bg-gradient-to-b from-bg-tertiary via-surface to-surface">
        <div className="mx-auto w-full max-w-6xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <span className="inline-block rounded-full border border-surgical-teal/30 bg-surgical-teal/10 px-3 py-1 text-xs font-semibold text-surgical-teal mb-3">
              Blog
            </span>
            <h1 className="text-3xl font-extrabold sm:text-4xl lg:text-5xl text-primary">
              Saúde Vascular em Dia
            </h1>
            <p className="mt-3 text-base text-secondary">
              Artigos, dicas e orientações do Dr. Herlon Moura sobre angiologia, cirurgia vascular
              e prevenção de doenças circulatórias.
            </p>
          </div>

          {/* Filters + search */}
          <div className="mt-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-center">
            <div className="flex flex-wrap justify-center gap-1.5">
              <button
                key="all"
                type="button"
                onClick={() => setCategory('Todas')}
                className={`rounded-full border px-3.5 py-1.5 text-xs font-semibold transition-colors ${
                  category === 'Todas'
                    ? 'border-surgical-teal/40 bg-surgical-teal/15 text-surgical-teal'
                    : 'border-default bg-surface-raised text-secondary hover:border-surgical-teal/30'
                }`}
              >
                Todas ({BLOG_POSTS.length})
              </button>
              {CATEGORIES.map((cat) => (
                <button
                  key={cat}
                  type="button"
                  onClick={() => setCategory(cat)}
                  className={`rounded-full border px-3.5 py-1.5 text-xs font-semibold transition-colors ${
                    category === cat
                      ? 'border-surgical-teal/40 bg-surgical-teal/15 text-surgical-teal'
                      : 'border-default bg-surface-raised text-secondary hover:border-surgical-teal/30'
                  }`}
                >
                  {cat} ({CATEGORY_MAP.get(cat)})
                </button>
              ))}
            </div>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                setQuery('');
                setCategory('Todas');
              }}
              className="ml-auto flex w-full justify-end gap-2 sm:w-auto sm:flex-none"
            >
              <input
                name="q"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Pesquisar…"
                className="rounded-full border border-default bg-surface-raised px-4 py-1.5 text-sm text-primary placeholder:text-tertiary focus:border-surgical-teal/50 focus:outline-none md:w-56"
              />
              <button
                type="submit"
                className="rounded-full bg-surgical-teal/15 px-3.5 py-1.5 text-xs font-semibold text-surgical-teal transition-colors hover:bg-surgical-teal/25"
              >
                Buscar
              </button>
            </form>
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
  );
}
