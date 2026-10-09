'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { TrendingUp, Users, FileText, MessageSquare, Clock, ArrowUp, ArrowDown, Activity, Filter } from 'lucide-react';
import { Card } from '@/components/Card';
import { api } from '@/lib/admin/api';

interface DashboardStats {
  leads: { total: number; new: number };
  posts: { pending: number; published: number };
  interactions: number;
  conversionRate: number;
  avgScore: number;
  sources: Record<string, number>;
  engagement: { weekOverWeek: number; monthOverMonth: number };
}

const STATUS_COLORS: Record<string, string> = {
  new: 'bg-muted/50 text-muted-foreground',
  contacted: 'bg-primary/15 text-primary',
  qualified: 'bg-info/15 text-info',
  converted: 'bg-success-green/15 text-success-green',
  lost: 'bg-error-red/15 text-error-red',
};

export default function AdminDashboard() {
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

  if (loading) return <div className="text-center text-muted-foreground py-8">Carregando dashboard...</div>;
  if (error) return (
    <div className="rounded-xl border border-error-red/30 bg-error-red/5 p-8 text-center">
      <p className="text-sm text-error-red">{error}</p>
      <button onClick={fetchStats} className="mt-3 text-sm text-primary underline">Tentar novamente</button>
    </div>
  );
  if (!stats) return null;

  const sourceEntries = Object.entries(stats.sources || {}).sort((a, b) => b[1] - a[1]);
  const totalSources = sourceEntries.reduce((sum, [, v]) => sum + v, 0);

  return (
    <div className="space-y-5">
      {/* Header */}
      <div>
        <h1 className="text-display-md font-heading font-semibold text-foreground">Dashboard</h1>
        <p className="text-sm text-muted-foreground">Visão geral do desempenho de leads e conteúdo.</p>
      </div>

      {/* Period filter */}
      <div className="flex items-center gap-2">
        <Filter className="h-4 w-4 text-muted-foreground" />
        {(['7d', '30d', '90d'] as const).map((p) => (
          <button key={p} onClick={() => setPeriod(p)} className={`rounded-full border px-3 py-1 text-[11px] font-medium transition-colors ${period === p ? 'border-primary bg-primary/10 text-primary' : 'border-border bg-muted/40 text-muted-foreground hover:bg-muted'}`}>{p}</button>
        ))}
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 tablet:grid-cols-4 gap-4">
        <Card variant="glass" className="p-4">
          <div className="flex items-center gap-2 mb-2"><Users className="h-4 w-4 text-primary" /><span className="text-[11px] uppercase tracking-wider text-muted-foreground">Total Leads</span></div>
          <p className="text-2xl font-bold text-foreground">{stats.leads.total}</p>
          <p className="text-[11px] text-muted-foreground">{stats.leads.new} novos</p>
        </Card>
        <Card variant="glass" className="p-4">
          <div className="flex items-center gap-2 mb-2"><TrendingUp className="h-4 w-4 text-success-green" /><span className="text-[11px] uppercase tracking-wider text-muted-foreground">Taxa Conversão</span></div>
          <p className="text-2xl font-bold text-foreground">{stats.conversionRate}%</p>
          <div className="flex items-center gap-1 mt-1"><ArrowUp className="h-3 w-3 text-success-green" /><span className="text-[11px] text-success-green">+{stats.engagement?.weekOverWeek ?? 0}% SEM</span></div>
        </Card>
        <Card variant="glass" className="p-4">
          <div className="flex items-center gap-2 mb-2"><Activity className="h-4 w-4 text-info" /><span className="text-[11px] uppercase tracking-wider text-muted-foreground">Score Médio</span></div>
          <p className="text-2xl font-bold text-foreground">{stats.avgScore}</p>
          <p className="text-[11px] text-muted-foreground">/100</p>
        </Card>
        <Card variant="glass" className="p-4">
          <div className="flex items-center gap-2 mb-2"><MessageSquare className="h-4 w-4 text-warning-amber" /><span className="text-[11px] uppercase tracking-wider text-muted-foreground">Interações</span></div>
          <p className="text-2xl font-bold text-foreground">{stats.interactions}</p>
          <p className="text-[11px] text-muted-foreground">{stats.posts.pending} pendentes aprovação</p>
        </Card>
      </div>

      {/* Lead Sources Chart */}
      <Card variant="glass" className="p-5">
        <h3 className="text-heading-3 font-heading font-semibold text-foreground mb-4">Fontes de Lead</h3>
        {sourceEntries.length === 0 ? (
          <p className="text-sm text-muted-foreground">Sem dados de fontes.</p>
        ) : (
          <div className="space-y-3">
            {sourceEntries.map(([source, count]) => {
              const pct = totalSources > 0 ? Math.round((count / totalSources) * 100) : 0;
              return (
                <div key={source} className="flex items-center gap-3">
                  <span className="w-24 text-xs text-muted-foreground capitalize">{source}</span>
                  <div className="flex-1 h-2 rounded-full bg-muted overflow-hidden">
                    <div className="h-full rounded-full bg-primary" style={{ width: `${pct}%` }} />
                  </div>
                  <span className="w-16 text-xs text-foreground text-right">{count} ({pct}%)</span>
                </div>
              );
            })}
          </div>
        )}
      </Card>

      {/* Engagement + Conversion */}
      <div className="grid grid-cols-1 tablet:grid-cols-2 gap-4">
        <Card variant="glass" className="p-5">
          <h3 className="text-heading-3 font-heading font-semibold text-foreground mb-3">Engajamento</h3>
          <div className="space-y-3">
            <div className="flex items-center justify-between"><span className="text-sm text-muted-foreground">Semana vs Semana</span><span className="text-sm font-semibold text-success-green">+{stats.engagement?.weekOverWeek ?? 0}%</span></div>
            <div className="flex items-center justify-between"><span className="text-sm text-muted-foreground">Mês vs Mês</span><span className="text-sm font-semibold text-primary">+{stats.engagement?.monthOverMonth ?? 0}%</span></div>
          </div>
        </Card>
        <Card variant="glass" className="p-5">
          <h3 className="text-heading-3 font-heading font-semibold text-foreground mb-3">Posts</h3>
          <div className="space-y-3">
            <div className="flex items-center justify-between"><span className="text-sm text-muted-foreground">Pendentes</span><span className="text-sm font-semibold text-warning-amber">{stats.posts.pending}</span></div>
            <div className="flex items-center justify-between"><span className="text-sm text-muted-foreground">Publicados</span><span className="text-sm font-semibold text-success-green">{stats.posts.published}</span></div>
          </div>
        </Card>
      </div>

      {/* Lead Status Breakdown */}
      <Card variant="glass" className="p-5">
        <h3 className="text-heading-3 font-heading font-semibold text-foreground mb-4">Status dos Leads</h3>
        <div className="grid grid-cols-2 tablet:grid-cols-5 gap-3">
          {(['new', 'contacted', 'qualified', 'converted', 'lost'] as const).map((status) => (
            <div key={status} className="rounded-xl border border-border/60 bg-muted/30 p-3 text-center">
              <span className={`inline-flex items-center rounded-full border px-2 py-0.5 text-[11px] font-medium ${STATUS_COLORS[status]}`}>{status}</span>
              <p className="mt-2 text-xl font-bold text-foreground">{/* would come from per-status count */}—</p>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}