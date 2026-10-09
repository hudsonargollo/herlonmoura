'use client';

import React from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';

interface LogoProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  animated?: boolean;
  className?: string;
  variant?: 'image' | 'vector';
}

export function Logo({
  size = 'md',
  animated = false,
  className = '',
  variant = 'image',
}: LogoProps) {
  const sizeMap = {
    sm: { width: 140, height: 42 },
    md: { width: 190, height: 56 },
    lg: { width: 250, height: 74 },
    xl: { width: 320, height: 94 },
  };

  const { width, height } = sizeMap[size] || sizeMap.md;

  if (variant === 'image') {
    const imgContent = (
      <div className={`relative inline-flex items-center ${className}`}>
        <Image
          src="/images/logo.png"
          alt="Dr. Herlon Moura - Angiologista e Cirurgia Vascular"
          width={width}
          height={height}
          priority
          className="h-auto w-auto max-h-[60px] object-contain drop-shadow-[0_2px_10px_rgba(20,184,166,0.15)]"
        />
      </div>
    );

    if (animated) {
      return (
        <motion.div
          initial={{ opacity: 0, y: -5 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
        >
          {imgContent}
        </motion.div>
      );
    }
    return imgContent;
  }

  // Fallback vector badge
  const vectorDimension = size === 'sm' ? 40 : size === 'md' ? 60 : 90;
  const content = (
    <svg
      width={vectorDimension}
      height={vectorDimension}
      viewBox="0 0 100 100"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-label="Dr. Herlon Moura Logo"
    >
      <circle cx="50" cy="50" r="48" fill="var(--color-primary)" opacity="0.12" stroke="var(--color-primary)" strokeWidth="2" />
      <g>
        <line x1="50" y1="20" x2="50" y2="80" stroke="var(--color-primary)" strokeWidth="4" strokeLinecap="round" />
        <line x1="20" y1="50" x2="80" y2="50" stroke="var(--color-primary)" strokeWidth="4" strokeLinecap="round" />
      </g>
      <circle cx="50" cy="50" r="8" fill="var(--color-primary)" />
      <circle cx="25" cy="25" r="3" fill="var(--color-primary)" opacity="0.7" />
      <circle cx="75" cy="25" r="3" fill="var(--color-primary)" opacity="0.7" />
      <circle cx="25" cy="75" r="3" fill="var(--color-primary)" opacity="0.7" />
      <circle cx="75" cy="75" r="3" fill="var(--color-primary)" opacity="0.7" />
    </svg>
  );

  if (animated) {
    return (
      <motion.div
        animate={{
          scale: [1, 1.03, 1],
        }}
        transition={{
          duration: 3,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
      >
        {content}
      </motion.div>
    );
  }

  return content;
}
