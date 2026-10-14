'use client';

import React from 'react';
import {
  ArrowRight, Check, X, Minus, Rocket, Palette, Layout, FileText,
  Users, Mail, BarChart3, Shield, Zap, Globe, Smartphone, Code2,
  Stethoscope, Calculator, MessageCircle, Calendar, Database, Search
} from 'lucide-react';

/* ============================================
   /doc — Platform Overview & Improvement Report

   Compares the original WordPress site (herlonmoura.com.br)
   against the new Next.js platform. Every claim is grounded in
   what actually exists in this repository — not aspirational.
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
  success: '#10B981',
  error: '#EF4444',
  warning: '#F59E0B',
} as const;

const headingStyle: React.CSSProperties = {
  fontFamily: 'var(--font-montserrat), var(--font-inter), system-ui, sans-serif',
  color: TOKEN.heading,
};

/* ── Data ─────────────────────────────────── */

interface BeforeAfter {
  area: string;
  before: string;
  after: string;
  status: 'done' | 'partial' | 'pending';
}

const IMPROVEMENTS: { title: string; icon: React.ElementType; items: BeforeAfter[] }[] = [
  {
    title: 'Design & Visual Identity',
    icon: Palette,
    items: [
      {
        area: 'Design tokens',
        before: 'No systematic token layer — colours, spacing and typography scattered across WordPress theme overrides',
        after: 'Three-layer token architecture: primitives (--g-color-*), semantics (--s-color-*), components (--c-card-*). All synced between CSS custom properties and Tailwind config. Documented in DESIGN_SYSTEM.md (570 lines)',
        status: 'done',
      },
      {
        area: 'Dark mode',
        before: 'Light-only WordPress theme with no alternative',
        after: 'Full light/dark mode via [data-theme] attribute, driven by ThemeProvider + ThemeToggle. All tokens have paired values for both modes',
        status: 'done',
      },
      {
        area: 'Typography',
        before: 'Default WordPress font stack, inconsistent heading sizes',
        after: 'Inter for body, Montserrat for headings. 8-step type scale (12px→56px) with documented rem values. Applied via CSS custom properties + .font-heading utility',
        status: 'done',
      },
      {
        area: 'Glassmorphism',
        before: 'Flat WordPress blocks with basic borders',
        after: 'Glass panel system: backdrop-filter blur, inner highlights, teal-tinted borders with hover states, modal overlay dimming. Realised in app/globals.css with WCAG AA contrast compliance',
        status: 'done',
      },
      {
        area: 'Animations',
        before: 'Static pages, no motion design',
        after: 'Framer Motion scroll-triggered reveals, staggered container animations, hover micro-interactions. All gated behind prefers-reduced-motion via lib/useAnimation.ts and lib/animations.ts',
        status: 'done',
      },
      {
        area: '3D hero',
        before: 'Static hero image',
        after: 'React Three Fiber 3D vascular scene (Hero3D, 222 lines) with drei controls, custom lighting, and performance-gated rendering',
        status: 'done',
      },
      {
        area: 'Mobile responsiveness',
        before: 'WordPress mobile theme — separate rendering, inconsistent experience',
        after: 'Single responsive codebase with Tailwind breakpoints. 1440px max container. Mobile-first navigation with slide-out sheet component',
        status: 'done',
      },
    ],
  },
  {
    title: 'Site Architecture & Information Structure',
    icon: Layout,
    items: [
      {
        area: 'Platform',
        before: 'WordPress + shared hosting. Plugin-heavy, slow load times, security surface',
        after: 'Next.js 15 static export on Cloudflare Pages edge CDN. Serverless functions for dynamic APIs. Zero cold starts for static pages',
        status: 'done',
      },
      {
        area: 'Pages',
        before: 'Single-page scroll + /consultas-e-procedimentos + /dr-herlon-moura',
        after: '21 routes: home, blog index, 42 article pages, procedures, about, contact, DVT calculator, varizes assessment, trombose screening, questionnaires, freebies, admin CRM/dashboard/blog, v2 design showcase, plataforma',
        status: 'done',
      },
      {
        area: 'Navigation',
        before: 'Fixed WordPress menu with WhatsApp CTA repeated throughout',
        after: 'Structured header with nav items, mobile sheet, theme toggle, contact modal trigger. Footer with organised sections (Sobre, Condições, Procedimentos, Recursos)',
        status: 'done',
      },
      {
        area: 'URL structure',
        before: 'WordPress default slugs, mixed Portuguese/English paths',
        after: 'Clean Portuguese slugs: /calculadora-de-risco-de-tvp, /consultas-e-procedimentos, /varizes/assessment, /trombose/screening. SEO-friendly and human-readable',
        status: 'done',
      },
      {
        area: 'CI/CD',
        before: 'Manual FTP uploads to WordPress host',
        after: 'GitHub Actions workflow: checkout → test → build → wrangler deploy to Cloudflare Pages. Every push to main auto-deploys',
        status: 'done',
      },
      {
        area: 'Custom domain',
        before: 'herlonmoura.com.br (shared hosting)',
        after: 'herlonmoura.clubemkt.digital on Cloudflare Pages with edge SSL. Apex domain configured',
        status: 'done',
      },
    ],
  },
  {
    title: 'Design Token System',
    icon: Code2,
    items: [
      {
        area: 'Token layers',
        before: 'None — colours hardcoded in theme CSS',
        after: 'Primitives → Semantics → Components. E.g. --g-color-base-secondary (#206095) → --s-color-action-primary → --c-button-primary-bg. Change one primitive, the whole system updates',
        status: 'done',
      },
      {
        area: 'Colour palette',
        before: 'Default WordPress blue + green, inconsistent usage',
        after: 'Curated medical palette: Deep Navy #0A2540 (primary), Vascular Blue #206095 (action), Champagne Gold #C5A880 (accent), with full status colours (success/warning/error) and surface hierarchy',
        status: 'done',
      },
      {
        area: 'Dark mode tokens',
        before: 'N/A',
        after: 'Every token has a [data-theme="dark"] counterpart. Dark surfaces use #121A21→#1A242F hierarchy with adjusted text colours for readability',
        status: 'done',
      },
      {
        area: 'Documentation',
        before: 'None',
        after: 'DESIGN_SYSTEM.md (570 lines): colour tables with hex values and usage, glassmorphism spec, typography scale, component tokens, accessibility notes (WCAG 4.5:1 contrast, 3:1 for interactive)',
        status: 'done',
      },
      {
        area: 'Design showcase',
        before: 'N/A',
        after: '/v2 route — live interactive design system showcase with swatches, type scale demo, button/card specimens, light/dark toggle',
        status: 'done',
      },
    ],
  },
  {
    title: 'Content Engine',
    icon: FileText,
    items: [
      {
        area: 'Blog posts',
        before: 'No blog. All content on static pages',
        after: '42 published articles in markdown with frontmatter (title, excerpt, date, category, image, author). Generated from content/blog/ via lib/blog.ts at build time',
        status: 'done',
      },
      {
        area: 'Content management',
        before: 'WordPress admin editor',
        after: 'Admin blog editor (components/admin/BlogEditor.tsx + BlogEditorList.tsx) with draft → approval → published workflow. Approval queue at /admin/blog/approval',
        status: 'done',
      },
      {
        area: 'Content pipeline',
        before: 'Manual page creation in WordPress',
        after: 'Markdown files → lib/blog-data.generated.ts → static pages. Blog index with ArticleCard components, reading time calculation, category filtering',
        status: 'done',
      },
      {
        area: 'SEO content',
        before: 'Basic WordPress SEO plugin defaults',
        after: 'Per-article frontmatter with title, description, category. Blog layout with structured navigation. Article cards with images and excerpts',
        status: 'partial',
      },
      {
        area: 'Structured data',
        before: 'WordPress schema plugin (basic)',
        after: 'Not yet implemented — no JSON-LD schema markup for LocalBusiness, MedicalCondition, FAQ, or Article types',
        status: 'pending',
      },
      {
        area: 'Sitemap / robots',
        before: 'WordPress auto-generated sitemap',
        after: 'Not yet implemented — no sitemap.xml or robots.txt in the static export',
        status: 'pending',
      },
    ],
  },
  {
    title: 'Lead Ingestion & CRM',
    icon: Users,
    items: [
      {
        area: 'Lead capture',
        before: 'WhatsApp button links only. No form data captured, no lead record',
        after: 'Multi-channel ingestion: contact form, DVT calculator results, varizes assessment, trombose screening, questionnaire, freebie downloads. All POST to /api/crm/leads',
        status: 'done',
      },
      {
        area: 'CRM dashboard',
        before: 'None. No way to track or manage leads',
        after: 'Full admin CRM at /admin/crm: lead table with status/source/date filters, search, score bars, patient detail view with interaction timeline. Protected by JWT auth',
        status: 'done',
      },
      {
        area: 'Lead lifecycle',
        before: 'None',
        after: '6-status pipeline: new → contacted → qualified → appointment → converted → lost. Forward-only transitions enforced (LEAD_TRANSITIONS in lib/leads.ts). Status history tracked per lead',
        status: 'done',
      },
      {
        area: 'Lead scoring',
        before: 'None',
        after: 'Score field on leads (0-100). Risk scores from calculators flow in as initial score. Visual score bars in the CRM table',
        status: 'partial',
      },
      {
        area: 'WhatsApp integration',
        before: 'Generic "Fale conosco" links with no context',
        after: 'Smart wa.me deep links via buildWhatsappLink(): prefilled message includes lead name, email, insurance type, stated interest, and patient card URL. Secretary sees full context before replying',
        status: 'done',
      },
      {
        area: 'Email automation',
        before: 'None',
        after: 'Resend integration: welcome email to lead on POST, admin notification email on new lead. Manual send from CRM patient detail. Templates in functions/api/crm/leads/index.ts',
        status: 'done',
      },
      {
        area: 'UTM tracking',
        before: 'None',
        after: 'captureUtm() in lib/leads.ts: reads utm_source/medium/campaign/term/content from URL, stores first-touch in sessionStorage, merges across pages. Attribution persists through conversion',
        status: 'done',
      },
      {
        area: 'Analytics',
        before: 'Basic Google Analytics (if any)',
        after: 'Section-view, CTA-click, modal-open, modal-submit, WhatsApp-click events. Batched (8s flush interval, max 40 queue). Anonymous visitor/session IDs. POST /api/analytics/events → D1. Admin dashboard aggregates at /api/dashboard/stats',
        status: 'done',
      },
      {
        area: 'Database',
        before: 'WordPress MySQL (shared)',
        after: 'Cloudflare D1 (SQLite at the edge). CRM_DB binding configured in wrangler.toml. Leads, analytics events, blog posts in D1 tables',
        status: 'done',
      },
    ],
  },
  {
    title: 'Interactive Tools & Patient Engagement',
    icon: Calculator,
    items: [
      {
        area: 'DVT risk calculator',
        before: 'None',
        after: 'Full interactive calculator (components/DVTRiskCalculator.tsx) with symptom questions, risk factor checkboxes, personalised score output. Standalone page at /calculadora-de-risco-de-tvp + embedded section on home page',
        status: 'done',
      },
      {
        area: 'Varizes assessment',
        before: 'None',
        after: 'Multi-step assessment at /varizes/assessment: leg symptoms, severity levels, duration. Produces a score and personalised recommendation. Feeds into lead pipeline',
        status: 'done',
      },
      {
        area: 'Trombose screening',
        before: 'None',
        after: 'Symptom-based screening at /trombose/screening: swelling, pain, warmth, redness, duration, risk factors. High/moderate/low risk classification with next-step guidance',
        status: 'done',
      },
      {
        area: 'Freebies / lead magnets',
        before: 'None',
        after: 'Downloadable educational PDFs at /freebies/[name] with name/WhatsApp/email capture before download. Detail component in FreebieDetail.tsx',
        status: 'done',
      },
      {
        area: 'Appointment scheduling',
        before: 'WhatsApp-only booking',
        after: 'Cal.com self-hosted scheduler integration (cal.clubemkt.digital). "Agendar Consulta" CTAs link directly to the booking calendar. Blocked on DNS setup',
        status: 'partial',
      },
      {
        area: 'Social proof',
        before: 'None',
        after: 'SocialProofTicker component (252 lines): rotating patient testimonials/stats with scroll-triggered animations',
        status: 'done',
      },
      {
        area: 'Symptom navigator',
        before: 'Static symptom list',
        after: 'Interactive SymptomNavigator (349 lines): browse symptoms by category, tap to see what it could mean, CTA to relevant procedure or contact',
        status: 'done',
      },
    ],
  },
  {
    title: 'Admin & Operations',
    icon: Shield,
    items: [
      {
        area: 'Authentication',
        before: 'WordPress admin login (shared credential risk)',
        after: 'JWT-based auth via /login. ProtectedRoute component redirects unauthenticated users. admin_token cookie (HttpOnly, 24h expiry)',
        status: 'done',
      },
      {
        area: 'Admin dashboard',
        before: 'WordPress dashboard (plugin-heavy, slow)',
        after: 'Custom dashboard at /admin/dashboard with aggregated stats from D1: total leads, new leads, status breakdown, analytics summaries',
        status: 'done',
      },
      {
        area: 'Patient management',
        before: 'None',
        after: 'PatientList + PatientDetail components: lead timeline, status transitions, notes, tags, next actions, email send. AppointmentScheduler component for booking management',
        status: 'done',
      },
      {
        area: 'Blog workflow',
        before: 'WordPress editor (single-step publish)',
        after: 'Multi-step: draft → approval queue → published. Separate approval page with category/author filters, sortable columns. BlogEditor with meta_title/meta_description fields',
        status: 'done',
      },
      {
        area: 'Testing',
        before: 'None',
        after: 'Vitest unit tests: Button, Card, FormInput, Label, ErrorMessage. Property-based tests with fast-check for animation performance. Contact module tests. CI runs tests before deploy',
        status: 'done',
      },
      {
        area: 'Role-based access',
        before: 'WordPress user roles',
        after: 'Single admin role. No multi-user support yet — no editor/reviewer/viewer distinction',
        status: 'pending',
      },
    ],
  },
];

const METRICS = [
  { label: 'Blog articles', value: '42', icon: FileText },
  { label: 'Interactive tools', value: '3', icon: Calculator },
  { label: 'Lead channels', value: '6', icon: Users },
  { label: 'Design tokens', value: '60+', icon: Palette },
  { label: 'Admin pages', value: '7', icon: Shield },
  { label: 'Pages / routes', value: '21', icon: Layout },
];

const STACK = [
  { name: 'Next.js 15', desc: 'App Router, static export' },
  { name: 'React 19', desc: 'Server + client components' },
  { name: 'Tailwind CSS 3', desc: 'Token-driven utility classes' },
  { name: 'Framer Motion', desc: 'Scroll animations, micro-interactions' },
  { name: 'Three.js / R3F', desc: '3D vascular hero scene' },
  { name: 'shadcn/ui', desc: 'Accessible component primitives' },
  { name: 'Cloudflare Pages', desc: 'Edge CDN + serverless functions' },
  { name: 'Cloudflare D1', desc: 'SQLite at the edge for CRM data' },
  { name: 'Resend', desc: 'Transactional email delivery' },
  { name: 'Cal.com', desc: 'Self-hosted appointment scheduling' },
  { name: 'Vitest + fast-check', desc: 'Unit + property-based testing' },
  { name: 'GitHub Actions', desc: 'CI/CD pipeline' },
];

/* ── Components ───────────────────────────── */

function StatusBadge({ status }: { status: BeforeAfter['status'] }) {
  const map = {
    done: { icon: Check, label: 'Done', bg: 'rgba(16, 185, 129, 0.12)', color: '#10B981', border: 'rgba(16, 185, 129, 0.3)' },
    partial: { icon: Minus, label: 'Partial', bg: 'rgba(245, 158, 11, 0.12)', color: '#F59E0B', border: 'rgba(245, 158, 11, 0.3)' },
    pending: { icon: X, label: 'Pending', bg: 'rgba(239, 68, 68, 0.12)', color: '#EF4444', border: 'rgba(239, 68, 68, 0.3)' },
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

function SectionBlock({ title, icon: IconComponent, items }: typeof IMPROVEMENTS[0]) {
  const Icon = IconComponent as React.FC<{ className?: string; style?: React.CSSProperties }>;
  return (
    <section className="mb-16">
      <div className="mb-8 flex items-center gap-3">
        <div
          className="flex h-10 w-10 items-center justify-center rounded-xl"
          style={{ backgroundColor: 'color-mix(in srgb, var(--s-color-action-primary) 12%, transparent)' }}
        >
          <Icon className="h-5 w-5" style={{ color: TOKEN.action }} />        </div>
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
                  Before (herlonmoura.com.br)
                </p>
                <p className="text-sm leading-relaxed" style={{ color: TOKEN.muted }}>{item.before}</p>
              </div>
              <div>
                <p className="mb-1.5 text-xs font-semibold uppercase tracking-wider" style={{ color: TOKEN.action }}>
                  After (this platform)
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

/* ── Page ─────────────────────────────────── */

export default function DocPage() {
  return (
    <main className="min-h-screen" style={{ backgroundColor: TOKEN.canvas, color: TOKEN.body }}>
      {/* Hero */}
      <section className="relative overflow-hidden py-20 sm:py-28" style={{ backgroundColor: TOKEN.surface }}>
        <div
          className="pointer-events-none absolute -top-40 left-1/2 -z-10 h-[500px] w-[800px] -translate-x-1/2 rounded-full blur-[120px]"
          style={{ backgroundColor: 'color-mix(in srgb, var(--s-color-action-primary) 8%, transparent)' }}
        />
        <div className="mx-auto w-full max-w-container px-4 sm:px-6 lg:px-8">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border px-3.5 py-1.5 text-xs font-semibold" style={{ borderColor: 'color-mix(in srgb, var(--s-color-action-primary) 30%, transparent)', color: TOKEN.action }}>
            <Rocket className="h-4 w-4" />
            <span>Platform Overview</span>
          </div>
          <h1 className="max-w-3xl text-4xl font-extrabold leading-tight sm:text-5xl lg:text-6xl" style={headingStyle}>
            What we built for{' '}
            <span className="bg-gradient-to-r from-vascular-blue to-champagne-gold bg-clip-text text-transparent" style={{ backgroundImage: 'linear-gradient(135deg, #206095 0%, #C5A880 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
              Dr. Herlon Moura
            </span>
          </h1>
          <p className="mt-6 max-w-2xl text-lg leading-relaxed" style={{ color: TOKEN.muted }}>
            A complete before-and-after analysis of the transformation from the original WordPress site
            to the new Next.js platform. Every improvement is grounded in what actually ships in this repository.
          </p>

          {/* Metrics */}
          <div className="mt-12 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
            {METRICS.map(({ label, value, icon: MIcon }) => (
              <div
                key={label}
                className="rounded-xl border p-4 text-center"
                style={{ backgroundColor: TOKEN.canvas, borderColor: TOKEN.border }}
              >
                <MIcon className="mx-auto mb-2 h-5 w-5" style={{ color: TOKEN.action }} />
                <p className="text-2xl font-bold" style={{ color: TOKEN.heading }}>{value}</p>
                <p className="text-xs" style={{ color: TOKEN.muted }}>{label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Original site analysis */}
      <section className="py-16 sm:py-20">
        <div className="mx-auto w-full max-w-container px-4 sm:px-6 lg:px-8">
          <div className="mb-10">
            <div className="mb-4 inline-flex items-center gap-2 rounded-full border px-3.5 py-1.5 text-xs font-semibold" style={{ borderColor: 'rgba(239, 68, 68, 0.3)', color: '#EF4444', backgroundColor: 'rgba(239, 68, 68, 0.08)' }}>
              <Globe className="h-4 w-4" />
              <span>Original Site — herlonmoura.com.br</span>
            </div>
            <h2 className="text-3xl font-bold sm:text-4xl" style={headingStyle}>What needed improvement</h2>
          </div>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {[
              { icon: Palette, title: 'No design system', desc: 'WordPress theme with hardcoded colours. No tokens, no dark mode, no consistent typography scale. Every page looked slightly different.' },
              { icon: Users, title: 'Zero lead capture', desc: 'Only WhatsApp buttons. No forms, no CRM, no way to track who visits or what they are interested in. Every lead was invisible until they messaged.' },
              { icon: FileText, title: 'No content strategy', desc: 'Static pages only. No blog, no educational content, no SEO-optimised articles. The site could not rank for informational queries.' },
              { icon: Zap, title: 'Slow & plugin-heavy', desc: 'WordPress on shared hosting with multiple plugins. Slow load times, large payloads, security surface from outdated plugins.' },
              { icon: BarChart3, title: 'No analytics', desc: 'No insight into which sections or procedures visitors engage with. No way to measure interest from people who never submit a form.' },
              { icon: Smartphone, title: 'Fragmented mobile', desc: 'WordPress mobile theme rendered separately. Inconsistent navigation, different layouts, broken interactions on small screens.' },
            ].map(({ icon: OIcon, title, desc }) => (
              <div
                key={title}
                className="rounded-xl border p-6"
                style={{ backgroundColor: TOKEN.surface, borderColor: TOKEN.border }}
              >
                <OIcon className="mb-3 h-6 w-6" style={{ color: '#EF4444' }} />
                <h3 className="mb-2 text-lg font-semibold" style={{ color: TOKEN.heading }}>{title}</h3>
                <p className="text-sm leading-relaxed" style={{ color: TOKEN.muted }}>{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Improvements */}
      <section className="py-16 sm:py-20" style={{ backgroundColor: TOKEN.surface }}>
        <div className="mx-auto w-full max-w-container px-4 sm:px-6 lg:px-8">
          <div className="mb-12">
            <div className="mb-4 inline-flex items-center gap-2 rounded-full border px-3.5 py-1.5 text-xs font-semibold" style={{ borderColor: 'rgba(16, 185, 129, 0.3)', color: '#10B981', backgroundColor: 'rgba(16, 185, 129, 0.08)' }}>
              <Check className="h-4 w-4" />
              <span>New Platform — herlonmoura.clubemkt.digital</span>
            </div>
            <h2 className="text-3xl font-bold sm:text-4xl" style={headingStyle}>What we accomplished</h2>
            <p className="mt-3 max-w-2xl text-base" style={{ color: TOKEN.muted }}>
              Every item below is grounded in code that exists in this repository. Status badges indicate completeness.
            </p>
          </div>

          {IMPROVEMENTS.map((section) => (
            <SectionBlock key={section.title} {...section} />
          ))}
        </div>
      </section>

      {/* Tech stack */}
      <section className="py-16 sm:py-20">
        <div className="mx-auto w-full max-w-container px-4 sm:px-6 lg:px-8">
          <div className="mb-10 text-center">
            <div className="mb-4 inline-flex items-center gap-2 rounded-full border px-3.5 py-1.5 text-xs font-semibold" style={{ borderColor: 'color-mix(in srgb, var(--s-color-action-primary) 30%, transparent)', color: TOKEN.action }}>
              <Code2 className="h-4 w-4" />
              <span>Technology Stack</span>
            </div>
            <h2 className="text-3xl font-bold sm:text-4xl" style={headingStyle}>Built with modern tools</h2>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {STACK.map(({ name, desc }) => (
              <div
                key={name}
                className="rounded-xl border p-4"
                style={{ backgroundColor: TOKEN.surface, borderColor: TOKEN.border }}
              >
                <h3 className="text-sm font-bold" style={{ color: TOKEN.heading }}>{name}</h3>
                <p className="mt-1 text-xs" style={{ color: TOKEN.muted }}>{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Roadmap */}
      <section className="py-16 sm:py-20" style={{ backgroundColor: TOKEN.surface }}>
        <div className="mx-auto w-full max-w-container px-4 sm:px-6 lg:px-8">
          <div className="mb-10">
            <div className="mb-4 inline-flex items-center gap-2 rounded-full border px-3.5 py-1.5 text-xs font-semibold" style={{ borderColor: 'rgba(245, 158, 11, 0.3)', color: '#F59E0B', backgroundColor: 'rgba(245, 158, 11, 0.08)' }}>
              <ArrowRight className="h-4 w-4" />
              <span>What&apos;s Next</span>
            </div>
            <h2 className="text-3xl font-bold sm:text-4xl" style={headingStyle}>Remaining work</h2>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            {[
              { title: 'Structured data (JSON-LD)', desc: 'Add LocalBusiness, MedicalCondition, FAQ, and Article schema for rich search results.', icon: Search },
              { title: 'Sitemap & robots.txt', desc: 'Generate sitemap.xml from the route tree and add robots.txt for crawler guidance.', icon: Globe },
              { title: 'Cal.com DNS', desc: 'Create Cloudflare A record for cal.clubemkt.digital → VPS 62.171.137.90 to activate direct booking.', icon: Calendar },
              { title: 'Multi-role admin access', desc: 'Add editor, reviewer, and viewer roles beyond the current single admin role.', icon: Shield },
              { title: 'Lead scoring refinement', desc: 'Automated scoring based on source, engagement events, and calculator risk scores.', icon: BarChart3 },
              { title: 'Advanced analytics', desc: 'Conversion funnels, cohort analysis, per-procedure engagement reports in the admin dashboard.', icon: BarChart3 },
            ].map(({ title, desc, icon: RIcon }) => (
              <div
                key={title}
                className="flex gap-4 rounded-xl border p-5"
                style={{ backgroundColor: TOKEN.canvas, borderColor: TOKEN.border }}
              >
                <div
                  className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg"
                  style={{ backgroundColor: 'rgba(245, 158, 11, 0.12)' }}
                >
                  <RIcon className="h-4 w-4" style={{ color: '#F59E0B' }} />
                </div>
                <div>
                  <h3 className="text-sm font-bold" style={{ color: TOKEN.heading }}>{title}</h3>
                  <p className="mt-1 text-sm leading-relaxed" style={{ color: TOKEN.muted }}>{desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer note */}
      <section className="border-t py-12" style={{ borderColor: TOKEN.border }}>
        <div className="mx-auto w-full max-w-container px-4 text-center sm:px-6 lg:px-8">
          <p className="text-sm" style={{ color: TOKEN.muted }}>
            This document reflects the state of the codebase as deployed. For technical details,
            see{' '}
            <code className="rounded px-1.5 py-0.5 text-xs" style={{ backgroundColor: 'color-mix(in srgb, var(--s-color-action-primary) 8%, transparent)', color: TOKEN.action }}>
              DESIGN_SYSTEM.md
            </code>{' '}
            and the source files referenced throughout.
          </p>
        </div>
      </section>
    </main>
  );
}
