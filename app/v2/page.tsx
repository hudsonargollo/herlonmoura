'use client';

import React from 'react';
import { ThemeToggle } from '@/components/ThemeToggle';
import { useTheme } from '@/components/ThemeProvider';

/* ============================================
   HealthNet × Dr. Herlon Moura — Design System v2.0
   Showcase / landing page at route /v2.
   Demonstrates the exact v2.0 token spec:
   base colors, semantic tokens, component tokens,
   typography scale, buttons and cards, with a
   light/dark toggle driven by [data-theme].
   ============================================ */

const BASE_TOKENS: { token: string; light: string; dark: string; label: string }[] = [
  { token: 'g-color-base-primary', label: 'Deep Navy → Soft Off-White', light: '#0A2540', dark: '#F4F7F6' },
  { token: 'g-color-base-secondary', label: 'Vascular Blue → Lighter Blue', light: '#206095', dark: '#4A90E2' },
  { token: 'g-color-accent', label: 'Champagne Gold → Lighter Gold', light: '#C5A880', dark: '#D4B88E' },
  { token: 'g-color-surface-light', label: 'Page Canvas', light: '#F8F9FA', dark: '#121A21' },
  { token: 'g-color-surface-card', label: 'Card Surface', light: '#FFFFFF', dark: '#1A242F' },
  { token: 'g-color-text-main', label: 'Primary Text', light: '#1A2B3C', dark: '#E2E8F0' },
  { token: 'g-color-text-muted', label: 'Muted Text', light: '#5A6B7C', dark: '#94A3B8' },
  { token: 'g-color-border-subtle', label: 'Subtle Border', light: '#E2E8F0', dark: '#2A3A4A' },
];

const TYPE_SCALE: { token: string; px: string; rem: string; font: 'inter' | 'montserrat' }[] = [
  { token: 'g-font-size-xs', px: '12px', rem: '0.75rem', font: 'inter' },
  { token: 'g-font-size-sm', px: '14px', rem: '0.875rem', font: 'inter' },
  { token: 'g-font-size-base', px: '16px', rem: '1.0rem', font: 'inter' },
  { token: 'g-font-size-md', px: '20px', rem: '1.25rem', font: 'montserrat' },
  { token: 'g-font-size-lg', px: '24px', rem: '1.5rem', font: 'montserrat' },
  { token: 'g-font-size-xl', px: '32px', rem: '2.0rem', font: 'montserrat' },
  { token: 'g-font-size-2xl', px: '44px', rem: '2.75rem', font: 'montserrat' },
  { token: 'g-font-size-3xl', px: '56px', rem: '3.5rem', font: 'montserrat' },
];

const FONT_STACK = "'Inter', var(--font-inter), 'Montserrat', var(--font-montserrat), sans-serif";
const HEADING_STACK = "'Montserrat', var(--font-montserrat), var(--font-inter), sans-serif";

const semanticStyle = (bgVar: string, colorVar: string, extra?: React.CSSProperties): React.CSSProperties => ({
  backgroundColor: `var(${bgVar})`,
  color: `var(${colorVar})`,
  ...extra,
});

const cardStyle: React.CSSProperties = {
  backgroundColor: 'var(--c-card-bg)',
  border: '1px solid var(--c-card-border)',
  borderRadius: 'var(--c-card-radius)',
  boxShadow: 'var(--c-card-shadow)',
};

function Swatch({ name, light, dark }: { name: string; light: string; dark: string }) {
  return (
    <div className="overflow-hidden rounded-lg border" style={{ borderColor: 'var(--c-card-border)' }}>
      <div className="flex h-16">
        <div className="flex flex-1 items-end p-2" style={{ backgroundColor: light }}>
          <span className="text-[10px] font-semibold" style={{ color: light.toLowerCase() > '#777' ? '#1A2B3C' : '#FFFFFF' }}>
            {light}
          </span>
        </div>
        <div className="flex flex-1 items-end p-2" style={{ backgroundColor: dark }}>
          <span className="text-[10px] font-semibold" style={{ color: dark.toLowerCase() > '#777' ? '#1A2B3C' : '#FFFFFF' }}>
            {dark}
          </span>
        </div>
      </div>
      <div className="px-3 py-2" style={{ backgroundColor: 'var(--s-color-bg-surface)' }}>
        <p className="font-mono text-xs" style={{ color: 'var(--s-color-content-heading)' }}>
          {name}
        </p>
      </div>
    </div>
  );
}

export default function DesignSystemV2Page() {
  const { theme } = useTheme();

  return (
    <div
      className="min-h-screen"
      style={{
        backgroundColor: 'var(--s-color-bg-canvas)',
        color: 'var(--s-color-content-body)',
        fontFamily: FONT_STACK,
      }}
    >
      {/* ---------- Nav bar with theme toggle ---------- */}
      <nav
        className="sticky top-0 z-50 flex items-center justify-between px-6 py-4"
        style={{ backgroundColor: 'var(--s-color-bg-surface)', borderBottom: '1px solid var(--c-card-border)' }}
      >
        <span className="font-montserrat text-sm font-bold" style={{ color: 'var(--s-color-content-heading)' }}>
          HealthNet × Dr. Herlon Moura
        </span>
        <div className="flex items-center gap-3">
          <span className="font-mono text-xs" style={{ color: 'var(--s-color-content-muted)' }}>
            theme: {theme}
          </span>
          <ThemeToggle />
        </div>
      </nav>

      {/* ---------- Hero ---------- */}
      <section className="px-6 py-24 text-center">
        <p
          className="mb-4 inline-block px-3 py-1 text-xs font-semibold uppercase tracking-widest"
          style={semanticStyle('--s-color-bg-accent', '--g-color-base-primary', { borderRadius: '999px' })}
        >
          Design System v2.0
        </p>
        <h1
          className="mx-auto max-w-3xl"
          style={{
            fontFamily: HEADING_STACK,
            fontSize: '56px',
            lineHeight: 1.1,
            fontWeight: 700,
            color: 'var(--s-color-content-heading)',
          }}
        >
          Medicina de precisão,<br />design de confiança
        </h1>
        <p className="mx-auto mt-6 max-w-xl" style={{ fontSize: '20px', color: 'var(--s-color-content-muted)' }}>
          Uma linguagem visual única para o ecossistema HealthNet — tokens, tipografia e componentes prontos para escalar.
        </p>
        <div className="mt-8 flex justify-center gap-4">
          <a
            href="#cores"
            style={{
              backgroundColor: 'var(--c-button-primary-bg)',
              color: 'var(--c-button-primary-text)',
              borderRadius: 'var(--c-button-radius)',
              padding: '12px 24px',
              fontWeight: 600,
              display: 'inline-block',
            }}
          >
            Ver paleta
          </a>
          <a
            href="#tipografia"
            style={{
              backgroundColor: 'var(--c-button-gold-bg)',
              color: 'var(--c-button-gold-text)',
              borderRadius: 'var(--c-button-radius)',
              padding: '12px 24px',
              fontWeight: 600,
              display: 'inline-block',
            }}
          >
            Tipografia
          </a>
        </div>
      </section>

      {/* ---------- Color palette ---------- */}
      <section id="cores" className="px-6 py-16">
        <h2 style={{ fontFamily: HEADING_STACK, fontSize: '32px', fontWeight: 700, color: 'var(--s-color-content-heading)' }}>
          Paleta de cores
        </h2>
        <p className="mt-2" style={{ color: 'var(--s-color-content-muted)' }}>
          Cada swatch mostra o valor no modo claro (esquerda) e no modo escuro (direita).
        </p>
        <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {BASE_TOKENS.map((t) => (
            <Swatch key={t.token} name={t.token} light={t.light} dark={t.dark} />
          ))}
        </div>
      </section>

      {/* ---------- Typography scale ---------- */}
      <section id="tipografia" className="px-6 py-16">
        <h2 style={{ fontFamily: HEADING_STACK, fontSize: '32px', fontWeight: 700, color: 'var(--s-color-content-heading)' }}>
          Escala tipográfica
        </h2>
        <p className="mt-2" style={{ color: 'var(--s-color-content-muted)' }}>
          12px → 56px · Inter para texto, Montserrat para títulos · pesos 400/500/600/700
        </p>
        <div className="mt-8 space-y-6">
          {TYPE_SCALE.map((t) => (
            <div
              key={t.token}
              className="flex flex-col gap-1 pb-4"
              style={{ borderBottom: '1px solid var(--c-card-border)' }}
            >
              <span className="font-mono text-xs" style={{ color: 'var(--s-color-content-muted)' }}>
                {t.token} · {t.px} / {t.rem}
              </span>
              <span
                style={{
                  fontFamily: t.font === 'montserrat' ? HEADING_STACK : FONT_STACK,
                  fontSize: t.px,
                  lineHeight: 1.2,
                  fontWeight: t.font === 'montserrat' ? 700 : 400,
                  color: 'var(--s-color-content-heading)',
                }}
              >
                Dr. Herlon Moura — 56 5x 4g
              </span>
            </div>
          ))}
        </div>
      </section>

      {/* ---------- Buttons ---------- */}
      <section id="botoes" className="px-6 py-16">
        <h2 style={{ fontFamily: HEADING_STACK, fontSize: '32px', fontWeight: 700, color: 'var(--s-color-content-heading)' }}>
          Botões
        </h2>
        <p className="mt-2" style={{ color: 'var(--s-color-content-muted)' }}>
          Tokens de componente: <code>c-button-primary-bg</code>, <code>c-button-gold-bg</code>, raio 6px.
        </p>
        <div className="mt-8 flex flex-wrap items-center gap-6">
          <button
            style={{
              backgroundColor: 'var(--c-button-primary-bg)',
              color: 'var(--c-button-primary-text)',
              borderRadius: 'var(--c-button-radius)',
              padding: '12px 24px',
              fontWeight: 600,
            }}
          >
            Primário
          </button>
          <button
            style={{
              backgroundColor: 'var(--s-color-action-hover)',
              color: 'var(--c-button-primary-text)',
              borderRadius: 'var(--c-button-radius)',
              padding: '12px 24px',
              fontWeight: 600,
            }}
          >
            Hover
          </button>
          <button
            style={{
              backgroundColor: 'var(--c-button-gold-bg)',
              color: 'var(--c-button-gold-text)',
              borderRadius: 'var(--c-button-radius)',
              padding: '12px 24px',
              fontWeight: 600,
            }}
          >
            Gold Accent
          </button>
        </div>
      </section>

      {/* ---------- Cards ---------- */}
      <section id="cards" className="px-6 py-16">
        <h2 style={{ fontFamily: HEADING_STACK, fontSize: '32px', fontWeight: 700, color: 'var(--s-color-content-heading)' }}>
          Cards
        </h2>
        <p className="mt-2" style={{ color: 'var(--s-color-content-muted)' }}>
          <code>c-card-bg</code> · <code>c-card-border</code> · raio 12px · shadow <code>0 4px 20px</code>.
        </p>
        <div className="mt-8 grid grid-cols-1 gap-6 md:grid-cols-3">
          {[
            { title: 'Angiologia', desc: 'Diagnóstico e tratamento de doenças vasculares com tecnologia de ponta.' },
            { title: 'Cirurgia Vascular', desc: 'Procedimentos minimamente invasivos com recuperação acelerada.' },
            { title: 'Trombose Venosa', desc: 'Avaliação de risco e protocolos personalizados de prevenção.' },
          ].map((c) => (
            <div key={c.title} style={{ ...cardStyle, padding: '24px' }}>
              <h3 style={{ fontFamily: HEADING_STACK, fontSize: '20px', fontWeight: 600, color: 'var(--s-color-content-heading)' }}>
                {c.title}
              </h3>
              <p className="mt-2" style={{ color: 'var(--s-color-content-body)' }}>
                {c.desc}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* ---------- Footer ---------- */}
      <footer
        className="px-6 py-8 text-center text-sm"
        style={{ borderTop: '1px solid var(--c-card-border)', color: 'var(--s-color-content-muted)' }}
      >
        HealthNet × Dr. Herlon Moura · Design System v2.0 · use o toggle acima para alternar entre claro e escuro.
      </footer>
    </div>
  );
}
