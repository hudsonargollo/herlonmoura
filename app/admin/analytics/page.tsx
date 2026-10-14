'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { TrendingUp, Users, FileText, Calendar, CheckCircle, Filter, ArrowRight } from 'lucide-react';
import { api } from '@/lib/admin/api';
import { ProtectedRoute } from '@/components/admin/ProtectedRoute';

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

const FUNNEL_ICONS = [Users, TrendingUp, FileText, Calendar, CheckCircle];
const STAGE_BG = ['bg-medical-teal', 'bg-medical-blue', 'bg-medical-yellow', 'bg-medical-purple', 'bg-emerald-100'];

export default function AnalyticsFunnels() {
  return (
    <ProtectedRoute requiredRole="viewer">
      <AnalyticsFunnelsContent />
    </ProtectedRoute>
  );
}

function AnalyticsFunnelsContent() {
  const [data, setData] = useState<{
    window_days: number;
    funnel: Funnel[];
    cohorts: Cohort[];
    procedures: ProcedureEngagement[];
  } | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [days, setDays] = useState('30');

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await api.get(`/api/analytics/funnels?days=${days}`) as any;
      setData(result);
    } catch (e: any) {
      setError(e.message || 'Erro ao carregar dados');
    } finally {
      setLoading(false);
    }
  }, [days]);

  useEffect(() => { fetchData(); }, [fetchData]);

  if (loading) return <div className="text-center text-slate-400 py-8">Carregando funil...</div>;
  if (error) return (
    <div className="rounded-2xl border border-red-500/30 bg-red-500/5 p-8 text-center">
      <p className="text-sm text-red-400">{error}</p>
      <button onClick={fetchData} className="mt-3 text-sm text-teal-400 underline">Tentar novamente</button>
    </div>
  );
  if (!data) return null;

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-display-md font-heading font-semibold text-white">Funis & Analytics</h1>
          <p className="text-sm text-slate-400">Conversão, coortes e engajamento por procedimento.</p>
        </div>
        <div className="flex items-center gap-2">
          <Filter className="h-4 w-4 text-slate-500" />
          {(['7', '30', '90'] as const).map((d) => (
            <button
              key={d}
              onClick={() => setDays(d)}
              className={`rounded-full px-4 py-1.5 text-xs font-medium transition-all ${
                days === d
                  ? 'bg-brand-accent text-slate-900 font-semibold'
                  : 'bg-surface-cardDark/60 border border-slate-700/50 text-slate-400 hover:bg-surface-cardDark hover:text-slate-300'
              }`}
            >
              {d}d
            </button>
          ))}
        </div>
      </div>

      {/* Conversion Funnel */}
      <div className="admin-glass p-5">
        <h3 className="text-heading-3 font-heading font-semibold text-white mb-4">Funil de Conversão</h3>
        <div className="space-y-3">
          {data.funnel.map((stage, i) => {
            const Icon = FUNNEL_ICONS[i] ?? TrendingUp;
            const width = Math.max(10, stage.rate);
            return (
              <div key={stage.stage} className="space-y-1">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className={`flex h-8 w-8 items-center justify-center rounded-xl ${STAGE_BG[i] || 'bg-slate-700/50'}`}>
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
                    className={`h-full rounded-full transition-all duration-500 ${STAGE_BG[i] || 'bg-slate-600'}`}
                    style={{ width: `${width}%` }}
                  />
                </div>
                {i < data.funnel.length - 1 && (
                  <div className="flex justify-center">
                    <ArrowRight className="h-3 w-3 text-slate-600 rotate-90" />
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Cohort Analysis */}
      <div className="admin-glass p-5">
        <h3 className="text-heading-3 font-heading font-semibold text-white mb-4">Análise de Coortes (Semanal)</h3>
        {data.cohorts.length === 0 ? (
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
                {data.cohorts.map((c) => (
                  <tr key={c.week} className="hover:bg-slate-800/20 transition-colors">
                    <td className="px-3 py-2 text-white">{c.week}</td>
                    <td className="px-3 py-2 text-right text-slate-300">{c.total}</td>
                    <td className="px-3 py-2 text-right text-emerald-400">{c.converted}</td>
                    <td className="px-3 py-2 text-right">
                      <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-[11px] font-medium border ${
                        c.conversionRate >= 20
                          ? 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30'
                          : c.conversionRate >= 10
                          ? 'bg-yellow-500/15 text-yellow-400 border-yellow-500/30'
                          : 'bg-red-500/15 text-red-400 border-red-500/30'
                      }`}>
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
        <h3 className="text-heading-3 font-heading font-semibold text-white mb-4">Engajamento por Procedimento</h3>
        {data.procedures.length === 0 ? (
          <p className="text-sm text-slate-400">Sem dados de procedimento.</p>
        ) : (
          <div className="space-y-3">
            {data.procedures.map((p) => (
              <div key={p.name} className="flex items-center gap-3">
                <span className="w-28 text-xs text-slate-400 capitalize truncate">{p.name}</span>
                <div className="flex-1">
                  <div className="h-2.5 rounded-full bg-slate-800 overflow-hidden">
                    <div
                      className="h-full rounded-full bg-surgical-teal transition-all duration-500"
                      style={{ width: `${data.procedures[0]?.clicks > 0 ? Math.round((p.clicks / data.procedures[0].clicks) * 100) : 0}%` }}
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
