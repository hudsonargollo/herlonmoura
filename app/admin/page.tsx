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
} from 'lucide-react';

type Section = 'crm' | 'appointments' | 'leads' | 'blog' | 'analytics';

interface DashboardStats {
  leads: { total: number; new: number; byStatus: Record<string, number>; conversionRate: number };
  interactions: number;
  posts: { pending: number; published: number };
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
  const [activeSection, setActiveSection] = useState<Section>('crm');
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
        // silent fail — dashboard will show zeros
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const bentoCards = [
    {
      title: 'Total de Pacientes',
      value: loading ? '—' : leadsCount,
      icon: Users,
      iconBg: 'bg-medical-teal',
      iconColor: 'text-teal-700',
      span: 'col-span-1',
    },
    {
      title: 'Novos Leads',
      value: loading ? '—' : stats?.leads.new ?? 0,
      icon: TrendingUp,
      iconBg: 'bg-brand-accent',
      iconColor: 'text-slate-900',
      span: 'col-span-1',
    },
    {
      title: 'Blog — Publicados',
      value: loading ? '—' : stats?.posts.published ?? 0,
      icon: FileText,
      iconBg: 'bg-medical-blue',
      iconColor: 'text-blue-700',
      span: 'col-span-1',
    },
    {
      title: 'Pendentes Aprovação',
      value: loading ? '—' : stats?.posts.pending ?? 0,
      icon: Clock,
      iconBg: 'bg-medical-yellow',
      iconColor: 'text-yellow-700',
      span: 'col-span-1',
    },
    {
      title: 'Interações',
      value: loading ? '—' : stats?.interactions ?? 0,
      icon: MessageSquare,
      iconBg: 'bg-medical-purple',
      iconColor: 'text-slate-700',
      span: 'col-span-1',
    },
    {
      title: 'Taxa de Conversão',
      value: loading ? '—' : `${stats?.leads.conversionRate ?? 0}%`,
      icon: Activity,
      iconBg: 'bg-emerald-100',
      iconColor: 'text-emerald-700',
      span: 'col-span-1',
    },
  ];

  return (
    <div className="flex min-h-screen bg-surface-dark">
      <Sidebar activeSection={activeSection} onNavigate={(s) => {
        setActiveSection(s);
        if (s === 'blog') router.push('/admin/blog');
        else if (s === 'analytics') router.push('/admin/analytics');
        else if (s === 'crm') router.push('/admin/crm');
      }} />

      <main className="flex-1 p-6 tablet:p-8 overflow-auto admin-scroll">
        {/* Header */}
        <header className="mb-8 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-brand-accent/15">
              <Stethoscope className="h-5 w-5 text-brand-accent" />
            </div>
            <div>
              <h1 className="text-display-md font-heading font-semibold text-white">
                Painel Admin
              </h1>
              <p className="text-sm text-slate-400">Dr. Herlon Moura</p>
            </div>
          </div>
          <div className="hidden tablet:flex items-center gap-2 rounded-2xl bg-surface-cardDark/60 px-4 py-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-brand-accent/20 text-brand-accent text-xs font-bold">A</div>
            <span className="text-sm text-slate-300">Administrador</span>
          </div>
        </header>

        {/* Bento Grid */}
        <div className="grid grid-cols-1 tablet:grid-cols-2 desktop:grid-cols-3 gap-4 mb-6">
          {bentoCards.map((card) => {
            const Icon = card.icon;
            return (
              <div
                key={card.title}
                className="rounded-3xl p-5 bg-surface-cardDark/50 border border-slate-700/40 hover:border-slate-600/50 transition-all duration-200"
              >
                <div className="flex items-center gap-3 mb-3">
                  <div className={`flex h-10 w-10 items-center justify-center rounded-2xl shadow-card ${card.iconBg}`}>
                    <Icon className={`h-5 w-5 ${card.iconColor}`} />
                  </div>
                  <span className="text-xs font-medium text-slate-400 uppercase tracking-wider">{card.title}</span>
                </div>
                <p className="text-3xl font-bold text-brand-accent">{card.value}</p>
              </div>
            );
          })}
        </div>

        {/* Quick Actions */}
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
      </main>
    </div>
  );
}
