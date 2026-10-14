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
  ContactModal,
} from '@/components';
import { SCHEDULER_URL } from '@/lib/contact';
import {
  Activity,
  Calendar,
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
} from 'lucide-react';

/* ============================================
   Design System v2.0 — HealthNet × Dr. Herlon Moura
   Home page. Typography is driven by the v2.0 token system:
   Inter for body copy, Montserrat for headings (see the element-level
   rules in app/globals.css and the .font-heading utility).
   Colours use the v2.0 semantic + component tokens rather than
   ad-hoc utilities.
   ============================================ */

// v2.0 semantic colour tokens, applied as inline custom properties.
const TOKEN = {
  heading: 'var(--s-color-content-heading)',
  body: 'var(--s-color-content-body)',
  muted: 'var(--s-color-content-muted)',
  inverse: 'var(--s-color-content-inverse)',
  actionPrimary: 'var(--s-color-action-primary)',
  actionHover: 'var(--s-color-action-hover)',
  actionGold: 'var(--s-color-action-gold)',
  cardBg: 'var(--c-card-bg)',
  cardBorder: 'var(--c-card-border)',
  cardShadow: 'var(--c-card-shadow)',
  canvas: 'var(--s-color-bg-canvas)',
  surface: 'var(--s-color-bg-surface)',
  border: 'var(--border-subtle)',
} as const;

const headingStyle: React.CSSProperties = {
  fontFamily: 'var(--font-montserrat), var(--font-inter), system-ui, sans-serif',
  color: TOKEN.heading,
};

const bodyStyle: React.CSSProperties = {
  color: TOKEN.body,
};

const mutedStyle: React.CSSProperties = {
  color: TOKEN.muted,
};

const cardStyle: React.CSSProperties = {
  backgroundColor: TOKEN.cardBg,
  border: `1px solid ${TOKEN.cardBorder}`,
  borderRadius: 'var(--c-card-radius)',
  boxShadow: TOKEN.cardShadow,
};

const primaryButtonStyle: React.CSSProperties = {
  backgroundColor: 'var(--c-button-primary-bg)',
  color: 'var(--c-button-primary-text)',
  borderRadius: 'var(--c-button-radius)',
  fontWeight: 600,
};

const goldButtonStyle: React.CSSProperties = {
  backgroundColor: 'var(--c-button-gold-bg)',
  color: 'var(--c-button-gold-text)',
  borderRadius: 'var(--c-button-radius)',
  fontWeight: 600,
};

/** Small uppercase eyebrow label used above section headings. */
function Eyebrow({ children }: { children: React.ReactNode }) {
  return (
    <span
      className="inline-block rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-wider"
      style={{
        fontFamily: 'var(--font-montserrat), system-ui, sans-serif',
        backgroundColor: 'var(--s-color-bg-brand)',
        color: 'var(--s-color-content-inverse)',
      }}
    >
      {children}
    </span>
  );
}

/** v2.0 pill badge (outlined, brand-tinted). */
function Badge({ children, icon }: { children: React.ReactNode; icon?: React.ReactNode }) {
  return (
    <span
      className="inline-flex items-center gap-2 rounded-full border px-3.5 py-1.5 text-xs font-semibold"
      style={{
        borderColor: TOKEN.cardBorder,
        backgroundColor: TOKEN.surface,
        color: TOKEN.heading,
      }}
    >
      {icon}
      <span>{children}</span>
    </span>
  );
}

export default function Home() {
  const [isCalculatorModalOpen, setIsCalculatorModalOpen] = useState(false);
  const [contactContext, setContactContext] = useState<string | null>(null);
  const openContact = (ctx: string) => setContactContext(ctx);

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
        'É um procedimento minimamente invasivo que utiliza a energia do laser para destruir as veias doentes.',
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
        'Procedimento que remove varizes pequenas e médias por meio de pequenas incisões. É um procedimento minimamente invasivo que pode ser realizado no consultório. É também conhecida como flebectomia ambulatória.',
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

  const LEG_SYMPTOMS = [
    'Dor e/ou inchaço constante nos braços e pernas',
    'Formigamento e/ou dormência nas mãos ou nos pés',
    'Sensação de peso nas pernas',
    'Cãibras recorrentes',
    'Cansaço sem motivo aparente',
    'Dificuldade para caminhar',
    'Aparecimento de veias azuladas ou arroxeadas',
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

  return (
    <main className="min-h-screen overflow-x-hidden" style={{ backgroundColor: TOKEN.canvas, color: TOKEN.body }}>
      <Header onOpenCalculator={() => setIsCalculatorModalOpen(true)} />

      {/* Hero Section with Doctor Photo & Real Branding */}
      <HeroSection
        headline="Dr. Herlon Moura — Angiologista e Cirurgião Vascular em Salvador"
        subheadline="Angiologista é um médico especialista em diagnosticar e tratar doenças que afetam os vasos sanguíneos e o sistema linfático. Ele atua no sistema circulatório de braços, pernas, tronco e pescoço."
        onOpenCalculator={() => setIsCalculatorModalOpen(true)}
        onBook={() => openContact('Agendar consulta')}
      />

      {/* Trust & Credibility Ticker Bar */}
      <section className="border-y py-6" style={{ borderColor: TOKEN.border, backgroundColor: TOKEN.surface }}>
        <div className="mx-auto w-full max-w-container px-4 sm:px-6">
          <div className="grid grid-cols-2 gap-4 text-center sm:grid-cols-4 sm:gap-6">
            {[
              { value: '15+', label: 'Anos de Prática Clínica' },
              { value: 'UFBA', label: 'Formação Médica de Elite' },
              { value: 'RQE', label: 'Nº 19791 / 22436' },
              { value: 'Graça', label: 'Consultório em Salvador' },
            ].map((stat) => (
              <div key={stat.label} style={{ ...cardStyle, padding: '1rem' }}>
                <span
                  className="block text-2xl sm:text-3xl"
                  style={{ ...headingStyle, fontWeight: 700, color: TOKEN.actionPrimary }}
                >
                  {stat.value}
                </span>
                <span className="mt-1 block text-xs sm:text-sm" style={mutedStyle}>
                  {stat.label}
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Why Choose — matches WordPress "Por que escolher meu atendimento?" */}
      <section className="py-16 sm:py-24" style={{ backgroundColor: TOKEN.canvas }}>
        <div className="mx-auto w-full max-w-container px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-3xl text-center">
            <Eyebrow>Atendimento Humanizado &amp; Alta Tecnologia</Eyebrow>
            <h2 className="mt-3 text-display-md" style={headingStyle}>
              Por que escolher meu atendimento?
            </h2>
          </div>

          <div className="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {[
              {
                icon: CheckCircle2,
                title: 'Tratamentos Minimamente Invasivos',
                desc: 'Tratamentos minimamente invasivos com recuperação rápida',
              },
              {
                icon: HeartPulse,
                title: 'Consultas Humanizadas',
                desc: 'Consultas humanizadas com foco no seu bem-estar',
              },
              {
                icon: Waves,
                title: 'Ambiente Confortável',
                desc: 'Ambiente confortável e seguro em Salvador e região metropolitana',
              },
              {
                icon: ShieldCheck,
                title: 'Convênios Selecionados',
                desc: 'Atendimento particular e convênios selecionados',
              },
            ].map((item) => {
              const Icon = item.icon;
              return (
                <div key={item.title} style={{ ...cardStyle, padding: '1.5rem' }}>
                  <div
                    className="mb-5 flex h-12 w-12 items-center justify-center rounded-xl"
                    style={{
                      backgroundColor: 'var(--g-color-accent)',
                      color: 'var(--g-color-base-primary)',
                    }}
                  >
                    <Icon className="h-6 w-6" />
                  </div>
                  <h3 className="mb-2 text-heading-3" style={headingStyle}>
                    {item.title}
                  </h3>
                  <p className="text-body-small leading-relaxed" style={bodyStyle}>
                    {item.desc}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Procedures Section */}
      <section id="procedimentos" className="relative overflow-hidden py-16 sm:py-24" style={{ backgroundColor: TOKEN.surface }}>
        {/* Anatomical circulatory-system accent (BR variant), right side, faded */}
        <Image
          src="/images/brand/banner-segundasecao.jpg"
          alt=""
          fill
          aria-hidden
          sizes="100vw"
          className="object-cover object-left"
          style={{ opacity: 0.07 }}
        />
        <div className="relative mx-auto w-full max-w-container px-4 sm:px-6 lg:px-8">
          <div className="mb-12 flex flex-col justify-between gap-6 md:flex-row md:items-end">
            <div>
              <Eyebrow>Especialidades Cirúrgicas</Eyebrow>
              <h2 className="mt-2 text-display-md" style={headingStyle}>
                Procedimentos e Tratamentos Especializados
              </h2>
              <p className="mt-3 max-w-2xl text-body-lg" style={bodyStyle}>
                Soluções vasculares modernas para eliminação de varizes, alívio de sintomas circulatórios e procedimentos de alta precisão.
              </p>
            </div>
            <button
              type="button"
              onClick={() => openContact('Dúvidas sobre procedimentos')}
              className="inline-flex flex-shrink-0 items-center gap-2 px-5 py-3 text-body-small"
              style={primaryButtonStyle}
            >
              <MessageCircle className="h-4 w-4" />
              Tirar Dúvidas no WhatsApp
            </button>
          </div>

          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {PROCEDURES.map((proc) => {
              const Icon = proc.icon;
              return (
                <div
                  key={proc.title}
                  className="group flex flex-col justify-between"
                  style={{ ...cardStyle, padding: '1.5rem' }}
                >
                  <div>
                    <div className="mb-4 flex items-center justify-between gap-3">
                      <div
                        className="flex h-11 w-11 items-center justify-center rounded-xl"
                        style={{
                          backgroundColor: 'var(--s-color-bg-accent)',
                          color: 'var(--g-color-base-primary)',
                        }}
                      >
                        <Icon className="h-5 w-5" />
                      </div>
                      <span
                        className="rounded-full border px-2.5 py-1 text-[11px] font-semibold"
                        style={{ borderColor: TOKEN.cardBorder, color: TOKEN.muted }}
                      >
                        {proc.tag}
                      </span>
                    </div>
                    <h3 className="text-heading-3" style={headingStyle}>
                      {proc.title}
                    </h3>
                    <div className="mt-1 text-caption" style={mutedStyle}>
                      {proc.subtitle}
                    </div>
                    <p className="mt-3 text-body-small leading-relaxed" style={bodyStyle}>
                      {proc.description}
                    </p>
                  </div>

                  <div className="mt-6 border-t pt-4" style={{ borderColor: TOKEN.cardBorder }}>
                    <button
                      type="button"
                      onClick={() => openContact(`Interesse em: ${proc.title}`)}
                      className="inline-flex items-center gap-1.5 text-caption font-semibold"
                      style={{ color: TOKEN.actionPrimary }}
                    >
                      <span>Consultar disponibilidade</span>
                      <ArrowRight className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Symptom Mapping Section — matches WordPress structure */}
      <section id="sintomas" className="py-16 sm:py-24" style={{ backgroundColor: TOKEN.canvas }}>
        <div className="mx-auto w-full max-w-container px-4 sm:px-6 lg:px-8">
          <div className="mx-auto mb-16 max-w-3xl text-center">
            <Eyebrow>Identificação de Sinais</Eyebrow>
            <h2 className="mt-2 text-display-md" style={headingStyle}>
              Você apresenta algum destes sintomas circulatórios?
            </h2>
            <p className="mt-3 text-body-lg" style={bodyStyle}>
              O diagnóstico vascular precoce previne complicações graves como úlceras de perna, trombose e insuficiência venosa crônica.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
            {/* Braços e Pernas — matches WP exactly */}
            <div style={{ ...cardStyle, padding: '2rem' }}>
              <div className="mb-6 flex items-center gap-3">
                <div
                  className="flex h-10 w-10 items-center justify-center rounded-xl"
                  style={{
                    backgroundColor: 'var(--s-color-bg-accent)',
                    color: 'var(--g-color-base-primary)',
                  }}
                >
                  <Activity className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="text-heading-3" style={headingStyle}>
                    Braços e Pernas
                  </h3>
                  <p className="text-caption" style={mutedStyle}>
                    Sintomas em membros superiores e inferiores
                  </p>
                </div>
              </div>

              <p className="mb-4 text-body-small font-semibold" style={{ color: TOKEN.actionPrimary }}>
                Se você tem algum dos sintomas abaixo, podemos te ajudar.
              </p>

              <ul className="space-y-3">
                {LEG_SYMPTOMS.map((symp) => (
                  <li key={symp} className="flex items-start gap-3 text-body-small" style={bodyStyle}>
                    <span
                      className="mt-0.5 flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full text-xs"
                      style={{
                        backgroundColor: 'var(--s-color-bg-accent)',
                        color: 'var(--g-color-base-primary)',
                      }}
                    >
                      ✓
                    </span>
                    <span>{symp}</span>
                  </li>
                ))}
              </ul>

              <div className="mt-8 border-t pt-6" style={{ borderColor: TOKEN.cardBorder }}>
                <button
                  type="button"
                  onClick={() => openContact('Avaliação: sintomas em braços e pernas')}
                  className="inline-flex w-full items-center justify-center gap-2 px-5 py-3 text-body-small"
                  style={primaryButtonStyle}
                >
                  <MessageCircle className="h-4 w-4" />
                  Agendar Exame das Pernas
                </button>
              </div>
            </div>

            {/* Tronco e Pescoço — matches WP exactly */}
            <div style={{ ...cardStyle, padding: '2rem' }}>
              <div className="mb-6 flex items-center gap-3">
                <div
                  className="flex h-10 w-10 items-center justify-center rounded-xl"
                  style={{
                    backgroundColor: 'var(--s-color-bg-brand)',
                    color: 'var(--s-color-content-inverse)',
                  }}
                >
                  <HeartPulse className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="text-heading-3" style={headingStyle}>
                    Tronco e Pescoço
                  </h3>
                  <p className="text-caption" style={mutedStyle}>
                    Sintomas vasculares centrais
                  </p>
                </div>
              </div>

              <p className="mb-4 text-body-small font-semibold" style={{ color: TOKEN.actionPrimary }}>
                Possíveis sintomas para procurar um angiologista:
              </p>

              <ul className="space-y-3">
                {NECK_SYMPTOMS.map((symp) => (
                  <li key={symp} className="flex items-start gap-3 text-body-small" style={bodyStyle}>
                    <span
                      className="mt-0.5 flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full text-xs"
                      style={{
                        backgroundColor: 'var(--s-color-bg-brand)',
                        color: 'var(--s-color-content-inverse)',
                      }}
                    >
                      ✓
                    </span>
                    <span>{symp}</span>
                  </li>
                ))}
              </ul>

              <div className="mt-8 border-t pt-6" style={{ borderColor: TOKEN.cardBorder }}>
                <button
                  type="button"
                  onClick={() => openContact('Avaliação: sintomas em tronco e pescoço')}
                  className="inline-flex w-full items-center justify-center gap-2 px-5 py-3 text-body-small"
                  style={goldButtonStyle}
                >
                  <MessageCircle className="h-4 w-4" />
                  FALE CONOSCO
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Mid-page banner: real consultório / ultrasound photo (BR variant) */}
      <section className="relative h-[280px] overflow-hidden sm:h-[360px]">
        <Image
          src="/images/brand/banner-meiohome.jpg"
          alt="Dr. Herlon Moura realizando exame de Eco-Doppler no consultório"
          fill
          sizes="100vw"
          className="object-cover object-center"
        />
        <div
          className="absolute inset-0"
          style={{
            background:
              'linear-gradient(to right, var(--g-color-base-primary) 0%, rgba(10,37,64,0.55) 45%, rgba(10,37,64,0) 100%)',
          }}
        />
        <div className="relative mx-auto flex h-full w-full max-w-container items-center px-4 sm:px-6 lg:px-8">
          <div className="max-w-md" style={{ color: 'var(--s-color-content-inverse)' }}>
            <Badge>Diagnóstico de Precisão</Badge>
            <h2 className="mt-3 text-heading-1" style={{ ...headingStyle, color: 'var(--s-color-content-inverse)' }}>
              Eco-Doppler colorido no próprio consultório
            </h2>
            <p className="mt-3 text-body-small sm:text-body-regular" style={{ color: 'var(--s-color-content-inverse)' }}>
              Tecnologia de imagem para avaliar artérias e veias com precisão, sem filas e com explicação clara de cada resultado.
            </p>
          </div>
        </div>
      </section>

      {/* Interactive DVT Risk Calculator Anchor Section */}
      <section id="calculadora-tvp" className="relative overflow-hidden py-20 sm:py-28" style={{ backgroundColor: TOKEN.surface }}>
        <div className="mx-auto w-full max-w-container px-4 sm:px-6 lg:px-8">
          <div className="mx-auto mb-10 max-w-3xl text-center">
            <div className="mb-3 inline-flex items-center justify-center">
              <Badge icon={<Activity className="h-4 w-4" />}>Triagem Vascular Rápida</Badge>
            </div>
            <h2 className="text-display-md" style={headingStyle}>
              Calculadora de Risco de Trombose (TVP)
            </h2>
            <p className="mt-4 text-body-lg" style={bodyStyle}>
              Responda às 4 etapas e receba instantaneamente a pontuação do seu risco tromboembólico, com orientações clínicas do Dr. Herlon Moura.
            </p>
            <div className="mt-4">
              <button
                type="button"
                onClick={() => setIsCalculatorModalOpen(true)}
                className="inline-flex items-center gap-2 border px-4 py-2 text-caption font-bold"
                style={{ ...primaryButtonStyle, fontWeight: 700 }}
              >
                <HeartPulse className="h-4 w-4" />
                <span>Abrir em Modo Janela Flutuante</span>
              </button>
            </div>
          </div>

          {/* Animated DVT Calculator Component */}
          <DVTRiskCalculator />
        </div>
      </section>

      {/* Doctor Bio & Credentials Section */}
      <section id="sobre" className="border-t py-20 sm:py-24" style={{ borderColor: TOKEN.border, backgroundColor: TOKEN.canvas }}>
        <div className="mx-auto w-full max-w-container px-4 sm:px-6 lg:px-8">
          <div className="grid items-center gap-12 lg:grid-cols-12">
            <div className="flex justify-center lg:col-span-5">
              <div className="relative w-full max-w-[380px]">
                <div className="absolute inset-0 rounded-3xl" style={{ backgroundColor: 'var(--g-color-accent)', opacity: 0.2, filter: 'blur(2rem)' }} />
                <div className="relative z-10 overflow-hidden rounded-3xl" style={{ ...cardStyle, boxShadow: TOKEN.cardShadow }}>
                  <Image
                    src="/images/brand/dr-photoroom.png"
                    alt="Dr. Herlon Moura dos Santos"
                    width={380}
                    height={520}
                    className="h-auto w-full object-cover"
                  />
                </div>
              </div>
            </div>

            <div className="space-y-6 lg:col-span-7">
              <div className="inline-flex items-center">
                <Badge icon={<Award className="h-4 w-4" />}>Formação de Excelência</Badge>
              </div>
              <h2 className="text-display-md" style={headingStyle}>
                Dr. Herlon Moura dos Santos
              </h2>
              <p className="text-body-regular font-medium" style={{ color: TOKEN.actionPrimary }}>
                Cirurgião Vascular e Endovascular – CRM/BA 23904 • RQE Nº 19791 / RQE Nº 22436
              </p>
              <p className="text-body-small leading-relaxed sm:text-body-regular" style={bodyStyle}>
                Com graduação médica pela conceituada <strong>Universidade Federal da Bahia (UFBA)</strong> e especializações em Cirurgia Vascular e Endovascular, ofereço um atendimento acolhedor, ético e personalizado em Salvador.
              </p>
              <p className="text-body-small leading-relaxed sm:text-body-regular" style={bodyStyle}>
                Combinamos a mais alta tecnologia de imagem diagnóstica (Eco-Doppler colorido) e procedimentos minimamente invasivos a laser com a escuta clínica atenta, cuidando do paciente de forma integral.
              </p>

              <div className="grid grid-cols-1 gap-4 border-t pt-4 sm:grid-cols-2" style={{ borderColor: TOKEN.border }}>
                {[
                  'Membro da SBACV',
                  'Especialista em Cirurgia Endovascular',
                  'Laser e Espuma Densa Ecoguiada',
                  'Acessos para Quimioterapia e Hemodiálise',
                ].map((item) => (
                  <div key={item} className="flex items-center gap-3">
                    <CheckCircle2 className="h-5 w-5 flex-shrink-0" style={{ color: TOKEN.actionPrimary }} />
                    <span className="text-body-small" style={bodyStyle}>
                      {item}
                    </span>
                  </div>
                ))}
              </div>

              <div className="pt-4">
                <button
                  type="button"
                  onClick={() => openContact('Agendar consulta')}
                  className="inline-flex items-center gap-2 px-6 py-3.5 text-body-small"
                  style={{ ...primaryButtonStyle, fontWeight: 700 }}
                >
                  <MessageCircle className="h-5 w-5" />
                  <span>Agendar Consulta com Dr. Herlon</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA — matches WordPress "Vamos agendar sua consulta?" */}
      <section id="contato" className="border-t py-20 sm:py-28" style={{ borderColor: TOKEN.border, backgroundColor: TOKEN.surface }}>
        <div className="mx-auto w-full max-w-container px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-3xl text-center">
            <Eyebrow>Agendamento Facilitado</Eyebrow>
            <h2 className="mb-4 mt-3 text-display-md" style={headingStyle}>
              Vamos agendar sua consulta?
            </h2>
            <p className="mb-6 text-body-lg" style={bodyStyle}>
              Fale conosco e agenda já!
            </p>
            <p className="mb-8 text-body-small" style={mutedStyle}>
              Nosso foco é o melhor atendimento pensando em seu bem estar. Atendimento humanizado com muito amor.
            </p>
            <div className="mb-6 flex flex-col items-center justify-center gap-4 sm:flex-row">
              <button
                type="button"
                onClick={() => openContact('Agendar consulta')}
                className="inline-flex items-center justify-center gap-2.5 px-7 py-4 text-body-regular"
                style={{ ...primaryButtonStyle, fontWeight: 700 }}
              >
                <MessageCircle className="h-5 w-5" />
                <span>Agendar pelo WhatsApp</span>
              </button>
              <a
                href={SCHEDULER_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 border px-6 py-3.5 text-body-small"
                style={{ ...primaryButtonStyle, backgroundColor: 'transparent', color: TOKEN.actionPrimary, borderColor: TOKEN.actionPrimary }}
              >
                <Calendar className="h-4 w-4" />
                Agendar no Calendário
              </a>
            </div>
            <div className="flex flex-col items-center justify-center gap-6 text-body-small sm:flex-row" style={mutedStyle}>
              <span>📍 R. Eng. Célso Tôrres, 654 - Graça, Salvador - BA</span>
              <span>📞 (71) 98344-9737 / (71) 99915-9975</span>
            </div>
          </div>
        </div>
      </section>

      <Footer />

      {/* Quick Floating Test Trigger Button */}
      <aside className="fixed bottom-5 right-5 z-30 hidden sm:block" aria-label="Acesso rápido ao teste de risco">
        <button
          type="button"
          onClick={() => setIsCalculatorModalOpen(true)}
          className="flex items-center gap-2.5 rounded-full border px-4 py-2.5 text-caption font-bold shadow-2xl"
          style={{
            backgroundColor: TOKEN.surface,
            borderColor: TOKEN.actionPrimary,
            color: TOKEN.heading,
          }}
          aria-label="Abrir teste rápido de TVP"
        >
          <span
            className="flex h-6 w-6 items-center justify-center rounded-full"
            style={{
              backgroundColor: 'var(--s-color-bg-accent)',
              color: 'var(--g-color-base-primary)',
            }}
          >
            <HeartPulse className="h-3.5 w-3.5" />
          </span>
          <span>Teste de Risco TVP</span>
        </button>
      </aside>

      {/* DVT Modal with zero scroll */}
      <DVTModal
        isOpen={isCalculatorModalOpen}
        onClose={() => setIsCalculatorModalOpen(false)}
      />

      {/* WhatsApp lead-capture modal (name, email, convênio/particular) */}
      <ContactModal
        isOpen={contactContext !== null}
        onClose={() => setContactContext(null)}
        context={contactContext ?? undefined}
      />
    </main>
  );
}
