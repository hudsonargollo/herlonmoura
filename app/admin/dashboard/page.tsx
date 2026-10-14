'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { TrendingUp, Users, MessageSquare, ArrowUp, Activity, Filter } from 'lucide-react';
import { api } from '@/lib/admin/api';
import { ProtectedRoute } from '@/components/admin/ProtectedRoute';
import { ActivitySvg, LungsSvg, HeartPulseSvg } from '@/components/ui/MedicalIcons';

interface DashboardStats {
  leads: { total: number; new: number; byStatus: Record<string, number> };
  posts: { pending: number; published: number };
  interactions: number;
  conversionRate: number;
  avgScore: number;
  sources: Record<string, number>;
  engagement: { weekOverWeek: number; monthOverMonth: number };
}

const STATUS_COLORS: Record<string, string> = {
  new: 'bg-slate-500/15 text-slate-400 border-slate-500/30',
  contacted: 'bg-teal-500/15 text-teal-400 border-teal-500/30',
  qualified: 'bg-blue-500/15 text-blue-400 border-blue-500/30',
  converted: 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30',
  lost: 'bg-red-500/15 text-red-400 border-red-500/30',
};

export default function AdminDashboard() {
  return (
    <ProtectedRoute requiredRole="viewer">
      <AdminDashboardContent />
    </ProtectedRoute>
  );
}

function AdminDashboardContent() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [period, setPeriod] = useState<'7d' | '30d' | '90d'>('30d');

  const fetchStats = useCallback(async () => {
    setLoading(true); setError(null);
    try {
      const data = await api.get<DashboardStats>('/api/dashboard/stats');
      setStats(data);
    } catch (e: any) { setError(e.message || 'Erro ao carregar estatísticas'); }
    finally { setLoading(false); }
  }, []);

  useEffect(() => { fetchStats(); }, [fetchStats]);

  if (loading) return <div className="text-center text-slate-400 py-8">Carregando dashboard...</div>;
  if (error) return (
    <div className="rounded-2xl border border-red-500/30 bg-red-500/5 p-8 text-center">
      <p className="text-sm text-red-400">{error}</p>
      <button onClick={fetchStats} className="mt-3 text-sm text-teal-400 underline">Tentar novamente</button>
    </div>
  );
  if (!stats) return null;

  const sourceEntries = Object.entries(stats.sources || {}).sort((a, b) => b[1] - a[1]);
  const totalSources = sourceEntries.reduce((sum, [, v]) => sum + v, 0);

  return (
    <div className="space-y-5">
      {/* Header */}
      <div>
        <h1 className="text-display-md font-heading font-semibold text-white">Dashboard</h1>
        <p className="text-sm text-slate-400">Visão geral do desempenho de leads e conteúdo.</p>
      </div>

      {/* Period filter */}
      <div className="flex items-center gap-2">
        <Filter className="h-4 w-4 text-slate-500" />
        {(['7d', '30d', '90d'] as const).map((p) => (
          <button
            key={p}
            onClick={() => setPeriod(p)}
            className={`rounded-full px-4 py-1.5 text-xs font-medium transition-all ${
              period === p
                ? 'bg-brand-accent text-slate-900 font-semibold'
                : 'bg-surface-cardDark/60 border border-slate-700/50 text-slate-400 hover:bg-surface-cardDark hover:text-slate-300'
            }`}
          >
            {p}
          </button>
        ))}
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 tablet:grid-cols-4 gap-4">
        <div className="rounded-3xl p-5 bg-surface-cardDark/50 border border-slate-700/40">
          <div className="flex items-center gap-2 mb-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-medical-teal">
              <Users className="h-4 w-4 text-teal-700" />
            </div>
            <span className="text-xs text-slate-400 uppercase tracking-wider">Total Leads</span>
          </div>
          <p className="text-2xl font-bold text-brand-accent">{stats.leads.total}</p>
          <p className="text-xs text-slate-500 mt-1">{stats.leads.new} novos</p>
        </div>
        <div className="rounded-3xl p-5 bg-surface-cardDark/50 border border-slate-700/40">
          <div className="flex items-center gap-2 mb-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-emerald-100">
              <TrendingUp className="h-4 w-4 text-emerald-700" />
            </div>
            <span className="text-xs text-slate-400 uppercase tracking-wider">Taxa Conversão</span>
          </div>
          <p className="text-2xl font-bold text-brand-accent">{stats.conversionRate}%</p>
          <div className="flex items-center gap-1 mt-1">
            <ArrowUp className="h-3 w-3 text-emerald-400" />
            <span className="text-xs text-emerald-400">+{stats.engagement?.weekOverWeek ?? 0}% SEM</span>
          </div>
        </div>
        <div className="rounded-3xl p-5 bg-surface-cardDark/50 border border-slate-700/40">
          <div className="flex items-center gap-2 mb-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-medical-blue">
              <LungsSvg className="h-4 w-4 text-blue-700" />
            </div>
            <span className="text-xs text-slate-400 uppercase tracking-wider">Score Médio</span>
          </div>
          <p className="text-2xl font-bold text-brand-accent">{stats.avgScore}</p>
          <p className="text-xs text-slate-500 mt-1">/100</p>
        </div>
        <div className="rounded-3xl p-5 bg-surface-cardDark/50 border border-slate-700/40">
          <div className="flex items-center gap-2 mb-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-medical-yellow">
              <MessageSquare className="h-4 w-4 text-yellow-700" />
            </div>
            <span className="text-xs text-slate-400 uppercase tracking-wider">Interações</span>
          </div>
          <p className="text-2xl font-bold text-brand-accent">{stats.interactions}</p>
          <p className="text-xs text-slate-500 mt-1">{stats.posts.pending} pendentes aprovação</p>
        </div>
      </div>

      {/* Lead Sources Chart */}
      <div className="admin-glass p-5">
        <h3 className="text-heading-3 font-heading font-semibold text-white mb-4 flex items-center gap-2">
          <HeartPulseSvg className="h-4 w-4 text-brand-accent" /> Fontes de Lead
        </h3>
        {sourceEntries.length === 0 ? (
          <p className="text-sm text-slate-400">Sem dados de fontes.</p>
        ) : (
          <div className="space-y-3">
            {sourceEntries.map(([source, count]) => {
              const pct = totalSources > 0 ? Math.round((count / totalSources) * 100) : 0;
              return (
                <div key={source} className="flex items-center gap-3">
                  <span className="w-24 text-xs text-slate-400 capitalize">{source}</span>
                  <div className="flex-1 h-2.5 rounded-full bg-slate-800 overflow-hidden">
                    <div className="h-full rounded-full bg-surgical-teal transition-all duration-500" style={{ width: `${pct}%` }} />
                  </div>
                  <span className="w-16 text-xs text-slate-300 text-right">{count} ({pct}%)</span>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Engagement + Conversion */}
      <div className="grid grid-cols-1 tablet:grid-cols-2 gap-4">
        <div className="admin-glass p-5">
          <h3 className="text-heading-3 font-heading font-semibold text-white mb-3 flex items-center gap-2">
            <ActivitySvg className="h-4 w-4 text-brand-accent" /> Engajamento
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
        <div className="admin-glass p-5">
          <h3 className="text-heading-3 font-heading font-semibold text-white mb-3 flex items-center gap-2">
            <Activity className="h-4 w-4 text-brand-accent" /> Posts
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
      </div>

      {/* Lead Status Breakdown */}
      <div className="admin-glass p-5">
        <h3 className="text-heading-3 font-heading font-semibold text-white mb-4">Status dos Leads</h3>
        <div className="grid grid-cols-2 tablet:grid-cols-5 gap-3">
          {(['new', 'contacted', 'qualified', 'converted', 'lost'] as const).map((status) => (
            <div key={status} className="rounded-2xl bg-slate-800/40 border border-slate-700/30 p-3 text-center">
              <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-[11px] font-medium border ${STATUS_COLORS[status] || 'bg-slate-500/15 text-slate-400 border-slate-500/30'}`}>
                {status}
              </span>
              <p className="mt-2 text-xl font-bold text-white">{stats.leads.byStatus?.[status] ?? '—'}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
