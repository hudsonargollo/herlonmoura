'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Sun, Moon } from 'lucide-react';
import { useTheme } from './ThemeProvider';

export function ThemeToggle({ className = '' }: { className?: string }) {
  const { theme, toggleTheme } = useTheme();
  const isDark = theme === 'dark';

  return (
    <button
      type="button"
      onClick={toggleTheme}
      className={`relative flex h-9 w-9 items-center justify-center rounded-full border border-surgical-teal/30 bg-surgical-teal/10 transition-all hover:bg-surgical-teal/20 hover:border-surgical-teal/50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-surgical-teal ${className}`}
      aria-label={isDark ? 'Mudar para modo claro' : 'Mudar para modo escuro'}
      title={isDark ? 'Mudar para modo claro' : 'Mudar para modo escuro'}
    >
      <motion.div
        key={theme}
        initial={{ rotate: -90, opacity: 0, scale: 0.5 }}
        animate={{ rotate: 0, opacity: 1, scale: 1 }}
        transition={{ duration: 0.3, ease: 'easeOut' }}
        className="flex items-center justify-center"
      >
        {isDark ? (
          <Sun className="h-4.5 w-4.5 text-surgical-teal" />
        ) : (
          <Moon className="h-4.5 w-4.5 text-surgical-teal" />
        )}
      </motion.div>
    </button>
  );
}
