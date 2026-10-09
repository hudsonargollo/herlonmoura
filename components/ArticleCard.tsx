'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Calendar, Clock, Tag, ArrowRight } from 'lucide-react';

interface ArticleCardProps {
  post: {
    slug: string;
    title: string;
    excerpt: string;
    date: string;
    readingTime: string;
    category: string;
    image: string;
  };
}

export function ArticleCard({ post }: ArticleCardProps) {
  return (
    <article className="group flex flex-col overflow-hidden rounded-2xl border border-border bg-card/60 transition-all hover:border-primary/40 hover:bg-card/90 hover:shadow-xl hover:shadow-primary/20">
      {/* Image */}
      <div className="relative h-48 overflow-hidden">
        <Image
          src={post.image}
          alt={post.title}
          fill
          className="object-cover transition-transform duration-500 group-hover:scale-105"
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 to-transparent" />
        <span className="absolute top-3 left-3 rounded-full bg-primary/90 px-2.5 py-0.5 text-[11px] font-semibold text-foreground">
          {post.category}
        </span>
      </div>

      {/* Content */}
      <div className="flex flex-1 flex-col p-5">
        <h3 className="text-base font-bold text-foreground leading-snug group-hover:text-primary transition-colors line-clamp-2">
          {post.title}
        </h3>
        <p className="mt-2 flex-1 text-sm text-muted-foreground leading-relaxed line-clamp-3">
          {post.excerpt}
        </p>

        {/* Meta */}
        <div className="mt-4 flex items-center gap-3 text-[11px] text-muted-foreground">
          <span className="flex items-center gap-1">
            <Calendar className="h-3 w-3" />
            {post.date}
          </span>
          <span className="flex items-center gap-1">
            <Clock className="h-3 w-3" />
            {post.readingTime}
          </span>
        </div>

        {/* CTA */}
        <Link
          href={`/blog/${post.slug}`}
          className="mt-4 inline-flex items-center gap-1.5 text-xs font-semibold text-primary hover:text-primary-hover transition-colors"
        >
          Ler artigo
          <ArrowRight className="h-3 w-3" />
        </Link>
      </div>
    </article>
  );
}