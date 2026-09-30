'use client';

import React from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { MessageCircle, Activity, Award, ShieldCheck, ArrowRight, Sparkles } from 'lucide-react';
import Link from 'next/link';

interface HeroSectionProps {
  headline?: string;
  subheadline?: string;
  primaryCTA?: { label: string; href: string };
  secondaryCTA?: { label: string; href: string };
}

export function HeroSection({
  headline = 'Dr. Herlon Moura',
  subheadline = 'Cirurgião Vascular e Endovascular em Salvador. Especialista em saúde circulatória, tratamento moderno de varizes a laser e prevenção de trombose.',
  primaryCTA = {
    label: 'Agendar Consulta',
    href: 'https://wa.me/5571999159975?text=Olá%20Dr.%20Herlon%20Moura,%20gostaria%20de%20agendar%20uma%20consulta.',
  },
  secondaryCTA = {
    label: 'Calculadora de Risco de TVP',
    href: '#calculadora-tvp',
  },
}: HeroSectionProps) {
  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-slate-950 via-dark-elevated to-slate-900 py-12 lg:py-20">
      {/* Background glow effects */}
      <div className="pointer-events-none absolute -top-40 left-1/2 -z-10 h-[500px] w-[800px] -translate-x-1/2 rounded-full bg-surgical-teal/10 blur-[120px]" />
      <div className="pointer-events-none absolute top-1/3 -right-40 -z-10 h-[400px] w-[500px] rounded-full bg-emerald-500/10 blur-[100px]" />

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
            <div className="inline-flex items-center gap-2 rounded-full border border-surgical-teal/30 bg-surgical-teal/10 px-3.5 py-1.5 text-xs font-semibold text-surgical-teal shadow-inner mb-6">
              <ShieldCheck className="h-4 w-4 text-surgical-teal" />
              <span>CRM/BA 23904 • RQE 19791 / 22436 • Formado pela UFBA</span>
            </div>

            {/* Headline */}
            <h1 className="text-4xl font-extrabold tracking-tight text-white sm:text-5xl lg:text-6xl">
              Cuidado Vascular de Excelência com{' '}
              <span className="bg-gradient-to-r from-surgical-teal via-teal-300 to-emerald-400 bg-clip-text text-transparent">
                Dr. Herlon Moura
              </span>
            </h1>

            {/* Subtitle */}
            <p className="mt-5 text-lg text-slate-300 sm:text-xl leading-relaxed max-w-2xl">
              {subheadline}
            </p>

            {/* Key Pillars */}
            <div className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-2 max-w-xl text-sm text-slate-300">
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
                <span className="flex h-6 w-6 items-center justify-center rounded-full bg-surgical-teal/20 text-surgical-teal">
                  ✓
                </span>
                <span>Atendimento humanizado na Graça</span>
              </div>
            </div>

            {/* CTAs */}
            <div className="mt-8 flex flex-col gap-4 sm:flex-row sm:items-center">
              <a
                href={primaryCTA.href}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-3 rounded-xl bg-emerald-600 px-7 py-4 text-base font-bold text-white shadow-xl shadow-emerald-950/40 transition-all hover:bg-emerald-500 hover:shadow-emerald-700/50 hover:-translate-y-0.5 active:translate-y-0"
              >
                <MessageCircle className="h-5 w-5" />
                <span>{primaryCTA.label}</span>
              </a>

              <a
                href={secondaryCTA.href}
                className="inline-flex items-center justify-center gap-2.5 rounded-xl border border-surgical-teal/40 bg-surgical-teal/10 px-6 py-4 text-base font-semibold text-surgical-teal backdrop-blur-md transition-all hover:bg-surgical-teal hover:text-slate-950 hover:-translate-y-0.5"
              >
                <Activity className="h-5 w-5" />
                <span>{secondaryCTA.label}</span>
                <ArrowRight className="h-4 w-4" />
              </a>
            </div>

            {/* Quick Contact Micro-Proof */}
            <div className="mt-8 flex items-center gap-6 border-t border-white/10 pt-6 text-xs text-slate-400">
              <div>
                <span className="block font-semibold text-slate-200">Consultório em Salvador</span>
                <span>R. Eng. Célso Tôrres, 654 - Graça</span>
              </div>
              <div className="h-8 w-px bg-white/10" />
              <div>
                <span className="block font-semibold text-slate-200">Agendamento Ágil</span>
                <span>WhatsApp: (71) 99915-9975</span>
              </div>
            </div>
          </motion.div>

          {/* Right Column: Doctor Cutout Photo & Badges */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.2, ease: 'easeOut' }}
            className="relative lg:col-span-5 flex justify-center"
          >
            {/* Visual Frame & Backdrop */}
            <div className="relative w-full max-w-[420px]">
              {/* Radial Glow */}
              <div className="absolute inset-0 rounded-3xl bg-gradient-to-tr from-surgical-teal/30 via-emerald-500/20 to-transparent blur-2xl" />

              {/* Doctor Cutout Image */}
              <div className="relative z-10 flex justify-center overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-b from-slate-800/80 to-slate-950/90 shadow-2xl backdrop-blur-xl pt-6 px-4">
                <Image
                  src="/images/dr-herlon-moura.png"
                  alt="Dr. Herlon Moura - Angiologista e Cirurgião Vascular"
                  width={420}
                  height={580}
                  priority
                  className="h-auto w-full object-cover object-top drop-shadow-[0_10px_25px_rgba(0,0,0,0.5)] transition-transform duration-500 hover:scale-[1.02]"
                />
              </div>

              {/* Floating Badge 1: Experience */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.5 }}
                className="absolute -left-6 bottom-16 z-20 hidden rounded-2xl border border-surgical-teal/30 bg-slate-900/90 p-4 shadow-xl backdrop-blur-md sm:flex items-center gap-3"
              >
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-surgical-teal/20 text-surgical-teal">
                  <Award className="h-6 w-6" />
                </div>
                <div>
                  <div className="text-sm font-bold text-white">15+ Anos</div>
                  <div className="text-xs text-slate-400">Prática Clínica & Cirúrgica</div>
                </div>
              </motion.div>

              {/* Floating Badge 2: SBACV */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.6 }}
                className="absolute -right-4 top-12 z-20 hidden rounded-2xl border border-emerald-500/30 bg-slate-900/90 p-3.5 shadow-xl backdrop-blur-md sm:flex items-center gap-3"
              >
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-500/20 text-emerald-400">
                  <Sparkles className="h-5 w-5" />
                </div>
                <div>
                  <div className="text-xs font-bold text-white">Laser & Espuma Densa</div>
                  <div className="text-[11px] text-slate-400">Tecnologia Minimamente Invasiva</div>
                </div>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
