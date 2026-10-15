'use client';

import React from 'react';
import {
  HeartPulse, FileText, Calculator, Stethoscope, Calendar,
  MessageCircle, Wrench, Users, ShieldCheck, Search,
  Globe, UserPlus, TrendingUp, Check, Minus, X,
  ArrowRight, Rocket, Sparkles, Palette, Code, Eye, Settings,
  Cloud, Mail, Phone, MapPin, Award, Clock, GitBranch
} from 'lucide-react';

/* ============================================
   /doc — Plataforma Digital do Dr. Herlon Moura
   Visão geral da plataforma + quem a fez

   Hudson Argollo — web wizard · front-end
   Dr. Herlon Moura dos Santos — angiologista (cousin)
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
  { label: 'Design tokens', value: '48', icon: Palette },
  { label: 'CSS custom props', value: '60', icon: Code },
  { label: 'Visual components', value: '12', icon: Eye },
  { label: 'Pages', value: '21', icon: Globe },
  { label: 'Blog artigos', value: '42', icon: FileText },
  { label: 'Ferramentas', value: '3', icon: Calculator },
];

/* ── Design system preview: tokens em destaque ── */

const DESIGN_SYSTEM = [
  {
    name: 'Navy profundo',
    tokens: 'var(--g-color-base-primary)',
    desc: '#0A2540 — base do brand. Fundo e cabeçalhos.',
    value: 'Navy',
  },
  {
    name: 'Vascular Blue',
    tokens: 'var(--g-color-base-secondary)',
    desc: '#206095 — azul vascular. Ações primárias e links.',
    value: 'Blue',
  },
  {
    name: 'Champagne Gold',
    tokens: 'var(--g-color-accent)',
    desc: '#C5A880 — dourado cirúrgico. Acentos e destaques.',
    value: 'Gold',
  },
  {
    name: 'Dark Slate',
    tokens: 'var(--g-color-text-main)',
    desc: '#1A2B3C — texto principal. Alta legibilidade.',
    value: 'Slate',
  },
  {
    name: 'Glassmorphism',
    tokens: 'var(--glass-bg) / var(--glass-border) / var(--glass-shadow)',
    desc: 'Painéis com blur, borda refratária e destaque físico.',
    value: 'Glass',
  },
  {
    name: 'Typography',
    tokens: 'var(--font-montserrat) / var(--font-inter)',
    desc: 'Headings Montserrat, corpo Inter. Hierarquia clara.',
    value: 'Typo',
  },
];

/* ── Personalização: quem fez ──────────────── */

const PERSONAL = [
  {
    name: 'Hudson Argollo',
    role: 'Web wizard · front-end',
    bio: 'Desenvolvi a plataforma inteira de front-end: o design system, os componentes glassmorphism, as animações, a calculadora, o painel admin e o blog.',
    avatar: 'H',
  },
  {
    name: 'Dr. Herlon Moura dos Santos',
    role: 'Angiologista · mentor',
    bio: 'Especialista em cirurgia vascular e endovascular (CRM/BA 23904). O conteúdo, a voz e a visão clínica da plataforma são seus.',
    avatar: 'HM',
  },
];

const TEAM_SKILLS = [
  { name: 'Next.js 15', icon: Code },
  { name: 'React 19', icon: Rocket },
  { name: 'Tailwind CSS 3', icon: Settings },
  { name: 'Framer Motion', icon: Rocket },
  { name: 'Cloudflare Pages', icon: Cloud },
  { name: 'Resend', icon: Mail },
  { name: 'Cal.com', icon: Calendar },
  { name: 'Vitest', icon: Check },
];

/* ── Comparação: antes vs depois ────────────── */

interface SectionItem {
  area: string;
  before: string;
  after: string;
  status: 'done' | 'partial' | 'pending';
}

const COMPARACOES: SectionItem[] = [
  {
    area: 'Design e identidade visual',
    before: 'Visual genérico do tema WordPress, sem padrão de cores, tipografia ou identidade definida. Sem modo escuro, sem animações, sem glassmorphism.',
    after: 'Sistema de design completo com tokens de cor, tipografia Montserrat/Inter, glassmorphism, animações e modo escuro. Identidade visual profissional e consistente.',
    status: 'done',
  },
  {
    area: 'Conteúdo e blog',
    before: 'Não havia blog. Conteúdo apenas em páginas estáticas do WordPress. Sem artigos educativos para pacientes.',
    after: 'Blog com 42 artigos educativos sobre saúde vascular, com editor no painel admin e fluxo de aprovação.',
    status: 'done',
  },
  {
    area: 'Captura de leads e CRM',
    before: 'Apenas botões de WhatsApp. Nenhum formulário, nenhum CRM, nenhum registro de pacientes. Leads invisíveis até o paciente enviar mensagem.',
    after: 'Captura multi-canal com formulário de contato, calculadora TVP, avaliação de varizes e triagem de trombose. Painel CRM com pipeline de 6 status, score e histórico.',
    status: 'done',
  },
  {
    area: 'Ferramentas interativas',
    before: 'Nenhuma ferramenta interativa. Sem calculadora de risco, sem avaliação de sintomas, sem freebies.',
    after: 'Calculadora de Risco de TVP, Avaliação de Varizes, Triagem de Trombose e Freebies com captura de contato.',
    status: 'done',
  },
];

/* ── Próximos passos ────────────────────────── */

const PROXIMOS_PASSOS: SectionItem[] = [
  {
    area: 'Acesso multiusuário',
    before: 'Permitir que diferentes membros da equipe acessem o painel administrativo com permissões específicas.',
    after: 'Cada pessoa da equipe poderá ter um acesso adequado à sua função.',
    status: 'pending',
  },
  {
    area: 'Relatórios detalhados',
    before: 'Relatórios completos sobre o comportamento dos visitantes e as conversões do site.',
    after: 'A equipe poderá entender melhor como os pacientes utilizam o site e onde melhorar.',
    status: 'pending',
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

function SectionBlock({ title, icon: IconComponent, items }: { title: string; icon: React.ElementType; items: typeof COMPARACOES }) {
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
                  O que será feito
                </p>
                <p className="text-sm leading-relaxed" style={{ color: TOKEN.muted }}>{item.before}</p>
              </div>
              <div>
                <p className="mb-1.5 text-xs font-semibold uppercase tracking-wider" style={{ color: TOKEN.action }}>
                  Benefício para pacientes e equipe
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
            name: 'Dr. Herlon Moura — Angiologista',
            description: 'Plataforma digital do Dr. Herlon Moura, angiologista em Salvador, BA. Conteúdos educativos sobre saúde vascular, calculadora de risco de TVP e agendamento online.',
            url: 'https://herlonmoura.clubemkt.digital',
            medicalSpecialty: 'Vascular',
            address: {
              '@type': 'PostalAddress',
              addressLocality: 'Salvador',
              addressRegion: 'BA',
              addressCountry: 'BR',
            },
          }),
        }}
      />

      {/* Hero */}
      <section className="relative overflow-hidden py-20 sm:py-28" style={{ backgroundColor: TOKEN.surface }}>
        <div
          className="pointer-events-none absolute -top-40 left-1/2 -z-10 h-[500px] w-[800px] -translate-x-1/2 rounded-full blur-[120px]"
          style={{ backgroundColor: 'color-mix(in srgb, var(--s-color-action-primary) 8%, transparent)' }}
        />
        <div className="mx-auto w-full max-w-container px-4 sm:px-6 lg:px-8">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border px-3.5 py-1.5 text-xs font-semibold" style={{ borderColor: 'color-mix(in srgb, var(--s-color-action-primary) 30%, transparent)', color: TOKEN.action }}>
            <Rocket className="h-4 w-4" />
            <span>Visão geral da plataforma</span>
          </div>
          <h1 className="max-w-3xl text-4xl font-extrabold leading-tight sm:text-5xl lg:text-6xl" style={headingStyle}>
            Plataforma Digital do{' '}
            <span className="bg-gradient-to-r from-vascular-blue to-champagne-gold bg-clip-text text-transparent" style={{ backgroundImage: 'linear-gradient(135deg, #206095 0%, #C5A880 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
              Dr. Herlon Moura
            </span>
          </h1>
          <p className="mt-6 max-w-2xl text-lg leading-relaxed" style={mutedStyle}>
            Um site moderno e completo para pacientes e equipe: conteúdos educativos, ferramentas
            interativas e agendamento online — tudo em um só lugar.
          </p>
        </div>
      </section>

      {/* Métricas */}
      <section className="py-16 sm:py-20">
        <div className="mx-auto w-full max-w-container px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
            {METRICS.map(({ label, value, icon: MIcon }) => (
              <div
                key={label}
                className="rounded-xl border p-4 text-center"
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
            <div className="mb-4 inline-flex items-center gap-2 rounded-full border px-3.5 py-1.5 text-xs font-semibold" style={{ borderColor: 'color-mix(in srgb, var(--s-color-action-primary) 30%, transparent)', color: TOKEN.action }}>
              <Palette className="h-4 w-4" />
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
                <p className="text-xs font-semibold uppercase tracking-wider" style={{ color: TOKEN.muted }}>
                  {item.value}
                </p>
                <h3 className="mt-1 text-sm font-bold" style={{ color: TOKEN.heading }}>{item.name}</h3>
                <p className="mt-1 text-xs" style={{ color: TOKEN.muted }}>{item.tokens}</p>
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
            <div className="mb-4 inline-flex items-center gap-2 rounded-full border px-3.5 py-1.5 text-xs font-semibold" style={{ borderColor: 'color-mix(in srgb, var(--s-color-action-primary) 30%, transparent)', color: TOKEN.action }}>
              <HeartPulse className="h-4 w-4" />
              <span>Recursos disponíveis</span>
            </div>
            <h2 className="text-3xl font-bold sm:text-4xl" style={headingStyle}>O que o site oferece</h2>
          </div>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {[
              { icon: FileText, title: 'Blog com 42 artigos', desc: 'Conteúdos educativos sobre saúde vascular, escritos de forma clara e acessível para pacientes.' },
              { icon: Calculator, title: 'Calculadora de risco de TVP', desc: 'Avalie seu risco de trombose venosa profunda com perguntas simples e receba uma orientação inicial.' },
              { icon: Stethoscope, title: 'Avaliação de varizes', desc: 'Responda algumas perguntas sobre seus sintomas e receba orientações sobre suas varizes.' },
              { icon: Calendar, title: 'Agendamento online', desc: 'Agende sua consulta diretamente pelo site, sem precisar ligar ou mandar mensagem.' },
              { icon: MessageCircle, title: 'Formulário de contato', desc: 'Fale com a equipe de forma rápida e prática, com registro automático para acompanhamento.' },
              { icon: Wrench, title: 'Ferramentas interativas', desc: 'Recursos interativos para ajudar você a entender melhor sua saúde vascular.' },
            ].map(({ icon: OIcon, title, desc }) => (
              <div
                key={title}
                className="rounded-xl border p-6 transition-colors"
                style={{ backgroundColor: TOKEN.canvas, borderColor: TOKEN.border }}
              >
                <OIcon className="mb-3 h-6 w-6" style={{ color: TOKEN.action }} />
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
            <div className="mb-4 inline-flex items-center gap-2 rounded-full border px-3.5 py-1.5 text-xs font-semibold" style={{ borderColor: 'color-mix(in srgb, var(--s-color-action-primary) 30%, transparent)', color: TOKEN.action }}>
              <Sparkles className="h-4 w-4" />
              <span>Simples assim</span>
            </div>
            <h2 className="text-3xl font-bold sm:text-4xl" style={headingStyle}>Como funciona</h2>
          </div>
          <div className="grid gap-8 sm:grid-cols-3">
            {[
              { icon: FileText, step: '1', title: 'Explore os conteúdos', desc: 'Navegue pelo blog e aprenda sobre saúde vascular com artigos escritos para pacientes.' },
              { icon: Calculator, step: '2', title: 'Use as ferramentas', desc: 'Utilize a calculadora de risco de TVP e a avaliação de varizes para entender seu caso.' },
              { icon: Calendar, step: '3', title: 'Agende sua consulta', desc: 'Marque seu horário pelo WhatsApp ou pelo agendamento online com o Dr. Herlon Moura.' },
            ].map(({ icon: SIcon, step, title, desc }) => (
              <div
                key={step}
                className="rounded-xl border p-6 text-center"
                style={{ backgroundColor: TOKEN.surface, borderColor: TOKEN.border }}
              >
                <div className="relative mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl" style={{ backgroundColor: 'color-mix(in srgb, var(--s-color-action-primary) 12%, transparent)' }}>
                  <SIcon className="h-6 w-6" style={{ color: TOKEN.action }} />
                  <span className="absolute -right-2 -top-2 flex h-6 w-6 items-center justify-center rounded-full text-xs font-bold" style={{ backgroundColor: TOKEN.action, color: '#fff' }}>{step}</span>
                </div>
                <h3 className="mb-2 text-lg font-semibold" style={{ color: TOKEN.heading }}>{title}</h3>
                <p className="text-sm leading-relaxed" style={mutedStyle}>{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Personalização: quem faz isso */}
      <section className="py-16 sm:py-20" style={{ backgroundColor: TOKEN.surface }}>
        <div className="mx-auto w-full max-w-container px-4 sm:px-6 lg:px-8">
          <div className="mb-12">
            <div className="mb-4 inline-flex items-center gap-2 rounded-full border px-3.5 py-1.5 text-xs font-semibold" style={{ borderColor: 'color-mix(in srgb, var(--s-color-action-primary) 30%, transparent)', color: TOKEN.action }}>
              <Users className="h-4 w-4" />
              <span>Equipe</span>
            </div>
            <h2 className="text-3xl font-bold sm:text-4xl" style={headingStyle}>Quem faz isso</h2>
            <p className="mt-3 max-w-2xl text-base" style={mutedStyle}>
              Do cliente ao fazedor: a visão clínica de Herlon, construída por minha equipa.
            </p>
          </div>
          <div className="grid gap-6 sm:grid-cols-2">
            {PERSONAL.map(({ name, role, bio, avatar }) => (
              <div
                key={name}
                className="rounded-xl border p-6"
                style={{ backgroundColor: TOKEN.canvas, borderColor: TOKEN.border }}
              >
                <div className="flex items-center gap-4">
                  <div className="flex h-14 w-14 items-center justify-center rounded-full" style={{ backgroundColor: 'color-mix(in srgb, var(--s-color-action-primary) 20%, transparent)', color: TOKEN.action }}>
                    <span className="text-lg font-bold" style={{ color: TOKEN.action }}>{avatar}</span>
                  </div>
                  <div>
                    <h3 className="text-lg font-bold" style={{ color: TOKEN.heading }}>{name}</h3>
                    <p className="text-sm" style={{ color: TOKEN.muted }}>{role}</p>
                  </div>
                </div>
                <p className="mt-3 text-sm leading-relaxed" style={{ color: TOKEN.body }}>{bio}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Tecnologias */}
      <section className="py-16 sm:py-20" style={{ backgroundColor: TOKEN.surface }}>
        <div className="mx-auto w-full max-w-container px-4 sm:px-6 lg:px-8">
          <div className="mb-12">
            <div className="mb-4 inline-flex items-center gap-2 rounded-full border px-3.5 py-1.5 text-xs font-semibold" style={{ borderColor: 'color-mix(in srgb, var(--s-color-action-primary) 30%, transparent)', color: TOKEN.action }}>
              <Settings className="h-4 w-4" />
              <span>Tecnologias</span>
            </div>
            <h2 className="text-3xl font-bold sm:text-4xl" style={headingStyle}>Ferramentas do sistema</h2>
            <p className="mt-3 max-w-2xl text-base" style={mutedStyle}>
              Pilha estável, performática e pronta para crescimento. Static export em Cloudflare Pages.
            </p>
          </div>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {TEAM_SKILLS.map(({ name, icon: TIcon }) => (
              <div
                key={name}
                className="flex items-center gap-3 rounded-xl border p-4"
                style={{ backgroundColor: TOKEN.canvas, borderColor: TOKEN.border }}
              >
                <TIcon className="h-5 w-5" style={{ color: TOKEN.action }} />
                <span className="text-sm font-semibold" style={{ color: TOKEN.heading }}>{name}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Comparação: antes vs depois */}
      <section className="py-16 sm:py-20" style={{ backgroundColor: TOKEN.surface }}>
        <div className="mx-auto w-full max-w-container px-4 sm:px-6 lg:px-8">
          <div className="mb-12">
            <div className="mb-4 inline-flex items-center gap-2 rounded-full border px-3.5 py-1.5 text-xs font-semibold" style={{ borderColor: 'rgba(16, 185, 129, 0.3)', color: '#10B981', backgroundColor: 'rgba(16, 185, 129, 0.08)' }}>
              <ArrowRight className="h-4 w-4" />
              <span>Antes e depois</span>
            </div>
            <h2 className="text-3xl font-bold sm:text-4xl" style={headingStyle}>O que mudou para melhor</h2>
            <p className="mt-3 max-w-2xl text-base" style={mutedStyle}>
              A plataforma foi totalmente reformulada para melhorar a experiência dos pacientes e facilitar o trabalho da equipe.
            </p>
          </div>
          <SectionBlock title="Comparação: antes e depois" icon={Check} items={COMPARACOES} />
        </div>
      </section>

      {/* Próximos passos */}
      <section className="py-16 sm:py-20">
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
          <SectionBlock title="Planejado para as próximas atualizações" icon={ArrowRight} items={PROXIMOS_PASSOS} />
        </div>
      </section>

      {/* Rodapé */}
      <section className="border-t py-12" style={{ borderColor: TOKEN.border }}>
        <div className="mx-auto w-full max-w-container px-4 text-center sm:px-6 lg:px-8">
          <p className="text-sm" style={mutedStyle}>
            Esta página apresenta o estado atual da plataforma digital do Dr. Herlon Moura.
            Para mais detalhes, entre em contato com a equipe.
          </p>
        </div>
      </section>
    </main>
  );
}
