'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { TrendingUp, Users, FileText, Calendar, CheckCircle, Filter, ArrowRight } from 'lucide-react';
import { Card } from '@/components/Card';
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
const STAGE_COLORS = ['#14B8A6', '#206095', '#C5A880', '#F59E0B', '#10B981'];

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

  if (loading) return <div className="text-center text-neutral-medium py-8">Carregando funil...</div>;
  if (error) return (
    <div className="rounded-xl border border-error-red/30 bg-error-red/5 p-8 text-center">
      <p className="text-sm text-error-red">{error}</p>
      <button onClick={fetchData} className="mt-3 text-sm text-surgical-teal underline">Tentar novamente</button>
    </div>
  );
  if (!data) return null;

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-display-md font-heading font-semibold text-neutral-light">Funis & Analytics</h1>
          <p className="text-sm text-neutral-medium">Conversão, coortes e engajamento por procedimento.</p>
        </div>
        <div className="flex items-center gap-2">
          <Filter className="h-4 w-4 text-neutral-medium" />
          {(['7', '30', '90'] as const).map((d) => (
            <button
              key={d}
              onClick={() => setDays(d)}
              className={`rounded-full border px-3 py-1 text-[11px] font-medium transition-colors ${
                days === d
                  ? 'border-surgical-teal bg-surgical-teal/10 text-surgical-teal'
                  : 'border-neutral-dark bg-neutral-dark/40 text-neutral-medium hover:bg-neutral-dark'
              }`}
            >
              {d}d
            </button>
          ))}
        </div>
      </div>

      {/* Conversion Funnel */}
      <Card variant="glass" className="p-5">
        <h3 className="text-heading-3 font-heading font-semibold text-neutral-light mb-4">Funil de Conversão</h3>
        <div className="space-y-3">
          {data.funnel.map((stage, i) => {
            const Icon = FUNNEL_ICONS[i] ?? TrendingUp;
            const width = Math.max(10, stage.rate);
            return (
              <div key={stage.stage} className="space-y-1">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Icon className="h-4 w-4" style={{ color: STAGE_COLORS[i] }} />
                    <span className="text-sm text-neutral-light">{stage.stage}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-sm font-bold text-neutral-light">{stage.count}</span>
                    <span className="text-xs text-neutral-medium w-12 text-right">{stage.rate}%</span>
                  </div>
                </div>
                <div className="h-2 rounded-full bg-neutral-dark overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all duration-500"
                    style={{ width: `${width}%`, backgroundColor: STAGE_COLORS[i] }}
                  />
                </div>
                {i < data.funnel.length - 1 && (
                  <div className="flex justify-center">
                    <ArrowRight className="h-3 w-3 text-neutral-medium rotate-90" />
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </Card>

      {/* Cohort Analysis */}
      <Card variant="glass" className="p-5">
        <h3 className="text-heading-3 font-heading font-semibold text-neutral-light mb-4">Análise de Coortes (Semanal)</h3>
        {data.cohorts.length === 0 ? (
          <p className="text-sm text-neutral-medium">Sem dados de coorte.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-neutral-dark/60">
                  <th className="px-3 py-2 text-left text-xs font-semibold text-neutral-medium uppercase">Semana</th>
                  <th className="px-3 py-2 text-right text-xs font-semibold text-neutral-medium uppercase">Leads</th>
                  <th className="px-3 py-2 text-right text-xs font-semibold text-neutral-medium uppercase">Convertidos</th>
                  <th className="px-3 py-2 text-right text-xs font-semibold text-neutral-medium uppercase">Taxa</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-dark/40">
                {data.cohorts.map((c) => (
                  <tr key={c.week} className="hover:bg-surgical-teal/5">
                    <td className="px-3 py-2 text-neutral-light">{c.week}</td>
                    <td className="px-3 py-2 text-right text-neutral-light">{c.total}</td>
                    <td className="px-3 py-2 text-right text-success-green">{c.converted}</td>
                    <td className="px-3 py-2 text-right">
                      <span className={`inline-flex items-center rounded-full border px-2 py-0.5 text-[11px] font-medium ${
                        c.conversionRate >= 20
                          ? 'bg-success-green/15 text-success-green border-success-green/30'
                          : c.conversionRate >= 10
                          ? 'bg-warning-amber/15 text-warning-amber border-warning-amber/30'
                          : 'bg-error-red/15 text-error-red border-error-red/30'
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
      </Card>

      {/* Per-Procedure Engagement */}
      <Card variant="glass" className="p-5">
        <h3 className="text-heading-3 font-heading font-semibold text-neutral-light mb-4">Engajamento por Procedimento</h3>
        {data.procedures.length === 0 ? (
          <p className="text-sm text-neutral-medium">Sem dados de procedimento.</p>
        ) : (
          <div className="space-y-3">
            {data.procedures.map((p) => (
              <div key={p.name} className="flex items-center gap-3">
                <span className="w-28 text-xs text-neutral-medium capitalize truncate">{p.name}</span>
                <div className="flex-1">
                  <div className="h-2 rounded-full bg-neutral-dark overflow-hidden">
                    <div
                      className="h-full rounded-full bg-surgical-teal"
                      style={{ width: `${data.procedures[0]?.clicks > 0 ? Math.round((p.clicks / data.procedures[0].clicks) * 100) : 0}%` }}
                    />
                  </div>
                </div>
                <span className="text-xs text-neutral-light w-20 text-right">{p.clicks} clicks</span>
                <span className="text-xs text-neutral-medium w-20 text-right">{p.leads} leads</span>
              </div>
            ))}
          </div>
        )}
      </Card>
    </div>
  );
}
