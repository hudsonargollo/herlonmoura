// Article detail page — reads from lib/blog-data.generated.ts (plain data,
// no fs at runtime). Static-exported via generateStaticParams for every slug.

import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import Image from 'next/image';
import { ArrowLeft, Calendar, Clock, Tag } from 'lucide-react';
import Link from 'next/link';
import { BLOG_POSTS } from '@/lib/blog-data.generated';
import { blogPostingSchema } from '@/lib/structured-data';

type BlogPost = {
  slug: string;
  title: string;
  excerpt: string;
  date: string;
  readingTime: string;
  category: string;
  image: string;
  author: string;
};

const publicDir = process.cwd();

export function generateStaticParams() {
  return BLOG_POSTS.map((post) => ({ slug: post.slug }));
}

function getPostBySlug(slug: string): BlogPost | undefined {
  return BLOG_POSTS.find((p) => p.slug === slug);
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const post = getPostBySlug(slug);
  if (!post) return {};
  return {
    title: `${post.title} | Dr. Herlon Moura`,
    description: post.excerpt.slice(0, 160),
    openGraph: {
      title: post.title,
      description: post.excerpt.slice(0, 160),
      type: 'article',
      publishedTime: post.date,
      authors: [post.author],
      images: [publicDir + post.image],
    },
    twitter: {
      card: 'summary_large_image',
      title: post.title,
      description: post.excerpt.slice(0, 160),
      images: [publicDir + post.image],
    },
  };
}

export default async function BlogPostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = getPostBySlug(slug);

  if (!post) notFound();

  return (
    <main className="min-h-screen bg-surface text-primary">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(
            {
              '@context': 'https://schema.org',
              '@type': 'BlogPosting',
              headline: post.title,
              description: post.excerpt.slice(0, 160),
              author: { '@type': 'Person', name: post.author },
              datePublished: post.date,
              image: publicDir + post.image,
            },
            null,
            2
          ),
        }}
      />

      {/* Back + header */}
      <section className="py-6 sm:py-10">
        <div className="mx-auto w-full max-w-container px-4 sm:px-6 lg:px-8">
          <Link
            href="/blog"
            className="inline-flex items-center gap-2 text-sm font-medium text-surgical-teal hover:text-teal-300 transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            Voltar para o blog
          </Link>
        </div>
      </section>

      {/* Article */}
      <article className="py-10 sm:py-16">
        <div className="mx-auto w-full max-w-3xl px-4 sm:px-6 lg:px-8">
          {/* Hero image */}
          <div className="relative h-64 sm:h-80 overflow-hidden rounded-2xl">
            <Image
              src={publicDir + post.image}
              alt={post.title}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 1200px"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 via-transparent to-transparent" />
            <span className="absolute top-4 left-4 rounded-full bg-surgical-teal/90 px-3 py-1 text-xs font-semibold text-slate-950">
              {post.category}
            </span>
          </div>

          <div className="mt-6 text-center">
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold leading-tight text-primary">
              {post.title}
            </h1>
          </div>

          <p className="mt-4 text-base leading-relaxed text-secondary text-center">
            {post.excerpt}
          </p>

          {/* Meta */}
          <div className="mt-6 flex flex-wrap items-center justify-center gap-4 text-xs text-tertiary">
            <span className="flex items-center gap-1.5">
              <Calendar className="h-4 w-4" />
              {post.date}
            </span>
            <span className="flex items-center gap-1.5">
              <Clock className="h-4 w-4" />
              {post.readingTime}
            </span>
            <span className="flex items-center gap-1.5">
              <Tag className="h-4 w-4" />
              {post.author}
            </span>
          </div>

          {/* Article body */}
          <div className="mt-8 space-y-4 text-secondary">
            <p className="text-base leading-relaxed">{post.excerpt}</p>
            <p className="text-sm italic text-tertiary">
              * O artigo é only informativo e não substitui avaliação médica. Agende uma
              consulta com o Dr. Herlon para avaliar seu caso.
            </p>
          </div>

          {/* Share */}
          <div className="mt-8 flex flex-wrap items-center justify-center gap-3 text-xs text-tertiary">
            <span>Partilhar:</span>
            <a
              href={`https://wa.me/5571999159975?text=Ol%C3%A1! Interessado(a) no artigo: ${post.title}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 rounded-full border border-surgical-teal/30 bg-surgical-teal/10 px-4 py-1.5 font-medium text-surgical-teal transition-colors hover:bg-surgical-teal/20"
            >
              WhatsApp
            </a>
            <Link
              href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(`${publicDir}/${post.image}`)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 rounded-full border border-surgical-teal/30 bg-surgical-teal/10 px-4 py-1.5 font-medium text-surgical-teal transition-colors hover:bg-surgical-teal/20"
            >
              Facebook
            </Link>
          </div>
        </div>
      </article>
    </main>
  );
}
