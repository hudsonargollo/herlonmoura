'use client';

import React from 'react';
import { TrendingUp, CheckCircle2, Clock, AlertCircle, ArrowUpRight, ArrowDownRight } from 'lucide-react';
import { Card } from '@/components/Card';

interface Lead {
  id: string;
  name: string;
  source: string;
  status: 'new' | 'contacted' | 'qualified' | 'converted' | 'lost';
  score: number;
  lastContact: string;
  nextAction: string;
}

const MOCK_LEADS: Lead[] = [
  {
    id: 'L-001',
    name: 'Carlos Mendes',
    source: 'WhatsApp',
    status: 'qualified',
    score: 78,
    lastContact: '2026-10-02',
    nextAction: 'Agendar retorno',
  },
  {
    id: 'L-002',
    name: 'Juliana Rocha',
    source: 'Google Ads',
    status: 'new',
    score: 45,
    lastContact: '2026-10-01',
    nextAction: 'Primeiro contato',
  },
  {
    id: 'L-003',
    name: 'Ricardo Souza',
    source: 'Indicação',
    status: 'converted',
    score: 95,
    lastContact: '2026-09-28',
    nextAction: 'Avaliação inicial',
  },
  {
    id: 'L-004',
    name: 'Patrícia Lima',
    source: 'Site',
    status: 'lost',
    score: 12,
    lastContact: '2026-08-15',
    nextAction: 'Reativação',
  },
  {
    id: 'L-005',
    name: 'Fernando Brandão',
    source: 'Telefone',
    status: 'contacted',
    score: 60,
    lastContact: '2026-09-30',
    nextAction: 'Encaminhar para exame',
  },
  {
    id: 'L-006',
    name: 'Luiza Ferraz',
    source: 'Instagram',
    status: 'new',
    score: 55,
    lastContact: '2026-10-03',
    nextAction: 'Responder DMs',
  },
];

const STATUS_CONFIG = {
  new: { label: 'Novo', color: 'bg-neutral-medium/15 text-neutral-medium border-neutral-medium/30' },
  contacted: { label: 'Contatado', color: 'bg-surgical-teal/15 text-surgical-teal border-surgical-teal/30' },
  qualified: { label: 'Qualificado', color: 'bg-info/15 text-info border-info/30' },
  converted: { label: 'Convertido', color: 'bg-success-green/15 text-success-green border-success-green/30' },
  lost: { label: 'Perdido', color: 'bg-error-red/15 text-error-red border-error-red/30' },
};

function LeadScoreBar({ score }: { score: number }) {
  const color = score >= 70 ? 'bg-success-green' : score >= 40 ? 'bg-warning-amber' : 'bg-error-red';
  return (
    <div className="flex items-center gap-2">
      <div className="h-1.5 w-12 rounded-full bg-neutral-dark overflow-hidden">
        <div className={`h-full rounded-full ${color}`} style={{ width: `${score}%` }} />
      </div>
      <span className="text-xs text-neutral-medium">{score}</span>
    </div>
  );
}

export function LeadStatusTracker() {
  const leads = MOCK_LEADS;

  const newCount = leads.filter((l) => l.status === 'new').length;
  const qualifiedCount = leads.filter((l) => l.status === 'qualified').length;
  const convertedCount = leads.filter((l) => l.status === 'converted').length;
  const lostCount = leads.filter((l) => l.status === 'lost').length;
  const conversionRate = leads.length > 0 ? Math.round((convertedCount / leads.length) * 100) : 0;

  return (
    <div className="space-y-5">
      {/* Summary cards */}
      <div className="grid grid-cols-2 tablet:grid-cols-4 gap-4">
        <Card variant="glass" className="p-4">
          <p className="text-[11px] uppercase tracking-wider text-neutral-medium">Novos</p>
          <p className="mt-1 text-2xl font-bold text-neutral-light">{newCount}</p>
        </Card>
        <Card variant="glass" className="p-4">
          <p className="text-[11px] uppercase tracking-wider text-neutral-medium">Qualificados</p>
          <p className="mt-1 text-2xl font-bold text-surgical-teal">{qualifiedCount}</p>
        </Card>
        <Card variant="glass" className="p-4">
          <p className="text-[11px] uppercase tracking-wider text-neutral-medium">Convertidos</p>
          <p className="mt-1 text-2xl font-bold text-success-green">{convertedCount}</p>
        </Card>
        <Card variant="glass" className="p-4">
          <p className="text-[11px] uppercase tracking-wider text-neutral-medium">Taxa</p>
          <p className="mt-1 text-2xl font-bold text-neutral-light">{conversionRate}%</p>
        </Card>
      </div>

      {/* Pipeline header */}
      <div className="flex items-center justify-between">
        <h3 className="text-heading-3 font-heading font-semibold text-neutral-light">
          Pipeline de Leads
        </h3>
        <div className="flex items-center gap-1 text-xs text-neutral-medium">
          <TrendingUp className="h-4 w-4" />
          <span>Conversion: {conversionRate}%</span>
        </div>
      </div>

      {/* Kanban-like columns */}
      <div className="grid grid-cols-1 tablet:grid-cols-5 gap-4">
        {(['new', 'contacted', 'qualified', 'converted', 'lost'] as const).map((status) => {
          const config = STATUS_CONFIG[status];
          const items = leads.filter((l) => l.status === status);
          return (
            <div key={status} className="rounded-xl border border-neutral-dark/60 bg-neutral-dark/30 p-3">
              <div className="mb-3 flex items-center justify-between">
                <span
                  className={`inline-flex items-center rounded-full border px-2 py-0.5 text-[11px] font-medium ${config.color}`}
                >
                  {config.label}
                </span>
                <span className="text-xs text-neutral-medium">{items.length}</span>
              </div>
              <div className="space-y-2">
                {items.map((lead) => (
                  <div
                    key={lead.id}
                    className="rounded-lg border border-neutral-dark/60 bg-neutral-dark/60 p-3 transition-colors hover:border-surgical-teal/30"
                  >
                    <p className="text-sm font-medium text-neutral-light">{lead.name}</p>
                    <p className="text-[11px] text-neutral-medium">{lead.source}</p>
                    <div className="mt-2 flex items-center justify-between">
                      <LeadScoreBar score={lead.score} />
                    </div>
                    <p className="mt-2 text-[11px] text-neutral-medium">
                      Próximo: {lead.nextAction}
                    </p>
                  </div>
                ))}
                {items.length === 0 && (
                  <p className="py-4 text-center text-[11px] text-neutral-medium">Vazio</p>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Detailed table */}
      <div className="overflow-hidden rounded-xl border border-neutral-dark bg-neutral-dark/60">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-neutral-dark/60 bg-neutral-dark/40">
              <th className="px-4 py-3 text-left text-xs font-semibold text-neutral-medium uppercase">
                Lead
              </th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-neutral-medium uppercase">
                Fonte
              </th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-neutral-medium uppercase">
                Status
              </th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-neutral-medium uppercase">
                Score
              </th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-neutral-medium uppercase">
                Último Contato
              </th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-neutral-medium uppercase">
                Próxima Ação
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-neutral-dark/40">
            {leads.map((lead) => (
              <tr key={lead.id} className="transition-colors hover:bg-surgical-teal/5">
                <td className="px-4 py-3 font-medium text-neutral-light">{lead.name}</td>
                <td className="px-4 py-3 text-neutral-medium">{lead.source}</td>
                <td className="px-4 py-3">
                  <span
                    className={`inline-flex items-center rounded-full border px-2 py-0.5 text-[11px] font-medium ${STATUS_CONFIG[lead.status].color}`}
                  >
                    {STATUS_CONFIG[lead.status].label}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <LeadScoreBar score={lead.score} />
                </td>
                <td className="px-4 py-3 text-neutral-medium">{lead.lastContact}</td>
                <td className="px-4 py-3 text-neutral-light">{lead.nextAction}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
