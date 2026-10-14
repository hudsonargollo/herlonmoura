'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { Search, Filter, Clock, Plus, ArrowUpDown } from 'lucide-react';
import { Button } from '@/components/Button';
import { FormInput } from '@/components/FormInput';
import { api } from '@/lib/admin/api';
import { ProtectedRoute } from '@/components/admin/ProtectedRoute';

type SourceFilter = 'all' | 'contact' | 'questionnaire' | 'whatsapp' | 'referral' | 'social';
type StatusFilter = 'all' | 'new' | 'contacted' | 'qualified' | 'appointment' | 'converted' | 'lost';

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

const SOURCES: SourceFilter[] = ['all', 'contact', 'questionnaire', 'whatsapp', 'referral', 'social'];
const SOURCE_LABELS: Record<string, string> = { all: 'Todas', contact: 'Contato', questionnaire: 'Questionário', whatsapp: 'WhatsApp', referral: 'Indicação', social: 'Social' };
const STATUSES: StatusFilter[] = ['all', 'new', 'contacted', 'qualified', 'appointment', 'converted', 'lost'];
const STATUS_LABELS: Record<string, string> = { new: 'Novo', contacted: 'Contatado', qualified: 'Qualificado', appointment: 'Consulta', converted: 'Convertido', lost: 'Perdido' };
const STATUS_COLORS: Record<string, string> = {
  new: 'bg-slate-500/15 text-slate-400 border-slate-500/30',
  contacted: 'bg-teal-500/15 text-teal-400 border-teal-500/30',
  qualified: 'bg-blue-500/15 text-blue-400 border-blue-500/30',
  appointment: 'bg-yellow-500/15 text-yellow-400 border-yellow-500/30',
  converted: 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30',
  lost: 'bg-red-500/15 text-red-400 border-red-500/30',
};

export default function CRMLeadList() {
  return (
    <ProtectedRoute requiredRole="editor">
      <CRMLeadListContent />
    </ProtectedRoute>
  );
}

function CRMLeadListContent() {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [search, setSearch] = useState('');
  const [sourceFilter, setSourceFilter] = useState<SourceFilter>('all');
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('all');
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchLeads = useCallback(async () => {
    setLoading(true); setError(null);
    try {
      const params = new URLSearchParams();
      if (statusFilter !== 'all') params.set('status', statusFilter);
      if (sourceFilter !== 'all') params.set('source', sourceFilter);
      if (dateFrom) params.set('dateFrom', dateFrom);
      if (dateTo) params.set('dateTo', dateTo);
      const qs = params.toString();
      const data: { leads: Lead[] } = await api.get(`/api/crm/leads${qs ? '?' + qs : ''}`);
      setLeads(data.leads);
    } catch (e: any) { setError(e.message || 'Erro ao carregar leads'); }
    finally { setLoading(false); }
  }, [statusFilter, sourceFilter, dateFrom, dateTo]);

  useEffect(() => { fetchLeads(); }, [fetchLeads]);

  const filtered = leads.filter((l) => {
    const matchSearch = l.name.toLowerCase().includes(search.toLowerCase()) || l.id.toLowerCase().includes(search.toLowerCase());
    const matchDate = (!dateFrom || l.created_at >= dateFrom) && (!dateTo || l.created_at <= dateTo + 'T23:59:59');
    return matchSearch && matchDate;
  });

  return (
    <div className="space-y-5">
      {/* Filters */}
      <div className="admin-glass p-5">
        <div className="flex items-center gap-2 mb-3">
          <Filter className="h-4 w-4 text-brand-accent" />
          <span className="text-sm font-semibold text-white">Filtros</span>
        </div>
        <div className="grid grid-cols-1 tablet:grid-cols-4 gap-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
            <input type="text" placeholder="Buscar nome ou ID..." value={search} onChange={(e) => setSearch(e.target.value)} className="glass-input pl-10 w-full text-sm" />
          </div>
          <select value={sourceFilter} onChange={(e) => setSourceFilter(e.target.value as SourceFilter)} className="glass-input text-sm py-2">
            {SOURCES.map((s) => <option key={s} value={s}>{SOURCE_LABELS[s]}</option>)}
          </select>
          <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value as StatusFilter)} className="glass-input text-sm py-2">
            {STATUSES.map((s) => <option key={s} value={s}>{STATUS_LABELS[s]}</option>)}
          </select>
          <div className="flex gap-2">
            <input type="date" value={dateFrom} onChange={(e) => setDateFrom(e.target.value)} className="glass-input text-sm py-2 flex-1" />
            <input type="date" value={dateTo} onChange={(e) => setDateTo(e.target.value)} className="glass-input text-sm py-2 flex-1" />
          </div>
        </div>
        <div className="flex items-center gap-2 mt-3">
          <Button variant="primary" size="sm" onClick={fetchLeads}><Clock className="mr-1.5 h-4 w-4" /> Atualizar</Button>
          {(sourceFilter !== 'all' || statusFilter !== 'all' || dateFrom || dateTo || search) && (
            <Button variant="ghost" size="sm" onClick={() => { setSearch(''); setSourceFilter('all'); setStatusFilter('all'); setDateFrom(''); setDateTo(''); }}>Limpar filtros</Button>
          )}
        </div>
      </div>

      {error && (
        <div className="rounded-2xl border border-red-500/30 bg-red-500/5 p-4 text-center">
          <p className="text-sm text-red-400">{error}</p>
          <Button variant="primary" size="sm" onClick={fetchLeads} className="mt-2">Tentar novamente</Button>
        </div>
      )}

      {loading ? (
        <div className="px-4 py-8 text-center text-slate-400">Carregando leads...</div>
      ) : (
        <div className="overflow-hidden admin-glass">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-700/50">
                <th className="px-4 py-3 text-left text-xs font-semibold text-slate-500 uppercase">Paciente</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-slate-500 uppercase">Status</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-slate-500 uppercase">Fonte</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-slate-500 uppercase">Score</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-slate-500 uppercase">Criado</th>
                <th className="px-4 py-3 text-right text-xs font-semibold text-slate-500 uppercase">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/40">
              {filtered.map((lead) => (
                <tr key={lead.id} className="hover:bg-slate-800/20 transition-colors">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <div className="flex h-9 w-9 items-center justify-center rounded-2xl bg-brand-accent/15 text-brand-accent text-xs font-bold">{lead.name.charAt(0)}</div>
                      <div>
                        <p className="font-medium text-white">{lead.name}</p>
                        <p className="text-[11px] text-slate-500">{lead.id}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-[11px] font-medium border ${STATUS_COLORS[lead.status] || STATUS_COLORS.new}`}>
                      {STATUS_LABELS[lead.status] || lead.status}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-slate-400">{SOURCE_LABELS[lead.source] || lead.source}</td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <div className="h-1.5 w-12 rounded-full bg-slate-800 overflow-hidden">
                        <div
                          className="h-full rounded-full"
                          style={{
                            width: `${lead.score}%`,
                            background: lead.score >= 70 ? '#E6FF57' : lead.score >= 40 ? '#F59E0B' : '#EF4444',
                          }}
                        />
                      </div>
                      <span className="text-xs text-slate-400">{lead.score}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-slate-500">{lead.created_at?.slice(0, 10)}</td>
                  <td className="px-4 py-3 text-right">
                    <Button variant="ghost" size="sm">Detalhes</Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {filtered.length === 0 && <div className="px-4 py-8 text-center text-slate-500">Nenhum lead encontrado.</div>}
        </div>
      )}

      <p className="text-xs text-slate-500">{filtered.length} de {leads.length} leads</p>
    </div>
  );
}
