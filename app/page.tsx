'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import {
  Activity,
  Check,
  HeartPulse,
  MessageCircle,
  Award,
} from 'lucide-react';
import {
  Header,
  Footer,
  Container,
  FormInput,
  Label,
  Button,
  ErrorMessage,
  DVTModal,
} from '@/components';

export default function Home() {
  const [isCalculatorModalOpen, setIsCalculatorModalOpen] = useState(false);

  // === COPY FROM LIVE SITE (herlonmoura.com.br) ===
  const MAIN_HEADLINE = 'Dr. Herlon Moura — Angiologista em Salvador';
  const MAIN_SUBHEADLINE =
    'Especialista em diagnóstico e tratamento de doenças vasculares com foco no seu bem-estar.';

  const TRUST_METRICS = [
    { value: '15+', label: 'Anos de Prática Clínica' },
    { value: 'UFBA', label: 'Formação Médica de Elite' },
    { value: 'RQE', label: 'Nº 19791 / 22436' },
    { value: 'Graça', label: 'Consultório em Salvador' },
  ];

  const WHY_CHOOSE = [
    {
      icon: 'check',
      title: 'Tratamentos Minimamente Invasivos',
      description: 'Tratamentos minimamente invasivos com recuperação rápida',
    },
    {
      icon: 'heart',
      title: 'Consultas Humanizadas',
      description: 'Consultas humanizadas com foco no seu bem-estar',
    },
    {
      icon: 'waves',
      title: 'Ambiente Confortável',
      description: 'Ambiente confortável e seguro em Salvador e região metropolitana',
    },
    {
      icon: 'shield',
      title: 'Convênios Selecionados',
      description: 'Atendimento particular e convênios selecionados',
    },
  ];

  const LEG_SYMPTOMS = [
    'Dor e/ou inchaço constante nos braços e pernas',
    'Formigamento e/ou dormência nas mãos ou nos pés',
    'Sensação de peso nas pernas',
    'Cãibras recorrentes',
    'Cansaço sem motivo aparente',
    'Dificuldade para caminhar',
    'Aparelho de veias azuladas ou arroxeadas',
    'Sensação de queimação nas pernas e pés',
  ];

  const NECK_SYMPTOMS = [
    'Dor no pescoço, geralmente intensa e unilateral',
    'Dor de cabeça súbita e intensa',
    'Perda repentina da visão de um dos olhos',
    'Dormência, perda da força e sensibilidade em um dos lados do corpo',
    'Distúrbios da fala ou da compreensão',
    'Alterações do equilíbrio',
    'Tonturas ou desequilíbrio',
    'Perda de audição',
  ];

  const PROCEDURES = [
    {
      title: 'Doppler Vascular',
      subtitle: 'Exame de Ultrassom do Fluxo Sanguíneo',
      description:
        'O Doppler vascular é um exame de ultrassom que analisa o fluxo sanguíneo em artérias e veias. É indolor, não invasivo e pode ser realizado em diversas partes do corpo.',
      tag: 'Diagnóstico',
      whatsappContext:
        'Olá Dr. Herlon, estou entrando em contato através do site Dr. Herlon Moura.',
    },
    {
      title: 'Tratamento de Varizes com Laser',
      subtitle: 'Procedimento Minimamente Invasivo',
      description:
        'O tratamento de varizes com laser é um procedimento minimamente invasivo que utiliza a energia do laser para destruir as veias doentes. Existem diferentes tipos, como o transdérmico e o endovenoso.',
      tag: 'Laser',
      whatsappContext:
        'Olá Dr. Herlon, estou entrando em contato através do site Dr. Herlon Moura.',
    },
    {
      title: 'Escleroterapia com Espuma Densa',
      subtitle: 'Tratamento em Consultório',
      description:
        'Tratamento para varizes e pequenos vasinhos que consiste na injeção de uma espuma na veia. O procedimento é minimamente invasivo e pode ser realizado em consultório.',
      tag: 'Espuma',
      whatsappContext:
        'Olá Dr. Herlon, estou entrando em contato através do site Dr. Herlon Moura.',
    },
    {
      title: 'Microcirurgia de Varizes',
      subtitle: 'Flebectomia Ambulatorial',
      description:
        'Procedimento que remove varizes pequenas e médias por meio de pequenas incisões. É um procedimento minimamente invasivo que pode ser realizado no consultório. É também conhecida como flebectomia ambulatória.',
      tag: 'Cirúrgico',
      whatsappContext:
        'Olá Dr. Herlon, estou entrando em contato através do site Dr. Herlon Moura.',
    },
    {
      title: 'Implante de Cateter Port-a-Cath',
      subtitle: 'Acesso para Quimioterapia',
      description:
        'O cateter Port-a-Cath é um dispositivo totalmente implantável que facilita a aplicação de quimioterapia e outros tratamentos.',
      tag: 'Oncológico',
      whatsappContext:
        'Olá Dr. Herlon, estou entrando em contato através do site Dr. Herlon Moura.',
    },
    {
      title: 'Implante de Cateter Permcath',
      subtitle: 'Acesso para Hemodiálise',
      description:
        'O cateter Permcath é um cateter de longa permanência que é implantado em uma veia profunda do paciente para realizar hemodiálise.',
      tag: 'Vascular',
      whatsappContext:
        'Olá Dr. Herlon, estou entrando em contato através do site Dr. Herlon Moura.',
    },
    {
      title: 'Fístula Arteriovenosa (FAV)',
      subtitle: 'Acesso para Hemodiálise',
      description:
        'A confecção de uma fístula arteriovenosa (FAV) para hemodiálise é um procedimento cirúrgico que une uma artéria a uma veia. É o melhor acesso vascular para hemodiálise.',
      tag: 'Cirúrgico',
      whatsappContext:
        'Olá Dr. Herlon, estou entrando em contato através do site Dr. Herlon Moura.',
    },
  ];

  const WHO_SYMPTOMS = [
    'Dor e/ou inchaço constante nos braços e pernas',
    'Formigamento e/ou dormência nas mãos ou nos pés',
    'Sensação de peso nas pernas',
    'Cãibras recorrentes',
    'Cansaço sem motivo aparente',
    'Dificuldade para caminhar',
    'Veias azuladas ou arroxeadas',
    'Sensação de queimação nas pernas e pés',
  ];

  const VASCULAR_SYMPTOMS = [
    'Dor no pescoço, geralmente intensa e unilateral',
    'Dor de cabeça súbita e intensa',
    'Perda repentina da visão de um dos olhos',
    'Dormência, perda da força e sensibilidade em um dos lados do corpo',
    'Distúrbios da fala ou da compreensão',
    'Alterações do equilíbrio',
    'Tonturas ou desequilíbrio',
    'Perda de audição',
  ];

  const WHATSAPP_URL =
    'https://wa.me/5571999159975?text=Ol%C3%A1%2C%20estou%20entrando%20em%20contato%20atrav%C3%A9s%20do%20site%20Dr.%20Herlon%20Moura.';

  const fadeInUp = {
    initial: { opacity: 0, y: 20 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true },
    transition: { duration: 0.6, ease: 'easeOut' },
  };

  const staggerContainer = {
    initial: { opacity: 0 },
    whileInView: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },
    },
    viewport: { once: true },
  };

  return (
    <main className="min-h-screen bg-background text-foreground">
      {/* Hero Section - matches live site exactly */}
      <section className="relative overflow-hidden bg-gradient-to-b from-white via-gray-50 to-teal-50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid items-center gap-12 lg:grid-cols-12 lg:gap-8 py-12 lg:py-20">
            {/* Left Column: Hero Content */}
            <div className="lg:col-span-7">
              {/* Brand Banner */}
              <div className="mb-8">
                <img
                  src="https://herlonmoura.com.br/wp-content/uploads/2025/04/Marca_Dr._Herlon_Moura_page-0008-removebg-preview.png"
                  alt="Dr. Herlon Moura - Marca"
                  className="h-12 w-auto"
                />
              </div>

              {/* Main CTA */}
              <div className="mb-6">
                <a
                  href="https://wa.me/5571999159975?source=google_ads"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2.5 rounded-xl bg-secondary px-5 py-3 text-sm font-bold text-secondary-foreground shadow-lg hover:bg-secondary-hover transition-all"
                >
                  <MessageCircle className="h-4 w-4" />
                  <span>Chame no whatsapp</span>
                </a>
              </div>

              {/* Headline */}
              <h1 className="text-3xl font-extrabold sm:text-4xl lg:text-5xl text-foreground leading-tight mb-4">
                {MAIN_HEADLINE}
              </h1>

              {/* Subheadline */}
              <p className="text-lg text-muted-foreground mb-6 max-w-2xl">
                {MAIN_SUBHEADLINE}
              </p>

              {/* Key Benefits */}
              <div className="mb-6">
                <ul className="space-y-3 text-base text-muted-foreground">
                  {['Tratamentos minimamente invasivos com recuperação rápida'].map(
                    (item, i) => (
                      <li key={i} className="flex items-start gap-3">
                        <span className="flex-shrink-0 text-primary font-bold">✓</span>
                        <span>{item}</span>
                      </li>
                    )
                  )}
                  <li className="flex items-start gap-3">
                    <span className="flex-shrink-0 text-primary font-bold">✓</span>
                    <span>Consultas humanizadas com foco no seu bem-estar</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="flex-shrink-0 text-primary font-bold">✓</span>
                    <span>Ambiente confortável e seguro em Salvador e região metropolitana</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="flex-shrink-0 text-primary font-bold">✓</span>
                    <span>Atendimento particular e convênios selecionados</span>
                  </li>
                </ul>
              </div>

              {/* Symptom Trigger */}
              <div className="mb-6">
                <p className="text-base text-muted-foreground mb-3">
                  Se você tem algum dos sintomas abaixo, podemos te ajudar.
                </p>
                <a
                  href={WHATSAPP_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 rounded-xl bg-secondary px-4 py-2.5 text-sm font-semibold text-secondary-foreground shadow-md hover:bg-secondary-hover transition-all"
                >
                  <MessageCircle className="h-4 w-4" />
                  Agendar Exame
                </a>
              </div>
            </div>

            {/* Right Column: Doctor Photo */}
            <div className="lg:col-span-5 flex justify-center">
              <div className="relative w-full max-w-[380px]">
                <div className="relative z-10 overflow-hidden rounded-3xl border border-border bg-card shadow-2xl">
                  <Image
                    src="/images/dr-herlon-moura.png"
                    alt="Dr. Herlon Moura dos Santos"
                    width={380}
                    height={520}
                    className="h-auto w-full rounded-2xl object-cover object-top"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Trust & Credibility Ticker Bar - matches live site exactly */}
      <motion.section
        className="border-y border-primary/20 bg-muted/30 py-6 backdrop-blur-md"
        variants={staggerContainer}
        initial="initial"
        whileInView="whileInView"
      >
        <div className="container mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-4 sm:gap-6 text-center">
            {TRUST_METRICS.map((metric, idx) => (
              <motion.div key={metric.label} className="rounded-xl border border-border/50 bg-card/60 p-4">
                <motion.span
                  className="block text-2xl sm:text-3xl font-black text-primary"
                  variants={fadeInUp}
                >
                  {metric.value}
                </motion.span>
                <motion.span
                  className="mt-1 block text-xs sm:text-sm text-muted-foreground"
                  variants={fadeInUp}
                >
                  {metric.label}
                </motion.span>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.section>

      {/* Why Choose Section - matches live site "Por que escolher meu atendimento?" */}
      <motion.section
        className="py-16 sm:py-24 bg-gradient-to-b from-background via-muted/20 to-muted/30"
        variants={staggerContainer}
        initial="initial"
        whileInView="whileInView"
      >
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div className="mx-auto max-w-3xl text-center" variants={fadeInUp}>
            <span className="inline-block rounded-full border border-primary/30 bg-primary/10 px-3 py-1 text-xs font-semibold text-primary mb-3">
              Atendimento Humanizado Alta Tecnologia
            </span>
            <h2 className="text-3xl font-extrabold sm:text-4xl text-foreground">
              Por que escolher meu atendimento?
            </h2>
          </motion.div>

          <div className="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {['check', 'heart', 'waves', 'shield'].map((icon, idx) => {
              const benefits = [
                { title: 'Tratamentos Minimamente Invasivos', desc: 'Tratamentos minimamente invasivos com recuperação rápida' },
                { title: 'Consultas Humanizadas', desc: 'Consultas humanizadas com foco no seu bem-estar' },
                { title: 'Ambiente Confortável', desc: 'Ambiente confortável e seguro em Salvador e região metropolitana' },
                { title: 'Convênios Selecionados', desc: 'Atendimento particular e convênios selecionados' },
              ];
              const benefit = benefits[idx];
              return (
                <motion.div
                  key={benefit.title}
                  className="rounded-2xl border border-border bg-card/60 p-6 transition-all hover:border-primary/50 hover:bg-card"
                  variants={fadeInUp}
                >
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/15 text-primary mb-5">
                    {icon === 'check' && '✓'}
                    {icon === 'heart' && '❤'}
                    {icon === 'waves' && '≈'}
                    {icon === 'shield' && '🛡'}
                  </div>
                  <h3 className="text-lg font-bold text-foreground mb-2">{benefit.title}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">{benefit.desc}</p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </motion.section>

      {/* Symptom Mapping Section - matches live site structure */}
      <motion.section
        id="sintomas"
        className="py-16 sm:py-24 bg-background"
        variants={staggerContainer}
        initial="initial"
        whileInView="whileInView"
      >
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div className="mx-auto max-w-3xl text-center mb-16" variants={fadeInUp}>
            <span className="text-xs font-bold uppercase tracking-wider text-primary">
              Identificação de Sinais
            </span>
            <h2 className="mt-2 text-3xl font-extrabold sm:text-4xl text-foreground">
              Você apresenta algum destes sintomas circulatórios?
            </h2>
            <p className="mt-3 text-base text-muted-foreground">
              O diagnóstico vascular precoce previne complicações graves como úlceras de perna, trombose e insuficiência venosa crônica.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Braços e Pernas - matches WP exactly */}
            <motion.div
              className="rounded-3xl border border-primary/30 bg-card/80 p-8 shadow-xl"
              variants={fadeInUp}
            >
              <div className="flex items-center gap-3 mb-6">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/20 text-primary">
                  🇧🇷
                </div>
                <div>
                  <h3 className="text-xl font-bold text-foreground">Braços e Pernas</h3>
                  <p className="text-xs text-muted-foreground">Sintomas em membros superiores e inferiores</p>
                </div>
              </div>

              <p className="mb-4 text-sm font-semibold text-primary">
                Se você tem algum dos sintomas abaixo, podemos te ajudar.
              </p>

              <ul className="space-y-3">
                {LEG_SYMPTOMS.map((symp) => (
                  <li key={symp} className="flex items-start gap-3 text-sm text-muted-foreground">
                    <span className="flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full bg-primary/20 text-primary text-xs mt-0.5">
                      ✓
                    </span>
                    <span>{symp}</span>
                  </li>
                ))}
              </ul>

              <div className="mt-8 pt-6 border-t border-border">
                <a
                  href="https://wa.me/5571999159975?text=Ol%C3%A1%2C%20Dr.%20Herlon%2C%20sinto%20dores%2Fincha%C3%B3%20nas%20pernas%20e%20gostaria%20de%20uma%20avalia%C3%A7%C3%A3o."
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-primary/20 border border-primary/40 px-5 py-3 text-sm font-semibold text-primary hover:bg-primary hover:text-primary-foreground transition-all"
                >
                  <MessageCircle className="h-4 w-4" />
                  Agendar Exame das Pernas
                </a>
              </div>
            </motion.div>

            {/* Tronco e Pescoço - matches WP exactly */}
            <motion.div
              className="rounded-3xl border border-secondary/30 bg-card/80 p-8 shadow-xl"
              variants={fadeInUp}
            >
              <div className="flex items-center gap-3 mb-6">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-secondary/20 text-secondary">
                  🧠
                </div>
                <div>
                  <h3 className="text-xl font-bold text-foreground">Tronco e Pescoço</h3>
                  <p className="text-xs text-muted-foreground">Sintomas vasculares centrais</p>
                </div>
              </div>

              <p className="mb-4 text-sm font-semibold text-secondary">
                Possíveis sintomas para procurar um angiologista:
              </p>

              <ul className="space-y-3">
                {NECK_SYMPTOMS.map((symp) => (
                  <li key={symp} className="flex items-start gap-3 text-sm text-muted-foreground">
                    <span className="flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full bg-secondary/20 text-secondary text-xs mt-0.5">
                      ✓
                    </span>
                    <span>{symp}</span>
                  </li>
                ))}
              </ul>

              <div className="mt-8 pt-6 border-t border-border">
                <a
                  href={WHATSAPP_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-secondary/20 border border-secondary/40 px-5 py-3 text-sm font-semibold text-secondary hover:bg-secondary hover:text-secondary-foreground transition-all"
                >
                  <MessageCircle className="h-4 w-4" />
                  FALE CONOSCO
                </a>
              </div>
            </motion.div>
          </div>
        </div>
      </motion.section>

      {/* Procedimentos Section - improved structure */}
      <motion.section
        id="procedimentos"
        className="py-16 sm:py-24 bg-muted/30"
        variants={staggerContainer}
        initial="initial"
        whileInView="whileInView"
      >
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
            <motion.div variants={fadeInUp}>
              <span className="text-xs font-bold uppercase tracking-wider text-primary">
                Especialidades Cirúrgicas
              </span>
              <h2 className="mt-2 text-3xl font-extrabold sm:text-4xl text-foreground">
                Procedimentos e Tratamentos Especializados
              </h2>
              <p className="mt-3 text-base text-muted-foreground max-w-2xl">
                Soluções vasculares modernas para eliminação de varizes, alívio de sintomas circulatórios e procedimentos de alta precisão.
              </p>
            </motion.div>
            <motion.a
              href={WHATSAPP_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2.5 rounded-xl bg-secondary px-5 py-3 text-sm font-semibold text-secondary-foreground hover:bg-secondary-hover transition-all flex-shrink-0"
              variants={fadeInUp}
            >
              <MessageCircle className="h-4 w-4" />
              Tirar Dúvidas no WhatsApp
            </motion.a>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {PROCEDURES.map((proc) => {
              const WhatsAppURL = `https://wa.me/5571999159975?text=${encodeURIComponent(
                `Olá Dr. Herlon Moura, gostaria de agendar uma consulta sobre ${proc.title}.`
              )}`;
              return (
                <motion.div
                  key={proc.title}
                  className="group relative flex flex-col justify-between rounded-2xl border border-border bg-card/60 p-6 transition-all duration-300 hover:border-primary/40 hover:bg-card hover:shadow-xl hover:shadow-primary/5"
                  variants={fadeInUp}
                >
                  <div>
                    <div className="flex items-center justify-between gap-3 mb-4">
                      <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary/15 text-primary transition-transform group-hover:scale-105">
                        {proc.tag === 'Diagnóstico' && '📊'}
                        {proc.tag === 'Laser' && '🔴'}
                        {proc.tag === 'Espuma' && '🧫'}
                        {proc.tag === 'Cirúrgico' && '🔪'}
                        {proc.tag === 'Oncológico' && '🧬'}
                        {proc.tag === 'Vascular' && '💉'}
                      </div>
                      <span className="rounded-full bg-muted/80 px-2.5 py-1 text-[11px] font-semibold text-secondary border border-secondary/20">
                        {proc.tag}
                      </span>
                    </div>
                    <h3 className="text-xl font-bold text-foreground group-hover:text-primary transition-colors">
                      {proc.title}
                    </h3>
                    <div className="text-xs font-medium text-muted-foreground mt-0.5 mb-3">
                      {proc.subtitle}
                    </div>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      {proc.description}
                    </p>
                  </div>

                  <div className="mt-6 pt-4 border-t border-border/60">
                    <a
                      href={WhatsAppURL}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 text-xs font-semibold text-primary hover:text-secondary-foreground transition-colors"
                    >
                      <span>SAIBA MAIS</span>
                      →
                    </a>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </motion.section>

      {/* Interactive DVT Risk Calculator Anchor Section */}
      <motion.section
        id="calculadora-tvp"
        className="py-20 sm:py-28 bg-gradient-to-b from-muted/30 via-background to-muted/30 relative overflow-hidden"
        variants={staggerContainer}
        initial="initial"
        whileInView="whileInView"
      >
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div className="mx-auto max-w-3xl text-center mb-10" variants={fadeInUp}>
            <div className="inline-flex items-center gap-2 rounded-full border border-primary/40 bg-primary/10 px-3.5 py-1.5 text-xs font-semibold text-primary mb-3">
              <Activity className="h-4 w-4" />
              <span>Triagem Vascular Rápida</span>
            </div>
            <h2 className="text-3xl font-extrabold sm:text-5xl text-foreground">
              Calculadora de Risco de Trombose (TVP)
            </h2>
            <p className="mt-4 text-base text-muted-foreground">
              Responda às 4 etapas e receba instantaneamente a pontuação do seu risco tromboembólico, com orientações clínicas do Dr. Herlon Moura.
            </p>
            <div className="mt-4">
              <button
                type="button"
                onClick={() => setIsCalculatorModalOpen(true)}
                className="inline-flex items-center gap-2 rounded-xl bg-primary/15 border border-primary/40 px-4 py-2 text-xs font-bold text-primary hover:bg-primary hover:text-primary-foreground transition-all shadow-sm"
              >
                <HeartPulse className="h-4 w-4" />
                <span>Abrir em Modo Janela Flutuante</span>
              </button>
            </div>
          </motion.div>
        </div>
      </motion.section>

      {/* Doctor Bio & Credentials Section */}
      <motion.section
        id="sobre"
        className="py-20 sm:py-24 bg-muted/30 border-t border-border"
        variants={staggerContainer}
        initial="initial"
        whileInView="whileInView"
      >
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid items-center gap-12 lg:grid-cols-12">
            <div className="lg:col-span-5 flex justify-center">
              <motion.div
                className="relative w-full max-w-[380px]"
                variants={fadeInUp}
              >
                <div className="absolute inset-0 rounded-3xl bg-primary/20 blur-2xl" />
                <div className="relative z-10 overflow-hidden rounded-3xl border border-border bg-card shadow-2xl p-2">
                  <Image
                    src="/images/dr-herlon-moura.png"
                    alt="Dr. Herlon Moura dos Santos"
                    width={380}
                    height={520}
                    className="h-auto w-full rounded-2xl object-cover object-top"
                  />
                </div>
              </motion.div>
            </div>

            <motion.div
              className="lg:col-span-7 space-y-6"
              variants={fadeInUp}
            >
              <div className="inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">
                <Award className="h-4 w-4" />
                <span>Formação de Excelência</span>
              </div>
              <h2 className="text-3xl font-extrabold sm:text-4xl text-foreground">
                Dr. Herlon Moura dos Santos
              </h2>
              <p className="text-base text-secondary font-medium">
                Cirurgião Vascular e Endovascular – CRM/BA 23904 | RQE Nº 19791 / RQE Nº 22436
              </p>
              <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
                Com formação pela Universidade Federal da Bahia (UFBA) e especializações em Cirurgia Vascular e Endovascular, ofereço um atendimento acolhedor e personalizado, combinando tecnologia de ponta e experiência clínica para tratar doenças como varizes, tromboses, aneurismas e obstruções arteriais.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4 border-t border-border">
                <div className="flex items-center gap-3">
                  <Check className="h-5 w-5 text-primary flex-shrink-0" />
                  <span className="text-sm text-foreground">Membro da SBACV</span>
                </div>
                <div className="flex items-center gap-3">
                  <Check className="h-5 w-5 text-primary flex-shrink-0" />
                  <span className="text-sm text-foreground">Especialista em Cirurgia Endovascular</span>
                </div>
                <div className="flex items-center gap-3">
                  <Check className="h-5 w-5 text-primary flex-shrink-0" />
                  <span className="text-sm text-foreground">Laser e Espuma Densa Ecoguiada</span>
                </div>
                <div className="flex items-center gap-3">
                  <Check className="h-5 w-5 text-primary flex-shrink-0" />
                  <span className="text-sm text-foreground">Acessos para Quimioterapia e Hemodiálise</span>
                </div>
              </div>

              <div className="pt-4">
                <a
                  href={WHATSAPP_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 rounded-xl bg-secondary px-6 py-3.5 text-sm font-bold text-secondary-foreground shadow-lg hover:bg-secondary-hover transition-all"
                >
                  <MessageCircle className="h-5 w-5" />
                  <span>Agendar Consulta com Dr. Herlon</span>
                </a>
              </div>
            </motion.div>
          </div>
        </div>
      </motion.section>

      {/* Final CTA Contact Section - matches live site */}
      <motion.section
        id="contato"
        className="py-20 sm:py-28 bg-muted/30 border-t border-border"
        variants={staggerContainer}
        initial="initial"
        whileInView="whileInView"
      >
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div className="mx-auto max-w-3xl text-center" variants={fadeInUp}>
            <span className="inline-block rounded-full border border-primary/30 bg-primary/10 px-3 py-1 text-xs font-semibold text-primary mb-3">
              Agendamento Facilitado
            </span>
            <h2 className="text-3xl font-extrabold sm:text-4xl text-foreground mb-4">
              Vamos agendar sua consulta?
            </h2>
            <p className="text-base text-muted-foreground mb-6">
              Fale conosco e agenda já!
            </p>
            <p className="text-sm text-muted-foreground mb-8">
              Nosso foco é o melhor atendimento pensando em seu bem estar. Atendimento humanizado com muito amor.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-6">
              <a
                href={WHATSAPP_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2.5 rounded-xl bg-secondary px-7 py-4 text-base font-bold text-secondary-foreground shadow-xl hover:bg-secondary-hover transition-all"
              >
                <MessageCircle className="h-5 w-5" />
                <span>WhatsApp</span>
              </a>
              <a
                href={WHATSAPP_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 rounded-xl border border-primary/40 bg-primary/10 px-6 py-3.5 text-sm font-semibold text-primary hover:bg-primary hover:text-primary-foreground transition-all"
              >
                <MessageCircle className="h-4 w-4" />
                Fale no WhatsApp
              </a>
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-6 text-sm text-muted-foreground">
              <span>📍 R. Eng. Célso Tôrres, 654 - Graça, Salvador - BA</span>
              <span>📞 (71) 98344-9737 / (71) 99915-9975</span>
            </div>
          </motion.div>
        </div>
      </motion.section>

      <Footer />

      {/* Quick Floating Test Trigger Button */}
      <aside className="fixed bottom-5 right-5 z-30 hidden sm:block" aria-label="Acesso rápido ao teste de risco">
        <motion.button
          type="button"
          onClick={() => setIsCalculatorModalOpen(true)}
          className="group flex items-center gap-2.5 rounded-full bg-card/90 border border-primary/50 px-4 py-2.5 text-xs font-bold text-foreground shadow-2xl backdrop-blur-xl transition-all hover:bg-primary hover:text-primary-foreground hover:shadow-primary/30 hover:scale-105 active:scale-95"
          aria-label="Abrir teste rápido de TVP"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.5, ease: 'easeOut' }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <span className="flex h-6 w-6 items-center justify-center rounded-full bg-primary/20 text-primary group-hover:bg-muted/90 group-hover:text-primary">
            <HeartPulse className="h-3.5 w-3.5" />
          </span>
          <span>Teste de Risco TVP</span>
        </motion.button>
      </aside>

      {/* DVT Modal */}
      <DVTModal
        isOpen={isCalculatorModalOpen}
        onClose={() => setIsCalculatorModalOpen(false)}
      />
    </main>
  );
}