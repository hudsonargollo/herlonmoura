'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { TrendingUp, CheckCircle2, Clock, AlertCircle, ArrowUpRight, ArrowDownRight } from 'lucide-react';
import { Card } from '@/components/Card';
import { api } from '@/lib/admin/api';

interface Lead {
  id: string;
  name: string;
  source: string;
  status: string;
  score: number;
  lastContact: string;
  nextAction: string;
  created_at: string;
}

interface Stats {
  leads: { total: number; new: number };
  posts: { pending: number; published: number };
  interactions: number;
}

const STATUS_CONFIG: Record<string, { label: string; color: string }> = {
  new: { label: 'Novo', color: ' bg-muted/50/15 text-muted-foreground border-neutral-medium/30' },
  contacted: { label: 'Contatado', color: 'bg-primary/15 text-primaryborder-primary/30' },
  qualified: { label: 'Qualificado', color: 'bg-info/15 text-info border-info/30' },
  converted: { label: 'Convertido', color: 'bg-success-green/15 text-success-green border-success-green/30' },
  lost: { label: 'Perdido', color: 'bg-error-red/15 text-error-red border-error-red/30' },
};

function LeadScoreBar({ score }: { score: number }) {
  const color = score >= 70 ? 'bg-success-green' : score >= 40 ? 'bg-warning-amber' : 'bg-error-red';
  return (
    <div className="flex items-center gap-2">
      <div className="h-1.5 w-12 rounded-full bg-muted overflow-hidden">
        <div className={`h-full rounded-full ${color}`} style={{ width: `${score}%` }} />
      </div>
      <span className="text-xs text-muted-foreground">{score}</span>
    </div>
  );
}

export function LeadStatusTracker() {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function load() {
      setLoading(true);
      setError(null);
      try {
        const [data, s] = await Promise.all([
          api.get<{ leads: Lead[] }>('/api/crm/leads'),
          api.get<Stats>('/api/dashboard/stats'),
        ]);
        setLeads(data.leads);
        setStats(s);
      } catch (e: any) {
        setError(e.message || 'Erro ao carregar');
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  const newCount = leads.filter((l) => l.status === 'new').length;
  const qualifiedCount = leads.filter((l) => l.status === 'qualified').length;
  const convertedCount = leads.filter((l) => l.status === 'converted').length;
  const lostCount = leads.filter((l) => l.status === 'lost').length;
  const conversionRate = leads.length > 0 ? Math.round((convertedCount / leads.length) * 100) : 0;

  if (error) {
    return (
      <div className="rounded-xl border border-error-red/30 bg-error-red/5 p-6 text-center">
        <p className="text-sm text-error-red">{error}</p>
      </div>
    );
  }

  return (
    <div className="space-y-5">
      <div className="grid grid-cols-2 tablet:grid-cols-4 gap-4">
        <Card variant="glass" className="p-4">
          <p className="text-[11px] uppercase tracking-wider text-muted-foreground">Novos</p>
          <p className="mt-1 text-2xl font-bold text-foreground">{stats?.leads.new ?? newCount}</p>
        </Card>
        <Card variant="glass" className="p-4">
          <p className="text-[11px] uppercase tracking-wider text-muted-foreground">Qualificados</p>
          <p className="mt-1 text-2xl font-bold text-primary">{qualifiedCount}</p>
        </Card>
        <Card variant="glass" className="p-4">
          <p className="text-[11px] uppercase tracking-wider text-muted-foreground">Convertidos</p>
          <p className="mt-1 text-2xl font-bold text-success-green">{convertedCount}</p>
        </Card>
        <Card variant="glass" className="p-4">
          <p className="text-[11px] uppercase tracking-wider text-muted-foreground">Taxa</p>
          <p className="mt-1 text-2xl font-bold text-foreground">{conversionRate}%</p>
        </Card>
      </div>

      <div className="flex items-center justify-between">
        <h3 className="text-heading-3 font-heading font-semibold text-foreground">Pipeline de Leads</h3>
        <div className="flex items-center gap-1 text-xs text-muted-foreground">
          <TrendingUp className="h-4 w-4" />
          <span>Total: {stats?.leads.total ?? leads.length}</span>
        </div>
      </div>

      {loading ? (
        <div className="text-center text-muted-foreground py-8">Carregando...</div>
      ) : (
        <div className="grid grid-cols-1 tablet:grid-cols-5 gap-4">
          {(['new', 'contacted', 'qualified', 'converted', 'lost'] as const).map((status) => {
            const config = STATUS_CONFIG[status];
            const items = leads.filter((l) => l.status === status);
            return (
              <div key={status} className="rounded-xl border border-border/60 bg-muted/30 p-3">
                <div className="mb-3 flex items-center justify-between">
                  <span className={`inline-flex items-center rounded-full border px-2 py-0.5 text-[11px] font-medium ${config.color}`}>{config.label}</span>
                  <span className="text-xs text-muted-foreground">{items.length}</span>
                </div>
                <div className="space-y-2">
                  {items.map((lead) => (
                    <div key={lead.id} className="rounded-lg border border-border/60 bg-muted/60 p-3 transition-colors hover:border-primary/30">
                      <p className="text-sm font-medium text-foreground">{lead.name}</p>
                      <p className="text-[11px] text-muted-foreground">{lead.source}</p>
                      <div className="mt-2 flex items-center justify-between"><LeadScoreBar score={lead.score} /></div>
                      <p className="mt-2 text-[11px] text-muted-foreground">Criado: {lead.created_at?.slice(0, 10)}</p>
                    </div>
                  ))}
                  {items.length === 0 && <p className="py-4 text-center text-[11px] text-muted-foreground">Vazio</p>}
                </div>
              </div>
            );
          })}
        </div>
      )}

      <div className="overflow-hidden rounded-xl border border-border bg-muted/60">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border/60 bg-muted/40">
              <th className="px-4 py-3 text-left text-xs font-semibold text-muted-foreground uppercase">Lead</th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-muted-foreground uppercase">Fonte</th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-muted-foreground uppercase">Status</th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-muted-foreground uppercase">Score</th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-muted-foreground uppercase">Criado</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border/40">
            {leads.map((lead) => (
              <tr key={lead.id} className="transition-colors hover:bg-primary/5">
                <td className="px-4 py-3 font-medium text-foreground">{lead.name}</td>
                <td className="px-4 py-3 text-muted-foreground">{lead.source}</td>
                <td className="px-4 py-3"><span className={`inline-flex items-center rounded-full border px-2 py-0.5 text-[11px] font-medium ${STATUS_CONFIG[lead.status]?.color || ''}`}>{STATUS_CONFIG[lead.status]?.label || lead.status}</span></td>
                <td className="px-4 py-3"><LeadScoreBar score={lead.score} /></td>
                <td className="px-4 py-3 text-muted-foreground">{lead.created_at?.slice(0, 10)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}