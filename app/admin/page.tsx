'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { Sidebar } from '@/components/admin/Sidebar';
import { ProtectedRoute } from '@/components/admin/ProtectedRoute';
import { api } from '@/lib/admin/api';
import { Button } from '@/components/Button';
import { HeartPulseSvg } from '@/components/ui/MedicalIcons';
import {
  Users, TrendingUp, FileText, Clock, MessageSquare, Activity,
  Plus, Eye, Stethoscope, BarChart3, ChevronRight, PlusCircle, Edit3,
  Trash2, CheckCircle2, XCircle, Send, Search, ChevronDown, Bot
} from 'lucide-react';

type Section = 'dashboard' | 'crm' | 'leads' | 'blog' | 'analytics';

interface DashboardStats {
  leads: { total: number; new: number; byStatus: Record<string, number>; conversionRate: number };
  posts: { pending: number; published: number };
  interactions: number;
  visitors: { total: number; unique: number };
  sources: Record<string, number>;
  engagement: { weekOverWeek: number; monthOverMonth: number };
  avgScore: number;
}

interface Lead {
  id: string;
  name: string;
  whatsapp: string;
  email: string | null;
  source: string;
  status: string;
  score: number;
  tags: string;
  notes: string;
  created_at: string;
  updated_at: string;
  status_history: string;
}

interface BlogPost {
  slug: string;
  title: string;
  excerpt: string;
  date: string;
  category: string;
  author: string;
  status: 'draft' | 'approval' | 'published' | 'archived';
  readingTime: string;
  content: string;
  meta_title: string;
  meta_description: string;
  questionnaire_enabled: boolean;
  freebie_name: string | null;
  generated?: boolean;
}

interface Funnel {
  stage: string;
  count: number;
  rate: number;
}

interface Cohort {
  week: string;
  total: number;
  converted: number;
  lost: number;
  conversionRate: number;
}

interface ProcedureEngagement {
  name: string;
  clicks: number;
  leads: number;
}

const STATUS_COLORS: Record<string, string> = {
  new: 'bg-slate-500/15 text-slate-400 border-slate-500/30',
  contacted: 'bg-teal-500/15 text-teal-400 border-teal-500/30',
  qualified: 'bg-blue-500/15 text-blue-400 border-blue-500/30',
  appointment: 'bg-yellow-500/15 text-yellow-400 border-yellow-500/30',
  converted: 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30',
  lost: 'bg-red-500/15 text-red-400 border-red-500/30',
};

const SOURCE_LABELS: Record<string, string> = {
  all: 'Todas', contact: 'Contato', questionnaire: 'Questionário',
  whatsapp: 'WhatsApp', referral: 'Indicação', social: 'Social'
};

const STATUS_LABELS: Record<string, string> = {
  new: 'Novo', contacted: 'Contatado', qualified: 'Qualificado',
  appointment: 'Consulta', converted: 'Convertido', lost: 'Perdido'
};

const SOURCES: Array<'all' | 'contact' | 'questionnaire' | 'whatsapp' | 'referral' | 'social'> = [
  'all', 'contact', 'questionnaire', 'whatsapp', 'referral', 'social'
];

const STATUS_FILTERS: Array<'all' | 'new' | 'contacted' | 'qualified' | 'appointment' | 'converted' | 'lost'> = [
  'all', 'new', 'contacted', 'qualified', 'appointment', 'converted', 'lost'
];

export default function AdminPage() {
  return (
    <ProtectedRoute requiredRole="viewer">
      <AdminLanding />
    </ProtectedRoute>
  );
}

function AdminLanding() {
  const router = useRouter();
  const [activeSection, setActiveSection] = useState<Section>('dashboard');
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [leads, setLeads] = useState<Lead[]>([]);
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [funnel, setFunnel] = useState<Funnel[]>([]);
  const [cohorts, setCohorts] = useState<Cohort[]>([]);
  const [procedures, setProcedures] = useState<ProcedureEngagement[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchAll = useCallback(async () => {
    setLoading(true); setError(null);
    try {
      const [statsData, leadsData, postsData, analyticsData] = await Promise.all([
        api.get<DashboardStats>('/api/dashboard/stats'),
        api.get<{ leads: Lead[]; stats: { total: number; new: number; byStatus: Record<string, number> } }>('/api/crm/leads'),
        api.get<{ posts: BlogPost[] }>('/api/blog'),
        api.get<{ funnel: Funnel[]; cohorts: Cohort[]; procedures: ProcedureEngagement[] }>('/api/analytics/funnels?days=30'),
      ]);
      setStats(statsData);
      setLeads(leadsData.leads);
      setPosts(postsData.posts);
      setFunnel(analyticsData.funnel);
      setCohorts(analyticsData.cohorts);
      setProcedures(analyticsData.procedures);
    } catch (e: any) {
      setError(e.message || 'Erro ao carregar dados');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchAll(); }, [fetchAll]);

  const renderContent = () => {
    switch (activeSection) {
      case 'dashboard':
        return renderDashboard(stats);
      case 'crm':
        return (
          <div className="space-y-5">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-display-md font-heading font-semibold text-white">CRM</h1>
                <p className="text-sm text-slate-400">Gerencie leads e pacientes.</p>
              </div>
              <Button variant="primary" size="sm" onClick={() => router.push('/admin/crm')}>
                <Plus className="h-4 w-4" /> Novo Lead
              </Button>
            </div>
            <LeadsTable leads={leads} router={router} />
          </div>
        );
      case 'leads':
        return (
          <div className="space-y-5">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-display-md font-heading font-semibold text-white">Leads</h1>
                <p className="text-sm text-slate-400">Lista de leads do autor.</p>
              </div>
              <Button variant="primary" size="sm" onClick={() => router.push('/admin/crm')}>
                <Plus className="h-4 w-4" /> Novo Lead
              </Button>
            </div>
            <LeadsTable leads={leads} router={router} />
          </div>
        );
      case 'blog':
        return (
          <div className="space-y-5">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-display-md font-heading font-semibold text-white">Blog</h1>
                <p className="text-sm text-slate-400">Gerencie artigos e conteúdo.</p>
              </div>
              <Button variant="primary" size="sm" onClick={() => router.push('/admin/blog')}>
                <Plus className="h-4 w-4" /> Novo Artigo
              </Button>
            </div>
            <BlogPostTable posts={posts} fetchAll={fetchAll} router={router} />
          </div>
        );
      case 'analytics':
        return <AnalyticsView funnel={funnel} cohorts={cohorts} procedures={procedures} />;
      default:
        return null;
    }
  };

  return (
    <div className="flex min-h-screen bg-surface-dark">
      <Sidebar onNavigate={setActiveSection} />

      <main className="flex-1 p-6 tablet:p-8 overflow-auto admin-scroll">
        {/* Header */}
        <header className="mb-8 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-brand-accent/15">
              <Stethoscope className="h-5 w-5 text-brand-accent" />
            </div>
            <div>
              <h1 className="text-display-md font-heading font-semibold text-white">
                {activeSection === 'dashboard' && 'Dashboard'}
                {activeSection === 'crm' && 'CRM'}
                {activeSection === 'leads' && 'Leads'}
                {activeSection === 'blog' && 'Blog'}
                {activeSection === 'analytics' && 'Analytics'}
              </h1>
              <p className="text-sm text-slate-400">
                {activeSection === 'dashboard' && 'Visão geral do desempenho de leads e conteúdo.'}
                {activeSection === 'crm' && 'Gerencie cadastros de pacientes.'}
                {activeSection === 'leads' && 'Lista de leads.'}
                {activeSection === 'blog' && 'Gerencie artigos e conteúdo.'}
                {activeSection === 'analytics' && 'Funis de conversão, coortes e engajamento.'}
              </p>
            </div>
          </div>
        </header>

        {/* Loading */}
        {loading && (
          <div className="flex items-center justify-center py-12">
            <div className="h-8 w-8 animate-spin rounded-full border-2 border-surgical-teal border-t-transparent" />
          </div>
        )}

        {/* Error */}
        {error && (
          <div className="rounded-2xl border border-red-500/30 bg-red-500/5 p-4 text-center">
            <p className="text-sm text-red-400">{error}</p>
            <Button variant="primary" size="sm" className="mt-3" onClick={fetchAll}>
              Tentar novamente
            </Button>
          </div>
        )}

        {/* Section content */}
        {!loading && !error && renderContent()}
      </main>
    </div>
  );
}

function BentoCard({ title, value, icon: Icon, iconBg, iconColor }: {
  title: string; value: string; icon: any; iconBg: string; iconColor: string;
}) {
  return (
    <div className="rounded-3xl p-5 bg-surface-cardDark/50 border border-slate-700/40 hover:border-slate-600/50 transition-all duration-200">
      <div className="flex items-center gap-3 mb-3">
        <div className={`flex h-10 w-10 items-center justify-center rounded-2xl shadow-card ${iconBg}`}>
          <Icon className={`h-5 w-5 ${iconColor}`} />
        </div>
        <span className="text-xs font-medium text-slate-400 uppercase tracking-wider">{title}</span>
      </div>
      <p className="text-3xl font-bold text-brand-accent">{value}</p>
    </div>
  );
}

function renderDashboard(stats: DashboardStats | null) {
  if (!stats) {
    return (
      <div className="space-y-5">
        <div className="grid grid-cols-2 tablet:grid-cols-4 gap-4">
          <BentoCard title="Total de Pacientes" value="--" icon={Users} iconBg="bg-medical-teal" iconColor="text-teal-700" />
          <BentoCard title="Novos Leads" value="--" icon={TrendingUp} iconBg="bg-brand-accent" iconColor="text-slate-900" />
          <BentoCard title="Interações" value="--" icon={MessageSquare} iconBg="bg-medical-purple" iconColor="text-slate-700" />
          <BentoCard title="Taxa de Conversão" value="--" icon={Activity} iconBg="bg-success-green" iconColor="text-emerald-700" />
        </div>
      </div>
    );
  }

  const byStatus = stats.leads?.byStatus || {};
  const newCount = byStatus.new ?? 0;
  const qualifiedCount = byStatus.qualified ?? 0;
  const convertedCount = byStatus.converted ?? 0;
  const appointmentCount = byStatus.appointment ?? 0;

  return (
    <div className="space-y-5">
      {/* KPI Cards */}
      <div className="grid grid-cols-2 tablet:grid-cols-4 gap-4">
        <BentoCard title="Total Leads" value={String(stats.leads?.total ?? 0)} icon={Users} iconBg="bg-medical-teal" iconColor="text-teal-700" />
        <BentoCard title="Novos" value={String(newCount)} icon={Plus} iconBg="bg-slate-500" iconColor="text-slate-300" />
        <BentoCard title="Em andamento" value={String(qualifiedCount + appointmentCount)} icon={Activity} iconBg="bg-medical-yellow" iconColor="text-yellow-700" />
        <BentoCard title="Convertidos" value={String(convertedCount)} icon={CheckCircle2} iconBg="bg-emerald-100" iconColor="text-emerald-700" />
      </div>

      {/* Lead Sources */}
      <div className="admin-glass p-5">
        <h3 className="text-heading-3 font-heading font-semibold text-white mb-4 flex items-center gap-2">
          <HeartPulseSvg className="h-4 w-4 text-brand-accent" /> Fontes de Leads
        </h3>
        {Object.keys(stats.sources || {}).length === 0 ? (
          <p className="text-sm text-slate-400">Sem dados de fontes ainda.</p>
        ) : (
          <div className="space-y-3">
            {Object.entries(stats.sources).map(([source, count]) => (
              <div key={source} className="flex items-center gap-3">
                <span className="w-24 text-xs text-slate-400 capitalize">{source || '—'}</span>
                <div className="flex-1 h-2.5 rounded-full bg-slate-800 overflow-hidden">
                  <div className="h-full rounded-full bg-surgical-teal" style={{ width: `${(Number(count) / (stats.leads?.total ?? 1)) * 100}%` }} />
                </div>
                <span className="text-xs text-slate-300 w-8 text-right">{count}</span>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Status breakdown */}
      <div className="admin-glass p-5">
        <h3 className="text-heading-3 font-heading font-semibold text-white mb-4">Status dos Leads</h3>
        <div className="grid grid-cols-2 tablet:grid-cols-6 gap-3">
          {(['new', 'contacted', 'qualified', 'appointment', 'converted', 'lost'] as const).map((s) => (
            <div key={s} className="rounded-xl bg-slate-800/40 border border-slate-700/30 p-3 text-center">
              <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-medium border ${STATUS_COLORS[s] || STATUS_COLORS.new}`}>
                {STATUS_LABELS[s]}
              </span>
              <p className="mt-2 text-xl font-bold text-white">{byStatus[s] ?? 0}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Recent activity */}
      <div className="admin-glass p-5">
        <h3 className="text-heading-3 font-heading font-semibold text-white mb-4 flex items-center gap-2">
          <Activity className="h-4 w-4 text-brand-accent" /> Atividade Recente
        </h3>
        <div className="space-y-3 text-sm">
          <p className="text-xs text-slate-500">
            {stats.interactions ?? 0} interações registradas · {stats.posts?.pending ?? 0} posts aguardando aprovação · {stats.posts?.published ?? 0} posts publicados
          </p>
        </div>
      </div>
    </div>
  );
}

function LeadsTable({ leads, router }: { leads: Lead[]; router: any }) {
  const [search, setSearch] = useState('');
  const [sourceFilter, setSourceFilter] = useState<'all' | 'contact' | 'questionnaire' | 'whatsapp' | 'referral' | 'social'>('all');
  const [statusFilter, setStatusFilter] = useState<'all' | 'new' | 'contacted' | 'qualified' | 'appointment' | 'converted' | 'lost'>('all');

  const filtered = leads.filter((l) => {
    const matchSearch = l.name.toLowerCase().includes(search.toLowerCase()) || l.id.toLowerCase().includes(search.toLowerCase());
    const matchSource = sourceFilter === 'all' || l.source === sourceFilter;
    const matchStatus = statusFilter === 'all' || l.status === statusFilter;
    return matchSearch && matchSource && matchStatus;
  });

  return (
    <div className="space-y-5">
      <div className="admin-glass p-5">
        <div className="flex items-center gap-2 mb-3">
          <Search className="h-4 w-4 text-brand-accent" />
          <span className="text-sm font-semibold text-white">Filtros</span>
        </div>
        <div className="grid grid-cols-1 tablet:grid-cols-4 gap-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
            <input
              type="text"
              placeholder="Buscar nome ou ID..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="glass-input pl-10 w-full text-sm"
            />
          </div>
          <select
            value={sourceFilter}
            onChange={(e) => setSourceFilter(e.target.value as any)}
            className="glass-input text-sm py-2"
          >
            {SOURCES.map((s) => <option key={s} value={s}>{SOURCE_LABELS[s]}</option>)}
          </select>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as any)}
            className="glass-input text-sm py-2"
          >
            {STATUS_FILTERS.map((s) => <option key={s} value={s}>{STATUS_LABELS[s]}</option>)}
          </select>
          <div className="flex gap-2">
            <input type="date" className="glass-input text-sm py-2 flex-1" />
          </div>
        </div>
      </div>

      <div className="overflow-hidden admin-glass">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-slate-700/50">
              <th className="px-4 py-3 text-left text-xs font-semibold text-slate-500 uppercase">Paciente</th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-slate-500 uppercase">Status</th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-slate-500 uppercase">Fonte</th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-slate-500 uppercase">Score</th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-slate-500 uppercase">Criado</th>
              <th className="px-4 py-3 text-right text-xs font-semibold text-slate-500 uppercase">Ações</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/40">
            {filtered.map((lead) => (
              <tr key={lead.id} className="hover:bg-slate-800/20 transition-colors">
                <td className="px-4 py-3">
                  <div className="flex items-center gap-3">
                    <div className="flex h-9 w-9 items-center justify-center rounded-2xl bg-brand-accent/15 text-brand-accent text-xs font-bold">
                      {lead.name.charAt(0)}
                    </div>
                    <div>
                      <p className="font-medium text-white">{lead.name}</p>
                      <p className="text-[11px] text-slate-500">{lead.id}</p>
                    </div>
                  </div>
                </td>
                <td className="px-4 py-3">
                  <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-[11px] font-medium border ${STATUS_COLORS[lead.status] || STATUS_COLORS.new}`}>
                    {STATUS_LABELS[lead.status] || lead.status}
                  </span>
                </td>
                <td className="px-4 py-3 text-slate-400">{SOURCE_LABELS[lead.source] || lead.source}</td>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-2">
                    <div className="h-1.5 w-12 rounded-full bg-slate-800 overflow-hidden">
                      <div
                        className="h-full rounded-full"
                        style={{
                          width: `${lead.score}%`,
                          background: lead.score >= 70 ? '#E6FF57' : lead.score >= 40 ? '#F59E0B' : '#EF4444',
                        }}
                      />
                    </div>
                    <span className="text-xs text-slate-400">{lead.score}</span>
                  </div>
                </td>
                <td className="px-4 py-3 text-slate-500">{lead.created_at?.slice(0, 10)}</td>
                <td className="px-4 py-3 text-right">
                  <Button variant="ghost" size="sm" onClick={() => router.push(`/admin/crm/${lead.id}`)}>
                    <Eye className="h-4 w-4" />
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {filtered.length === 0 && <div className="px-4 py-8 text-center text-slate-500">Nenhum lead encontrado.</div>}
      </div>

      <p className="text-xs text-slate-500">{filtered.length} de {leads.length} leads</p>
    </div>
  );
}

function BlogPostTable({ posts, fetchAll, router }: { posts: BlogPost[]; fetchAll: () => void; router: any }) {
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'draft' | 'approval' | 'published' | 'archived'>('all');
  const [generatedOnly, setGeneratedOnly] = useState(false);
  const [actionMsg, setActionMsg] = useState<string | null>(null);

  const filtered = posts.filter((p) => {
    const matchSearch = p.title.toLowerCase().includes(search.toLowerCase()) || p.slug.toLowerCase().includes(search.toLowerCase());
    const matchStatus = statusFilter === 'all' || p.status === statusFilter;
    const matchGenerated = !generatedOnly || p.generated === true;
    return matchSearch && matchStatus && matchGenerated;
  });

  const handleDelete = async (slug: string) => {
    if (!confirm(`Excluir "${slug}" permanentemente?`)) return;
    try {
      await api.delete(`/api/blog/${slug}`);
      setActionMsg(`"${slug}" excluído!`);
      fetchAll();
    } catch (e: any) {
      alert(`Erro: ${e.message}`);
    }
  };

  const handlePublish = async (slug: string) => {
    if (!confirm(`Publicar "${slug}"?`)) return;
    try {
      await api.put(slug, { status: 'published' });
      setActionMsg(`"${slug}" publicado!`);
      fetchAll();
    } catch (e: any) {
      alert(`Erro: ${e.message}`);
    }
  };

  return (
    <div className="space-y-5">
      <div className="flex flex-col gap-3 tablet:flex-row tablet:items-center tablet:justify-between">
        <div className="relative max-w-sm">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-neutral-medium" />
          <input
            type="text"
            placeholder="Buscar artigo..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="glass-input pl-10 w-full text-sm"
          />
        </div>
        <div className="flex items-center gap-2">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as any)}
            className="glass-input text-sm py-2"
          >
            <option value="all">Todos os status</option>
            <option value="published">Publicado</option>
            <option value="approval">Aprovação</option>
            <option value="draft">Rascunho</option>
            <option value="archived">Arquivado</option>
          </select>
          <Button variant="primary" size="sm" onClick={() => router.push('/admin/blog')}>
            <PlusCircle className="mr-1.5 h-4 w-4" /> Novo Artigo
          </Button>
          <Button variant="ghost" size="sm" onClick={fetchAll}>
            <Clock className="mr-1.5 h-4 w-4" /> Atualizar
          </Button>
          <button
            onClick={() => setGeneratedOnly(!generatedOnly)}
            className={`flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-medium transition-colors ${
              generatedOnly
                ? 'border-surgical-teal/30 bg-surgical-teal/10 text-surgical-teal'
                : 'border-neutral-dark bg-transparent text-neutral-medium hover:bg-neutral-medium/10'
            }`}
          >
            <Bot className="h-3 w-3" /> Apenas gerados
          </button>
        </div>
      </div>

      {actionMsg && (
        <div className="rounded-2xl border border-emerald-500/30 bg-emerald-500/5 px-4 py-3 text-sm text-emerald-400">
          {actionMsg}
        </div>
      )}

      {filtered.length === 0 ? (
        <div className="py-8 text-center text-slate-500">Nenhum artigo encontrado.</div>
      ) : (
        <div className="overflow-hidden admin-glass">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-700/50">
                <th className="px-4 py-3 text-left text-xs font-semibold text-slate-500 uppercase">Título</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-slate-500 uppercase">Categoria</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-slate-500 uppercase">Status</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-slate-500 uppercase">Data</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-slate-500 uppercase">Leitura</th>
                <th className="px-4 py-3 text-right text-xs font-semibold text-slate-500 uppercase">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/40">
              {filtered.map((post) => (
                <tr key={post.slug} className="hover:bg-slate-800/20 transition-colors">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-medical-blue/15 text-medical-blue">
                        <FileText className="h-4 w-4" />
                      </div>
                      <div>
                        <p className="font-medium text-white text-sm">{post.title}</p>
                        <p className="text-[11px] text-slate-500">{post.slug}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-slate-300">{post.category}</td>
                  <td className="px-4 py-3">
                    <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-[11px] font-medium border ${STATUS_COLORS[post.status]}`}>
                      {post.status}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-slate-500">{post.date?.slice(0, 10)}</td>
                  <td className="px-4 py-3 text-slate-400">{post.readingTime}</td>
                  <td className="px-4 py-3 text-right">
                    <div className="flex items-center justify-end gap-1">
                      <Button variant="ghost" size="sm" title="Preview">
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="sm" title="Editar" className="text-blue-400 border-blue-500/30">
                        <Edit3 className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="sm" title="Excluir" className="text-red-400 hover:bg-red-500/10" onClick={() => handleDelete(post.slug)}>
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

function AnalyticsView({ funnel, cohorts, procedures }: {
  funnel: Funnel[]; cohorts: Cohort[]; procedures: ProcedureEngagement[];
}) {
  return (
    <div className="space-y-5">
      {/* Conversion Funnel */}
      <div className="admin-glass p-5">
        <h3 className="text-heading-3 font-heading font-semibold text-white mb-4 flex items-center gap-2">
          <BarChart3 className="h-4 w-4 text-brand-accent" /> Funil de Conversão
        </h3>
        <div className="space-y-3">
          {funnel.map((stage, i) => {
            const Icon = [Users, TrendingUp, FileText, Clock, CheckCircle2][i] || Activity;
            const width = Math.max(10, stage.rate);
            return (
              <div key={stage.stage} className="space-y-1">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-medical-teal">
                      <Icon className="h-4 w-4 text-slate-700" />
                    </div>
                    <span className="text-sm text-white">{stage.stage}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-sm font-bold text-brand-accent">{stage.count}</span>
                    <span className="text-xs text-slate-500 w-12 text-right">{stage.rate}%</span>
                  </div>
                </div>
                <div className="h-2.5 rounded-full bg-slate-800 overflow-hidden">
                  <div
                    className="h-full rounded-full bg-surgical-teal transition-all duration-500"
                    style={{ width: `${width}%` }}
                  />
                </div>
                {i < funnel.length - 1 && (
                  <div className="flex justify-center">
                    <ChevronRight className="h-3 w-3 text-slate-600 rotate-90" />
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Cohort Analysis */}
      <div className="admin-glass p-5">
        <h3 className="text-heading-3 font-heading font-semibold text-white mb-4 flex items-center gap-2">
          <Activity className="h-4 w-4 text-brand-accent" /> Análise de Coortes (Semanal)
        </h3>
        {cohorts.length === 0 ? (
          <p className="text-sm text-slate-400">Sem dados de coorte.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-slate-700/50">
                  <th className="px-3 py-2 text-left text-xs font-semibold text-slate-500 uppercase">Semana</th>
                  <th className="px-3 py-2 text-right text-xs font-semibold text-slate-500 uppercase">Leads</th>
                  <th className="px-3 py-2 text-right text-xs font-semibold text-slate-500 uppercase">Convertidos</th>
                  <th className="px-3 py-2 text-right text-xs font-semibold text-slate-500 uppercase">Taxa</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/40">
                {cohorts.map((c) => (
                  <tr key={c.week} className="hover:bg-slate-800/20 transition-colors">
                    <td className="px-3 py-2 text-white">{c.week}</td>
                    <td className="px-3 py-2 text-right text-slate-300">{c.total}</td>
                    <td className="px-3 py-2 text-right text-emerald-400">{c.converted}</td>
                    <td className="px-3 py-2 text-right">
                      <span className={
                        c.conversionRate >= 20
                          ? 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30'
                          : c.conversionRate >= 10
                          ? 'bg-yellow-500/15 text-yellow-400 border-yellow-500/30'
                          : 'bg-red-500/15 text-red-400 border-red-500/30'
                      }>
                        {c.conversionRate}%
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Per-Procedure Engagement */}
      <div className="admin-glass p-5">
        <h3 className="text-heading-3 font-heading font-semibold text-white mb-4 flex items-center gap-2">
          <Activity className="h-4 w-4 text-brand-accent" /> Engajamento por Procedimento
        </h3>
        {procedures.length === 0 ? (
          <p className="text-sm text-slate-400">Sem dados de procedimento.</p>
        ) : (
          <div className="space-y-3">
            {procedures.map((p) => (
              <div key={p.name} className="flex items-center gap-3">
                <span className="w-28 text-xs text-slate-400 capitalize truncate">{p.name}</span>
                <div className="flex-1">
                  <div className="h-2.5 rounded-full bg-slate-800 overflow-hidden">
                    <div
                      className="h-full rounded-full bg-surgical-teal transition-all duration-500"
                      style={{ width: `${procedures[0]?.clicks > 0 ? Math.round((p.clicks / procedures[0].clicks) * 100) : 0}%` }}
                    />
                  </div>
                </div>
                <span className="text-xs text-white w-20 text-right">{p.clicks} clicks</span>
                <span className="text-xs text-slate-500 w-20 text-right">{p.leads} leads</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
