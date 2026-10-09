import React from 'react';
import Link from 'next/link';
import { ArticleCard } from '@/components/ArticleCard';
import { loadBlogPosts, type BlogPost } from '@/lib/blog';

export const metadata = {
  title: 'Blog – Dr. Herlon Moura | Angiologia e Cirurgia Vascular',
  description:
    'Artigos sobre saúde vascular, tratamentos de varizes, trombose, Doppler e prevenção. Orientações do Dr. Herlon Moura, angiologista em Salvador.',
  keywords: [
    'blog angiologista Salvador',
    'varizes tratamento',
    'trombose venosa',
    'doppler vascular',
    'cirurgia vascular Salvador',
  ],
  openGraph: {
    title: 'Blog – Dr. Herlon Moura',
    description: 'Artigos sobre saúde vascular e tratamentos modernos.',
    type: 'website',
  },
};

const CATEGORIES = ['Todas', 'Varizes', 'Trombose', 'Diagnóstico', 'Prevenção', 'Procedimentos', 'Tratamentos'];

export default async function BlogPage({ searchParams }: { searchParams: Promise<{ categoria?: string; q?: string }> }) {
  const { categoria, q } = await searchParams;
  const allPosts = loadBlogPosts();
  const category = categoria ?? 'Todas';
  const query = q ?? '';

  const filtered = allPosts.filter((p: BlogPost) => {
    const matchCat = category !== 'Todas' ? p.category === category : true;
    const matchQ = query
      ? p.title.toLowerCase().includes(query.toLowerCase()) || p.excerpt.toLowerCase().includes(query.toLowerCase())
      : true;
    return matchCat && matchQ;
  });

  return (
    <main className="min-h-screen bg-background text-foreground">
      <section className="py-16 sm:py-24 bg-gradient-to-b from-muted/30 via-background to-muted/30">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <span className="inline-block rounded-full border border-primary/30 bg-primary/10 px-3 py-1 text-xs font-semibold text-primary mb-3">
            Blog
          </span>
          <h1 className="mt-2 text-3xl font-extrabold sm:text-4xl lg:text-5xl text-foreground">
            Saúde Vascular em Dia
          </h1>
          <p className="mt-4 text-base text-muted-foreground max-w-2xl mx-auto">
            Artigos, dicas e orientações do Dr. Herlon Moura sobre angiologia, cirurgia vascular e prevenção de doenças circulatórias.
          </p>

          {/* Category filters */}
          <div className="mt-6 flex flex-wrap justify-center gap-2">
            {CATEGORIES.map((cat) => (
              <Link
                key={cat}
                href={`/blog${cat !== 'Todas' ? `?categoria=${cat.toLowerCase()}` : ''}`}
                className={`rounded-full border px-3 py-1 text-xs font-medium transition-colors ${
                  category === cat
                    ? 'border-primary/40 bg-primary/15 text-primary'
                    : 'border-border/60 bg-muted/20 text-muted-foreground hover:border-primary/30'
                }`}
              >
                {cat}
              </Link>
            ))}
          </div>

          {/* Search */}
          <div className="mt-5">
            <form action="/blog" method="get" className="flex justify-center">
              <input
                name="q"
                defaultValue={query}
                placeholder="Pesquisar artigos…"
                className="w-full max-w-md rounded-xl border border-border/60 bg-card/60 px-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary/50 focus:outline-none"
              />
            </form>
          </div>
        </div>
      </section>

      <section className="py-12 sm:py-16 bg-background">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          {filtered.length === 0 ? (
            <p className="text-center text-muted-foreground">Nenhum artigo encontrado.</p>
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
