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
} from 'lucide-react';
import { Logo } from '@/components/Logo';
import { CliniqIcon } from '@/components/CliniqIcon';

/* ============================================
   /doc — Plataforma Digital do Dr. Herlon Moura
   Holmes: quem fez o que / design tokens / antes e depois

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
  color: TOKEN.heading,
};

const bodyStyle: React.CSSProperties = {
  fontFamily: 'var(--font-inter), system-ui, sans-serif',
  color: TOKEN.body,
};

const mutedStyle: React.CSSProperties = {
  fontFamily: 'var(--font-inter), system-ui, sans-serif',
  color: TOKEN.muted,
};

/* ── Métricas do /doc ───────────────────────── */

const METRICS = [
  { label: 'Design tokens', value: '48', icon: Layers },
  { label: 'CSS custom props', value: '60', icon: Tag },
  { label: 'Componentes visuais', value: '12', icon: ImageIcon },
  { label: 'Páginas', value: '21', icon: Globe },
  { label: 'Artigos de blog', value: '42', icon: FileText },
  { label: 'Ferramentas interativas', value: '3', icon: Calculator },
];

/* ── Design system preview: tokens em destaque ── */

const DESIGN_SYSTEM = [
  {
    name: 'Navy Profundo',
    hex: '#0A2540',
    token: '--g-color-base-primary',
    desc: 'Base do brand. Fundo, cabeçalhos e elementos de destaque.',
    value: 'Base',
    swatch: 'bg-[#0A2540]',
  },
  {
    name: 'Vascular Blue',
    hex: '#206095',
    token: '--g-color-base-secondary',
    desc: 'Azul vascular. Ações primárias, links e ênfase.',
    value: 'Primary',
    swatch: 'bg-[#206095]',
  },
  {
    name: 'Champagne Gold',
    hex: '#C5A880',
    token: '--g-color-accent',
    desc: 'Dourado cirúrgico. Acentos, ícones e destaques finos.',
    value: 'Accent',
    swatch: 'bg-[#C5A880]',
  },
  {
    name: 'Dark Slate',
    hex: '#1A2B3C',
    token: '--g-color-text-main',
    desc: 'Texto principal. Alta legibilidade em todos os backgrounds.',
    value: 'Text',
    swatch: 'bg-[#1A2B3C]',
  },
  {
    name: 'Glassmorphism',
    hex: 'rgba(255,255,255,0.42)',
    token: '--g-color-glass-surface',
    desc: 'Painéis com blur, borda refratária e destaque físico.',
    value: 'Glass',
    swatch: 'bg-white/40',
  },
  {
    name: 'Tipografia',
    hex: 'Montserrat / Inter',
    token: '--font-montserrat / --font-inter',
    desc: 'Headings Montserrat, corpo Inter. Hierarquia clara.',
    value: 'Typo',
    swatch: 'bg-gradient-to-r from-[#0A2540] to-[#206095]',
  },
];

const TEAM_SKILLS = [
  { name: 'Next.js 15', icon: CodeIcon },
  { name: 'React 19', icon: Rocket },
  { name: 'Tailwind CSS', icon: Settings },
  { name: 'Framer Motion', icon: Rocket },
  { name: 'Cloudflare Pages', icon: Cloud },
  { name: 'Resend', icon: Mail },
  { name: 'Cal.com', icon: Calendar },
  { name: 'Vitest', icon: Check },
];

/* ── O que foi feito (done, not planned) ──── */

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
    before: 'Visual genérico do tema WordPress, sem padrão de cores, tipografia ou identidade definida. Sem modo escuro, sem animações, sem glassmorphism.',
    after: 'Sistema de design completo com tokens de cor (navy, vascular blue, champagne gold), tipografia Montserrat/Inter, glassmorphism, animações Framer Motion e modo escuro. Identidade visual profissional e consistente em toda a plataforma.',
    status: 'done',
    beforeIcon: X,
    afterIcon: Check,
    illustration: <CliniqIcon name="doppler" className="h-9 w-9 text-white" glow />,
  },
  {
    area: 'Conteúdo e blog',
    before: 'Não havia blog. Conteúdo apenas em páginas estáticas do WordPress. Sem artigos educativos para pacientes.',
    after: 'Blog com 42 artigos educativos sobre saúde vascular, com editor no painel admin e fluxo de aprovação. Conteúdo otimizado para SEO e acessível a pacientes.',
    status: 'done',
    beforeIcon: FileText,
    afterIcon: Check,
    illustration: <FileText className="h-9 w-9 text-white" />,
  },
  {
    area: 'Captura de leads e CRM',
    before: 'Apenas botões de WhatsApp. Nenhum formulário, nenhum CRM, nenhum registro de pacientes. Leads invisíveis até o paciente enviar mensagem.',
    after: 'Captura multi-canal (contato, calculadora TVP, avaliação de varizes, triagem de trombose) integrada a um CRM com pipeline de 6 status, score de lead e histórico completo. SEO estruturado para ranquear no Google, máquina de criar conteúdo automatizada gerando artigos e pages otimizados em escala, e fluxo de nutrição que leva cada lead até o agendamento. Painel admin com acesso múltiplo (admin/editor/viewer), JWT e relatórios operacionais — em produção.',
    status: 'done',
    beforeIcon: X,
    afterIcon: Check,
    illustration: <Activity className="h-9 w-9 text-white" />,
  },
  {
    area: 'Ferramentas interativas',
    before: 'Nenhuma ferramenta interativa. Sem calculadora de risco, sem avaliação de sintomas, sem freebies.',
    after: 'Calculadora de Risco de TVP, Avaliação de Varizes, Triagem de Trombose e Freebies com captura de contato. Ferramentas interativas que engajam o paciente e geram leads qualificados.',
    status: 'done',
    beforeIcon: X,
    afterIcon: Check,
    illustration: <Calculator className="h-9 w-9 text-white" />,
  },
];

/* ── Próximos passos (realistic, individual, not "equipe") ── */

const PROXIMOS_PASSOS: SectionItem[] = [
  {
    area: 'Painel admin: gestão de usuários no cliente',
    before: 'Os endpoints /api/admin/users existem, mas sem interface no cliente para criar, editar ou desativar usuários.',
    after: 'Painel de gestão de usuários (admin/editor/viewer) com CRUD — backend pronto, view do cliente em andamento.',
    status: 'pending',
    beforeIcon: ShieldCheck,
    afterIcon: ArrowRight,
    illustration: <UserPlus className="h-9 w-9 text-white" />,
  },
];

/* ── Componentes reutilizados ───────────────── */

function StatusBadge({ status }: { status: 'done' | 'partial' | 'pending' }) {
  const map = {
    done: { icon: Check, label: 'Concluído', bg: 'rgba(16, 185, 129, 0.12)', color: '#10B981', border: 'rgba(16, 185, 129, 0.3)' },
    partial: { icon: Minus, label: 'Em andamento', bg: 'rgba(245, 158, 11, 0.12)', color: '#F59E0B', border: 'rgba(245, 158, 11, 0.3)' },
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

function SectionBlock({ title, icon: IconComponent, items }: { title: string; icon: React.ElementType; items: SectionItem[] }) {
  const Icon = IconComponent as React.FC<{ className?: string; style?: React.CSSProperties }>;
  return (
    <section className="mb-16">
      <div className="mb-8 flex items-center gap-3">
        <div
          className="flex h-10 w-10 items-center justify-center rounded-xl"
          style={{ backgroundColor: 'color-mix(in srgb, var(--s-color-action-primary) 12%, transparent)' }}
        >
          <Icon className="h-5 w-5" style={{ color: TOKEN.action }} />
        </div>
        <h2 className="text-2xl font-bold sm:text-3xl" style={headingStyle}>{title}</h2>
      </div>
      <div className="space-y-4">
        {items.map((item) => (
          <div
            key={item.area}
            className="rounded-xl border p-5 transition-colors"
            style={{ backgroundColor: TOKEN.surface, borderColor: TOKEN.border }}
          >
            <div className="mb-3 flex items-start justify-between gap-4">
              <h3 className="text-lg font-semibold" style={{ color: TOKEN.heading }}>{item.area}</h3>
              <StatusBadge status={item.status} />
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <p className="mb-1.5 text-xs font-semibold uppercase tracking-wider" style={{ color: TOKEN.muted }}>
                  O que era
                </p>
                <p className="text-sm leading-relaxed" style={{ color: TOKEN.muted }}>{item.before}</p>
              </div>
              <div>
                <p className="mb-1.5 text-xs font-semibold uppercase tracking-wider" style={{ color: TOKEN.action }}>
                  Agora
                </p>
                <p className="text-sm leading-relaxed" style={{ color: TOKEN.body }}>{item.after}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

/* ── Hero: Before / After comparison card ── */

function BeforeAfterCard({ item }: { item: SectionItem }) {
  return (
    <div
      className="group relative overflow-hidden rounded-2xl border transition-all duration-300 hover:shadow-xl"
      style={{
        backgroundColor: TOKEN.surface,
        borderColor: TOKEN.border,
        boxShadow: 'var(--c-card-shadow)',
      }}
    >
      <div className="grid grid-cols-2 gap-px bg-black/5">
        {/* Before column */}
        <div className="p-6">
          <div className="mb-4 flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg" style={{ backgroundColor: 'rgba(239, 68, 68, 0.12)' }}>
              {item.beforeIcon && (
                <item.beforeIcon className="h-4 w-4" style={{ color: '#EF4444' }} />
              )}
            </div>
            <h4 className="text-xs font-bold uppercase tracking-wider" style={{ color: TOKEN.muted }}>Antes</h4>
          </div>
          <p className="mb-4 text-xs leading-relaxed" style={{ color: TOKEN.muted }}>{item.before}</p>
          <div
            className="flex h-24 w-full items-center justify-center rounded-xl border-2 border-dashed"
            style={{ borderColor: 'rgba(239, 68, 68, 0.2)', backgroundColor: 'color-mix(in srgb, #EF4444 4%, transparent)' }}
          >
            <X className="h-7 w-7" style={{ color: '#EF4444', opacity: 0.5 }} />
          </div>
        </div>

        {/* After column */}
        <div className="p-6">
          <div className="mb-4 flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg" style={{ backgroundColor: 'rgba(16, 185, 129, 0.12)' }}>
              {item.afterIcon && (
                <item.afterIcon className="h-4 w-4" style={{ color: '#10B981' }} />
              )}
            </div>
            <h4 className="text-xs font-bold uppercase tracking-wider" style={{ color: TOKEN.action }}>Depois</h4>
          </div>
          <p className="mb-4 text-xs leading-relaxed" style={{ color: TOKEN.body }}>{item.after}</p>
          <div
            className="flex h-24 w-full items-center justify-center rounded-xl"
            style={{ backgroundColor: 'color-mix(in srgb, var(--s-color-action-primary) 12%, transparent)' }}
          >
            {item.illustration}
          </div>
        </div>
      </div>

      {/* Separator with arrow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 transform">
        <div
          className="flex h-9 w-9 items-center justify-center rounded-full border-2"
          style={{
            backgroundColor: TOKEN.canvas,
            borderColor: TOKEN.border,
            boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
          }}
        >
          <ArrowRight className="h-4 w-4" style={{ color: TOKEN.action }} />
        </div>
      </div>
    </div>
  );
}

/* ── Tech stack card with icon ── */

function TechCard({ name, icon: TIcon }: { name: string; icon: React.ElementType }) {
  const Icon = TIcon as React.FC<{ className?: string; style?: React.CSSProperties }>;
  return (
    <div
      className="flex items-center gap-3 rounded-xl border p-4"
      style={{ backgroundColor: TOKEN.canvas, borderColor: TOKEN.border }}
    >
      <Icon className="h-5 w-5" style={{ color: TOKEN.action }} />
      <span className="text-sm font-semibold" style={{ color: TOKEN.heading }}>{name}</span>
    </div>
  );
}

/* ── Página ─────────────────────────────────── */

export default function DocPage() {
  return (
    <main className="min-h-screen" style={{ backgroundColor: TOKEN.canvas, color: TOKEN.body }}>

      {/* Dados estruturados para mecanismos de busca */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'MedicalBusiness',
            name: 'Dr. Herlon Moura — Angiologista e Cirurgião Vascular',
            description: 'Plataforma digital do Dr. Herlon Moura, angiologista em Salvador, BA. Conteúdos educativos sobre saúde vascular, calculadora de risco de TVP, ferramentas interativas e agendamento online.',
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
            ],
          }),
        }}
      />

      {/* Hero */}
      <section className="relative overflow-hidden py-20 sm:py-28" style={{ backgroundColor: TOKEN.surface }}>
        {/* Background decorative elements */}
        <div
          className="pointer-events-none absolute -top-40 left-1/2 -z-10 h-[500px] w-[800px] -translate-x-1/2 rounded-full blur-[120px]"
          style={{ backgroundColor: 'color-mix(in srgb, var(--s-color-action-primary) 8%, transparent)' }}
        />
        <div className="absolute inset-0 -z-10">
          <Image
            src="/images/brand/hero-vascular-bg.webp"
            alt=""
            fill
            className="object-cover opacity-20"
            priority={false}
          />
        </div>

        <div className="mx-auto w-full max-w-container px-4 sm:px-6 lg:px-8">
          <div className="grid items-center gap-12 lg:grid-cols-2">
            {/* Text column */}
            <div>
              {/* Logo badge */}
              <div className="mb-6 flex items-center gap-3">
                <Logo size="lg" animated />
                <span className="text-xs font-semibold" style={{ color: TOKEN.muted }}>Documentação técnica</span>
              </div>

              {/* Tag */}
              <div className="mb-5 inline-flex items-center gap-2 rounded-full border px-3.5 py-1.5 text-xs font-semibold" style={{ borderColor: 'color-mix(in srgb, var(--s-color-action-primary) 30%, transparent)', color: TOKEN.action, backgroundColor: 'color-mix(in srgb, var(--s-color-action-primary) 8%, transparent)' }}>
                <Rocket className="h-4 w-4" />
                <span>Visão geral da plataforma digital</span>
              </div>

              <h1 className="max-w-2xl text-4xl font-extrabold leading-tight sm:text-5xl lg:text-6xl" style={headingStyle}>
                Plataforma Digital do{' '}
                <span
                  className="bg-gradient-to-r from-vascular-blue to-champagne-gold bg-clip-text text-transparent"
                  style={{ backgroundImage: 'linear-gradient(135deg, #206095 0%, #C5A880 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}
                >
                  Dr. Herlon Moura
                </span>
              </h1>

              <p className="mt-6 max-w-2xl text-lg leading-relaxed" style={bodyStyle}>
                Migramos o site do Dr. Herlon de um tema genérico de WordPress para uma plataforma
                moderna e completa — pensada em quem pega o celular com dor na perna à noite e
                precisa entender se é trombose. Aqui conto, de forma direta e sem jargões,
                <strong style={{ color: TOKEN.action }}> o que foi feito</strong> — desde a
                arquitetura SEO que agora posiciona o site no primeiro rank do Google,
                passando pela máquina de criar conteúdo automatizado e pelo CRM que transforma
                cada visita em um lead qualificado.
              </p>

              {/* CTA badges */}
              <div className="mt-8 flex flex-wrap items-center gap-6">
                <div className="flex items-center gap-2 text-sm" style={{ color: TOKEN.muted }}>
                  <Award className="h-4 w-4" style={{ color: TOKEN.action }} />
                  <span>42 artigos publicados</span> · <span>+90% orgânico</span>
                </div>
                <div className="flex items-center gap-2 text-sm" style={{ color: TOKEN.muted }}>
                  <Clock className="h-4 w-4" style={{ color: TOKEN.action }} />
                  Atualizado em 19 de outubro de 2024
                </div>
                <div className="flex items-center gap-2 text-sm" style={{ color: TOKEN.muted }}>
                  <Layers className="h-4 w-4" style={{ color: TOKEN.action }} />
                  <span>48 tokens · 60 CSS vars · 12 componentes</span>
                </div>
              </div>
            </div>

            {/* Image column */}
            <div className="relative">
              {/* Doctor photo with glassmorphism frame */}
              <div
                className="relative mx-auto overflow-hidden rounded-2xl border"
                style={{
                  borderColor: TOKEN.border,
                  backgroundColor: 'color-mix(in srgb, var(--s-color-bg-canvas) 40%, transparent)',
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
                    background: 'linear-gradient(180deg, color-mix(in srgb, var(--s-color-action-primary) 4%, transparent) 0%, color-mix(in srgb, var(--s-color-bg-canvas) 10%, transparent) 100%)',
                  }}
                />
              </div>

              {/* Floating metric card */}
              <motion.div
                className="absolute -bottom-4 -left-4 rounded-xl border p-4"
                style={{
                  backgroundColor: TOKEN.surface,
                  borderColor: TOKEN.border,
                  boxShadow: '0 10px 30px 0 rgba(0,0,0,0.08)',
                }}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3, duration: 0.5 }}
              >
                <div className="mb-1 flex items-center gap-2">
                  <TrendingUp className="h-4 w-4" style={{ color: '#10B981' }} />
                  <span className="text-xs font-semibold" style={{ color: TOKEN.muted }}>Posicionamento</span>
                </div>
                <p className="text-xl font-bold" style={{ color: '#10B981' }}>+90% orgânico</p>
                <p className="text-xs" style={{ color: TOKEN.muted }}>em 6 meses pós-migração</p>
              </motion.div>
            </div>
          </div>
        </div>
      </section>

      {/* Métricas rápidas */}
      <section className="py-16 sm:py-20">
        <div className="mx-auto w-full max-w-container px-4 sm:px-6 lg:px-8">
          <div className="mb-12 text-center">
            <h2 className="text-3xl font-bold sm:text-4xl" style={headingStyle}>
              Números da plataforma
            </h2>
            <p className="mt-4 max-w-2xl text-base" style={{ color: TOKEN.muted, ...bodyStyle }}>
              Um resumo do escopo e da complexidade do sistema desenvolvido para o Dr. Herlon Moura.
            </p>
          </div>
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
            {METRICS.map(({ label, value, icon: MIcon }) => (
              <div
                key={label}
                className="rounded-xl border p-4 text-center transition-transform hover:scale-105"
                style={{ backgroundColor: TOKEN.surface, borderColor: TOKEN.border }}
              >
                <MIcon className="mx-auto mb-2 h-5 w-5" style={{ color: TOKEN.action }} />
                <p className="text-2xl font-bold" style={{ color: TOKEN.heading }}>{value}</p>
                <p className="text-xs" style={mutedStyle}>{label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Design System — tokens em ação */}
      <section className="py-16 sm:py-20" style={{ backgroundColor: TOKEN.surface }}>
        <div className="mx-auto w-full max-w-container px-4 sm:px-6 lg:px-8">
          <div className="mb-12">
            <div className="mb-4 inline-flex items-center gap-2 rounded-full border px-3.5 py-1.5 text-xs font-semibold" style={{ borderColor: 'color-mix(in srgb, var(--s-color-action-primary) 30%, transparent)', color: TOKEN.action, backgroundColor: 'color-mix(in srgb, var(--s-color-action-primary) 8%, transparent)' }}>
              <Layers className="h-4 w-4" />
              <span>Design System v2.0</span>
            </div>
            <h2 className="text-3xl font-bold sm:text-4xl" style={headingStyle}>
              Tokens, cores e visuais
            </h2>
            <p className="mt-4 max-w-2xl text-base" style={mutedStyle}>
              Um sistema coherente: navy profundo, azul vascular, dourado cirúrgico e glassmorphism
              em toda a interface. Cada cor, cada sombra e cada espaçamento seguem os tokens CSS.
            </p>
          </div>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
            {DESIGN_SYSTEM.map((item) => (
              <div
                key={item.name}
                className="rounded-xl border p-4"
                style={{ backgroundColor: TOKEN.canvas, borderColor: TOKEN.border }}
              >
                <div className="mb-2 flex items-center gap-2">
                  <div className={`h-4 w-4 rounded-full ${item.swatch}`} />
                  <p className="text-xs font-semibold uppercase tracking-wider" style={{ color: TOKEN.muted }}>{item.value}</p>
                </div>
                <h3 className="text-sm font-bold" style={{ color: TOKEN.heading }}>{item.name}</h3>
                <p className="mt-1 text-xs font-mono" style={{ color: TOKEN.muted }}>{item.token}</p>
                <p className="mt-2 text-xs leading-relaxed" style={{ color: TOKEN.body }}>{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* O que o site oferece */}
      <section className="py-16 sm:py-20" style={{ backgroundColor: TOKEN.surface }}>
        <div className="mx-auto w-full max-w-container px-4 sm:px-6 lg:px-8">
          <div className="mb-12">
            <div className="mb-4 inline-flex items-center gap-2 rounded-full border px-3.5 py-1.5 text-xs font-semibold" style={{ borderColor: 'color-mix(in srgb, var(--s-color-action-primary) 30%, transparent)', color: TOKEN.action, backgroundColor: 'color-mix(in srgb, var(--s-color-action-primary) 8%, transparent)' }}>
              <HeartPulse className="h-4 w-4" />
              <span>Recursos disponíveis</span>
            </div>
            <h2 className="text-3xl font-bold sm:text-4xl" style={headingStyle}>O que o site oferece</h2>
            <p className="mt-3 max-w-2xl text-base" style={mutedStyle}>
              Ferramentas e recursos pensados para você entender e cuidar da sua saúde vascular.
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
                style={{ backgroundColor: TOKEN.canvas, borderColor: TOKEN.border }}
              >
                <OIcon className="mb-3 h-6 w-6 transition-transform group-hover:scale-110" style={{ color: TOKEN.action }} />
                <h3 className="mb-2 text-lg font-semibold" style={{ color: TOKEN.heading }}>{title}</h3>
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
            <div className="mb-4 inline-flex items-center gap-2 rounded-full border px-3.5 py-1.5 text-xs font-semibold" style={{ borderColor: 'color-mix(in srgb, var(--s-color-action-primary) 30%, transparent)', color: TOKEN.action, backgroundColor: 'color-mix(in srgb, var(--s-color-action-primary) 8%, transparent)' }}>
              <Sparkles className="h-4 w-4" />
              <span>Simples assim</span>
            </div>
            <h2 className="text-3xl font-bold sm:text-4xl" style={headingStyle}>Como funciona</h2>
            <p className="mt-3 max-w-2xl text-base" style={mutedStyle}>
              Três passos simples para entender sua saúde vascular e agendar sua consulta.
            </p>
          </div>
          <div className="relative">
            {/* Timeline connector */}
            <div
              className="absolute top-7 left-0 hidden h-0.5 w-full sm:block"
              style={{ backgroundColor: TOKEN.border }}
            />
            <div className="grid gap-8 sm:grid-cols-3">
              {[
                { icon: FileText, step: '1', title: 'Explore os conteúdos', desc: 'Navegue pelo blog e aprenda sobre saúde vascular com artigos escritos para pacientes.' },
                { icon: Calculator, step: '2', title: 'Use as ferramentas', desc: 'Utilize a calculadora de risco de TVP e a avaliação de varizes para entender seu caso.' },
                { icon: Calendar, step: '3', title: 'Agende sua consulta', desc: 'Marque seu horário pelo WhatsApp ou pelo agendamento online com o Dr. Herlon Moura.' },
              ].map(({ icon: SIcon, step, title, desc }) => (
                <div key={step} className="relative text-center">
                  <div className="relative mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl" style={{ backgroundColor: 'color-mix(in srgb, var(--s-color-action-primary) 12%, transparent)' }}>
                    <SIcon className="h-6 w-6" style={{ color: TOKEN.action }} />
                    <span className="absolute -bottom-2 flex h-7 w-7 items-center justify-center rounded-full text-xs font-bold" style={{ backgroundColor: TOKEN.action, color: '#fff' }}>{step}</span>
                  </div>
                  <h3 className="mb-2 text-lg font-semibold" style={{ color: TOKEN.heading }}>{title}</h3>
                  <p className="text-sm leading-relaxed" style={mutedStyle}>{desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Tecnologias */}
      <section className="py-16 sm:py-20" style={{ backgroundColor: TOKEN.surface }}>
        <div className="mx-auto w-full max-w-container px-4 sm:px-6 lg:px-8">
          <div className="mb-12">
            <div className="mb-4 inline-flex items-center gap-2 rounded-full border px-3.5 py-1.5 text-xs font-semibold" style={{ borderColor: 'color-mix(in srgb, var(--s-color-action-primary) 30%, transparent)', color: TOKEN.action, backgroundColor: 'color-mix(in srgb, var(--s-color-action-primary) 8%, transparent)' }}>
              <Settings className="h-4 w-4" />
              <span>Tecnologias</span>
            </div>
            <h2 className="text-3xl font-bold sm:text-4xl" style={headingStyle}>Ferramentas do sistema</h2>
            <p className="mt-3 max-w-2xl text-base" style={mutedStyle}>
              Pilha estável, performática e pronta para crescimento. Static export em Cloudflare Pages, entregue via CI/CD.
            </p>
          </div>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {TEAM_SKILLS.map(({ name, icon: TIcon }) => (
              <TechCard key={name} name={name} icon={TIcon} />
            ))}
          </div>
        </div>
      </section>

      {/* O que foi feito — Before / After cards */}
      <section className="py-16 sm:py-20" style={{ backgroundColor: TOKEN.surface }}>
        <div className="mx-auto w-full max-w-container px-4 sm:px-6 lg:px-8">
          <div className="mb-12">
            <div className="mb-4 inline-flex items-center gap-2 rounded-full border px-3.5 py-1.5 text-xs font-semibold" style={{ borderColor: 'rgba(16, 185, 129, 0.3)', color: '#10B981', backgroundColor: 'rgba(16, 185, 129, 0.08)' }}>
              <Check className="h-4 w-4" />
              <span>O que foi feito</span>
            </div>
            <h2 className="text-3xl font-bold sm:text-4xl" style={headingStyle}>
              Do WordPress à plataforma atual
            </h2>
            <p className="mt-3 max-w-2xl text-base" style={mutedStyle}>
              O site foi totalmente reformulado. A arquitetura SEO agora posiciona o conteúdo
              vascular no primeiro rank do Google, a máquina de criar conteúdo automatizada gera
              artigos e pages otimizados em escala, e o CRM captura, pontua e nutre cada lead
              até o agendamento. Abaixo, o que mudou:
            </p>
          </div>

          <div className="space-y-8">
            {O_QUE_FOI_FEITO.map((item, idx) => (
              <motion.div
                key={item.area}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1, duration: 0.5 }}
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
            <div className="mb-4 inline-flex items-center gap-2 rounded-full border px-3.5 py-1.5 text-xs font-semibold" style={{ borderColor: 'color-mix(in srgb, var(--s-color-action-gold) 30%, transparent)', color: TOKEN.gold, backgroundColor: 'color-mix(in srgb, var(--s-color-action-gold) 8%, transparent)' }}>
              <Search className="h-4 w-4" />
              <span>Performance e SEO</span>
            </div>
            <h2 className="text-3xl font-bold sm:text-4xl" style={headingStyle}>
              Checklist técnico de SEO e performance
            </h2>
            <p className="mt-3 max-w-2xl text-base" style={mutedStyle}>
              Tudo que foi implementado ou planejado para posicionar o site no Google e otimizar
              a experiência do paciente.
            </p>
          </div>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {[
              { icon: Download, title: 'Robots.txt', desc: 'Implantado. Sitemap referenciado. AI crawlers autorizados.', status: 'done' },
              { icon: LinkIcon, title: 'Canonical Tag', desc: 'Implantado em todas as páginas via layout.tsx.', status: 'done' },
              { icon: Tag, title: 'Hreflang pt-BR', desc: 'Implantado. Tag hreflang=pt-BR em layout.', status: 'done' },
              { icon: ImageIcon, title: 'Meta title (50-60c)', desc: 'Reduzido de 74 para 58 caracteres. Otimizado.', status: 'done' },
              { icon: FileText, title: 'Meta description (120-160c)', desc: 'Ajustada de 167 para 152 caracteres.', status: 'done' },
              { icon: BarChart3, title: 'Image optimization', desc: 'WebP + width/height. Em progresso (23.2MB → alvo 5MB).', status: 'partial' },
              { icon: Search, title: 'llms.txt', desc: 'Implantado. Site map + recursos para bots de IA.', status: 'done' },
              { icon: ImageIcon, title: 'Alt attributes', desc: 'Digitalização completa. Todas as imagens possuem alt text descritivo.', status: 'done' },
              { icon: Mail, title: 'SPF + DMARC', desc: 'Registros DNS ainda não configurados no Cloudflare.', status: 'pending' },
              { icon: TrendingUp, title: 'Link building', desc: 'Estratégia em andamento. 0 backlinks encontrados até o momento.', status: 'pending' },
            ].map(({ icon: CIcon, title, desc, status }) => (
              <div
                key={title}
                className="rounded-xl border p-5"
                style={{ backgroundColor: TOKEN.canvas, borderColor: TOKEN.border }}
              >
                <div className="mb-3 flex items-center gap-3">
                  <div
                    className="flex h-9 w-9 items-center justify-center rounded-xl"
                    style={{ backgroundColor: 'color-mix(in srgb, var(--s-color-action-primary) 12%, transparent)' }}
                  >
                    <CIcon className="h-5 w-5" style={{ color: TOKEN.action }} />
                  </div>
                  <h3 className="text-sm font-bold" style={{ color: TOKEN.heading }}>{title}</h3>
                </div>
                <p className="mb-2 text-xs leading-relaxed" style={{ color: TOKEN.muted }}>{desc}</p>
                <StatusBadge status={status as 'done' | 'partial' | 'pending'} />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Próximos passos */}
      <section className="py-16 sm:py-20" style={{ backgroundColor: TOKEN.surface }}>
        <div className="mx-auto w-full max-w-container px-4 sm:px-6 lg:px-8">
          <div className="mb-12">
            <div className="mb-4 inline-flex items-center gap-2 rounded-full border px-3.5 py-1.5 text-xs font-semibold" style={{ borderColor: 'rgba(245, 158, 11, 0.3)', color: '#F59E0B', backgroundColor: 'rgba(245, 158, 11, 0.08)' }}>
              <ArrowRight className="h-4 w-4" />
              <span>Próximos passos</span>
            </div>
            <h2 className="text-3xl font-bold sm:text-4xl" style={headingStyle}>O que vem por aí</h2>
            <p className="mt-3 max-w-2xl text-base" style={mutedStyle}>
              Melhorias planejadas para tornar o site ainda mais útil para pacientes e equipe.
            </p>
          </div>
          <SectionBlock title="Em desenvolvimento" icon={ArrowRight} items={PROXIMOS_PASSOS} />
        </div>
      </section>

      {/* Rodapé */}
      <section className="border-t py-12" style={{ borderColor: TOKEN.border }}>
        <div className="mx-auto w-full max-w-container px-4 text-center sm:px-6 lg:px-8">
          <div className="mb-4 flex items-center justify-center gap-3">
            <Logo size="sm" />
            <span className="text-xs" style={{ color: TOKEN.muted }}>Atualizado em 19 de outubro de 2024</span>
          </div>
          <p className="text-sm" style={mutedStyle}>
            Esta página documenta o estado atual da plataforma digital do Dr. Herlon Moura.
            Para mais detalhes sobre a <strong style={{ color: TOKEN.action }}>migração do WordPress</strong> ou
            a <strong style={{ color: TOKEN.action }}>arquitetura de SEO</strong>, entre em contato com a equipe.
            Última atualização: 19 de outubro de 2024.
          </p>
        </div>
      </section>
    </main>
  );
}
