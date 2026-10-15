'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import {
  Header,
  HeroSection,
  Footer,
  DVTRiskCalculator,
  DVTModal,
  ContactModal,
  CliniqIcon,
  EdgeButton,
  ProceduresSlider,
} from '@/components';
import { SCHEDULER_URL } from '@/lib/contact';
import { PROCEDURES } from '@/lib/procedures';
import { initSectionTracking, trackCtaClick, trackModalOpen } from '@/lib/analytics';
import {
  Activity,
  Calendar,
  CheckCircle2,
  Stethoscope,
  Waves,
  Zap,
  ShieldCheck,
  ArrowRight,
  HeartPulse,
  Award,
  Clock,
  Check,
  MessageCircle,
  Droplets,
  Syringe,
  GitBranch,
  Microscope,
} from 'lucide-react';
import { medicalBusinessSchema } from '@/lib/structured-data';
/* ============================================
   Per-procedure icons — each glyph mirrors the meaning of the
   source site's (herlonmoura.com.br) WordPress font-glyph icon,
   recreated here with lucide-react and styled to the v2.0 tokens:
   - Doppler vascular        -> Waves (blood-flow imaging)
   - Varizes com laser       -> Zap (laser energy)
   - Escleroterapia espuma   -> Droplets (foam injection)
   - Microcirurgia           -> Microscope (precise microsurgery)
   - Cateter Port-o-Cath     -> Syringe (chemo access)
   - Cateter Permcath        -> HeartPulse (hemodialysis access)
   - Fístula arteriovenosa   -> GitBranch (artery-vein graft)
   ============================================ */

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
  // Contact modal state — carries both the section that opened it (for
  // reporting) and the specific interest (procedure) into WhatsApp + CRM.
  const [contact, setContact] = useState<{
    sectionId: string;
    interest?: string;
    context?: string;
    title?: string;
  } | null>(null);

  const openContact = (sectionId: string, interest?: string, context?: string, title?: string) =>
    setContact({ sectionId, interest, context, title });

  // Start section-view tracking once the page has mounted.
  useEffect(() => {
    const teardown = initSectionTracking();
    return teardown;
  }, []);

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
    <main className="min-h-screen overflow-x-clip" style={{ backgroundColor: TOKEN.canvas, color: TOKEN.body }}>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(medicalBusinessSchema()) }}
      />
      <Header onOpenCalculator={() => setIsCalculatorModalOpen(true)} />

      {/* Hero Section with Doctor Photo & Real Branding */}
      <HeroSection
        headline="Dr. Herlon Moura — Angiologista e Cirurgião Vascular em Salvador"
        subheadline="Exame de ultrassom que avalia o fluxo sanguíneo em artérias e veias, com resultado explicado em linguagem clara."
        onOpenCalculator={() => {
          trackCtaClick('hero', 'Calculadora de Risco de TVP');
          trackModalOpen('hero', 'Calculadora de Risco de TVP');
          setIsCalculatorModalOpen(true);
        }}
        onBook={() => {
          trackCtaClick('hero', 'Agendar Consulta');
          openContact('hero', undefined, 'Agendar consulta', 'Agendar Consulta');
        }}
      />

      {/* O que é um Angiologista? — educational section with vascular illustration */}
      <section data-analytics-section="o-que-e-angiologista" className="py-16 sm:py-24" style={{ backgroundColor: TOKEN.surface }}>
        <div className="mx-auto w-full max-w-container px-4 sm:px-6 lg:px-8">
          <div className="grid items-center gap-12 lg:grid-cols-2">
            <div className="order-2 lg:order-1">
              <Eyebrow>Entenda a Especialidade</Eyebrow>
              <h2 className="mt-3 text-display-md" style={headingStyle}>
                O que é um Angiologista?
              </h2>
              <p className="mt-4 text-body-lg leading-relaxed" style={bodyStyle}>
                O Angiologista é o médico especialista no diagnóstico e tratamento das doenças que afetam os vasos sanguíneos e o sistema linfático. Ele atua em todo o sistema circulatório, incluindo braços, pernas, tronco e pescoço.
              </p>
              <p className="mt-4 text-body-lg leading-relaxed" style={bodyStyle}>
                Doenças como varizes, tromboses, obstruções arteriais e fazem parte do escopo de atuação deste especialista, que utiliza desde exames de imagem minimamente invasivos até cirurgias vasculares e endovasculares.
              </p>
              <div className="mt-6">
                <EdgeButton
                  variant="primary"
                  onClick={() => {
                    trackCtaClick('o-que-e-angiologista', 'Saiba mais sobre Angiologia');
                    openContact('o-que-e-angiologista', undefined, 'Dúvidas sobre angiologia', 'Saiba Mais');
                  }}
                >
                  <MessageCircle className="h-4 w-4" />
                  <span>Tirar Dúvidas</span>
                </EdgeButton>
              </div>
            </div>
            <div className="order-1 flex justify-center lg:order-2">
              <div className="relative w-full max-w-[500px]">
                <div className="absolute inset-0 rounded-3xl" style={{ backgroundColor: 'var(--s-color-action-primary)', opacity: 0.08, filter: 'blur(2rem)' }} />
                <div className="relative overflow-hidden rounded-3xl border" style={{ borderColor: TOKEN.cardBorder, backgroundColor: TOKEN.cardBg }}>
                  <Image
                    src="/images/support/body-vascular-network.webp"
                    alt="Sistema vascular do corpo humano — ilustração da rede de vasos sanguíneos"
                    width={500}
                    height={400}
                    className="h-auto w-full object-contain"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

{/* Trust & Credibility — thin band, no photo gallery */}
      <section data-analytics-section="trust-ticker" className="border-y py-6" style={{ borderColor: TOKEN.border, backgroundColor: TOKEN.surface }}>
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
      <section data-analytics-section="por-que-escolher" className="py-16 sm:py-24" style={{ backgroundColor: TOKEN.canvas }}>
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
                      backgroundColor: 'color-mix(in srgb, var(--s-color-action-gold) 18%, transparent)',
                      color: 'var(--s-color-action-gold)',
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
      <section id="procedimentos" data-analytics-section="procedimentos" className="relative overflow-hidden py-16 sm:py-24" style={{ backgroundColor: TOKEN.surface }}>
        {/* Anatomical circulatory-system accent (BR variant), right side, faded */}
        <video
          src="/images/videos/cardio.webm"
          autoPlay
          muted
          loop
          playsInline
          aria-hidden
          className="absolute inset-0 h-full w-full object-cover object-left"
          style={{ opacity: 0.15 }}
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
            <EdgeButton
              variant="primary"
              onClick={() => {
                trackCtaClick('procedimentos', 'Tirar Dúvidas no WhatsApp');
                openContact('procedimentos', undefined, 'Dúvidas sobre procedimentos', 'Tirar Dúvidas');
              }}
            >
              <MessageCircle className="h-4 w-4" />
              Tirar Dúvidas no WhatsApp
            </EdgeButton>
          </div>

          <ProceduresSlider onCtaClick={(sectionId, interest) => openContact(sectionId, interest, `Interesse em: ${interest}`, 'Consultar Disponibilidade')} />
        </div>
      </section>

      {/* Symptom Mapping Section — matches WordPress structure */}
      <section id="sintomas" data-analytics-section="sintomas" className="py-16 sm:py-24" style={{ backgroundColor: TOKEN.canvas }}>
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
                  className="flex h-11 w-11 items-center justify-center rounded-xl"
                  style={{
                    backgroundColor: 'color-mix(in srgb, var(--s-color-action-primary) 12%, transparent)',
                    color: 'var(--s-color-action-primary)',
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
                <EdgeButton
                  variant="primary"
                  block
                  onClick={() => {
                    trackCtaClick('sintomas', 'Agendar Exame das Pernas');
                    openContact(
                      'sintomas',
                      'Avaliação de sintomas em braços e pernas',
                      'Avaliação: sintomas em braços e pernas',
                      'Agendar Exame'
                    );
                  }}
                >
                  <MessageCircle className="h-4 w-4" />
                  Agendar Exame das Pernas
                </EdgeButton>
              </div>
            </div>

            {/* Tronco e Pescoço — matches WP exactly */}
            <div style={{ ...cardStyle, padding: '2rem' }}>
              <div className="mb-6 flex items-center gap-3">
                <div
                  className="flex h-11 w-11 items-center justify-center rounded-xl"
                  style={{
                    backgroundColor: 'color-mix(in srgb, var(--s-color-action-primary) 12%, transparent)',
                    color: 'var(--s-color-action-primary)',
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
                <EdgeButton
                  variant="gold"
                  block
                  onClick={() => {
                    trackCtaClick('sintomas', 'Fale Conosco (tronco e pescoço)');
                    openContact(
                      'sintomas',
                      'Avaliação de sintomas em tronco e pescoço',
                      'Avaliação: sintomas em tronco e pescoço',
                      'Fale Conosco'
                    );
                  }}
                >
                  <MessageCircle className="h-4 w-4" />
                  Fale Conosco
                </EdgeButton>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section data-analytics-section="eco-doppler-banner" className="relative h-[400px] overflow-hidden sm:h-[520px] lg:h-[640px]">
          <Image
          src="/images/brand/banner-meiohome.jpg"
          alt="Dr. Herlon Moura realizando exame de Eco-Doppler no consultório"
          fill
          sizes="100vw"
          className="object-cover object-[70%_30%] sm:object-[60%_25%] lg:object-[55%_20%]"
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
              Eco-Doppler Vascular no próprio consultório
            </h2>
            <p className="mt-3 text-body-small sm:text-body-regular" style={{ color: 'var(--s-color-content-inverse)' }}>
              Tecnologia de imagem para avaliar artérias e veias com precisão, sem filas e com explicação clara de cada resultado.
            </p>
            <div className="mt-6">
              <EdgeButton
                variant="primary"
                onClick={() => {
                  trackCtaClick('eco-doppler-banner', 'Agendar Exame de Eco-Doppler');
                  openContact('eco-doppler-banner', undefined, 'Agendar exame de Eco-Doppler', 'Agendar Exame');
                }}
              >
                <MessageCircle className="h-4 w-4" />
                <span>Agendar Exame de Eco-Doppler</span>
              </EdgeButton>
            </div>
          </div>
        </div>
      </section>

      {/* Interactive DVT Risk Calculator Anchor Section */}
      <section id="calculadora-tvp" data-analytics-section="calculadora-tvp" className="relative overflow-hidden py-20 sm:py-28" style={{ backgroundColor: TOKEN.surface }}>
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
              <EdgeButton
                variant="outline"
                onClick={() => {
                  trackCtaClick('calculadora-tvp', 'Abrir em Modo Janela Flutuante');
                  trackModalOpen('calculadora-tvp', 'Calculadora TVP');
                  setIsCalculatorModalOpen(true);
                }}
              >
                <HeartPulse className="h-4 w-4" />
                <span>Abrir em Modo Janela Flutuante</span>
              </EdgeButton>
            </div>
          </div>

          {/* Animated DVT Calculator Component */}
          <DVTRiskCalculator />
        </div>
      </section>

      {/* Doctor Bio & Credentials Section */}
      <section id="sobre" data-analytics-section="sobre" className="border-t py-20 sm:py-24" style={{ borderColor: TOKEN.border, backgroundColor: TOKEN.canvas }}>
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
                Combinamos a mais alta tecnologia de imagem diagnóstica (Eco-Doppler Vascular) e procedimentos minimamente invasivos a laser com a escuta clínica atenta, cuidando do paciente de forma integral.
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
                <EdgeButton
                  variant="primary"
                  onClick={() => {
                    trackCtaClick('sobre', 'Agendar Consulta com Dr. Herlon');
                    openContact('sobre', undefined, 'Agendar consulta', 'Agendar Consulta');
                  }}
                >
                  <MessageCircle className="h-4 w-4" />
                  <span>Agendar Consulta com Dr. Herlon</span>
                </EdgeButton>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA — matches WordPress "Vamos agendar sua consulta?" */}
      <section id="contato" data-analytics-section="contato" className="border-t py-20 sm:py-28" style={{ borderColor: TOKEN.border, backgroundColor: TOKEN.surface }}>
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
              <EdgeButton
                variant="whatsapp"
                onClick={() => {
                  trackCtaClick('contato', 'Agendar pelo WhatsApp');
                  openContact('contato', undefined, 'Agendar consulta', 'Agendar Consulta');
                }}
              >
                <MessageCircle className="h-4 w-4" />
                <span>Agendar pelo WhatsApp</span>
              </EdgeButton>
              <EdgeButton
                variant="outline"
                external
                href={SCHEDULER_URL}
                onClick={() => trackCtaClick('contato', 'Agendar no Calendário')}
              >
                <Calendar className="h-4 w-4" />
                <span>Agendar no Calendário</span>
              </EdgeButton>
            </div>
            <div className="flex flex-col items-center justify-center gap-6 text-body-small sm:flex-row" style={mutedStyle}>
              <span>📍 R. Eng. Célso Tôrres, 654 - Graça, Salvador - BA</span>
              <span>📞 (71) 98344-9737 / (71) 99915-9975</span>
            </div>
          </div>
        </div>
      </section>

      <Footer />

      {/* DVT Modal with zero scroll */}
      <DVTModal
        isOpen={isCalculatorModalOpen}
        onClose={() => setIsCalculatorModalOpen(false)}
      />

      {/* WhatsApp lead-capture modal — carries section + interest into the
          WhatsApp message and the CRM lead record. */}
      <ContactModal
        isOpen={contact !== null}
        onClose={() => setContact(null)}
        sectionId={contact?.sectionId}
        interest={contact?.interest}
        context={contact?.context}
        title={contact?.title}
      />
    </main>
  );
}
