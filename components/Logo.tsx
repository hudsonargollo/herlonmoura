'use client';

import React from 'react';
import { motion } from 'framer-motion';

interface LogoProps {
  size?: 'sm' | 'md' | 'lg';
  animated?: boolean;
  className?: string;
}

export function Logo({ size = 'md', animated = false, className = '' }: LogoProps) {
  const sizeMap = {
    sm: 40,
    md: 60,
    lg: 100,
  };

  const dimension = sizeMap[size];

  const logoVariants = {
    initial: { scale: 1, rotate: 0 },
    animate: {
      scale: [1, 1.05, 1],
      rotate: [0, 5, -5, 0],
      transition: {
        duration: 3,
        repeat: Infinity,
        ease: 'easeInOut',
      },
    },
  };

  const content = (
    <svg
      width={dimension}
      height={dimension}
      viewBox="0 0 100 100"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      {/* Background Circle */}
      <circle cx="50" cy="50" r="48" fill="#14B8A6" opacity="0.1" stroke="#14B8A6" strokeWidth="2" />

      {/* Medical Cross */}
      <g>
        {/* Vertical Line */}
        <line x1="50" y1="20" x2="50" y2="80" stroke="#14B8A6" strokeWidth="4" strokeLinecap="round" />
        {/* Horizontal Line */}
        <line x1="20" y1="50" x2="80" y2="50" stroke="#14B8A6" strokeWidth="4" strokeLinecap="round" />
      </g>

      {/* Decorative Elements */}
      <circle cx="50" cy="50" r="8" fill="#14B8A6" />

      {/* Corner Accents */}
      <circle cx="25" cy="25" r="3" fill="#14B8A6" opacity="0.6" />
      <circle cx="75" cy="25" r="3" fill="#14B8A6" opacity="0.6" />
      <circle cx="25" cy="75" r="3" fill="#14B8A6" opacity="0.6" />
      <circle cx="75" cy="75" r="3" fill="#14B8A6" opacity="0.6" />
    </svg>
  );

  if (animated) {
    return (
      <motion.div
        variants={logoVariants}
        initial="initial"
        animate="animate"
      >
        {content}
      </motion.div>
    );
  }

  return content;
}
