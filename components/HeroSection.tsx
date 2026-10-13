'use client';

import React from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { MessageCircle, Activity, ShieldCheck, ArrowRight, Sparkles } from 'lucide-react';

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

export function HeroSection({
  headline,
  subheadline = 'Angiologista é um médico especialista em diagnosticar e tratar doenças que afetam os vasos sanguíneos e o sistema linfático. Ele atua no sistema circulatório de braços, pernas, tronco e pescoço.',
  primaryCTA = {
    label: 'Agendar Consulta',
    href: 'https://wa.me/5571999159975?text=Olá%20Dr.%20Herlon%20Moura,%20gostaria%20de%20agendar%20uma%20consulta.',
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
      {/* Full-bleed professional banner (doctor at his desk — no cutout halo) */}
      <Image
        src="/images/brand/banner-home2.jpg"
        alt="Dr. Herlon Moura em seu consultório"
        fill
        priority
        sizes="100vw"
        className="object-cover object-right"
      />

      {/* Legibility scrim: strong on the left (where the copy sits), clear on the right (the doctor) */}
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-r from-white via-white/85 to-white/10" />
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-white/70 via-transparent to-white/20" />

      <div className="relative container mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-24">
        <div className="max-w-xl lg:max-w-2xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: 'easeOut' }}
          >
            {/* Medical Credentials Pill */}
            <div className="inline-flex items-center gap-2 rounded-full border border-surgical-teal/30 bg-white/70 px-3.5 py-1.5 text-xs font-semibold text-surgical-teal shadow-sm backdrop-blur-md mb-6">
              <ShieldCheck className="h-4 w-4 text-surgical-teal" />
              <span>CRM/BA 23904 • RQE 19791 / 22436 • Formado pela UFBA</span>
            </div>

            {/* Headline */}
            <h1 className="text-4xl font-extrabold tracking-tight text-primary sm:text-5xl lg:text-6xl">
              {headline ? (
                <span>{headline}</span>
              ) : (
                <>
                  Cuidado Vascular de Excelência com{' '}
                  <span className="bg-gradient-to-r from-surgical-teal via-teal-500 to-emerald-500 bg-clip-text text-transparent">
                    Dr. Herlon Moura
                  </span>
                </>
              )}
            </h1>

            {logoSvg && <div className="mt-4 flex">{logoSvg}</div>}

            {/* Subtitle */}
            <p className="mt-5 text-lg text-secondary sm:text-xl leading-relaxed">
              {subheadline}
            </p>

            {/* Key Pillars */}
            <div className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-2 text-sm text-secondary">
              <div className="flex items-center gap-2.5">
                <span className="flex h-6 w-6 items-center justify-center rounded-full bg-surgical-teal/20 text-surgical-teal">
                  ✓
                </span>
                <span>Tratamentos minimamente invasivos</span>
              </div>
              <div className="flex items-center gap-2.5">
                <span className="flex h-6 w-6 items-center justify-center rounded-full bg-surgical-teal/20 text-surgical-teal">
                  ✓
                </span>
                <span>Recuperação rápida sem internação</span>
              </div>
              <div className="flex items-center gap-2.5">
                <span className="flex h-6 w-6 items-center justify-center rounded-full bg-surgical-teal/20 text-surgical-teal">
                  ✓
                </span>
                <span>Eco-Doppler Vascular no consultório</span>
              </div>
              <div className="flex items-center gap-2.5">
                <span className="flex h-6 w-6 items-center justify-center rounded-full bg-emerald-500/20 text-emerald-600">
                  <Sparkles className="h-3.5 w-3.5" />
                </span>
                <span>Laser e espuma densa ecoguiada</span>
              </div>
            </div>

            {/* CTAs */}
            <div className="mt-8 flex flex-col gap-4 sm:flex-row sm:items-center">
              {onBook ? (
                <button
                  type="button"
                  onClick={onBook}
                  className="inline-flex items-center justify-center gap-3 rounded-xl bg-emerald-600 px-7 py-4 text-base font-bold text-white shadow-xl shadow-emerald-950/20 transition-all hover:bg-emerald-500 hover:-translate-y-0.5 active:translate-y-0"
                >
                  <MessageCircle className="h-5 w-5" />
                  <span>{primaryCTA.label}</span>
                </button>
              ) : (
                <a
                  href={primaryCTA.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-3 rounded-xl bg-emerald-600 px-7 py-4 text-base font-bold text-white shadow-xl shadow-emerald-950/20 transition-all hover:bg-emerald-500 hover:-translate-y-0.5 active:translate-y-0"
                >
                  <MessageCircle className="h-5 w-5" />
                  <span>{primaryCTA.label}</span>
                </a>
              )}

              {onOpenCalculator ? (
                <button
                  type="button"
                  onClick={onOpenCalculator}
                  className="inline-flex items-center justify-center gap-2.5 rounded-xl border border-surgical-teal/40 bg-white/70 px-6 py-4 text-base font-semibold text-surgical-teal backdrop-blur-md transition-all hover:bg-surgical-teal hover:text-white hover:-translate-y-0.5 active:translate-y-0"
                >
                  <Activity className="h-5 w-5" />
                  <span>{secondaryCTA.label}</span>
                  <ArrowRight className="h-4 w-4" />
                </button>
              ) : (
                <a
                  href={secondaryCTA.href || '#calculadora-tvp'}
                  className="inline-flex items-center justify-center gap-2.5 rounded-xl border border-surgical-teal/40 bg-white/70 px-6 py-4 text-base font-semibold text-surgical-teal backdrop-blur-md transition-all hover:bg-surgical-teal hover:text-white hover:-translate-y-0.5"
                >
                  <Activity className="h-5 w-5" />
                  <span>{secondaryCTA.label}</span>
                  <ArrowRight className="h-4 w-4" />
                </a>
              )}
            </div>

            {/* Quick Contact Micro-Proof */}
            <div className="mt-8 flex items-center gap-6 border-t border-default pt-6 text-xs text-tertiary">
              <div>
                <span className="block font-semibold text-primary">Consultório em Salvador</span>
                <span>R. Eng. Célso Tôrres, 654 - Graça</span>
              </div>
              <div className="h-8 w-px bg-slate-300" />
              <div>
                <span className="block font-semibold text-primary">Agendamento Ágil</span>
                <span>WhatsApp: (71) 99915-9975</span>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
