'use client';

import React from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { MessageCircle, Activity, Award, ArrowRight } from 'lucide-react';

interface HeroSectionProps {
  headline?: string;
  subheadline?: string;
  primaryCTA?: { label: string; href: string };
  secondaryCTA?: { label: string; href?: string };
  onOpenCalculator?: () => void;
  logoSvg?: React.ReactNode;
}

export function HeroSection({
  headline,
  subheadline = 'Especialista em Angiologia e Cirurgia Vascular em Salvador, Bahia. Tratamento moderno de varizes a laser, prevenção de trombose e doenças vasculares com alta tecnologia e atendimento humanizado.',
  primaryCTA = {
    label: 'Agendar Consulta',
    href: 'https://wa.me/5571999159975?text=Olá%20Dr.%20Herlon%20Moura,%20gostaria%20de%20agendar%20uma%20consulta.',
  },
  secondaryCTA = {
    label: 'Calculadora de Risco de TVP',
    href: '#calculadora-tvp',
  },
  onOpenCalculator,
  logoSvg,
}: HeroSectionProps) {
  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-background via-muted/30 to-background py-12 lg:py-20">
      {/* Background glow effects */}
      <div className="pointer-events-none absolute -top-40 left-1/2 -z-10 h-[500px] w-[800px] -translate-x-1/2 rounded-full bg-secondary/10 blur-[120px]" />
      <div className="pointer-events-none absolute top-1/3 -right-40 -z-10 h-[400px] w-[500px] rounded-full bg-primary/10 blur-[100px]" />

      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid items-center gap-12 lg:grid-cols-12 lg:gap-8">
          {/* Left Column: Copy & CTAs */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: 'easeOut' }}
            className="lg:col-span-7"
          >
            {/* Medical Credentials Pill */}
            <div className="inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-3.5 py-1.5 text-xs font-semibold text-primary shadow-inner mb-6">
              <Activity className="h-4 w-4 text-primary" />
              <span>CRM/BA 23904 • RQE 19791 / 22436 • Formado pela UFBA</span>
            </div>

            {/* Headline */}
            <h1 className="text-4xl font-extrabold tracking-tight text-foreground sm:text-5xl lg:text-6xl">
              {headline ? (
                <span>{headline}</span>
              ) : (
                <>
                  Cuidado Vascular de Excelência com{' '}
                  <span className="bg-gradient-to-r from-primary via-teal-400 to-secondary bg-clip-text text-transparent">
                    Dr. Herlon Moura
                  </span>
                </>
              )}
            </h1>

            {logoSvg && <div className="mt-4 flex">{logoSvg}</div>}

            {/* Subheadline */}
            <p className="mt-5 text-lg text-muted-foreground sm:text-xl leading-relaxed max-w-2xl">
              {subheadline}
            </p>

            {/* Key Pillars — matches live site trust bullets */}
            <div className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-2 max-w-xl text-sm text-muted-foreground">
              <div className="flex items-center gap-2.5">
                <span className="flex h-6 w-6 items-center justify-center rounded-full bg-primary/20 text-primary">✓</span>
                <span>Tratamentos minimamente invasivos com recuperação rápida</span>
              </div>
              <div className="flex items-center gap-2.5">
                <span className="flex h-6 w-6 items-center justify-center rounded-full bg-primary/20 text-primary">✓</span>
                <span>Consultas humanizadas com foco no seu bem-estar</span>
              </div>
              <div className="flex items-center gap-2.5">
                <span className="flex h-6 w-6 items-center justify-center rounded-full bg-primary/20 text-primary">✓</span>
                <span>Ambiente confortável e seguro em Salvador e região metropolitana</span>
              </div>
              <div className="flex items-center gap-2.5">
                <span className="flex h-6 w-6 items-center justify-center rounded-full bg-primary/20 text-primary">✓</span>
                <span>Atendimento particular e convênios selecionados</span>
              </div>
            </div>

            {/* CTAs */}
            <div className="mt-8 flex flex-col gap-4 sm:flex-row sm:items-center">
              <a
                href={primaryCTA.href}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-3 rounded-xl bg-secondary px-7 py-4 text-base font-bold text-secondary-foreground shadow-xl shadow-secondary/20 transition-all hover:bg-secondary-hover hover:shadow-secondary/30 hover:-translate-y-0.5 active:translate-y-0"
              >
                <MessageCircle className="h-5 w-5" />
                <span>{primaryCTA.label}</span>
              </a>

              {onOpenCalculator ? (
                <button
                  type="button"
                  onClick={onOpenCalculator}
                  className="inline-flex items-center justify-center gap-2.5 rounded-xl border border-primary/40 bg-primary/10 px-6 py-4 text-base font-semibold text-primary transition-all hover:bg-primary hover:text-primary-foreground hover:-translate-y-0.5 active:translate-y-0"
                >
                  <Activity className="h-5 w-5" />
                  <span>{secondaryCTA.label}</span>
                  <ArrowRight className="h-4 w-4" />
                </button>
              ) : (
                <a
                  href={secondaryCTA.href || '#calculadora-tvp'}
                  className="inline-flex items-center justify-center gap-2.5 rounded-xl border border-primary/40 bg-primary/10 px-6 py-4 text-base font-semibold text-primary transition-all hover:bg-primary hover:text-primary-foreground hover:-translate-y-0.5 active:translate-y-0"
                >
                  <Activity className="h-5 w-5" />
                  <span>{secondaryCTA.label}</span>
                  <ArrowRight className="h-4 w-4" />
                </a>
              )}
            </div>

            {/* Quick Contact Micro-Proof */}
            <div className="mt-8 flex items-center gap-6 border-t border-border pt-6 text-xs text-muted-foreground">
              <div>
                <span className="block font-semibold text-foreground">Consultório em Salvador</span>
                <span>R. Eng. Célso Tôrres, 654 - Graça</span>
              </div>
              <div className="h-8 w-px bg-border" />
              <div>
                <span className="block font-semibold text-foreground">Agendamento Ágil</span>
                <span>WhatsApp: (71) 99915-9975</span>
              </div>
            </div>
          </motion.div>

          {/* Right Column: Doctor Photo & Badges */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.2, ease: 'easeOut' }}
            className="relative lg:col-span-5 flex justify-center"
          >
            {/* Radial Glow */}
            <div className="absolute inset-0 rounded-3xl bg-gradient-to-tr from-primary/30 via-secondary/20 to-transparent blur-2xl" />

            {/* Doctor Photo Frame */}
            <div className="relative w-full max-w-[420px]">
              <div className="relative z-10 overflow-hidden rounded-3xl border border-border bg-gradient-to-b from-muted/80 to-muted/90 shadow-2xl p-2">
                <Image
                  src="/images/dr-herlon-moura.png"
                  alt="Dr. Herlon Moura - Angiologista e Cirurgião Vascular"
                  width={420}
                  height={580}
                  priority
                  className="h-auto w-full rounded-2xl object-cover object-top drop-shadow-[0_10px_25px_rgba(0,0,0,0.5)] transition-transform duration-500 hover:scale-[1.02]"
                />
              </div>

              {/* Floating Badge 1: Experience */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.5 }}
                className="absolute -left-6 bottom-16 z-20 hidden rounded-2xl border border-primary/30 bg-card/90 p-4 shadow-xl backdrop-blur-md sm:flex items-center gap-3"
              >
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/20 text-primary">
                  <Award className="h-6 w-6" />
                </div>
                <div>
                  <div className="text-sm font-bold text-foreground">15+ Anos</div>
                  <div className="text-xs text-muted-foreground">Prática Clínica & Cirúrgica</div>
                </div>
              </motion.div>

              {/* Floating Badge 2: Technology */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.6 }}
                className="absolute -right-4 top-12 z-20 hidden rounded-2xl border border-secondary/30 bg-card/90 p-3.5 shadow-xl backdrop-blur-md sm:flex items-center gap-3"
              >
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-secondary/20 text-secondary">
                  <Activity className="h-5 w-5" />
                </div>
                <div>
                  <div className="text-xs font-bold text-foreground">Laser & Espuma Densa</div>
                  <div className="text-[11px] text-muted-foreground">Tecnologia Minimamente Invasiva</div>
                </div>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
