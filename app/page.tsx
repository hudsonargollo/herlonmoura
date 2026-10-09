'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import {
  Header,
  HeroSection,
  Footer,
  DVTRiskCalculator,
  DVTModal,
  ThemeToggle,
} from '@/components';
import {
  Activity,
  CheckCircle2,
  Stethoscope,
  Sparkles,
  Waves,
  Zap,
  ShieldCheck,
  ArrowRight,
  HeartPulse,
  Award,
  Clock,
  Check,
  MessageCircle,
  Phone,
} from 'lucide-react';

export default function Home() {
  const [isCalculatorModalOpen, setIsCalculatorModalOpen] = useState(false);

  // === PROCEDURES — copy matches live site (herlonmoura.com.br) ===
  const PROCEDURES = [
    {
      title: 'Doppler Vascular',
      subtitle: 'Exame de Ultrassom do Fluxo Sanguíneo',
      description:
        'O Doppler vascular é um exame de ultrassom que analisa o fluxo sanguíneo em artérias e veias. É indolor, não invasivo e pode ser realizado em diversas partes do corpo.',
      icon: Waves,
      tag: 'Diagnóstico',
    },
    {
      title: 'Tratamento de Varizes com Laser',
      subtitle: 'Procedimento Minimamente Invasivo',
      description:
        'O tratamento de varizes com laser é um procedimento minimamente invasivo que utiliza a energia do laser para destruir as veias doentes. Existem diferentes tipos, como o transdérmico e o endovenoso.',
      icon: Zap,
      tag: 'Laser',
    },
    {
      title: 'Escleroterapia com Espuma Densa',
      subtitle: 'Tratamento em Consultório',
      description:
        'Tratamento para varizes e pequenos vasinhos que consiste na injeção de uma espuma na veia. O procedimento é minimamente invasivo e pode ser realizado em consultório.',
      icon: Sparkles,
      tag: 'Espuma',
    },
    {
      title: 'Microcirurgia de Varizes',
      subtitle: 'Flebectomia Ambulatorial',
      description:
        'Procedimento que remove varizes pequenas e médias por meio de pequenas incisões. É um procedimento minimamente invasivo que pode ser realizado no consultório. É também conhecida como flebectomia ambulatária.',
      icon: Activity,
      tag: 'Cirúrgico',
    },
    {
      title: 'Implante de Cateter Port-o-Cath',
      subtitle: 'Acesso para Quimioterapia',
      description:
        'O cateter Port-a-Cath é um dispositivo totalmente implantável que facilita a aplicação de quimioterapia e outros tratamentos.',
      icon: ShieldCheck,
      tag: 'Oncológico',
    },
    {
      title: 'Implante de Cateter Permcath',
      subtitle: 'Acesso para Hemodiálise',
      description:
        'O cateter Permcath é um cateter de longa permanência que é implantado em uma veia profunda do paciente para realizar hemodiálise.',
      icon: Stethoscope,
      tag: 'Vascular',
    },
    {
      title: 'Fístula Arteriovenosa (FAV)',
      subtitle: 'Acesso para Hemodiálise',
      description:
        'A confecção de uma fístula arteriovenosa (FAV) para hemodiálise é um procedimento cirúrgico que une uma artéria a uma veia. É o melhor acesso vascular para hemodiálise.',
      icon: Activity,
      tag: 'Cirúrgico',
    },
  ];

  // === SYMPTOMS — copy matches live site exactly ===
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

  const WHATSAPP_URL =
    'https://wa.me/5571999159975?text=Olá%20Dr.%20Herlon,%20estou%20entrando%20em%20contato%20através%20do%20site%20Dr.%20Herlon%20Moura.';

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
      <Header onOpenCalculator={() => setIsCalculatorModalOpen(true)} />

      {/* Hero Section */}
      <HeroSection
        headline="Dr. Herlon Moura — Angiologista e Cirurgião Vascular em Salvador"
        subheadline="Angiologista é um médico especialista em diagnosticar e tratar doenças que afetam os vasos sanguíneos e o sistema linfático. Ele atua no sistema circulatório de braços, pernas, tronco e pescoço."
        onOpenCalculator={() => setIsCalculatorModalOpen(true)}
      />

      {/* Trust & Credibility Ticker Bar */}
      <motion.section
        className="border-y border-primary/20 bg-muted/30 py-6 backdrop-blur-md"
        variants={staggerContainer}
        initial="initial"
        whileInView="whileInView"
      >
        <div className="container mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-4 sm:gap-6 text-center">
            <motion.div
              className="rounded-xl border border-border/50 bg-card/60 p-4"
              variants={fadeInUp}
            >
              <span className="block text-2xl sm:text-3xl font-black text-primary">15+</span>
              <span className="mt-1 block text-xs sm:text-sm text-muted-foreground">Anos de Prática Clínica</span>
            </motion.div>
            <motion.div
              className="rounded-xl border border-border/50 bg-card/60 p-4"
              variants={fadeInUp}
            >
              <span className="block text-2xl sm:text-3xl font-black text-secondary">UFBA</span>
              <span className="mt-1 block text-xs sm:text-sm text-muted-foreground">Formação Médica de Elite</span>
            </motion.div>
            <motion.div
              className="rounded-xl border border-border/50 bg-card/60 p-4"
              variants={fadeInUp}
            >
              <span className="block text-2xl sm:text-3xl font-black text-primary">RQE</span>
              <span className="mt-1 block text-xs sm:text-sm text-muted-foreground">Nº 19791 / 22436</span>
            </motion.div>
            <motion.div
              className="rounded-xl border border-border/50 bg-card/60 p-4"
              variants={fadeInUp}
            >
              <span className="block text-2xl sm:text-3xl font-black text-secondary">Graça</span>
              <span className="mt-1 block text-xs sm:text-sm text-muted-foreground">Consultório em Salvador</span>
            </motion.div>
          </div>
        </div>
      </motion.section>

      {/* Why Choose — matches WordPress "Por que escolher meu atendimento?" */}
      <motion.section
        className="py-16 sm:py-24 bg-gradient-to-b from-background via-muted/20 to-muted/30"
        variants={staggerContainer}
        initial="initial"
        whileInView="whileInView"
      >
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div className="mx-auto max-w-3xl text-center" variants={fadeInUp}>
            <span className="inline-block rounded-full border border-primary/30 bg-primary/10 px-3 py-1 text-xs font-semibold text-primary mb-3">
              Atendimento Humanizado & Alta Tecnologia
            </span>
            <h2 className="text-3xl font-extrabold sm:text-4xl text-foreground">
              Por que escolher meu atendimento?
            </h2>
          </motion.div>

          <div className="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            <motion.div
              className="rounded-2xl border border-border bg-card/60 p-6 transition-all hover:border-primary/50 hover:bg-card"
              variants={fadeInUp}
            >
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/15 text-primary mb-5">
                <CheckCircle2 className="h-6 w-6" />
              </div>
              <h3 className="text-lg font-bold text-foreground mb-2">Tratamentos Minimamente Invasivos</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Tratamentos minimamente invasivos com recuperação rápida
              </p>
            </motion.div>

            <motion.div
              className="rounded-2xl border border-border bg-card/60 p-6 transition-all hover:border-primary/50 hover:bg-card"
              variants={fadeInUp}
            >
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-secondary/15 text-secondary mb-5">
                <HeartPulse className="h-6 w-6" />
              </div>
              <h3 className="text-lg font-bold text-foreground mb-2">Consultas Humanizadas</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Consultas humanizadas com foco no seu bem-estar
              </p>
            </motion.div>

            <motion.div
              className="rounded-2xl border border-border bg-card/60 p-6 transition-all hover:border-primary/50 hover:bg-card"
              variants={fadeInUp}
            >
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/15 text-primary mb-5">
                <Waves className="h-6 w-6" />
              </div>
              <h3 className="text-lg font-bold text-foreground mb-2">Ambiente Confortável</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Ambiente confortável e seguro em Salvador e região metropolitana
              </p>
            </motion.div>

            <motion.div
              className="rounded-2xl border border-border bg-card/60 p-6 transition-all hover:border-primary/50 hover:bg-card"
              variants={fadeInUp}
            >
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-secondary/15 text-secondary mb-5">
                <ShieldCheck className="h-6 w-6" />
              </div>
              <h3 className="text-lg font-bold text-foreground mb-2">Convênios Selecionados</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Atendimento particular e convênios selecionados
              </p>
            </motion.div>
          </div>
        </div>
      </motion.section>

      {/* Symptom Mapping Section — matches WordPress structure */}
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
            {/* Braços e Pernas — matches WP exactly */}
            <motion.div
              className="rounded-3xl border border-primary/30 bg-card/80 p-8 shadow-xl"
              variants={fadeInUp}
            >
              <div className="flex items-center gap-3 mb-6">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/20 text-primary">
                  <Activity className="h-5 w-5" />
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
                  href={`https://wa.me/5571999159975?text=Ol%C3%A1%20Dr.%20Herlon,%20sinto%20dores/incha%C3%B3%20nas%20pernas%20e%20gostaria%20de%20uma%20avalia%C3%A7%C3%A3o.`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-primary/20 border border-primary/40 px-5 py-3 text-sm font-semibold text-primary hover:bg-primary hover:text-primary-foreground transition-all"
                >
                  <MessageCircle className="h-4 w-4" />
                  Agendar Exame das Pernas
                </a>
              </div>
            </motion.div>

            {/* Tronco e Pescoço — matches WP exactly */}
            <motion.div
              className="rounded-3xl border border-secondary/30 bg-card/80 p-8 shadow-xl"
              variants={fadeInUp}
            >
              <div className="flex items-center gap-3 mb-6">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-secondary/20 text-secondary">
                  <HeartPulse className="h-5 w-5" />
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

      {/* Procedimentos Section */}
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
              const Icon = proc.icon;
              return (
                <motion.div
                  key={proc.title}
                  className="group relative flex flex-col justify-between rounded-2xl border border-border bg-card/60 p-6 transition-all duration-300 hover:border-primary/40 hover:bg-card hover:shadow-xl hover:shadow-primary/5"
                  variants={fadeInUp}
                >
                  <div>
                    <div className="flex items-center justify-between gap-3 mb-4">
                      <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary/15 text-primary transition-transform group-hover:scale-105">
                        <Icon className="h-5 w-5" />
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
                      href={`https://wa.me/5571999159975?text=${encodeURIComponent(
                        `Olá Dr. Herlon Moura, gostaria de agendar uma consulta sobre ${proc.title}.`
                      )}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 text-xs font-semibold text-primary hover:text-secondary-foreground transition-colors"
                    >
                      <span>SAIBA MAIS</span>
                      <ArrowRight className="h-3.5 w-3.5" />
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
        <div className="pointer-events-none absolute top-1/2 left-1/2 -z-10 h-[600px] w-[900px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-secondary/10 blur-[130px]" />
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

          {/* Animated DVT Calculator Component */}
          <DVTRiskCalculator />
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
                    className="h-auto w-full rounded-2xl object-cover"
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
                Cirurgião Vascular e Endovascular – CRM/BA 23904 • RQE Nº 19791 / RQE Nº 22436
              </p>
              <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
                Com formação pela Universidade Federal da Bahia (UFBA) e especializações em Cirurgia Vascular e Endovascular, ofereço um atendimento acolhedor, ético e personalizado em Salvador.
              </p>
              <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
                Combinamos a mais alta tecnologia de imagem diagnóstica (Eco-Doppler colorido) e procedimentos minimamente invasivos a laser com a escuta clínica atenta, cuidando do paciente de forma integral.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4 border-t border-border">
                <div className="flex items-center gap-3">
                  <CheckCircle2 className="h-5 w-5 text-primary flex-shrink-0" />
                  <span className="text-sm text-foreground">Membro da SBACV</span>
                </div>
                <div className="flex items-center gap-3">
                  <CheckCircle2 className="h-5 w-5 text-primary flex-shrink-0" />
                  <span className="text-sm text-foreground">Especialista em Cirurgia Endovascular</span>
                </div>
                <div className="flex items-center gap-3">
                  <CheckCircle2 className="h-5 w-5 text-primary flex-shrink-0" />
                  <span className="text-sm text-foreground">Laser e Espuma Densa Ecoguiada</span>
                </div>
                <div className="flex items-center gap-3">
                  <CheckCircle2 className="h-5 w-5 text-primary flex-shrink-0" />
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

      {/* Final CTA — matches WordPress "Vamos agendar sua consulta?" */}
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
