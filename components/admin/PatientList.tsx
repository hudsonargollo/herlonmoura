'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { Search, Plus, Filter, UserCheck, Clock, MoreHorizontal, Phone, Mail, MapPin } from 'lucide-react';
import { Button } from '@/components/Button';
import { api, login as apiLogin, logout as apiLogout, getToken, getUser } from '@/lib/admin/api';

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
}

interface LeadCounts {
  leads: { total: number; new: number };
  posts: { pending: number; published: number };
  interactions: number;
}

const STATUS_LABELS: Record<string, string> = {
  active: 'Ativo',
  inactive: 'Inativo',
  pending: 'Pendente',
  new: 'Novo',
  contacted: 'Contatado',
  qualified: 'Qualificado',
  converted: 'Convertido',
  lost: 'Perdido',
  appointment: 'Consulta',
};

const STATUS_COLORS: Record<string, string> = {
  active: 'bg-success-green/15 text-success-green border-success-green/30',
  inactive: ' bg-muted/50/15 text-muted-foreground border-neutral-medium/30',
  pending: 'bg-warning-amber/15 text-warning-amber border-warning-amber/30',
  new: ' bg-muted/50/15 text-muted-foreground border-neutral-medium/30',
  contacted: 'bg-primary/15 text-primaryborder-primary/30',
  qualified: 'bg-info/15 text-info border-info/30',
  converted: 'bg-success-green/15 text-success-green border-success-green/30',
  lost: 'bg-error-red/15 text-error-red border-error-red/30',
  appointment: 'bg-warning-amber/15 text-warning-amber border-warning-amber/30',
};

function LeadScoreBar({ score }: { score: number }) {
  const color = score >= 70 ? 'bg-success-green' : score >= 40 ? 'bg-warning-amber' : 'bg-error-red';
  return (
    <div className="flex items-center gap-2">
      <div className="h-1.5 w-16 rounded-full bg-muted overflow-hidden">
        <div className={`h-full rounded-full ${color}`} style={{ width: `${score}%` }} />
      </div>
      <span className="text-xs text-muted-foreground">{score}</span>
    </div>
  );
}

export function PatientList({ onSelectLead }: { onSelectLead?: (id: string) => void }) {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchLeads = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const params = statusFilter !== 'all' ? `?status=${statusFilter}` : '';
      const data: { leads: Lead[] } = await api.get(`/api/crm/leads${params}`);
      setLeads(data.leads);
    } catch (e: any) {
      setError(e.message || 'Erro ao carregar leads');
    } finally {
      setLoading(false);
    }
  }, [statusFilter]);

  useEffect(() => { fetchLeads(); }, [fetchLeads]);

  const filtered = leads.filter((p) => {
    const matchSearch = p.name.toLowerCase().includes(search.toLowerCase()) || p.id.toLowerCase().includes(search.toLowerCase());
    return matchSearch;
  });

  if (error) {
    return (
      <div className="rounded-xl border border-error-red/30 bg-error-red/5 p-6 text-center">
        <p className="text-sm text-error-red">{error}</p>
        <Button variant="primary" size="sm" onClick={fetchLeads} className="mt-3">Tentar novamente</Button>
      </div>
    );
  }

  return (
    <div className="space-y-5">
      <div className="flex flex-col gap-3 tablet:flex-row tablet:items-center tablet:justify-between">
        <div className="relative max-w-sm">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <input type="text" placeholder="Buscar paciente..." value={search} onChange={(e) => setSearch(e.target.value)} className="glass-input pl-10 w-full text-sm" />
        </div>
        <div className="flex items-center gap-2">
          <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} className="glass-input text-sm py-2">
            <option value="all">Todos os status</option>
            <option value="new">Novo</option>
            <option value="contacted">Contatado</option>
            <option value="qualified">Qualificado</option>
            <option value="appointment">Consulta</option>
            <option value="converted">Convertido</option>
            <option value="lost">Perdido</option>
            <option value="inactive">Inativo</option>
          </select>
          <Button variant="primary" size="sm" onClick={fetchLeads}><Clock className="mr-1.5 h-4 w-4" /> Atualizar</Button>
        </div>
      </div>

      {loading ? (
        <div className="px-4 py-8 text-center text-muted-foreground">Carregando...</div>
      ) : (
        <div className="overflow-hidden rounded-xl border border-border bg-muted/60">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border/60 bg-muted/40">
                <th className="px-4 py-3 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider">Paciente</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider">Status</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider">Fonte</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider">Score</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider">Criado</th>
                <th className="px-4 py-3 text-right text-xs font-semibold text-muted-foreground uppercase tracking-wider">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/40">
              {filtered.map((p) => (
                <tr key={p.id} className={`cursor-pointer transition-colors hover:bg-primary/5 ${selectedId === p.id ? 'bg-primary/10' : ''}`} onClick={() => { setSelectedId(p.id); onSelectLead?.(p.id); }}>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <div className="flex h-9 w-9 items-center justify-center rounded-full bg-primary/15 text-primarytext-xs font-bold">{p.name.charAt(0)}</div>
                      <div>
                        <p className="font-medium text-foreground">{p.name}</p>
                        <p className="text-[11px] text-muted-foreground">{p.id}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3"><span className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-[11px] font-medium ${STATUS_COLORS[p.status] || STATUS_COLORS.new}`}>{STATUS_LABELS[p.status] || p.status}</span></td>
                  <td className="px-4 py-3 text-muted-foreground">{p.source}</td>
                  <td className="px-4 py-3"><LeadScoreBar score={p.score} /></td>
                  <td className="px-4 py-3 text-muted-foreground">{p.created_at?.slice(0, 10)}</td>
                  <td className="px-4 py-3 text-right"><Button variant="ghost" size="sm"><MoreHorizontal className="h-4 w-4" /></Button></td>
                </tr>
              ))}
            </tbody>
          </table>
          {filtered.length === 0 && <div className="px-4 py-8 text-center text-muted-foreground">Nenhum lead encontrado.</div>}
        </div>
      )}

      <p className="text-[11px] text-muted-foreground">{filtered.length} de {leads.length} leads</p>
    </div>
  );
}