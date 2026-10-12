'use client';

import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, HeartPulse } from 'lucide-react';
import { DVTRiskCalculator } from './DVTRiskCalculator';

interface DVTModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function DVTModal({ isOpen, onClose }: DVTModalProps) {
  // Close on Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  // Lock body scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 overflow-y-auto">
          {/* Backdrop blur overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={onClose}
            className="fixed inset-0 bg-slate-950/85 backdrop-blur-md"
            aria-hidden="true"
          />

          {/* Modal Container */}
          <motion.div
            initial={{ opacity: 0, scale: 0.96, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: 10 }}
            transition={{ duration: 0.22, ease: 'easeOut' }}
            role="dialog"
            aria-modal="true"
            aria-labelledby="tvp-modal-title"
            className="relative z-10 w-full max-w-2xl my-auto overflow-hidden rounded-3xl border border-surgical-teal/30 bg-slate-900/98 shadow-2xl backdrop-blur-2xl"
          >
            {/* Top Bar with Close button */}
            <div className="flex items-center justify-between border-b border-white/10 px-5 sm:px-6 py-3.5 bg-slate-950/70">
              <div className="flex items-center gap-2.5">
                <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-surgical-teal/20 text-surgical-teal">
                  <HeartPulse className="h-4 w-4" />
                </span>
                <div>
                  <h3 id="tvp-modal-title" className="text-sm sm:text-base font-bold text-white">
                    Calculadora Interativa de TVP
                  </h3>
                  <p className="text-[11px] text-slate-400">Dr. Herlon Moura • Triagem Vascular</p>
                </div>
              </div>

              <button
                onClick={onClose}
                className="flex h-8 w-8 items-center justify-center rounded-full bg-white/5 text-slate-300 transition-colors hover:bg-white/15 hover:text-white"
                aria-label="Fechar janela"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            {/* Modal Body: Compact, No-Scroll Calculator */}
            <div className="p-3 sm:p-5">
              <DVTRiskCalculator inModal={true} onComplete={() => {}} />
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}