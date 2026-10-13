'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Menu, X, MessageCircle, Phone, HeartPulse } from 'lucide-react';
import { Logo } from './Logo';
import { ThemeToggle } from './ThemeToggle';
import { ContactModal } from './ContactModal';

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
    { label: 'Blog', href: '/blog' },
    { label: 'Procedimentos', href: '/#procedimentos' },
    { label: 'Sintomas', href: '/#sintomas' },
    { label: 'Calculadora TVP', href: '/calculadora-dvt', isCalculator: true },
    { label: 'Contato', href: '/contato' },
  ],
  ctaButton = {
    label: 'Agendar no WhatsApp',
    href: 'https://wa.me/5571999159975',
  },
  onOpenCalculator,
}: HeaderProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [contactOpen, setContactOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 border-b border-default bg-surface/90 backdrop-blur-md">
      {/* Top microbar with phone/address */}
      <div className="hidden border-b border-subtle bg-bg-secondary/60 px-4 py-1.5 text-xs text-secondary sm:block">
        <div className="container mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1.5 text-secondary">
              <span className="inline-block h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
              Atendimento em Salvador – Graça | Particular e Convênios
            </span>
          </div>
          <div className="flex items-center gap-5">
            <a
              href="tel:+5571993449737"
              className="flex items-center gap-1.5 transition-colors hover:text-surgical-teal"
            >
              <Phone className="h-3.5 w-3.5 text-surgical-teal" />
              (71) 98344-9737
            </a>
            <button
              type="button"
              onClick={() => setContactOpen(true)}
              className="flex items-center gap-1.5 font-medium text-emerald-400 transition-colors hover:text-emerald-300"
            >
              <MessageCircle className="h-3.5 w-3.5" />
              WhatsApp: (71) 99915-9975
            </button>
          </div>
        </div>
      </div>

      <div className="container mx-auto flex items-center justify-between gap-6 px-4 py-4 sm:px-6 lg:py-5">
        {/* Logo */}
        <Link
          href="/"
          className="flex flex-shrink-0 items-center py-1 transition-opacity hover:opacity-95"
          aria-label="Dr. Herlon Moura - Início"
        >
          {logo || <Logo size="lg" />}
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden items-center gap-8 lg:flex">
          {navItems.map((item) => {
            if (item.isCalculator && onOpenCalculator) {
              return (
                <button
                  key={item.href}
                  onClick={onOpenCalculator}
                  className="inline-flex items-center gap-1.5 rounded-full bg-surgical-teal/10 px-3 py-1 text-sm font-semibold text-surgical-teal border border-surgical-teal/30 transition-all hover:bg-surgical-teal hover:text-text-inverse"
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
                className="text-sm font-medium text-primary transition-colors hover:text-surgical-teal"
              >
                {item.label}
              </Link>
            );
          })}
        </nav>

        {/* Theme Toggle + CTA Button */}
        <div className="hidden sm:flex items-center gap-3">
          <ThemeToggle />
          <button
            type="button"
            onClick={() => setContactOpen(true)}
            className="inline-flex items-center justify-center gap-2 rounded-lg bg-emerald-600 px-4 py-2.5 text-sm font-semibold text-white shadow-lg shadow-emerald-900/30 transition-all hover:bg-emerald-500 hover:shadow-emerald-700/40 active:scale-95"
          >
            <MessageCircle className="h-4 w-4" />
            <span>{ctaButton.label}</span>
          </button>
        </div>

        {/* Mobile Menu Button */}
        <button
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          className="rounded-lg p-2 text-primary hover:bg-surface-raised lg:hidden"
          aria-label="Abrir menu"
        >
          {isMenuOpen ? <X className="h-6 w-6 text-surgical-teal" /> : <Menu className="h-6 w-6 text-primary" />}
        </button>
      </div>

      {/* Mobile Drawer Menu */}
      {isMenuOpen && (
        <div className="border-t border-subtle bg-surface-overlay px-6 py-6 backdrop-blur-xl lg:hidden">
          <nav className="flex flex-col space-y-4">
            {navItems.map((item) => {
              if (item.isCalculator && onOpenCalculator) {
                return (
                  <button
                    key={item.href}
                    onClick={() => {
                      setIsMenuOpen(false);
                      onOpenCalculator();
                    }}
                    className="flex items-center justify-between rounded-xl bg-surgical-teal/15 p-3 text-left text-base font-bold text-surgical-teal border border-surgical-teal/30"
                  >
                    <span className="flex items-center gap-2">
                      <HeartPulse className="h-4 w-4" />
                      {item.label}
                    </span>
                    <span className="text-xs font-semibold uppercase tracking-wider bg-surgical-teal text-text-inverse px-2 py-0.5 rounded">
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
                  className="text-base font-medium text-primary transition-colors hover:text-surgical-teal"
                >
                  {item.label}
                </Link>
              );
            })}
            <div className="pt-4 border-t border-subtle">
              <button
                type="button"
                onClick={() => {
                  setIsMenuOpen(false);
                  setContactOpen(true);
                }}
                className="flex w-full items-center justify-center gap-2 rounded-lg bg-emerald-600 px-5 py-3 text-center text-sm font-semibold text-white shadow-md hover:bg-emerald-500"
              >
                <MessageCircle className="h-4 w-4" />
                {ctaButton.label}
              </button>
              <div className="mt-4 flex justify-center">
                <ThemeToggle />
              </div>
              <div className="mt-4 flex flex-col gap-2 text-xs text-tertiary">
                <p>📍 R. Eng. Célso Tôrres, 654 - Graça, Salvador</p>
                <p>📞 (71) 98344-9737 / (71) 99915-9975</p>
              </div>
            </div>
          </nav>
        </div>
      )}

      <ContactModal
        isOpen={contactOpen}
        onClose={() => setContactOpen(false)}
        context="Agendamento pelo site"
      />
    </header>
  );
}
