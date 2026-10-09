import React from 'react';
import Link from 'next/link';
import { ArticleCard } from '@/components/ArticleCard';
import { loadBlogPosts, type BlogPost } from '@/lib/blog';

export const metadata = {
  title: 'Blog – Dr. Herlon Moura | Angiologia e Cirurgia Vascular',
  description:
    'Artigos sobre saúde vascular, tratamentos de varizes, trombose, Doppler e prevenção. Orientações do Dr. Herlon Moura, angiologista em Salvador.',
};

const CATEGORIES = ['Todas', 'Varizes', 'Trombose', 'Diagnóstico', 'Prevenção', 'Procedimentos', 'Tratamentos'];

export default function BlogPage() {
  const allPosts = loadBlogPosts();

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
                className="rounded-full border px-3 py-1 text-xs font-medium transition-colors border-border/60 bg-muted/20 text-muted-foreground hover:border-primary/30"
              >
                {cat}
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="py-12 sm:py-16 bg-background">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {allPosts.map((post: BlogPost) => (
              <ArticleCard key={post.slug} post={post} />
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
