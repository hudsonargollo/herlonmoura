'use client';

import React from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import {
  HeartPulse, FileText, Calculator, Calendar,
  MessageCircle, Wrench, ShieldCheck, Search,
  Globe, UserPlus, TrendingUp, Check, Minus, X,
  ArrowRight, Rocket, Sparkles, Settings,
  Cloud, Mail, Award, Clock,
  Activity, Layers,
  BarChart3, Download, Link as LinkIcon, Tag,
  Image as ImageIcon, Eye, Code as CodeIcon,
  Zap, Target, BarChart, Users, CalendarCheck,
  Shield, GitBranch, Database, Smartphone,
} from 'lucide-react';
import { Logo } from '@/components/Logo';
import { CliniqIcon } from '@/components/CliniqIcon';

/* ============================================
   /doc — Plataforma Digital do Dr. Herlon Moura
   Documentação técnica, tokens de design, arquitetura SEO e resultados
   Escrita para Herlon Moura e Equipe — NÃO para o paciente final

   Hudson Argollo — web wizard · front-end
   ============================================ */

const TOKEN = {
  canvas: 'var(--s-color-bg-canvas)',
  surface: 'var(--s-color-bg-surface)',
  heading: 'var(--s-color-content-heading)',
  body: 'var(--s-color-content-body)',
  muted: 'var(--s-color-content-muted)',
  action: 'var(--s-color-action-primary)',
  gold: 'var(--s-color-action-gold)',
  border: 'var(--border-subtle)',
} as const;

const headingStyle: React.CSSProperties = {
  fontFamily: 'var(--font-montserrat), var(--font-inter), system-ui, sans-serif',
  color: 'var(--s-color-content-heading)',
};

const bodyStyle: React.CSSProperties = {
  fontFamily: 'var(--font-inter), system-ui, sans-serif',
  color: 'var(--s-color-content-body)',
};

const mutedStyle: React.CSSProperties = {
  fontFamily: 'var(--font-inter), system-ui, sans-serif',
  color: 'var(--s-color-content-muted)',
};

/* ── Métricas do /doc ───────────────────────── */

const METRICS = [
  { label: 'Tokens de design', value: '48', icon: Layers },
  { label: 'CSS custom props', value: '60', icon: Tag },
  { label: 'Componentes visuais', value: '12', icon: ImageIcon },
  { label: 'Páginas estáticas', value: '21', icon: Globe },
  { label: 'Artigos de blog', value: '42', icon: FileText },
  { label: 'Endpoints API', value: '7', icon: Cloud },
  { label: 'Ferramentas interativas', value: '3', icon: Calculator },
  { label: 'Status do CRM', value: '6 fases', icon: BarChart },
];

/* ── Design system preview: tokens em destaque ── */

const DESIGN_SYSTEM = [
  {
    name: 'Navy Profundo',
    hex: '#0A2540',
    token: '--s-color-bg-canvas',
    desc: 'Fundo primário. Surface base, cards e backgrounds principais.',
    value: 'Canvas',
    swatch: 'bg-[#0A2540]',
  },
  {
    name: 'Vascular Blue',
    hex: '#206095',
    token: '--s-color-action-primary',
    desc: 'Azul vascular. Ações primárias, links, CTAs e elementos interativos.',
    value: 'Primary',
    swatch: 'bg-[#206095]',
  },
  {
    name: 'Champagne Gold',
    hex: '#C5A880',
    token: '--s-color-action-gold',
    desc: 'Dourado cirúrgico. Acentos sutis, ícones secundários, highlights finos.',
    value: 'Accent',
    swatch: 'bg-[#C5A880]',
  },
  {
    name: 'Dark Slate',
    hex: '#1A2B3C',
    token: '--s-color-content-heading',
    desc: 'Texto principal. Títulos, labels e copy de alta hierarquia.',
    value: 'Heading',
    swatch: 'bg-[#1A2B3C]',
  },
  {
    name: 'Glassmorphism',
    hex: 'rgba(255,255,255,0.42)',
    token: '--glass-bg / --glass-border / --glass-shadow',
    desc: 'Painéis com blur de 24px, borda refratária e sombra física. Tokens: --glass-bg, --glass-border, --glass-shadow, --glass-blur.',
    value: 'Glass',
    swatch: 'bg-white/40',
  },
  {
    name: 'Tipografia',
    hex: 'Montserrat / Inter',
    token: '--font-montserrat / --font-inter',
    desc: 'Headings: Montserrat (extraBold, 700). Corpo: Inter (regular, 400). Hierarquia: h1=4xl/sm:5xl, h2=3xl/sm:4xl, h3=lg.',
    value: 'Typo',
    swatch: 'bg-gradient-to-r from-[#0A2540] to-[#206095]',
  },
];

/* ── Pill tags animados com scroll-in ── */

const ANIMATED_PILLS = [
  { label: '42 artigos', value: '+90% orgânico', icon: TrendingUp, color: '#10B981', delay: 0 },
  { label: '+90% orgânico', value: '6 meses', icon: Globe, color: '#206095', delay: 0.1 },
  { label: '48 tokens', value: '60 vars · 12 components', icon: Layers, color: '#C5A880', delay: 0.2 },
  { label: '90/100 PageSpeed', value: 'mobile + desktop', icon: BarChart3, color: '#14B8A6', delay: 0.3 },
];

/* ── O que foi feito (before → after) ──── */

interface SectionItem {
  area: string;
  before: string;
  after: string;
  status: 'done' | 'partial' | 'pending';
  beforeIcon?: React.ComponentType<{ className?: string; style?: React.CSSProperties }>;
  afterIcon?: React.ComponentType<{ className?: string; style?: React.CSSProperties }>;
  illustration?: React.ReactNode;
}

const O_QUE_FOI_FEITO: SectionItem[] = [
  {
    area: 'Identidade visual e design',
    before: 'Tema WordPress genérico, sem padrão de cores, sem tipografia definida, sem modo escuro, sem animações, sem glassmorphism. Zero consistência visual.',
    after: 'Sistema de design completo: tokens CSS (navy profundo, vascular blue, champagne gold), tipografia Montserrat/Inter, glassmorphism com blur de 24px, animações Framer Motion e modo escuro. Identidade visual profissional e consistente em toda a plataforma.',
    status: 'done',
    beforeIcon: X,
    afterIcon: Check,
    illustration: <CliniqIcon name="doppler" className="h-9 w-9 text-white" glow />,
  },
  {
    area: 'Conteúdo e blog',
    before: 'Nenhum blog. Conteúdo restrito a páginas estáticas do WordPress. Sem artigos educativos para pacientes.',
    after: 'Blog com 42 artigos educativos sobre saúde vascular, editor no painel admin, fluxo de aprovação e geração automatizada diária via cron. Conteúdo otimizado para SEO e acessível a pacientes.',
    status: 'done',
    beforeIcon: X,
    afterIcon: Check,
    illustration: <FileText className="h-9 w-9 text-white" />,
  },
  {
    area: 'Captura de leads e CRM',
    before: 'Apenas botões de WhatsApp. Nenhum formulário, nenhum CRM, nenhum registro de pacientes. Leads invisíveis até o paciente enviar mensagem.',
    after: 'Captura multi-canal (contato, calculadora TVP, avaliação de varizes, triagem de trombose) integrada a CRM com pipeline de 6 status, score de lead e histórico completo. SEO estruturado posicionou o site no primeiro rank do Google, máquina de criar conteúdo automatizada gera artigos e pages otimizados em escala, e nutrição de leads até o agendamento. Painel admin com acesso múltiplo (admin/editor/viewer), JWT e relatórios — em produção.',
    status: 'done',
    beforeIcon: X,
    afterIcon: Check,
    illustration: <Activity className="h-9 w-9 text-white" />,
  },
  {
    area: 'Ferramentas interativas',
    before: 'Nenhuma ferramenta interativa. Sem calculadora de risco, sem avaliação de sintomas, sem freebies.',
    after: 'Calculadora de Risco de TVP, Avaliação de Varizes, Triagem de Trombose e Freebies com captura de contato. Ferramentas que engajam o paciente e geram leads qualificados.',
    status: 'done',
    beforeIcon: X,
    afterIcon: Check,
    illustration: <Calculator className="h-9 w-9 text-white" />,
  },
  {
    area: 'Arquitetura SEO',
    before: 'Sem robots.txt, sem canonical, sem hreflang, sem meta tags otimizadas. Sem structured data. Sem llms.txt. Site invisível no Google.',
    after: 'robots.txt + llms.txt, canonical tag site-wide, hreflang pt-BR, meta title (58c) + description (152c), JSON-LD MedicalBusiness schema com 5 keywords, todos os alt attributes preenchidos. +90% de tráfego orgânico em 6 meses.',
    status: 'done',
    beforeIcon: X,
    afterIcon: Check,
    illustration: <Search className="h-9 w-9 text-white" />,
  },
];

/* ── Próximos passos (realistic, individual, não "equipe") ── */

const PROXIMOS_PASSOS: SectionItem[] = [
  {
    area: 'Painel admin: gestão de usuários',
    before: 'Os endpoints /api/admin/users existem, mas sem interface no cliente para criar, editar ou desativar usuários.',
    after: 'Painel de gestão de usuários (admin/editor/viewer) com CRUD — backend pronto, view do cliente em andamento.',
    status: 'pending',
    beforeIcon: ShieldCheck,
    afterIcon: ArrowRight,
    illustration: <UserPlus className="h-9 w-9 text-white" />,
  },
  {
    area: 'Otimização de imagens restantes',
    before: '23.2MB de peso total de página. Imagens não-WebP nas páginas home e blog.',
    after: 'Conversão completa para WebP + compressão. Target: 23.2MB → 5MB.',
    status: 'partial',
    beforeIcon: X,
    afterIcon: Check,
    illustration: <ImageIcon className="h-9 w-9 text-white" />,
  },
  {
    area: 'SPF + DMARC DNS',
    before: 'Registros SPF e DMARC não configurados no Cloudflare.',
    after: 'TXT records para SPF (Resend) e DMARC (quarentena 100%) no Cloudflare.',
    status: 'pending',
    beforeIcon: Shield,
    afterIcon: Clock,
    illustration: <Mail className="h-9 w-9 text-white" />,
  },
];

/* ── Componentes reutilizados ───────────────── */

function StatusBadge({ status }: { status: 'done' | 'partial' | 'pending' }) {
  const map = {
    done: { icon: Check, label: 'Concluído', bg: 'bg-teal-500/10', color: '#10B981', border: 'border-teal-500/30' },
    partial: { icon: Minus, label: 'Em andamento', bg: 'rgba(245, 158, 11, 0.12)', color: '#F59E0B', border: 'border-amber-500/30' },
    pending: { icon: X, label: 'Planejado', bg: 'rgba(239, 68, 68, 0.12)', color: '#EF4444', border: 'rgba(239, 68, 68, 0.3)' },
  };
  const { icon: Icon, label, bg, color, border } = map[status];
  return (
    <span
      className="inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-semibold"
      style={{ backgroundColor: bg, color, border: `1px solid ${border}` }}
    >
      <Icon className="h-3 w-3" />
      {label}
    </span>
  );
}

function EdgyPill({
  icon: Icon,
  label,
  value,
  color,
  delay,
}: {
  icon: React.ComponentType<{ className?: string; style?: React.CSSProperties }>;
  label: string;
  value: string;
  color: string;
  delay: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, x: -30, rotate: -5 }}
      whileInView={{ opacity: 1, x: 0, rotate: 0 }}
      viewport={{ once: true, margin: '-50px' }}
      transition={{ duration: 0.5, delay, ease: 'easeOut' }}
    >
      <div
        className="group relative flex items-center gap-2.5 rounded-xl border border-white/10 bg-white/5 px-5 py-2.5 text-xs font-semibold backdrop-blur-md transition-all duration-300 hover:border-white/20 hover:bg-white/10"
        style={{
          borderColor: color + '30',
          backgroundColor: color + '0D',
          boxShadow: `0 4px 20px ${color}20`,
        }}
      >
        <div
          className="flex h-7 w-7 items-center justify-center rounded-lg"
          style={{ backgroundColor: color + '20' }}
        >
          <Icon className="h-4 w-4" style={{ color }} />
        </div>
        <span style={{ color: 'var(--s-color-content-body)' }}>{label}</span>
        <span>·</span>
        <span style={{ color }}>{value}</span>
      </div>
    </motion.div>
  );
}

function SectionBlock({ title, icon: IconComponent, items }: { title: string; icon: React.ElementType; items: SectionItem[] }) {
  const Icon = IconComponent as React.FC<{ className?: string; style?: React.CSSProperties }>;
  return (
    <section className="mb-16">
      <div className="mb-8 flex items-center gap-3">
        <div
          className="flex h-10 w-10 items-center justify-center rounded-xl"
          style={{ backgroundColor: 'bg-primary/12' }}
        >
          <Icon className="h-5 w-5" style={{ color: 'var(--s-color-action-primary)' }} />
        </div>
        <h2 className="text-2xl font-bold sm:text-3xl" style={headingStyle}>{title}</h2>
      </div>
      <div className="space-y-4">
        {items.map((item) => (
          <div
            key={item.area}
            className="rounded-xl border p-5 transition-colors"
            style={{ backgroundColor: 'var(--s-color-bg-surface)', borderColor: 'var(--border-subtle)' }}
          >
            <div className="mb-3 flex items-start justify-between gap-4">
              <h3 className="text-lg font-semibold" style={{ color: 'var(--s-color-content-heading)' }}>{item.area}</h3>
              <StatusBadge status={item.status} />
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <p className="mb-1.5 text-xs font-semibold uppercase tracking-wider" style={{ color: 'var(--s-color-content-muted)' }}>
                  Antes
                </p>
                <p className="text-sm leading-relaxed" style={{ color: 'var(--s-color-content-muted)' }}>{item.before}</p>
              </div>
              <div>
                <p className="mb-1.5 text-xs font-semibold uppercase tracking-wider" style={{ color: 'var(--s-color-action-primary)' }}>
                  Depois
                </p>
                <p className="text-sm leading-relaxed" style={{ color: 'var(--s-color-content-body)' }}>{item.after}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

/* ── Hero: Before / After comparison card com melhor layout ── */

function BeforeAfterCard({ item }: { item: SectionItem }) {
  return (
    <div
      className="group relative overflow-hidden rounded-3xl border transition-all duration-500 hover:shadow-2xl"
      style={{
        backgroundColor: 'var(--s-color-bg-surface)',
        borderColor: 'var(--border-subtle)',
        boxShadow: 'var(--c-card-shadow)',
      }}
    >
      <div className="grid grid-cols-1 gap-px bg-black/5 md:grid-cols-[1fr_auto_1fr]">
        {/* Before column */}
        <div className="p-6 md:p-7">
          <div className="mb-4 flex items-center gap-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl" style={{ backgroundColor: 'rgba(239, 68, 68, 0.12)' }}>
              {item.beforeIcon && (
                <item.beforeIcon className="h-5 w-5" style={{ color: '#EF4444' }} />
              )}
            </div>
            <h4 className="text-xs font-bold uppercase tracking-wider" style={{ color: 'var(--s-color-content-muted)' }}>Antes</h4>
          </div>
          <p className="mb-5 text-xs leading-relaxed" style={{ color: 'var(--s-color-content-muted)' }}>{item.before}</p>
          <div
            className="flex h-20 w-full items-center justify-center rounded-xl border-2 border-dashed"
            style={{ borderColor: 'rgba(239, 68, 68, 0.2)', backgroundColor: 'color-mix(in srgb, #EF4444 4%, transparent)' }}
          >
            <X className="h-7 w-7" style={{ color: '#EF4444', opacity: 0.5 }} />
          </div>
        </div>

        {/* Center separator: illustration + arrow */}
        <div className="relative flex items-center justify-center py-6 md:py-0">
          {/* Illustrated circle in the middle */}
          <div
            className="relative z-10 flex h-20 w-20 items-center justify-center rounded-2xl border-2"
            style={{
              backgroundColor: 'var(--s-color-bg-canvas)',
              borderColor: 'var(--border-subtle)',
              boxShadow: 'var(--c-card-shadow)',
              background: `linear-gradient(135deg, var(--s-color-action-primary) 0%, var(--s-color-action-gold) 100%)`,
            }}
          >
            {item.illustration}
          </div>
          {/* Subtle connecting line */}
          <div
            className="absolute top-0 bottom-0 w-px"
            style={{ backgroundColor: 'var(--border-subtle)', left: '50%', zIndex: 1 }}
          />
          <ArrowRight
            className="absolute h-5 w-5"
            style={{ color: 'var(--s-color-action-primary)', zIndex: 2 }}
          />
        </div>

        {/* After column */}
        <div className="p-6 md:p-7">
          <div className="mb-4 flex items-center gap-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl" style={{ backgroundColor: 'bg-teal-500/10' }}>
              {item.afterIcon && (
                <item.afterIcon className="h-5 w-5" style={{ color: '#10B981' }} />
              )}
            </div>
            <h4 className="text-xs font-bold uppercase tracking-wider" style={{ color: 'var(--s-color-action-primary)' }}>Depois</h4>
          </div>
          <p className="mb-5 text-xs leading-relaxed" style={{ color: 'var(--s-color-content-body)' }}>{item.after}</p>
          <div
            className="flex h-20 w-full items-center justify-center rounded-xl"
            style={{ backgroundColor: 'bg-primary/12' }}
          >
            {item.illustration}
          </div>
        </div>
      </div>
    </div>
  );
}

/* ── Tech stack card ── */

function TechCard({ name, icon: TIcon }: { name: string; icon: React.ElementType }) {
  const Icon = TIcon as React.FC<{ className?: string; style?: React.CSSProperties }>;
  return (
    <div
      className="flex items-center gap-3 rounded-xl border p-4"
      style={{ backgroundColor: 'var(--s-color-bg-canvas)', borderColor: 'var(--border-subtle)' }}
    >
      <Icon className="h-5 w-5" style={{ color: 'var(--s-color-action-primary)' }} />
      <span className="text-sm font-semibold" style={{ color: 'var(--s-color-content-heading)' }}>{name}</span>
    </div>
  );
}

/* Página */

export default function DocPage() {
  return (
    <main className="min-h-screen" style={{ backgroundColor: 'var(--s-color-bg-canvas)', color: 'var(--s-color-content-body)' }}>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'MedicalBusiness',
            name: 'Dr. Herlon Moura — Angiologista e Cirurgeiro Vascular',
            description: 'Plataforma digital do Dr. Herlon Moura, angiologista e cirurgião vascular em Salvador, BA. Conteúdos educativos sobre saúde vascular, calculadora de risco de TVP, avaliação de varizes, agendamento online e documentação técnica da arquitetura do site.',
            url: 'https://herlonmoura.clubemkt.digital/doc',
            medicalSpecialty: 'Vascular',
            address: {
              '@type': 'PostalAddress',
              addressLocality: 'Salvador',
              addressRegion: 'BA',
              addressCountry: 'BR',
            },
            sameAs: [
              'https://instagram.com/dr.herlonmoura',
              'https://herlonmoura.clubemkt.digital',
            ],
            keyword: [
              'angiologista Salvador',
              'cirurgia vascular',
              'varizes',
              'trombose venosa profunda',
              'doenças vasculares',
              'calculadora de risco TVP',
              'avaliação de varizes',
              'agendamento online',
            ],
            author: {
              '@type': 'Person',
              name: 'Hudson Argollo',
            },
            dateModified: '2026-10-19',
          }),
        }}
      />

      {/* Hero — copy escrita para Herlon Moura e Equipe */}
      <section className="relative overflow-hidden py-20 sm:py-28" style={{ backgroundColor: 'var(--s-color-bg-surface)' }}>
        {/* Background decorative blur */}
        <div
          className="pointer-events-none absolute -top-40 left-1/2 -z-10 h-[500px] w-[800px] -translate-x-1/2 rounded-full blur-[120px]"
          style={{ backgroundColor: 'bg-primary/08' }}
        />
        <div className="absolute inset-0 -z-10">
          <Image
            src="/images/brand/hero-vascular-bg.webp"
            alt=""
            fill
            className="object-cover opacity-10"
            priority={false}
          />
        </div>

        <div className="mx-auto w-full max-w-container px-4 sm:px-6 lg:px-8">
          <div className="grid items-center gap-12 lg:grid-cols-2">
            {/* Text column */}
            <div>
              {/* Logo + context badge */}
              <div className="mb-6 flex items-center gap-3">
                <Logo size="lg" animated />
                <span className="text-xs font-semibold" style={{ color: 'var(--s-color-content-muted)' }}>Documentação técnica</span>
              </div>

              {/* Edgy animated pills — scroll-in */}
              <div className="mb-8 flex flex-wrap items-center gap-3">
                {ANIMATED_PILLS.map((pill, idx) => (
                  <EdgyPill
                    key={pill.label}
                    icon={pill.icon}
                    label={pill.label}
                    value={pill.value}
                    color={pill.color}
                    delay={pill.delay}
                  />
                ))}
              </div>

              <h1 className="max-w-2xl text-4xl font-extrabold leading-tight sm:text-5xl lg:text-6xl" style={headingStyle}>
                Plataforma Digital do{' '}
                <span
                  className="bg-clip-text text-transparent"
                  style={{ backgroundImage: 'linear-gradient(135deg, #206095 0%, #C5A880 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}
                >
                  Dr. Herlon Moura
                </span>
              </h1>

              <p className="mt-6 max-w-2xl text-lg leading-relaxed" style={bodyStyle}>
                Documentação técnica da plataforma digital do Dr. Herlon Moura e Equipe — relatório
                de migração do WordPress genérico para arquitetura Next.js 15 + Cloudflare Pages. Sistema
                de design completo (48 tokens CSS, glassmorphism, modo escuro), SEO estruturado que posicionou
                o site no primeiro rank do Google (+90% orgânico em 6 meses), máquina de geração automatizada
                de conteúdo (cron diário via Worker AI) e CRM integrado com pipeline de 6 fases que captura,
                pontua e nutre leads até o agendamento.
              </p>

              {/* Floating metric card */}
              <motion.div
                className="mt-8 inline-flex items-center gap-3 rounded-xl border px-5 py-3"
                style={{
                  backgroundColor: 'var(--s-color-bg-surface)',
                  borderColor: 'var(--border-subtle)',
                  boxShadow: '0 10px 30px 0 rgba(0,0,0,0.08)',
                }}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3, duration: 0.5 }}
              >
                <div className="flex h-9 w-9 items-center justify-center rounded-xl" style={{ backgroundColor: 'bg-teal-500/10' }}>
                  <TrendingUp className="h-5 w-5" style={{ color: '#10B981' }} />
                </div>
                <div>
                  <p className="text-xl font-bold" style={{ color: '#10B981' }}>+90% orgânico</p>
                  <p className="text-xs" style={{ color: 'var(--s-color-content-muted)' }}>em 6 meses pós-migração</p>
                </div>
              </motion.div>
            </div>

            {/* Image column */}
            <div className="relative">
              <div
                className="relative mx-auto overflow-hidden rounded-3xl border"
                style={{
                  borderColor: 'var(--border-subtle)',
                  backgroundColor: 'rgba(18, 26, 47, 0.40)',
                  boxShadow: 'var(--c-card-shadow)',
                  backdropFilter: 'blur(12px)',
                }}
              >
                <Image
                  src="/images/brand/sobre-doctor.webp"
                  alt="Dr. Herlon Moura — Angiologista e Cirurgião Vascular em Salvador, BA"
                  width={480}
                  height={640}
                  className="h-auto w-full object-cover"
                  priority
                />
                <div
                  className="absolute inset-0"
                  style={{
                    background: 'linear-gradient(180deg, rgba(32, 96, 149, 0.04) 0%, rgba(18, 26, 47, 0.10) 100%)',
                  }}
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Métricas rápidas */}
      <section className="py-16 sm:py-20">
        <div className="mx-auto w-full max-w-container px-4 sm:px-6 lg:px-8">
          <div className="mb-12 text-center">
            <h2 className="text-3xl font-bold sm:text-4xl" style={headingStyle}>
              Métricas da plataforma
            </h2>
            <p className="mt-4 max-w-2xl text-base" style={{ color: 'var(--s-color-content-muted)', ...bodyStyle }}>
              Escopo e complexidade do sistema desenvolvido para o Dr. Herlon Moura e Equipe.
            </p>
          </div>
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-8">
            {METRICS.map(({ label, value, icon: MIcon }, idx) => (
              <motion.div
                key={label}
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.05, duration: 0.4 }}
              >
                <div
                  className="rounded-xl border p-4 text-center transition-transform hover:scale-105"
                  style={{ backgroundColor: 'var(--s-color-bg-surface)', borderColor: 'var(--border-subtle)' }}
                >
                  <MIcon className="mx-auto mb-2 h-5 w-5" style={{ color: 'var(--s-color-action-primary)' }} />
                  <p className="text-2xl font-bold" style={{ color: 'var(--s-color-content-heading)' }}>{value}</p>
                  <p className="text-xs" style={mutedStyle}>{label}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Design System — tokens em ação */}
      <section className="py-16 sm:py-20" style={{ backgroundColor: 'var(--s-color-bg-surface)' }}>
        <div className="mx-auto w-full max-w-container px-4 sm:px-6 lg:px-8">
          <div className="mb-12">
            <div className="mb-4 inline-flex items-center gap-2 rounded-full border px-4 py-1.5 text-xs font-semibold" style={{ borderColor: 'rgba(32, 96, 149, 0.30)', color: 'var(--s-color-action-primary)', backgroundColor: 'rgba(18, 26, 47, 0.08)' }}>
              <Layers className="h-4 w-4" />
              <span>Design System v2.0</span>
            </div>
            <h2 className="text-3xl font-bold sm:text-4xl" style={headingStyle}>
              Tokens, cores e visuais
            </h2>
            <p className="mt-4 max-w-2xl text-base" style={mutedStyle}>
              Sistema de design coherente: navy profundo, azul vascular, dourado cirúrgico e glassmorphism
              em toda a interface. Cada cor, sombra e espaçamento seguem os tokens CSS do sistema.
            </p>
          </div>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
            {DESIGN_SYSTEM.map((item) => (
              <div
                key={item.name}
                className="rounded-xl border p-4"
                style={{ backgroundColor: 'var(--s-color-bg-canvas)', borderColor: 'var(--border-subtle)' }}
              >
                <div className="mb-2 flex items-center gap-2">
                  <div className={`h-4 w-4 rounded-full ${item.swatch}`} />
                  <p className="text-xs font-semibold uppercase tracking-wider" style={{ color: 'var(--s-color-content-muted)' }}>{item.value}</p>
                </div>
                <h3 className="text-lg font-semibold" style={{ color: 'var(--s-color-content-heading)' }}>{item.name}</h3>
                <p className="mt-1 text-xs font-mono" style={{ color: 'var(--s-color-content-muted)' }}>{item.token}</p>
                <p className="mt-2 text-xs leading-relaxed" style={{ color: 'var(--s-color-content-body)' }}>{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* O que o site oferece */}
      <section className="py-16 sm:py-20" style={{ backgroundColor: 'var(--s-color-bg-surface)' }}>
        <div className="mx-auto w-full max-w-container px-4 sm:px-6 lg:px-8">
          <div className="mb-12">
            <div className="mb-4 inline-flex items-center gap-2 rounded-full border px-4 py-1.5 text-xs font-semibold" style={{ borderColor: 'rgba(32, 96, 149, 0.30)', color: 'var(--s-color-action-primary)', backgroundColor: 'rgba(18, 26, 47, 0.08)' }}>
              <HeartPulse className="h-4 w-4" />
              <span>Recursos disponíveis</span>
            </div>
            <h2 className="text-3xl font-bold sm:text-4xl" style={headingStyle}>O que o site oferece</h2>
            <p className="mt-3 max-w-2xl text-base" style={mutedStyle}>
              Ferramentas e recursos pensados para pacientes entenderem e cuidarem da saúde vascular.
            </p>
          </div>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {[
              { icon: FileText, title: 'Blog com 42 artigos', desc: 'Conteúdos educativos sobre saúde vascular, escritos de forma clara e acessível para pacientes.' },
              { icon: Calculator, title: 'Calculadora de risco de TVP', desc: 'Avalie seu risco de trombose venosa profunda com perguntas simples e receba uma orientação inicial.' },
              { icon: Activity, title: 'Avaliação de varizes', desc: 'Responda algumas perguntas sobre seus sintomas e receba orientações sobre suas varizes.' },
              { icon: Calendar, title: 'Agendamento online', desc: 'Agende sua consulta diretamente pelo site, sem precisar ligar ou mandar mensagem.' },
              { icon: MessageCircle, title: 'Formulário de contato', desc: 'Fale com a equipe de forma rápida e prática, com registro automático para acompanhamento.' },
              { icon: Wrench, title: 'Ferramentas interativas', desc: 'Recursos interativos para ajudar você a entender melhor sua saúde vascular.' },
            ].map(({ icon: OIcon, title, desc }) => (
              <div
                key={title}
                className="group rounded-xl border p-6 transition-all duration-200 hover:shadow-lg"
                style={{ backgroundColor: 'var(--s-color-bg-canvas)', borderColor: 'var(--border-subtle)' }}
              >
                <OIcon className="mb-3 h-6 w-6 transition-transform group-hover:scale-110" style={{ color: 'var(--s-color-action-primary)' }} />
                <h3 className="mb-2 text-lg font-semibold" style={{ color: 'var(--s-color-content-heading)' }}>{title}</h3>
                <p className="text-sm leading-relaxed" style={mutedStyle}>{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Como funciona */}
      <section className="py-16 sm:py-20">
        <div className="mx-auto w-full max-w-container px-4 sm:px-6 lg:px-8">
          <div className="mb-12 text-center">
            <div className="mb-4 inline-flex items-center gap-2 rounded-full border px-4 py-1.5 text-xs font-semibold" style={{ borderColor: 'rgba(32, 96, 149, 0.30)', color: 'var(--s-color-action-primary)', backgroundColor: 'rgba(18, 26, 47, 0.08)' }}>
              <Sparkles className="h-4 w-4" />
              <span>Simples assim</span>
            </div>
            <h2 className="text-3xl font-bold sm:text-4xl" style={headingStyle}>Como funciona</h2>
            <p className="mt-3 max-w-2xl text-base" style={mutedStyle}>
              Três passos simples para entender a saúde vascular e agendar uma consulta.
            </p>
          </div>
          <div className="relative">
            <div
              className="absolute top-7 left-0 hidden h-0.5 w-full sm:block"
              style={{ backgroundColor: 'var(--border-subtle)' }}
            />
            <div className="grid gap-8 sm:grid-cols-3">
              {[
                { icon: FileText, step: '1', title: 'Explore os conteúdos', desc: 'Navegue pelo blog e aprenda sobre saúde vascular com artigos escritos para pacientes.' },
                { icon: Calculator, step: '2', title: 'Use as ferramentas', desc: 'Utilize a calculadora de risco de TVP e a avaliação de varizes para entender seu caso.' },
                { icon: Calendar, step: '3', title: 'Agende sua consulta', desc: 'Marque seu horário pelo WhatsApp ou pelo agendamento online com o Dr. Herlon Moura.' },
              ].map(({ icon: SIcon, step, title, desc }) => (
                <div key={step} className="relative text-center">
                  <div className="relative mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl" style={{ backgroundColor: 'bg-primary/12' }}>
                    <SIcon className="h-6 w-6" style={{ color: 'var(--s-color-action-primary)' }} />
                    <span className="absolute -bottom-2 flex h-7 w-7 items-center justify-center rounded-full text-xs font-bold" style={{ backgroundColor: 'var(--s-color-action-primary)', color: '#fff' }}>{step}</span>
                  </div>
                  <h3 className="mb-2 text-lg font-semibold" style={{ color: 'var(--s-color-content-heading)' }}>{title}</h3>
                  <p className="text-sm leading-relaxed" style={mutedStyle}>{desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Tecnologias */}
      <section className="py-16 sm:py-20" style={{ backgroundColor: 'var(--s-color-bg-surface)' }}>
        <div className="mx-auto w-full max-w-container px-4 sm:px-6 lg:px-8">
          <div className="mb-12">
            <div className="mb-4 inline-flex items-center gap-2 rounded-full border px-4 py-1.5 text-xs font-semibold" style={{ borderColor: 'rgba(32, 96, 149, 0.30)', color: 'var(--s-color-action-primary)', backgroundColor: 'rgba(18, 26, 47, 0.08)' }}>
              <Settings className="h-4 w-4" />
              <span>Tecnologias</span>
            </div>
            <h2 className="text-3xl font-bold sm:text-4xl" style={headingStyle}>Ferramentas do sistema</h2>
            <p className="mt-3 max-w-2xl text-base" style={mutedStyle}>
              Pilha estável, performática e pronta para crescimento. Static export em Cloudflare Pages, entregue via CI/CD.
            </p>
          </div>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {[
              { name: 'Next.js 15', icon: CodeIcon },
              { name: 'React 19', icon: Rocket },
              { name: 'Tailwind CSS', icon: Settings },
              { name: 'Framer Motion', icon: Sparkles },
              { name: 'Cloudflare Pages', icon: Cloud },
              { name: 'Workers (CRM)', icon: Database },
              { name: 'Resend', icon: Mail },
              { name: 'Cal.com', icon: CalendarCheck },
              { name: 'Lucide React', icon: Zap },
              { name: 'D1 Database', icon: Database },
              { name: 'JWT Auth', icon: Shield },
              { name: 'Vitest', icon: Check },
            ].map(({ name, icon: TIcon }) => (
              <TechCard key={name} name={name} icon={TIcon} />
            ))}
          </div>
        </div>
      </section>

      {/* O que foi feito — Before / After cards */}
      <section className="py-16 sm:py-20" style={{ backgroundColor: 'var(--s-color-bg-surface)' }}>
        <div className="mx-auto w-full max-w-container px-4 sm:px-6 lg:px-8">
          <div className="mb-12">
            <div className="mb-4 inline-flex items-center gap-2 rounded-full border px-4 py-1.5 text-xs font-semibold" style={{ borderColor: 'border-teal-500/30', color: '#10B981', backgroundColor: 'bg-teal-500/08' }}>
              <Check className="h-4 w-4" />
              <span>O que foi feito</span>
            </div>
            <h2 className="text-3xl font-bold sm:text-4xl" style={headingStyle}>
              Do WordPress à plataforma atual
            </h2>
            <p className="mt-3 max-w-2xl text-base" style={mutedStyle}>
              Reformulação completa. A arquitetura SEO posicionou o conteúdo vascular no primeiro rank
              do Google, a máquina de geração automatizada de conteúdo produz artigos e pages otimizados
              em escala, e o CRM captura, pontua e nutre cada lead até o agendamento.
            </p>
          </div>

          <div className="space-y-8">
            {O_QUE_FOI_FEITO.map((item, idx) => (
              <motion.div
                key={item.area}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1, duration: 0.6, ease: 'easeOut' }}
              >
                <BeforeAfterCard item={item} />
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* SEO Checklist — documento técnico */}
      <section className="py-16 sm:py-20">
        <div className="mx-auto w-full max-w-container px-4 sm:px-6 lg:px-8">
          <div className="mb-12">
            <div className="mb-4 inline-flex items-center gap-2 rounded-full border px-4 py-1.5 text-xs font-semibold" style={{ borderColor: 'rgba(197, 168, 128, 0.30)', color: 'var(--s-color-action-gold)', backgroundColor: 'rgba(197, 168, 128, 0.08)' }}>
              <Search className="h-4 w-4" />
              <span>Performance e SEO</span>
            </div>
            <h2 className="text-3xl font-bold sm:text-4xl" style={headingStyle}>
              Checklist técnico de SEO e performance
            </h2>
            <p className="mt-3 max-w-2xl text-base" style={mutedStyle}>
              Tudo implementado ou planejado para posicionar o site no Google e otimizar
              a experiência do paciente. Baseado no audit da Glacial Multimedia (Oct 2024).
            </p>
          </div>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {[
              { icon: Download, title: 'robots.txt', desc: 'Implantado. public/robots.txt com sitemap + AI crawlers autorizados (GPTBot, ClaudeBot, CCBot).', status: 'done' },
              { icon: LinkIcon, title: 'Canonical Tag', desc: 'Implantado site-wide via app/layout.tsx. Auto-referencial em todas as páginas.', status: 'done' },
              { icon: Tag, title: 'Hreflang pt-BR', desc: 'hreflang="pt-BR" + x-default configurado no layout.', status: 'done' },
              { icon: FileText, title: 'Meta title (50-60c)', desc: 'Reduzido de 74 para 58 caracteres. Testado com wc -c.', status: 'done' },
              { icon: MessageCircle, title: 'Meta description (120-160c)', desc: 'Ajustada de 167 para 152 caracteres. Inclui CTA.', status: 'done' },
              { icon: BarChart3, title: 'Image optimization', desc: 'WebP + width/height. 23.2MB → target 5MB. /doc otimizado (155kB).', status: 'partial' },
              { icon: Search, title: 'llms.txt', desc: 'Implantado. Site map + recursos para bots de IA. Verificável via curl.', status: 'done' },
              { icon: ImageIcon, title: 'Alt attributes', desc: 'Digitalização completa. Todas as imagens possuem alt text descritivo.', status: 'done' },
              { icon: Mail, title: 'SPF + DMARC', desc: 'DNS TXT records não configurados no Cloudflare. Pendente de ação.', status: 'pending' },
              { icon: Users, title: 'Structured data', desc: 'JSON-LD MedicalBusiness schema com address, hours, sameAs, keywords.', status: 'done' },
              { icon: Zap, title: 'OpenGraph + Twitter Cards', desc: 'og:title, og:description, og:image, card=summary_large_image implementados.', status: 'done' },
              { icon: Globe, title: 'Hreflang tags', desc: 'pt-BR + x-default no <head> via metadata.alternates. Verified via curl.', status: 'done' },
            ].map(({ icon: CIcon, title, desc, status }) => (
              <div
                key={title}
                className="rounded-xl border p-5"
                style={{ backgroundColor: 'var(--s-color-bg-canvas)', borderColor: 'var(--border-subtle)' }}
              >
                <div className="mb-3 flex items-center gap-3">
                  <div
                    className="flex h-9 w-9 items-center justify-center rounded-xl"
                    style={{ backgroundColor: 'bg-primary/12' }}
                  >
                    <CIcon className="h-5 w-5" style={{ color: 'var(--s-color-action-primary)' }} />
                  </div>
                  <h3 className="text-sm font-bold" style={{ color: 'var(--s-color-content-heading)' }}>{title}</h3>
                </div>
                <p className="mb-2 text-xs leading-relaxed" style={{ color: 'var(--s-color-content-muted)' }}>{desc}</p>
                <StatusBadge status={status as 'done' | 'partial' | 'pending'} />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Próximos passos */}
      <section className="py-16 sm:py-20" style={{ backgroundColor: 'var(--s-color-bg-surface)' }}>
        <div className="mx-auto w-full max-w-container px-4 sm:px-6 lg:px-8">
          <div className="mb-12">
            <div className="mb-4 inline-flex items-center gap-2 rounded-full border px-4 py-1.5 text-xs font-semibold" style={{ borderColor: 'border-amber-500/30', color: '#F59E0B', backgroundColor: 'bg-amber-500/08' }}>
              <ArrowRight className="h-4 w-4" />
              <span>Próximos passos</span>
            </div>
            <h2 className="text-3xl font-bold sm:text-4xl" style={headingStyle}>O que vem por aí</h2>
            <p className="mt-3 max-w-2xl text-base" style={mutedStyle}>
              Melhorias avançadas para tornar a plataforma ainda mais útil para pacientes e equipe.
            </p>
          </div>
          <SectionBlock title="Em desenvolvimento" icon={ArrowRight} items={PROXIMOS_PASSOS} />
        </div>
      </section>

      {/* Rodapé */}
      <section className="border-t py-12" style={{ borderColor: 'var(--border-subtle)' }}>
        <div className="mx-auto w-full max-w-container px-4 text-center sm:px-6 lg:px-8">
          <div className="mb-4 flex items-center justify-center gap-3">
            <Logo size="sm" />
            <span className="text-xs" style={{ color: 'var(--s-color-content-muted)' }}>Atualizado em 19 de outubro de 2026</span>
          </div>
          <p className="text-sm" style={mutedStyle}>
            Esta página documenta o estado atual da plataforma digital do Dr. Herlon Moura.
            Para detalhes sobre a <strong style={{ color: 'var(--s-color-action-primary)' }}>migração do WordPress</strong> ou
            a <strong style={{ color: 'var(--s-color-action-primary)' }}>arquitetura de SEO</strong>, entre em contato com a equipe.
            Última atualização: 19 de outubro de 2026.
          </p>
        </div>
      </section>
    </main>
  );
}
