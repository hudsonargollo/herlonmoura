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
    { label: 'Dr. Herlon Moura', href: '/sobre' },
    { label: 'Blog', href: '/blog' },
    { label: 'Procedimentos', href: '/consultas-e-procedimentos' },
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
    <header className="sticky top-0 z-50 border-b" style={{ borderColor: 'var(--c-card-border)', backgroundColor: 'var(--s-color-bg-surface)' }}>
      {/* Top microbar with phone/address */}
      <div className="hidden border-b px-4 py-1.5 text-caption sm:block" style={{ borderColor: 'var(--c-card-border)', backgroundColor: 'var(--s-color-bg-canvas)', color: 'var(--s-color-content-muted)' }}>
        <div className="mx-auto flex w-full max-w-container items-center justify-between">
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1.5" style={{ color: 'var(--s-color-content-muted)' }}>
              <span className="inline-block h-2 w-2 rounded-full" style={{ backgroundColor: 'var(--g-color-success)' }} />
              Atendimento em Salvador – Graça | Particular e Convênios
            </span>
          </div>
          <div className="flex items-center gap-5">
            <a
              href="tel:+5571983449737"
              className="flex items-center gap-1.5"
              style={{ color: 'var(--s-color-action-primary)' }}
            >
              <Phone className="h-3.5 w-3.5" />
              (71) 98344-9737
            </a>
            <button
              type="button"
              onClick={() => setContactOpen(true)}
              className="flex items-center gap-1.5 font-medium"
              style={{ color: 'var(--g-color-success)' }}
            >
              <MessageCircle className="h-3.5 w-3.5" />
              WhatsApp: (71) 99915-9975
            </button>
          </div>
        </div>
      </div>

      <div className="mx-auto flex w-full max-w-container items-center justify-between gap-6 px-4 py-4 sm:px-6 lg:py-5">
        {/* Logo */}
        <Link
          href="/"
          className="flex flex-shrink-0 items-center py-1"
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
                  className="inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-body-small font-semibold"
                  style={{
                    borderColor: 'var(--s-color-action-primary)',
                    backgroundColor: 'var(--s-color-bg-accent)',
                    color: 'var(--g-color-base-primary)',
                  }}
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
                className="text-body-small font-medium"
                style={{ color: 'var(--s-color-content-body)' }}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>

        {/* Theme Toggle + CTA Button */}
        <div className="hidden items-center gap-3 sm:flex">
          <ThemeToggle />
          <button
            type="button"
            onClick={() => setContactOpen(true)}
            className="inline-flex items-center justify-center gap-2 px-4 py-2.5 text-body-small"
            style={{
              backgroundColor: 'var(--c-button-primary-bg)',
              color: 'var(--c-button-primary-text)',
              borderRadius: 'var(--c-button-radius)',
              fontWeight: 600,
            }}
          >
            <MessageCircle className="h-4 w-4" />
            <span>{ctaButton.label}</span>
          </button>
        </div>

        {/* Mobile Menu Button */}
        <button
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          className="rounded-lg p-2 lg:hidden"
          style={{ color: 'var(--s-color-content-body)' }}
          aria-label="Abrir menu"
        >
          {isMenuOpen ? <X className="h-6 w-6" style={{ color: 'var(--s-color-action-primary)' }} /> : <Menu className="h-6 w-6" />}
        </button>
      </div>

      {/* Mobile Drawer Menu */}
      {isMenuOpen && (
        <div className="border-t px-6 py-6 lg:hidden" style={{ borderColor: 'var(--c-card-border)', backgroundColor: 'var(--s-color-bg-surface)' }}>
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
                    className="flex items-center justify-between rounded-xl border p-3 text-left text-body-regular font-bold"
                    style={{
                      borderColor: 'var(--s-color-action-primary)',
                      backgroundColor: 'var(--s-color-bg-accent)',
                      color: 'var(--g-color-base-primary)',
                    }}
                  >
                    <span className="flex items-center gap-2">
                      <HeartPulse className="h-4 w-4" />
                      {item.label}
                    </span>
                    <span
                      className="rounded px-2 py-0.5 text-caption font-semibold uppercase tracking-wider"
                      style={{
                        backgroundColor: 'var(--s-color-action-primary)',
                        color: 'var(--c-button-primary-text)',
                      }}
                    >
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
                  className="text-body-regular font-medium"
                  style={{ color: 'var(--s-color-content-body)' }}
                >
                  {item.label}
                </Link>
              );
            })}
            <div className="border-t pt-4" style={{ borderColor: 'var(--c-card-border)' }}>
              <button
                type="button"
                onClick={() => {
                  setIsMenuOpen(false);
                  setContactOpen(true);
                }}
                className="flex w-full items-center justify-center gap-2 px-5 py-3 text-center text-body-small"
                style={{
                  backgroundColor: 'var(--c-button-primary-bg)',
                  color: 'var(--c-button-primary-text)',
                  borderRadius: 'var(--c-button-radius)',
                  fontWeight: 600,
                }}
              >
                <MessageCircle className="h-4 w-4" />
                {ctaButton.label}
              </button>
              <div className="mt-4 flex justify-center">
                <ThemeToggle />
              </div>
              <div className="mt-4 flex flex-col gap-2 text-caption" style={{ color: 'var(--s-color-content-muted)' }}>
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
