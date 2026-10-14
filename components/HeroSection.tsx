'use client';

import React from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { MessageCircle, Activity, ShieldCheck, ArrowRight, Sparkles, CheckCircle2, Syringe, Waves, Zap } from 'lucide-react';

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
      {/* Full-bleed professional banner (Dr. Herlon performing an Eco-Doppler exam) */}
      {/*
        banner-home2.jpg was a tight studio portrait with NO patient and NO
        doppler machine in the frame — object-cover + object-right cropped it
        so the doctor filled the frame and the action was lost. Swapped to
        banner-meiohome.jpg (2560×1706, 3:2): the doctor, the seated patient
        and the ultrasound machine are all visible; object-top keeps the head
        in-frame on short viewports (same technique as the mid-page banner).
      */}
      <Image
        src="/images/brand/banner-meiohome.jpg"
        alt="Dr. Herlon Moura realizando exame de Eco-Doppler com a paciente no consultório"
        fill
        priority
        sizes="100vw"
        className="object-cover object-[50%_35%]"
      />

      {/* Legibility scrim: strong on the left (where the copy sits), clear on the right (the doctor) */}
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            'linear-gradient(to right, var(--s-color-bg-canvas) 0%, var(--s-color-bg-canvas) 55%, rgba(248,249,250,0.1) 100%)',
        }}
      />
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            'linear-gradient(to top, var(--s-color-bg-canvas) 0%, rgba(248,249,250,0) 40%, rgba(248,249,250,0.2) 100%)',
        }}
      />

      <div className="relative mx-auto w-full max-w-container px-4 py-16 sm:px-6 lg:px-8 lg:py-24">
        <div className="max-w-xl lg:max-w-2xl">
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
              className="text-4xl sm:text-5xl lg:text-6xl"
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
            <p className="mt-5 text-lg leading-relaxed sm:text-xl" style={{ color: 'var(--s-color-content-body)' }}>
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
      </div>
    </section>
  );
}
