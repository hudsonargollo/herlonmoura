'use client';

import React from 'react';
import { useTheme } from '@/app/context/ThemeProvider';
import { motion } from 'framer-motion';

interface ThemeToggleProps {
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export function ThemeToggle({ size = 'md', className = '' }: ThemeToggleProps) {
  const { theme, toggleTheme } = useTheme();

  const sizeClasses = {
    sm: 'h-8 w-14',
    md: 'h-10 w-18',
    lg: 'h-12 w-20',
  };

  const iconSize = {
    sm: 'h-3 w-3',
    md: 'h-4 w-4',
    lg: 'h-5 w-5',
  };

  return (
    <button
      type="button"
      role="switch"
      aria-label={theme === 'dark' ? 'Alternar para modo claro' : 'Alternar para modo escuro'}
      aria-checked={theme === 'dark'}
      onClick={toggleTheme}
      className={`relative inline-flex items-center rounded-full border border-border transition-all duration-300 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring ${sizeClasses[size]} ${className}`}
    >
      {/* Background track with sun/moon icons */}
      <motion.span
        className="absolute inset-0 flex items-center justify-between px-1"
        initial={false}
        animate={theme === 'dark' ? 'dark' : 'light'}
      >
        <motion.span
          className="text-sm"
          animate={{ opacity: theme === 'dark' ? 0.3 : 1 }}
          transition={{ duration: 0.2 }}
        >
          ☀️
        </motion.span>
        <motion.span
          className="text-sm"
          animate={{ opacity: theme === 'dark' ? 1 : 0.3 }}
          transition={{ duration: 0.2 }}
        >
          🌙
        </motion.span>
      </motion.span>

      {/* Sliding knob */}
      <motion.div
        className="absolute top-0.5 left-0.5 z-10 flex h-9 w-9 items-center justify-center rounded-full bg-background shadow-md"
        initial={false}
        animate={theme === 'dark' ? { x: 26 } : { x: 0 }}
        style={{
          width: 'calc(100% - 4px)',
          maxWidth: '36px',
          height: 'calc(100% - 4px)',
        }}
        transition={{ type: 'spring', stiffness: 500, damping: 25 }}
      >
        {theme === 'dark' ? (
          <motion.span
            key="moon"
            initial={{ opacity: 0, rotate: -90 }}
            animate={{ opacity: 1, rotate: 0 }}
            exit={{ opacity: 0, rotate: 90 }}
            transition={{ duration: 0.2 }}
            className={iconSize[size]}
          >
            🌙
          </motion.span>
        ) : (
          <motion.span
            key="sun"
            initial={{ opacity: 0, rotate: 90 }}
            animate={{ opacity: 1, rotate: 0 }}
            exit={{ opacity: 0, rotate: -90 }}
            transition={{ duration: 0.2 }}
            className={iconSize[size]}
          >
            ☀️
          </motion.span>
        )}
      </motion.div>
    </button>
  );
}
