'use client';

import React from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { MessageCircle, Activity, ShieldCheck, ArrowRight, Waves, Zap } from 'lucide-react';

interface HeroSectionProps {
  headline?: string;
  subheadline?: string;
  primaryCTA?: { label: string; href: string };
  secondaryCTA?: { label: string; href?: string };
  onOpenCalculator?: () => void;
  /** When provided, the primary CTA opens the lead-capture flow instead of a raw link. */
  onBook?: () => void;
  logoSvg?: React.ReactNode;
}

/* ============================================
   Design System v2.0 — HealthNet × Dr. Herlon Moura
   Hero. Headings use Montserrat, body copy uses Inter (both via the
   v2.0 token stack). The h1 below is the element the typography fix
   targets — it must resolve to Montserrat, never the UA serif.

   Layout: two-column. Copy on the left, the doctor's portrait as the
   prominent visual anchor on the right, sitting over a faded full-bleed
   consultório banner so the medical context is still present.
   ============================================ */

const HEADING_STACK = 'var(--font-montserrat), var(--font-inter), system-ui, sans-serif';

const primaryButtonStyle: React.CSSProperties = {
  backgroundColor: 'var(--c-button-primary-bg)',
  color: 'var(--c-button-primary-text)',
  borderRadius: 'var(--c-button-radius)',
  fontWeight: 600,
};

export function HeroSection({
  headline,
  subheadline = 'Angiologista é um médico especialista em diagnosticar e tratar doenças que afetam os vasos sanguíneos e o sistema linfático. Ele atua no sistema circulatório de braços, pernas, tronco e pescoço.',
  primaryCTA = {
    label: 'Agendar Consulta',
    href: '#',
  },
  secondaryCTA = {
    label: 'Calculadora de Risco de TVP',
    href: '#calculadora-tvp',
  },
  onOpenCalculator,
  onBook,
  logoSvg,
}: HeroSectionProps) {
  return (
    <section className="relative overflow-hidden">
      {/* Full-bleed consultório banner — heavily faded, provides medical context only.
          The doctor's portrait in the right column is the prominent visual. */}
      <Image
        src="/images/brand/banner-meiohome.jpg"
        alt=""
        fill
        priority
        aria-hidden
        sizes="100vw"
        className="object-cover object-[50%_20%] sm:object-[50%_35%]"
        style={{ opacity: 0.35 }}
      />

      {/* Soft wash so the faded banner never competes with the copy or the portrait */}
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            'linear-gradient(to right, var(--s-color-bg-canvas) 0%, rgba(248,249,250,0.94) 45%, rgba(248,249,250,0.72) 75%, rgba(248,249,250,0.55) 100%)',
        }}
      />
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            'linear-gradient(to top, var(--s-color-bg-canvas) 0%, rgba(248,249,250,0) 45%, rgba(248,249,250,0.35) 100%)',
        }}
      />

      <div className="relative mx-auto w-full max-w-container px-4 py-10 sm:px-6 lg:px-8 lg:py-20">
        <div className="grid items-center gap-8 sm:gap-10 lg:grid-cols-12 lg:gap-8">
          {/* ---------- Copy column ---------- */}
          <div className="lg:col-span-7">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, ease: 'easeOut' }}
            >
              {/* Medical Credentials Pill */}
              <div
                className="mb-6 inline-flex items-center gap-2 rounded-full border px-3.5 py-1.5 text-xs font-semibold"
                style={{
                  borderColor: 'var(--c-card-border)',
                  backgroundColor: 'var(--s-color-bg-surface)',
                  color: 'var(--s-color-action-primary)',
                }}
              >
                <ShieldCheck className="h-4 w-4" />
                <span>CRM/BA 23904 • RQE 19791 / 22436 • Formado pela UFBA</span>
              </div>

              {/* Headline — Montserrat, v2.0 display scale */}
              <h1
                className="text-4xl sm:text-5xl lg:text-[3.4rem]"
                style={{
                  fontFamily: HEADING_STACK,
                  color: 'var(--s-color-content-heading)',
                  fontWeight: 700,
                  lineHeight: 1.1,
                  letterSpacing: '-0.02em',
                }}
              >
                {headline ? (
                  <span>{headline}</span>
                ) : (
                  <>
                    Cuidado Vascular de Excelência com{' '}
                    <span style={{ color: 'var(--s-color-action-primary)' }}>Dr. Herlon Moura</span>
                  </>
                )}
              </h1>

              {logoSvg && <div className="mt-4 flex">{logoSvg}</div>}

              {/* Subtitle — Inter */}
              <p className="mt-5 max-w-xl text-lg leading-relaxed sm:text-xl" style={{ color: 'var(--s-color-content-body)' }}>
                {subheadline}
              </p>

              {/* Key Pillars — each pillar mirrors the source site's Health glyph,
                  recreated with a distinct v2-token lucide icon */}
              <div className="mt-6 grid grid-cols-1 gap-3 text-body-small sm:grid-cols-2" style={{ color: 'var(--s-color-content-body)' }}>
                {[
                  { icon: ShieldCheck, label: 'Tratamentos minimamente invasivos' },
                  { icon: Activity, label: 'Recuperação rápida sem internação' },
                  { icon: Waves, label: 'Eco-Doppler Vascular no consultório' },
                  { icon: Zap, label: 'Laser e espuma densa ecoguiada' },
                ].map((pillar) => (
                  <div key={pillar.label} className="flex items-center gap-2.5">
                    <span
                      className="flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-full"
                      style={{
                        backgroundColor: 'color-mix(in srgb, var(--s-color-action-gold) 20%, transparent)',
                        color: 'var(--s-color-action-gold)',
                      }}
                    >
                      <pillar.icon className="h-4 w-4" />
                    </span>
                    <span>{pillar.label}</span>
                  </div>
                ))}
              </div>

              {/* CTAs */}
              <div className="mt-8 flex flex-col gap-4 sm:flex-row sm:items-center">
                {onBook ? (
                  <button
                    type="button"
                    onClick={onBook}
                    className="inline-flex items-center justify-center gap-3 px-7 py-4 text-body-regular"
                    style={primaryButtonStyle}
                  >
                    <MessageCircle className="h-5 w-5" />
                    <span>{primaryCTA.label}</span>
                  </button>
                ) : (
                  <a
                    href={primaryCTA.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center gap-3 px-7 py-4 text-body-regular"
                    style={primaryButtonStyle}
                  >
                    <MessageCircle className="h-5 w-5" />
                    <span>{primaryCTA.label}</span>
                  </a>
                )}

                {onOpenCalculator ? (
                  <button
                    type="button"
                    onClick={onOpenCalculator}
                    className="inline-flex items-center justify-center gap-2.5 border px-6 py-4 text-body-regular"
                    style={{
                      ...primaryButtonStyle,
                      backgroundColor: 'transparent',
                      color: 'var(--s-color-action-primary)',
                      borderColor: 'var(--s-color-action-primary)',
                    }}
                  >
                    <Activity className="h-5 w-5" />
                    <span>{secondaryCTA.label}</span>
                    <ArrowRight className="h-4 w-4" />
                  </button>
                ) : (
                  <a
                    href={secondaryCTA.href || '#calculadora-tvp'}
                    className="inline-flex items-center justify-center gap-2.5 border px-6 py-4 text-body-regular"
                    style={{
                      ...primaryButtonStyle,
                      backgroundColor: 'transparent',
                      color: 'var(--s-color-action-primary)',
                      borderColor: 'var(--s-color-action-primary)',
                    }}
                  >
                    <Activity className="h-5 w-5" />
                    <span>{secondaryCTA.label}</span>
                    <ArrowRight className="h-4 w-4" />
                  </a>
                )}
              </div>

              {/* Quick Contact Micro-Proof */}
              <div className="mt-8 flex items-center gap-6 border-t pt-6 text-caption" style={{ borderColor: 'var(--c-card-border)', color: 'var(--s-color-content-muted)' }}>
                <div>
                  <span className="block font-semibold" style={{ color: 'var(--s-color-content-heading)' }}>
                    Consultório em Salvador
                  </span>
                  <span>R. Eng. Célso Tôrres, 654 - Graça</span>
                </div>
                <div className="h-8 w-px" style={{ backgroundColor: 'var(--c-card-border)' }} />
                <div>
                  <span className="block font-semibold" style={{ color: 'var(--s-color-content-heading)' }}>
                    Agendamento Ágil
                  </span>
                  <span>WhatsApp: (71) 99915-9975</span>
                </div>
              </div>
            </motion.div>
          </div>

          {/* ---------- Prominent portrait column ---------- */}
          <div className="lg:col-span-5">
            <motion.div
              initial={{ opacity: 0, scale: 0.96, y: 16 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.15, ease: 'easeOut' }}
              className="relative mx-auto w-full max-w-[280px] sm:max-w-[340px] lg:max-w-[420px] xl:max-w-none"
            >
              {/* Gold ambient glow behind the portrait */}
              <div
                className="pointer-events-none absolute -inset-6 rounded-[2.5rem] blur-3xl"
                style={{ backgroundColor: 'var(--s-color-action-gold)', opacity: 0.22 }}
              />
              <div
                className="pointer-events-none absolute -inset-3 rounded-[2rem] blur-2xl"
                style={{ backgroundColor: 'var(--s-color-action-primary)', opacity: 0.12 }}
              />

              {/* Portrait card */}
              <div
                className="relative z-10 overflow-hidden rounded-[2rem] border"
                style={{
                  borderColor: 'color-mix(in srgb, var(--s-color-action-gold) 35%, transparent)',
                  backgroundColor: 'color-mix(in srgb, var(--s-color-bg-surface) 70%, transparent)',
                  backdropFilter: 'blur(12px)',
                  WebkitBackdropFilter: 'blur(12px)',
                  boxShadow:
                    'inset 0 1px 0 rgba(255,255,255,0.35), 0 24px 48px -16px rgba(10,37,64,0.28), 0 8px 20px -10px rgba(10,37,64,0.14)',
                }}
              >
                <Image
                  src="/images/brand/dr-photoroom.png"
                  alt="Dr. Herlon Moura dos Santos — Angiologista e Cirurgião Vascular"
                  width={853}
                  height={1280}
                  priority
                  sizes="(max-width: 1024px) 420px, 40vw"
                  className="h-auto w-full object-contain object-bottom"
                />

                {/* Name plate pinned to the bottom of the portrait */}
                <div
                  className="absolute inset-x-0 bottom-0 px-5 py-4"
                  style={{
                    background:
                      'linear-gradient(to top, rgba(10,37,64,0.92) 0%, rgba(10,37,64,0.70) 55%, rgba(10,37,64,0) 100%)',
                  }}
                >
                  <p
                    className="text-base font-bold leading-tight"
                    style={{ fontFamily: HEADING_STACK, color: '#FFFFFF' }}
                  >
                    Dr. Herlon Moura dos Santos
                  </p>
                  <p className="mt-0.5 text-xs font-medium" style={{ color: 'rgba(255,255,255,0.82)' }}>
                    Angiologista e Cirurgião Vascular
                  </p>
                </div>
              </div>

              {/* Floating credibility chip */}
              <div
                className="pointer-events-none absolute -bottom-3 left-1/2 z-20 hidden -translate-x-1/2 items-center gap-2 whitespace-nowrap rounded-full border px-3 py-1.5 text-[11px] font-semibold shadow-lg sm:flex"
                style={{
                  borderColor: 'color-mix(in srgb, var(--s-color-action-gold) 40%, transparent)',
                  backgroundColor: 'var(--s-color-bg-surface)',
                  color: 'var(--s-color-content-heading)',
                }}
              >
                <span
                  className="inline-block h-2 w-2 rounded-full"
                  style={{ backgroundColor: 'var(--g-color-success)' }}
                />
                <span>15+ anos de prática clínica</span>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}
