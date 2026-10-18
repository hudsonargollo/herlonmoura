'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { ProtectedRoute } from '@/components/admin/ProtectedRoute';
import { api } from '@/lib/admin/api';
import {
  LEAD_STATUSES,
  LEAD_STATUS_LABELS,
  LEAD_TRANSITIONS,
  type LeadStatus,
} from '@/lib/leads';
import { GitBranch, Save, Users, RefreshCw } from 'lucide-react';
import { Button } from '@/components/Button';

interface Lead {
  id: string;
  name: string;
  whatsapp: string;
  email: string | null;
  source: string;
  status: string;
  score: number;
  notes: string;
  created_at: string;
  updated_at: string;
}

const STATUS_COLORS: Record<string, string> = {
  new: 'bg-slate-500/15 text-slate-400 border-slate-500/30',
  contacted: 'bg-teal-500/15 text-teal-400 border-teal-500/30',
  qualified: 'bg-blue-500/15 text-blue-400 border-blue-500/30',
  appointment: 'bg-yellow-500/15 text-yellow-400 border-yellow-500/30',
  converted: 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30',
  lost: 'bg-red-500/15 text-red-400 border-red-500/30',
};

export default function PipelinePage() {
  return (
    <ProtectedRoute requiredRole="editor">
      <PipelineContent />
    </ProtectedRoute>
  );
}

function PipelineContent() {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [moving, setMoving] = useState<string | null>(null);

  const fetchLeads = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data: { leads: Lead[] } = await api.get('/api/crm/leads?limit=500');
      setLeads(data.leads || []);
    } catch (e: any) {
      setError(e.message || 'Erro ao carregar leads');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchLeads();
  }, [fetchLeads]);

  const leadsByStatus = (status: LeadStatus): Lead[] =>
    leads.filter((l) => l.status === status);

  const handleMove = async (leadId: string, newStatus: LeadStatus) => {
    if (!confirm(`Mover lead para "${LEAD_STATUS_LABELS[newStatus]}"?`)) return;
    setMoving(leadId);
    try {
      await api.patch<{ lead: Lead }>(`/api/crm/leads/${leadId}`, { status: newStatus });
      setLeads((prev) =>
        prev.map((l) => (l.id === leadId ? { ...l, status: newStatus } : l))
      );
    } catch (e: any) {
      alert(`Erro: ${e.message}`);
    } finally {
      setMoving(null);
    }
  };

  if (loading) {
    return <div className="text-center text-slate-400 py-8">Carregando pipeline...</div>;
  }

  if (error) {
    return (
      <div className="rounded-2xl border border-red-500/30 bg-red-500/5 p-8 text-center">
        <p className="text-sm text-red-400">{error}</p>
        <Button variant="primary" size="sm" onClick={fetchLeads} className="mt-2">
          Tentar novamente
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-display-md font-heading font-semibold text-white">Pipeline de Leads</h1>
          <p className="text-sm text-slate-400">
            Visualize e mova leads entre etapas do funil. {leads.length} leads no total.
          </p>
        </div>
        <Button variant="ghost" size="sm" onClick={fetchLeads}>
          <RefreshCw className="h-4 w-4" />
        </Button>
      </div>

      <div className="grid grid-cols-1 tablet:grid-cols-6 gap-4">
        {LEAD_STATUSES.map((status) => {
          const statusLeads = leadsByStatus(status);
          return (
            <div key={status} className="space-y-3">
              <div className="flex items-center justify-between">
                <span
                  className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-[11px] font-medium border ${STATUS_COLORS[status]}`}
                >
                  {LEAD_STATUS_LABELS[status]}
                </span>
                <span className="text-xs text-slate-500">{statusLeads.length}</span>
              </div>

              <div className="space-y-2 min-h-[400px]">
                {statusLeads.length === 0 ? (
                  <div className="rounded-xl border-2 border-dashed border-slate-700/40 bg-slate-800/20 p-4 text-center">
                    <Users className="mx-auto h-6 w-6 text-slate-600" />
                    <p className="mt-1 text-[11px] text-slate-600">Nenhum lead</p>
                  </div>
                ) : (
                  statusLeads.map((lead) => (
                    <PipelineLeadCard
                      key={lead.id}
                      lead={lead}
                      status={status}
                      onMove={handleMove}
                      isMoving={moving === lead.id}
                    />
                  ))
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function PipelineLeadCard({
  lead,
  status,
  onMove,
  isMoving,
}: {
  lead: Lead;
  status: LeadStatus;
  onMove: (id: string, status: LeadStatus) => void;
  isMoving: boolean;
}) {
  const nextStatuses = LEAD_TRANSITIONS[status].filter((s) => s !== 'lost');
  const canRecover = status === 'lost';
  const recoverStatuses = LEAD_TRANSITIONS.lost.filter((s) => s !== 'new');

  return (
    <div
      className="rounded-xl border border-slate-700/40 bg-slate-800/30 p-3 transition-all hover:border-slate-600 group"
    >
      <div className="flex items-start justify-between mb-2">
        <div>
          <p className="font-medium text-sm text-white">{lead.name}</p>
          <p className="text-[11px] text-slate-500">{lead.id.slice(0, 8)}</p>
        </div>
        <span
          className={`text-xs font-medium ${
            lead.score >= 70 ? 'text-emerald-400' : lead.score >= 40 ? 'text-amber-400' : 'text-red-400'
          }`}
        >
          {lead.score}
        </span>
      </div>

      {lead.notes && (
        <p className="text-[11px] text-slate-400 mb-2 line-clamp-2">{lead.notes}</p>
      )}

      <p className="text-[10px] text-slate-500 mb-2">
        {lead.created_at?.slice(0, 10)}
      </p>

      <div className="flex flex-col gap-1">
        {canRecover ? (
          recoverStatuses.map((s) => (
            <button
              key={s}
              onClick={() => onMove(lead.id, s)}
              disabled={isMoving}
              className="text-[10px] text-xs text-left px-2 py-1 rounded hover:bg-slate-700/30 disabled:opacity-50"
            >
              → {LEAD_STATUS_LABELS[s]}
            </button>
          ))
        ) : (
          nextStatuses.map((s) => (
            <button
              key={s}
              onClick={() => onMove(lead.id, s)}
              disabled={isMoving}
              className={`text-[10px] text-left px-2 py-1 rounded hover:bg-slate-700/30 disabled:opacity-50 ${STATUS_COLORS[s]}`}
            >
              → {LEAD_STATUS_LABELS[s]}
            </button>
          ))
        )}
        <button
          onClick={() => onMove(lead.id, 'lost')}
          disabled={isMoving || status === 'lost'}
          className="text-[10px] text-left px-2 py-1 rounded text-red-400 hover:bg-red-500/10 disabled:opacity-50"
        >
          → {LEAD_STATUS_LABELS.lost}
        </button>
      </div>

      {isMoving && (
        <div className="absolute inset-0 bg-slate-900/50 rounded-xl flex items-center justify-center">
          <RefreshCw className="h-4 w-4 animate-spin text-brand-accent" />
        </div>
      )}
    </div>
  );
}
