'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Menu, X, MessageCircle, Phone, HeartPulse, Sun, Moon } from 'lucide-react';
import { Logo } from './Logo';
import { useTheme } from '@/app/context/ThemeProvider';
import { motion, AnimatePresence } from 'framer-motion';

interface HeaderProps {
  logo?: React.ReactNode;
  navItems?: Array<{ label: string; href: string; isCalculator?: boolean }>;
  ctaButton?: { label: string; href: string };
  onOpenCalculator?: () => void;
}

export function Header({
  logo,
  navItems = [
    { label: 'Sobre', href: '/sobre' },
    { label: 'Procedimentos', href: '/#procedimentos' },
    { label: 'Sintomas', href: '/#sintomas' },
    { label: 'Calculadora TVP', href: '/calculadora-dvt', isCalculator: true },
    { label: 'Contato', href: '/contato' },
  ],
  ctaButton = {
    label: 'Agendar no WhatsApp',
    href: 'https://wa.me/5571999159975?text=Olá%20Dr.%20Herlon%20Moura,%20gostaria%20de%20agendar%20uma%20consulta.',
  },
  onOpenCalculator,
}: HeaderProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { theme, toggleTheme } = useTheme();

  return (
    <header className="sticky top-0 z-50 border-b border-border bg-background/80 backdrop-blur-md">
      {/* Top microbar with contact info — matches live site */}
      <div className="hidden border-b border-border/50 bg-muted/30 px-4 py-2 sm:block">
        <div className="container mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2 text-xs text-muted-foreground sm:gap-4">
            <span className="flex items-center gap-1.5">
              <span className="inline-block h-2 w-2 rounded-full bg-secondary animate-pulse" />
              <span>Atendimento em Salvador – Graça | Particular e Convênios</span>
            </span>
          </div>
          <div className="flex items-center gap-3 sm:gap-5">
            <a
              href="tel:+5571983449737"
              className="flex items-center gap-1.5 text-xs text-muted-foreground transition-colors hover:text-primary"
            >
              <Phone className="h-3 w-3 text-primary" />
              (71) 98344-9737
            </a>
            <a
              href="https://wa.me/5571999159975"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 font-medium text-secondary transition-colors hover:text-secondary-hover"
            >
              <MessageCircle className="h-3 w-3" />
              WhatsApp: (71) 99915-9975
            </a>
          </div>
        </div>
      </div>

      <div className="container mx-auto flex items-center justify-between px-4 py-3 sm:px-6">
        {/* Logo */}
        <Link href="/" className="flex-shrink-0 transition-opacity hover:opacity-90" aria-label="Dr. Herlon Moura - Início">
          <div className="flex items-center gap-2">
            {logo || <Logo size="md" />}
            <motion.span
              className="font-heading text-xl font-bold text-foreground"
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
            >
              Dr. Herlon Moura
            </motion.span>
          </div>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden items-center gap-6 lg:flex lg:gap-8">
          {navItems.map((item) => {
            if (item.isCalculator && onOpenCalculator) {
              return (
                <button
                  key={item.href}
                  onClick={onOpenCalculator}
                  className="inline-flex items-center gap-1.5 rounded-full bg-primary/10 px-3 py-1.5 text-sm font-semibold text-primary border border-primary/30 transition-all hover:bg-primary hover:text-primary-foreground"
                >
                  <HeartPulse className="h-3.5 w-3.5" />
                  <span>{item.label}</span>
                </button>
              );
            }
            return (
              <Link
                key={item.href}
                href={item.href}
                className="text-sm font-medium text-muted-foreground transition-colors hover:text-primary"
              >
                {item.label}
              </Link>
            );
          })}
        </nav>

        {/* CTA Button + Theme Toggle */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Theme Toggle */}
          <button
            type="button"
            aria-label={theme === 'dark' ? 'Alternar para modo claro' : 'Alternar para modo escuro'}
            onClick={toggleTheme}
            className="flex h-9 w-9 items-center justify-center rounded-lg border border-border bg-muted/30 text-muted-foreground transition-all hover:bg-primary hover:text-primary-foreground focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
          >
            {theme === 'dark' ? (
              <Sun className="h-4 w-4" />
            ) : (
              <Moon className="h-4 w-4" />
            )}
          </button>

          {/* WhatsApp CTA */}
          <div className="hidden sm:flex">
            <a
              href={ctaButton.href}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 rounded-lg bg-secondary px-4 py-2.5 text-sm font-semibold text-secondary-foreground shadow-md transition-all hover:bg-secondary-hover active:scale-95"
            >
              <MessageCircle className="h-4 w-4" />
              <span className="hidden sm:inline">{ctaButton.label}</span>
            </a>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="rounded-lg p-2 text-foreground hover:bg-muted lg:hidden"
            aria-label="Abrir menu"
            aria-expanded={isMenuOpen}
          >
            {isMenuOpen ? <X className="h-6 w-6 text-primary" /> : <Menu className="h-6 w-6 text-foreground" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2, ease: 'easeOut' }}
            className="border-t border-border bg-card lg:hidden"
          >
            <nav className="flex flex-col space-y-2 px-4 py-6">
              {navItems.map((item) => {
                if (item.isCalculator && onOpenCalculator) {
                  return (
                    <button
                      key={item.href}
                      onClick={() => {
                        setIsMenuOpen(false);
                        onOpenCalculator();
                      }}
                      className="flex items-center justify-between rounded-xl bg-primary/10 p-3 text-left text-base font-bold text-primary border border-primary/30"
                    >
                      <span className="flex items-center gap-2">
                        <HeartPulse className="h-4 w-4" />
                        {item.label}
                      </span>
                      <span className="text-xs font-semibold uppercase tracking-wider bg-primary text-primary-foreground px-2 py-0.5 rounded">
                        Abrir Teste
                      </span>
                    </button>
                  );
                }
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setIsMenuOpen(false)}
                    className="text-base font-medium text-foreground transition-colors hover:text-primary py-2"
                  >
                    {item.label}
                  </Link>
                );
              })}
              <div className="pt-4 border-t border-border">
                <a
                  href={ctaButton.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => setIsMenuOpen(false)}
                  className="flex items-center justify-center gap-2 rounded-lg bg-secondary px-5 py-3 text-center text-sm font-semibold text-secondary-foreground hover:bg-secondary-hover"
                >
                  <MessageCircle className="h-4 w-4" />
                  {ctaButton.label}
                </a>
                <div className="mt-4 flex flex-col gap-2 text-xs text-muted-foreground">
                  <p>📍 R. Eng. Célso Tôrres, 654 - Graça, Salvador</p>
                  <p>📞 (71) 98344-9737 / (71) 99915-9975</p>
                </div>
              </div>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
