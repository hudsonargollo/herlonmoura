'use client';

import React, { useState, useRef } from 'react';
import Image from 'next/image';
import { motion, useScroll, useTransform } from 'framer-motion';
import {
  Activity,
  Check,
  HeartPulse,
  MessageCircle,
  ArrowRight,
} from 'lucide-react';
import {
  Header,
  Footer,
  DVTModal,
  Hero3D,
  ProcedureCard,
  ScrollProgress,
} from '@/components';

export default function Home() {
  const [isCalculatorModalOpen, setIsCalculatorModalOpen] = useState(false);
  const heroRef = useRef<HTMLElement>(null);

  // Parallax for hero image
  const { scrollYProgress: heroScrollProgress } = useScroll({
    target: heroRef,
    offset: ['start start', 'end start'],
  });
  const heroImageY = useTransform(heroScrollProgress, [0, 1], [0, -30]);
  const heroImageScale = useTransform(heroScrollProgress, [0, 1], [1, 1.05]);

  // === COPY FROM LIVE SITE (herlonmoura.com.br) ===
  const MAIN_HEADLINE = 'Dr. Herlon Moura';
  const MAIN_SUBHEADLINE = 'Angiologista em Salvador';

  const ANGIO_DESCRIPTION =
    'Angiologista é um médico especialista em diagnosticar e tratar doenças que afetam os vasos sanguíneos e o sistema linfático. Ele atua no sistema circulatório de braços, pernas, tronco e pescoço.';

  const WHY_CHOOSE_ITEMS = [
    'Tratamentos minimamente invasivos com recuperação rápida',
    'Consultas humanizadas com foco no seu bem-estar',
    'Ambiente confortável e seguro em Salvador e região metropolitana',
    'Atendimento particular e convênios selecionados',
  ];

  const PROCEDURES = [
    {
      title: 'Doppler vascular',
      description:
        'O Doppler vascular é um exame de ultrassom que analisa o fluxo sanguíneo em artérias e veias. É indolor, não invasivo e pode ser realizado em diversas partes do corpo.',
      tag: 'DiagNóstico',
    },
    {
      title: 'Tratamento de varizes com laser',
      description:
        'É um procedimento minimamente invasivo que utiliza a energia do laser para destruir as veias doentes.',
      tag: 'Laser',
    },
    {
      title: 'Escleroterapia com espuma densa',
      description:
        'Tratamento para varizes e pequenos vasinhos que consiste na injeção de uma espuma na veia. O procedimento é minimamente invasivo e pode ser realizado em consultório.',
      tag: 'Espuma',
    },
    {
      title: 'Microcirurgia de varizes',
      description:
        'Procedimento que remove varizes pequenas e médias por meio de pequenas incisões. É um procedimento minimamente invasivo que pode ser realizado no consultório. É também conhecida como flebectomia ambulatória.',
      tag: 'Cirúrgico',
    },
    {
      title: 'Implante de Cateter para Quimioterapia (Port-o-Cath)',
      description:
        'O cateter Port-a-Cath é um dispositivo totalmente implantável que facilita a aplicação de quimioterapia e outros tratamentos.',
      tag: 'Oncológico',
    },
    {
      title: 'Implante de Cateter para Hemodialise (Permath)',
      description:
        'É um procedimento cirúrgico que permite o acesso vascular para hemodiálise por um período prolongado.',
      tag: 'Vascular',
    },
  ];

  const DOCTOR_NAME = 'Dr. Herlon Moura dos Santos';
  const DOCTOR_ROLE = 'Cirurgião Vascular e Endovascular – CRM/BA 23904';
  const DOCTOR_RQE = 'RQE Nº 19791 / RQE Nº 22436';
  const DOCTOR_BIO =
    'Com formação pela Universidade Federal da Bahia (UFBA) e especializações em Cirurgia Vascular e Endovascular, ofereço um atendimento acolhedor e personalizado, combinando tecnologia de ponta e experiência clínica para tratar doenças como varizes, tromboses, aneurismas e obstruções arteriais.';

  const WHATSAPP_URL =
    'https://wa.me/5571999159975?text=Ol%C3%A1%2C%20estou%20entrando%20em%20contato%20atrav%C3%A9s%20do%20site%20Dr.%20Herlon%20Moura.';

  const fadeInUp = {
    initial: { opacity: 0, y: 30 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true, margin: '-50px' },
    transition: { duration: 0.7, ease: [0.21, 0.45, 0.35, 1] },
  };

  const fadeInScale = {
    initial: { opacity: 0, scale: 0.9 },
    whileInView: { opacity: 1, scale: 1 },
    viewport: { once: true, margin: '-50px' },
    transition: { duration: 0.6, ease: [0.21, 0.45, 0.35, 1] },
  };

  const staggerContainer = {
    initial: { opacity: 0 },
    whileInView: {
      opacity: 1,
      transition: {
        staggerChildren: 0.12,
        delayChildren: 0.15,
      },
    },
    viewport: { once: true, margin: '-50px' },
  };

  const floating = {
    animate: {
      y: [-5, 5, -5],
      transition: {
        duration: 4,
        repeat: Infinity,
        repeatType: 'reverse' as const,
        ease: 'easeInOut',
      },
    },
  };

  return (
    <main className="min-h-screen bg-background text-foreground overflow-x-hidden">
      <ScrollProgress />
      <Header onOpenCalculator={() => setIsCalculatorModalOpen(true)} />

      {/* Hero Section - matches live site with 3D enhancement */}
      <section
        ref={heroRef}
        className="relative overflow-hidden bg-gradient-to-b from-white via-gray-50 to-sky-50"
      >
        {/* Animated background gradient overlay */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <motion.div
            className="absolute -top-40 -left-40 h-[500px] w-[500px] rounded-full bg-sky-200/30 blur-[100px]"
            animate={{
              scale: [1, 1.1, 1],
              opacity: [0.3, 0.4, 0.3],
            }}
            transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
          />
          <motion.div
            className="absolute -bottom-40 -right-40 h-[400px] w-[400px] rounded-full bg-navy-100/20 blur-[100px]"
            animate={{
              scale: [1, 1.15, 1],
              opacity: [0.2, 0.3, 0.2],
            }}
            transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut', delay: 1 }}
          />
        </div>

        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid items-center gap-12 lg:grid-cols-12 lg:gap-8 py-12 lg:py-20">
            {/* Left Column: Hero Content */}
            <motion.div
              className="lg:col-span-7"
              initial={{ opacity: 0, x: -40 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, ease: [0.21, 0.45, 0.35, 1] }}
            >
              {/* Brand Logo */}
              <motion.div
                className="mb-8"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.1 }}
              >
                <img
                  src="https://herlonmoura.com.br/wp-content/uploads/2025/04/Marca_Dr._Herlon_Moura_page-0008-removebg-preview.png"
                  alt="Dr. Herlon Moura - Marca"
                  className="h-12 w-auto"
                />
              </motion.div>

              {/* Headline */}
              <motion.h1
                className="text-display-md sm:text-display-lg font-heading font-bold text-primary leading-tight mb-2"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, delay: 0.2 }}
              >
                {MAIN_HEADLINE}
              </motion.h1>
              <motion.p
                className="text-2xl sm:text-3xl font-heading font-bold text-primary mb-8"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, delay: 0.3 }}
              >
                {MAIN_SUBHEADLINE}
              </motion.p>

              {/* CTA Buttons */}
              <motion.div
                className="flex flex-wrap gap-4 mb-8"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, delay: 0.4 }}
              >
                <motion.a
                  href="https://wa.me/5571999159975?source=google_ads"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2.5 rounded bg-tertiary px-6 py-3.5 text-sm text-tertiary-foreground shadow-lg hover:bg-tertiary-hover transition-all"
                  whileHover={{ scale: 1.03, y: -2 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <MessageCircle className="h-4 w-4" />
                  <span>Chame no whatsapp</span>
                </motion.a>
                <motion.a
                  href="https://wa.me/5571999159975"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 rounded border border-primary/30 bg-transparent px-6 py-3.5 text-sm text-primary hover:bg-primary hover:text-primary-foreground transition-all"
                  whileHover={{ scale: 1.03, y: -2 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <span>Agendar uma consulta</span>
                </motion.a>
              </motion.div>

              {/* Phone */}
              <motion.p
                className="text-lg font-semibold text-primary"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, delay: 0.5 }}
              >
                (71) 99915-9975
              </motion.p>
            </motion.div>

            {/* Right Column: 3D Hero */}
            <div className="lg:col-span-5">
              <Hero3D />
            </div>
          </div>
        </div>
      </section>

      {/* Angiologista Description Section - matches live site */}
      <motion.section
        className="py-16 sm:py-20 bg-background"
        variants={staggerContainer}
        initial="initial"
        whileInView="whileInView"
      >
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div className="mx-auto max-w-3xl text-center" variants={fadeInUp}>
            <p className="text-lg text-muted-foreground leading-relaxed">
              {ANGIO_DESCRIPTION}
            </p>
          </motion.div>

          {/* Why Choose */}
          <motion.div className="mx-auto max-w-2xl mt-12" variants={fadeInUp}>
            <h2 className="text-2xl sm:text-3xl font-heading font-bold text-primary text-center mb-8">
              Por que escolher meu atendimento?
            </h2>
            <ul className="space-y-4">
              {WHY_CHOOSE_ITEMS.map((item) => (
                <motion.li
                  key={item}
                  className="flex items-start gap-3 text-base text-foreground"
                  whileHover={{ x: 5 }}
                  transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                >
                  <Check className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                  <span>{item}</span>
                </motion.li>
              ))}
            </ul>
          </motion.div>
        </div>
      </motion.section>

      {/* Procedures Section - matches live site (sky blue background) */}
      <motion.section
        id="procedimentos"
        className="py-16 sm:py-24 bg-secondary"
        variants={staggerContainer}
        initial="initial"
        whileInView="whileInView"
      >
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div className="mx-auto max-w-3xl text-center mb-12" variants={fadeInUp}>
            <h2 className="text-3xl sm:text-4xl font-heading font-bold text-white mb-4">
              Angiologista em Salvador?
            </h2>
            <p className="text-lg text-white/90 mb-6">
              Conte comigo! Entre em contato e agende sua consulta!
            </p>
            <a
              href={WHATSAPP_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded bg-tertiary px-6 py-3 text-sm text-tertiary-foreground hover:bg-tertiary-hover transition-all"
            >
              Fale no whatsapp
            </a>
          </motion.div>

          <motion.div variants={fadeInUp} className="text-center mb-12">
            <h3 className="text-2xl font-heading font-bold text-white mb-2">
              Atendimento Humanizado
            </h3>
            <p className="text-white/80 mb-4">
              Nosso foco é o melhor atendimento pensando em seu bem estar. Veja alguns de nossos serviços.
            </p>
            <a
              href="#procedimentos-lista"
              className="inline-flex items-center gap-2 rounded border border-white/50 px-6 py-3 text-sm text-white hover:bg-white hover:text-primary transition-all"
            >
              Ver todos os procedimentos
              <ArrowRight className="h-4 w-4" />
            </a>
          </motion.div>

          {/* Procedure Cards with 3D tilt */}
          <div id="procedimentos-lista" className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {PROCEDURES.map((proc, idx) => {
              const procWhatsApp = `https://wa.me/5571999159975?text=${encodeURIComponent(
                `Olá Dr. Herlon Moura, gostaria de saber mais sobre ${proc.title}.`
              )}`;
              return (
                <motion.div
                  key={proc.title}
                  variants={fadeInScale}
                  transition={{ delay: idx * 0.1 }}
                >
                  <ProcedureCard
                    title={proc.title}
                    description={proc.description}
                    tag={proc.tag}
                    href={procWhatsApp}
                  />
                </motion.div>
              );
            })}
          </div>
        </div>
      </motion.section>

      {/* Doctor Bio Section - matches live site */}
      <motion.section
        id="sobre"
        className="py-20 sm:py-24 bg-background"
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
                style={{ y: heroImageY, scale: heroImageScale }}
              >
                <Image
                  src="/images/dr-herlon-moura.png"
                  alt="Dr. Herlon Moura dos Santos"
                  width={380}
                  height={520}
                  className="h-auto w-full object-cover object-top rounded-lg shadow-2xl"
                  priority
                />
              </motion.div>
            </div>

            <motion.div
              className="lg:col-span-7 space-y-6"
              variants={fadeInUp}
            >
              <h2 className="text-2xl sm:text-3xl font-heading font-bold text-primary">
                {DOCTOR_NAME}
              </h2>
              <p className="text-base font-medium text-primary">{DOCTOR_ROLE}</p>
              <p className="text-sm text-muted-foreground font-medium">{DOCTOR_RQE}</p>
              <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
                {DOCTOR_BIO}
              </p>

              <div className="pt-4">
                <motion.a
                  href={WHATSAPP_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 rounded bg-primary px-6 py-3.5 text-sm text-primary-foreground shadow-lg hover:bg-primary-hover transition-all"
                  whileHover={{ scale: 1.03, y: -2 }}
                  whileTap={{ scale: 0.98 }}
                >
                  SAIBA MAIS
                  <ArrowRight className="h-4 w-4" />
                </motion.a>
              </div>
            </motion.div>
          </div>
        </div>
      </motion.section>

      {/* DVT Risk Calculator Section */}
      <motion.section
        id="calculadora-tvp"
        className="py-20 sm:py-28 bg-gradient-to-b from-muted/30 via-background to-muted/30"
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
            <h2 className="text-3xl font-heading font-bold sm:text-4xl text-primary">
              Calculadora de Risco de Trombose (TVP)
            </h2>
            <p className="mt-4 text-base text-muted-foreground">
              Responda às 4 etapas e receba instantaneamente a pontuação do seu risco tromboembólico, com orientações clínicas do Dr. Herlon Moura.
            </p>
            <div className="mt-4">
              <motion.button
                type="button"
                onClick={() => setIsCalculatorModalOpen(true)}
                className="inline-flex items-center gap-2 rounded bg-primary px-6 py-3 text-sm text-primary-foreground hover:bg-primary-hover transition-all shadow-sm"
                whileHover={{ scale: 1.03, y: -2 }}
                whileTap={{ scale: 0.98 }}
              >
                <HeartPulse className="h-4 w-4" />
                <span>Abrir Calculadora</span>
              </motion.button>
            </div>
          </motion.div>
        </div>
      </motion.section>

      {/* Final CTA Section - matches live site footer */}
      <motion.section
        id="contato"
        className="py-16 sm:py-20"
        style={{ backgroundColor: 'rgba(104, 169, 242, 0.19)' }}
        variants={staggerContainer}
        initial="initial"
        whileInView="whileInView"
      >
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div className="mx-auto max-w-3xl text-center" variants={fadeInUp}>
            <h2 className="text-2xl sm:text-3xl font-heading font-bold text-primary mb-3">
              Vamos agendar sua consulta?
            </h2>
            <p className="text-lg text-primary/80 mb-6">
              Fale conosco e agenda já!
            </p>
            <a
              href={WHATSAPP_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2.5 rounded bg-primary px-7 py-4 text-base text-primary-foreground shadow-xl hover:bg-primary-hover transition-all"
            >
              <MessageCircle className="h-5 w-5" />
              <motion.span
                className="hidden sm:inline"
                variants={floating}
                animate="animate"
              >
                Fale conosco e agenda já!
              </motion.span>
              <span className="sm:hidden">WhatsApp</span>
            </a>

            <div className="mt-8">
              <img
                src="https://herlonmoura.com.br/wp-content/uploads/2025/04/Marca_Dr._Herlon_Moura_page-0008-removebg-preview.png"
                alt="Dr. Herlon Moura"
                className="h-10 w-auto mx-auto mb-6"
              />
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-6 text-sm text-primary/70">
              <span>📍 R. Eng. Célso Tôrres, 654 - Graça, Salvador - BA</span>
              <span>📞 (71) 98344-9737 / (71) 99915-9975</span>
            </div>
          </motion.div>
        </div>
      </motion.section>

      <Footer />

      {/* Quick Floating Test Trigger Button */}
      <motion.aside
        className="fixed bottom-5 right-5 z-30 hidden sm:block"
        aria-label="Acesso rápido ao teste de risco"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.5, ease: 'easeOut' }}
      >
        <motion.button
          type="button"
          onClick={() => setIsCalculatorModalOpen(true)}
          className="group flex items-center gap-2.5 rounded-full bg-card/90 border border-primary/50 px-4 py-2.5 text-xs font-bold text-foreground shadow-2xl backdrop-blur-xl transition-all hover:bg-primary hover:text-primary-foreground hover:shadow-primary/30 active:scale-95"
          aria-label="Abrir teste rápido de TVP"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <span className="flex h-6 w-6 items-center justify-center rounded-full bg-primary/20 text-primary group-hover:bg-muted/90 group-hover:text-primary">
            <HeartPulse className="h-3.5 w-3.5" />
          </span>
          <span>Teste de Risco TVP</span>
        </motion.button>
      </motion.aside>

      {/* DVT Modal */}
      <DVTModal
        isOpen={isCalculatorModalOpen}
        onClose={() => setIsCalculatorModalOpen(false)}
      />
    </main>
  );
}
