'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { useTilt } from '@/hooks/useMagneticHover';

interface ProcedureCardProps {
  title: string;
  description: string;
  tag: string;
  href: string;
  variants?: any;
}

export function ProcedureCard({ title, description, tag, href, variants }: ProcedureCardProps) {
  const { style, handleMouseMove, handleMouseLeave } = useTilt(8);

  return (
    <motion.div
      variants={variants}
      className="group relative"
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{
        transform: style.transform,
        transformStyle: 'preserve-3d',
      }}
    >
      <div
        className="relative h-full w-full rounded-xl border border-border bg-white p-6 shadow-lg shadow-black/5 transition-all duration-300 group-hover:border-primary/30 group-hover:shadow-xl group-hover:shadow-primary/10"
        style={{ transform: 'translateZ(20px)' }}
      >
        {/* Gloss overlay for premium finish */}
        <div className="pointer-events-none absolute inset-0 rounded-xl bg-gradient-to-b from-white/50 via-transparent to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />

        <span className="inline-block rounded-full bg-sky-100 px-3 py-1 text-xs font-medium text-navy-700 mb-3">
          {tag}
        </span>
        <h4 className="text-lg font-heading font-bold text-primary mb-2">
          {title}
        </h4>
        <p className="text-sm text-muted-foreground leading-relaxed mb-4">
          {description}
        </p>
        <a
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1.5 rounded bg-tertiary px-4 py-2 text-xs text-tertiary-foreground hover:bg-tertiary-hover transition-all"
        >
          SAIBA MAIS
          <ArrowRight className="h-3 w-3" />
        </a>
      </div>
    </motion.div>
  );
}
