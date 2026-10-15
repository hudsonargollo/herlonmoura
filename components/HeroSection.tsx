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
  onBook?: () => void;
  logoSvg?: React.ReactNode;
}

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
    {/* Video background - animated vascular flow, health context */}
    <video
      src="/videos/cardio.webm"
      autoPlay
      muted
      loop
      playsInline
      aria-hidden
      className="absolute inset-0 h-full w-full object-cover"
      style={{ opacity: 0.28 }}
    />
    {/* Subtle anatomical background overlay - clinical context without overwhelming copy */}
    <Image
      src="/images/fotos/photo-08.webp"
      alt=""
      fill
      priority
      aria-hidden
      sizes="100vw"
      className="object-cover object-[80%_50%] sm:object-[75%_50%]"
      style={{ opacity: 0.28 }}
    />
    <div
      className="pointer-events-none absolute inset-0"
      style={{
        background:
          'linear-gradient(to right, var(--s-color-bg-canvas) 0%, rgba(248,249,250,0.96) 40%, rgba(248,249,250,0.88) 70%, rgba(248,249,250,0.75) 100%)',
      }}
    />
    <div
      className="pointer-events-none absolute inset-0"
      style={{
        background:
          'linear-gradient(to bottom, rgba(248,249,250,0.6) 0%, rgba(248,249,250,0) 30%, rgba(248,249,250,0) 70%, var(--s-color-bg-canvas) 100%)',
      }}
    />

    <div className="relative mx-auto w-full max-w-container px-4 py-10 sm:px-6 lg:px-8 lg:py-16">
        <div className="grid items-center gap-6 sm:gap-8 lg:grid-cols-12 lg:gap-6">
          {/* ---------- Copy column ---------- */}
          <div className="lg:col-span-7">
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, ease: 'easeOut' }}
            >
              {/* Medical Credentials Pill */}
              <div
                className="mb-4 inline-flex items-center gap-2 rounded-full border px-3 py-1.5 text-[11px] font-semibold"
                style={{
                  borderColor: 'var(--c-card-border)',
                  backgroundColor: 'var(--s-color-bg-surface)',
                  color: 'var(--s-color-action-primary)',
                }}
              >
                <ShieldCheck className="h-3.5 w-3.5" />
                <span>CRM/BA 23904 • RQE 19791 / 22436 • UFBA</span>
              </div>

              {/* Headline */}
              <h1
                className="text-3xl sm:text-4xl lg:text-[2.8rem] xl:text-[3.2rem]"
                style={{
                  fontFamily: HEADING_STACK,
                  color: 'var(--s-color-content-heading)',
                  fontWeight: 700,
                  lineHeight: 1.12,
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

              {logoSvg && <div className="mt-3 flex">{logoSvg}</div>}

              {/* Subtitle */}
              <p className="mt-4 max-w-lg text-base leading-relaxed sm:text-lg" style={{ color: 'var(--s-color-content-body)' }}>
                {subheadline}
              </p>

              {/* Key Pillars */}
              <div className="mt-5 grid grid-cols-1 gap-2.5 text-sm sm:grid-cols-2" style={{ color: 'var(--s-color-content-body)' }}>
                {[
                  { icon: ShieldCheck, label: 'Tratamentos minimamente invasivos' },
                  { icon: Activity, label: 'Recuperação rápida sem internação' },
                  { icon: Waves, label: 'Eco-Doppler Vascular no consultório' },
                  { icon: Zap, label: 'Laser e espuma densa ecoguiada' },
                ].map((pillar) => (
                  <div key={pillar.label} className="flex items-center gap-2">
                    <span
                      className="flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full"
                      style={{
                        backgroundColor: 'color-mix(in srgb, var(--s-color-action-gold) 20%, transparent)',
                        color: 'var(--s-color-action-gold)',
                      }}
                    >
                      <pillar.icon className="h-3.5 w-3.5" />
                    </span>
                    <span>{pillar.label}</span>
                  </div>
                ))}
              </div>

              {/* CTAs */}
              <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center">
                {onBook ? (
                  <button
                    type="button"
                    onClick={onBook}
                    className="inline-flex items-center justify-center gap-2.5 px-6 py-3.5 text-base"
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
                    className="inline-flex items-center justify-center gap-2.5 px-6 py-3.5 text-base"
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
                    className="inline-flex items-center justify-center gap-2 border px-5 py-3.5 text-base"
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
                    className="inline-flex items-center justify-center gap-2 border px-5 py-3.5 text-base"
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
              <div className="mt-6 flex items-center gap-5 border-t pt-4 text-xs" style={{ borderColor: 'var(--c-card-border)', color: 'var(--s-color-content-muted)' }}>
                <div>
                  <span className="block font-semibold" style={{ color: 'var(--s-color-content-heading)' }}>
                    Consultório em Salvador
                  </span>
                  <span>R. Eng. Célso Tôrres, 654 - Graça</span>
                </div>
                <div className="h-6 w-px" style={{ backgroundColor: 'var(--c-card-border)' }} />
                <div>
                  <span className="block font-semibold" style={{ color: 'var(--s-color-content-heading)' }}>
                    Agendamento Ágil
                  </span>
                  <span>WhatsApp: (71) 99915-9975</span>
                </div>
              </div>
            </motion.div>
          </div>

          {/* ---------- Portrait column — real clinical photo ---------- */}
          <div className="lg:col-span-5">
            <motion.div
              initial={{ opacity: 0, scale: 0.96, y: 12 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.12, ease: 'easeOut' }}
              className="relative mx-auto w-full max-w-[260px] sm:max-w-[300px] lg:max-w-[360px] xl:max-w-none"
            >
              {/* Gold ambient glow */}
              <div
                className="pointer-events-none absolute -inset-5 rounded-[2.5rem] blur-3xl"
                style={{ backgroundColor: 'var(--s-color-action-gold)', opacity: 0.18 }}
              />
              <div
                className="pointer-events-none absolute -inset-2 rounded-[2rem] blur-2xl"
                style={{ backgroundColor: 'var(--s-color-action-primary)', opacity: 0.1 }}
              />

              {/* Portrait card — real photo */}
              <div
                className="relative z-10 overflow-hidden rounded-[1.75rem] border"
                style={{
                  borderColor: 'color-mix(in srgb, var(--s-color-action-gold) 30%, transparent)',
                  boxShadow:
                    '0 20px 40px -12px rgba(10,37,64,0.25), 0 8px 16px -8px rgba(10,37,64,0.12)',
                }}
              >
                <Image
                  src="/images/fotos/photo-04.webp"
                  alt="Dr. Herlon Moura dos Santos — Angiologista e Cirurgião Vascular"
                  width={1067}
                  height={1600}
                  priority
                  sizes="(max-width: 1024px) 360px, 40vw"
                  className="h-auto w-full object-cover"
                />
                {/* Name plate */}
                <div
                  className="absolute inset-x-0 bottom-0 px-4 py-3.5"
                  style={{
                    background:
                      'linear-gradient(to top, rgba(10,37,64,0.92) 0%, rgba(10,37,64,0.65) 55%, rgba(10,37,64,0) 100%)',
                  }}
                >
                  <p
                    className="text-sm font-bold leading-tight"
                    style={{ fontFamily: HEADING_STACK, color: '#FFFFFF' }}
                  >
                    Dr. Herlon Moura dos Santos
                  </p>
                  <p className="mt-0.5 text-[11px] font-medium" style={{ color: 'rgba(255,255,255,0.82)' }}>
                    Angiologista e Cirurgião Vascular
                  </p>
                </div>
              </div>

              {/* Floating credibility chip */}
              <div
                className="pointer-events-none absolute -bottom-2.5 left-1/2 z-20 hidden -translate-x-1/2 items-center gap-1.5 whitespace-nowrap rounded-full border px-3 py-1.5 text-[11px] font-semibold shadow-lg sm:flex"
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
