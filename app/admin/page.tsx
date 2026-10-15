'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Sidebar } from '@/components/admin/Sidebar';
import { ProtectedRoute } from '@/components/admin/ProtectedRoute';
import { api } from '@/lib/admin/api';
import {
  Users,
  TrendingUp,
  FileText,
  Clock,
  MessageSquare,
  Activity,
  Plus,
  Eye,
  Stethoscope,
  BarChart3,
} from 'lucide-react';

type Section = 'dashboard' | 'crm' | 'leads' | 'blog' | 'analytics';

interface DashboardStats {
  leads: { total: number; new: number; byStatus: Record<string, number>; conversionRate: number };
  posts: { pending: number; published: number };
  interactions: number;
  engagement: { weekOverWeek: number; monthOverMonth: number };
  avgScore: number;
  sources: Record<string, number>;
}

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
  const [leadsCount, setLeadsCount] = useState<number>(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const [statsData, leadsData] = await Promise.all([
          api.get<DashboardStats>('/api/dashboard/stats'),
          api.get<{ leads: unknown[] }>('/api/crm/leads'),
        ]);
        setStats(statsData);
        setLeadsCount(leadsData.leads.length);
      } catch {
        // silent fail — sections render with zeros
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const renderBentoCards = () => {
    if (!stats) {
      return [
        { title: 'Total de Pacientes', value: '—', icon: Users, iconBg: 'bg-medical-teal', iconColor: 'text-teal-700' },
        { title: 'Novos Leads', value: '—', icon: TrendingUp, iconBg: 'bg-brand-accent', iconColor: 'text-slate-900' },
        { title: 'Interações', value: '—', icon: MessageSquare, iconBg: 'bg-medical-purple', iconColor: 'text-slate-700' },
        { title: 'Taxa de Conversão', value: '—', icon: Activity, iconBg: 'bg-emerald-100', iconColor: 'text-emerald-700' },
      ];
    }
    return [
      { title: 'Total de Pacientes', value: leadsCount, icon: Users, iconBg: 'bg-medical-teal', iconColor: 'text-teal-700' },
      { title: 'Novos Leads', value: stats.leads.new, icon: TrendingUp, iconBg: 'bg-brand-accent', iconColor: 'text-slate-900' },
      { title: 'Interações', value: stats.interactions, icon: MessageSquare, iconBg: 'bg-medical-purple', iconColor: 'text-slate-700' },
      { title: 'Taxa de Conversão', value: `${stats.leads.conversionRate ?? 0}%`, icon: Activity, iconBg: 'bg-emerald-100', iconColor: 'text-emerald-700' },
    ];
  };

  const renderContent = () => {
    switch (activeSection) {
      case 'dashboard':
        return renderDashboard();
      case 'crm':
        return (
          <div className="space-y-5">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-display-md font-heading font-semibold text-white">CRM</h1>
                <p className="text-sm text-slate-400">Gerencie leads e pacientes.</p>
              </div>
              <button
                onClick={() => router.push('/admin/crm')}
                className="flex items-center gap-2 rounded-3xl bg-brand-accent px-5 py-2.5 text-sm font-semibold text-slate-900 hover:bg-brand-accent/90 transition-colors"
              >
                <Plus className="h-4 w-4" /> Ver CRM
              </button>
            </div>
            <p className="text-sm text-slate-400">Acesse o CRM completo em <strong>/admin/crm</strong>.</p>
          </div>
        );
      case 'leads':
        return (
          <div className="space-y-5">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-display-md font-heading font-semibold text-white">Leads</h1>
                <p className="text-sm text-slate-400">Lista de leads do autor.{'\n'}<ul>
                  <li>Novo</li><li>Contatado</li><li>Qualificado</li><li>Consulta</li><li>Convertido</li><li>Perdido</li></ul></p>
              </div>
              <button
                onClick={() => router.push('/admin/crm')}
                className="flex items-center gap-2 rounded-3xl bg-brand-accent px-5 py-2.5 text-sm font-semibold text-slate-900 hover:bg-brand-accent/90 transition-colors"
              >
                <Plus className="h-4 w-4" /> Ver Leads
              </button>
            </div>
            <p className="text-sm text-slate-400">Acesse a lista de leads em <strong>/admin/crm</strong>.</p>
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
              <button
                onClick={() => router.push('/admin/blog')}
                className="flex items-center gap-2 rounded-3xl bg-brand-accent px-5 py-2.5 text-sm font-semibold text-slate-900 hover:bg-brand-accent/90 transition-colors"
              >
                <Plus className="h-4 w-4" /> Novo Artigo
              </button>
            </div>
            <p className="text-sm text-slate-400">Acesse o editor de artigos em <strong>/admin/blog</strong>.</p>
          </div>
        );
      case 'analytics':
        return (
          <div className="space-y-5">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-display-md font-heading font-semibold text-white">Analytics</h1>
                <p className="text-sm text-slate-400">Funis de conversão, coortes e engajamento.</p>
              </div>
              <button
                onClick={() => router.push('/admin/analytics')}
                className="flex items-center gap-2 rounded-3xl bg-brand-accent px-5 py-2.5 text-sm font-semibold text-slate-900 hover:bg-brand-accent/90 transition-colors"
              >
                <BarChart3 className="h-4 w-4" /> Ver Analytics
              </button>
            </div>
            <p className="text-sm text-slate-400">Acesse os gráficos e análises em <strong>/admin/analytics</strong>.</p>
          </div>
        );
      default:
        return null;
    }
  };

  const renderDashboard = () => {
    return (
      <div className="space-y-5">
        {/* KPI Cards */}
        <div className="grid grid-cols-2 tablet:grid-cols-4 gap-4">
          <div className="rounded-3xl p-5 bg-surface-cardDark/50 border border-slate-700/40">
            <div className="flex items-center gap-2 mb-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-medical-teal">
                <Users className="h-4 w-4 text-teal-700" />
              </div>
              <span className="text-xs text-slate-400 uppercase tracking-wider">Total Leads</span>
            </div>
            <p className="text-2xl font-bold text-brand-accent">{loading ? '—' : leadsCount}</p>
            <p className="text-xs text-slate-500 mt-1">novos registros</p>
          </div>
          <div className="rounded-3xl p-5 bg-surface-cardDark/50 border border-slate-700/40">
            <div className="flex items-center gap-2 mb-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-emerald-100">
                <TrendingUp className="h-4 w-4 text-emerald-700" />
              </div>
              <span className="text-xs text-slate-400 uppercase tracking-wider">Taxa Conversão</span>
            </div>
            <p className="text-2xl font-bold text-brand-accent">{loading ? '—' : stats?.leads.conversionRate ?? 0}%</p>
          </div>
          <div className="rounded-3xl p-5 bg-surface-cardDark/50 border border-slate-700/40">
            <div className="flex items-center gap-2 mb-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-medical-blue">
                <MessageSquare className="h-4 w-4 text-blue-700" />
              </div>
              <span className="text-xs text-slate-400 uppercase tracking-wider">Interações</span>
            </div>
            <p className="text-2xl font-bold text-brand-accent">{loading ? '—' : stats?.interactions ?? 0}</p>
          </div>
          <div className="rounded-3xl p-5 bg-surface-cardDark/50 border border-slate-700/40">
            <div className="flex items-center gap-2 mb-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-medical-yellow">
                <FileText className="h-4 w-4 text-yellow-700" />
              </div>
              <span className="text-xs text-slate-400 uppercase tracking-wider">Blog</span>
            </div>
            <p className="text-2xl font-bold text-brand-accent">{loading ? '—' : stats?.posts.published ?? 0}</p>
            <p className="text-xs text-slate-500 mt-1">publicados</p>
          </div>
        </div>

        {!loading && stats && (
          <>
            {/* Lead Sources */}
            <div className="admin-glass p-5">
              <h3 className="text-heading-3 font-heading font-semibold text-white mb-4 flex items-center gap-2">
                <Users className="h-4 w-4 text-brand-accent" /> Fontes de Lead
              </h3>
              {Object.entries(stats.sources || {}).length === 0 ? (
                <p className="text-sm text-slate-400">Sem dados de fontes.</p>
              ) : (
                <div className="space-y-3">
                  {Object.entries(stats.sources)
                    .sort((a, b) => b[1] - a[1])
                    .map(([source, count]) => {
                      const total = Object.values(stats.sources).reduce((a, b) => a + b, 0);
                      const pct = total > 0 ? Math.round((count / total) * 100) : 0;
                      return (
                        <div key={source} className="flex items-center gap-3">
                          <span className="w-24 text-xs text-slate-400 capitalize">{source}</span>
                          <div className="flex-1 h-2.5 rounded-full bg-slate-800 overflow-hidden">
                            <div
                              className="h-full rounded-full bg-surgical-teal transition-all duration-500"
                              style={{ width: `${pct}%` }}
                            />
                          </div>
                          <span className="w-16 text-xs text-slate-300 text-right">{count} ({pct}%)</span>
                        </div>
                      );
                    })}
                </div>
              )}
            </div>

            {/* Engagement */}
            <div className="admin-glass p-5">
              <h3 className="text-heading-3 font-heading font-semibold text-white mb-3 flex items-center gap-2">
                <Activity className="h-4 w-4 text-brand-accent" /> Engajamento
              </h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-slate-400">Semana vs Semana</span>
                  <span className="text-sm font-semibold text-emerald-400">+{stats.engagement?.weekOverWeek ?? 0}%</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-slate-400">Mês vs Mês</span>
                  <span className="text-sm font-semibold text-teal-400">+{stats.engagement?.monthOverMonth ?? 0}%</span>
                </div>
              </div>
            </div>

            {/* Posts */}
            <div className="admin-glass p-5">
              <h3 className="text-heading-3 font-heading font-semibold text-white mb-3 flex items-center gap-2">
                <FileText className="h-4 w-4 text-brand-accent" /> Posts
              </h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-slate-400">Pendentes</span>
                  <span className="text-sm font-semibold text-yellow-400">{stats.posts.pending}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-slate-400">Publicados</span>
                  <span className="text-sm font-semibold text-emerald-400">{stats.posts.published}</span>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    );
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
                {activeSection === 'dashboard' ? 'Dashboard' : activeSection === 'crm' ? 'CRM' : activeSection === 'leads' ? 'Leads' : activeSection === 'blog' ? 'Blog' : 'Analytics'}
              </h1>
              <p className="text-sm text-slate-400">
                {activeSection === 'dashboard' ? 'Visão geral do desempenho de leads e conteúdo.' :
                 activeSection === 'crm' ? 'Gerencie cadastros de pacientes.' :
                 activeSection === 'leads' ? 'Lista de leads.' :
                 activeSection === 'blog' ? 'Gerencie artigos e conteúdo.' :
                 'Funis de conversão, coortes e engajamento.'}
              </p>
            </div>
          </div>
        </header>

        {/* Bento Grid — dashboard summary */}
        {activeSection === 'dashboard' && (
          <div className="grid grid-cols-1 tablet:grid-cols-2 desktop:grid-cols-3 gap-4 mb-6">
            {renderBentoCards().map((card) => (
              <div
                key={card.title}
                className="rounded-3xl p-5 bg-surface-cardDark/50 border border-slate-700/40 hover:border-slate-600/50 transition-all duration-200"
              >
                <div className="flex items-center gap-3 mb-3">
                  <div className={`flex h-10 w-10 items-center justify-center rounded-2xl shadow-card ${card.iconBg}`}>
                    <card.icon className={`h-5 w-5 ${card.iconColor}`} />
                  </div>
                  <span className="text-xs font-medium text-slate-400 uppercase tracking-wider">{card.title}</span>
                </div>
                <p className="text-3xl font-bold text-brand-accent">{card.value}</p>
              </div>
            ))}
          </div>
        )}

        {activeSection === 'dashboard' && (
          <div className="flex flex-wrap gap-3">
            <button
              onClick={() => router.push('/admin/crm')}
              className="flex items-center gap-2 rounded-3xl bg-brand-accent px-5 py-2.5 text-sm font-semibold text-slate-900 hover:bg-brand-accent/90 transition-colors"
            >
              <Plus className="h-4 w-4" /> Novo Lead
            </button>
            <button
              onClick={() => router.push('/admin/blog')}
              className="flex items-center gap-2 rounded-3xl bg-surface-cardDark/60 border border-slate-700/50 px-5 py-2.5 text-sm font-semibold text-slate-200 hover:bg-surface-cardDark transition-colors"
            >
              <FileText className="h-4 w-4" /> Criar Artigo
            </button>
            <button
              onClick={() => router.push('/admin/blog/approval')}
              className="flex items-center gap-2 rounded-3xl bg-surface-cardDark/60 border border-slate-700/50 px-5 py-2.5 text-sm font-semibold text-slate-200 hover:bg-surface-cardDark transition-colors"
            >
              <Eye className="h-4 w-4" /> Ver Blog
            </button>
          </div>
        )}

        {/* Section content */}
        {renderContent()}
      </main>
    </div>
  );
}
