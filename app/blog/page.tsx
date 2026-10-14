'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { ArticleCard } from '@/components/ArticleCard';
import type { BlogPost } from '@/lib/blog';
import { BLOG_POSTS } from '@/lib/blog-data.generated';
import { blogPostingSchema } from '@/lib/structured-data';

const CATEGORIES = ['Todas', 'Varizes', 'Trombose', 'Diagnóstico', 'Prevenção', 'Procedimentos', 'Tratamentos'];

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
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <span className="inline-block rounded-full border border-surgical-teal/30 bg-surgical-teal/10 px-3 py-1 text-xs font-semibold text-surgical-teal mb-3">
            Blog
          </span>
          <h1 className="mt-2 text-3xl font-extrabold sm:text-4xl lg:text-5xl text-primary">
            Saúde Vascular em Dia
          </h1>
          <p className="mt-4 text-base text-secondary max-w-2xl mx-auto">
            Artigos, dicas e orientações do Dr. Herlon Moura sobre angiologia, cirurgia vascular e prevenção de doenças circulatórias.
          </p>

          {/* Category filters */}
          <div className="mt-6 flex flex-wrap justify-center gap-2">
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => setCategory(cat)}
                className={`rounded-full border px-3 py-1 text-xs font-medium transition-colors ${
                  category === cat
                    ? 'border-surgical-teal/40 bg-surgical-teal/15 text-surgical-teal'
                    : 'border-default bg-surface-raised text-secondary hover:border-surgical-teal/30'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Search */}
          <div className="mt-5">
            <form onSubmit={(e) => e.preventDefault()} className="flex justify-center">
              <input
                name="q"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Pesquisar artigos…"
                className="w-full max-w-md rounded-xl border border-default bg-surface-raised px-4 py-2.5 text-sm text-primary placeholder:text-tertiary focus:border-surgical-teal/50 focus:outline-none"
              />
            </form>
          </div>
        </div>
      </section>

      <section className="py-12 sm:py-16 bg-surface">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
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
