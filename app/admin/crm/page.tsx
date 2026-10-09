'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { Search, Filter, Clock, Plus, ArrowUpDown, GripVertical, ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/Button';
import { Card } from '@/components/Card';
import { FormInput } from '@/components/FormInput';
import { api } from '@/lib/admin/api';

type Status = 'new' | 'contacted' | 'qualified' | 'appointment' | 'converted' | 'lost';
type SourceFilter = 'all' | 'contact' | 'questionnaire' | 'whatsapp' | 'referral' | 'social';

interface Lead {
  id: string;
  name: string;
  whatsapp: string;
  email: string | null;
  source: string;
  status: Status;
  score: number;
  tags: string;
  notes: string;
  created_at: string;
  updated_at: string;
}

const STATUSES: Status[] = ['new', 'contacted', 'qualified', 'appointment', 'converted', 'lost'];
const STATUS_LABELS: Record<Status, string> = { new: 'Novo', contacted: 'Contatado', qualified: 'Qualificado', appointment: 'Consulta', converted: 'Convertido', lost: 'Perdido' };
const STATUS_COLORS: Record<Status, string> = {
  new: 'bg-muted/50 text-muted-foreground border-border/30',
  contacted: 'bg-primary/15 text-primary border-primary/30',
  qualified: 'bg-info/15 text-info border-info/30',
  appointment: 'bg-warning-amber/15 text-warning-amber border-warning-amber/30',
  converted: 'bg-success-green/15 text-success-green border-success-green/30',
  lost: 'bg-error-red/15 text-error-red border-error-red/30',
};
const SOURCE_LABELS: Record<string, string> = { all: 'Todas', contact: 'Contato', questionnaire: 'Questionário', whatsapp: 'WhatsApp', referral: 'Indicação', social: 'Social' };

const STATUS_LIMITS: Record<Status, number> = { new: 99, contacted: 99, qualified: 99, appointment: 99, converted: 99, lost: 99 };

export default function CRMPipeline() {
  const [allLeads, setAllLeads] = useState<Lead[]>([]);
  const [search, setSearch] = useState('');
  const [sourceFilter, setSourceFilter] = useState<SourceFilter>('all');
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [dragging, setDragging] = useState<string | null>(null);
  const [saving, setSaving] = useState<string | null>(null);

  const fetchLeads = useCallback(async () => {
    setLoading(true); setError(null);
    try {
      const params = new URLSearchParams();
      if (sourceFilter !== 'all') params.set('source', sourceFilter);
      if (dateFrom) params.set('dateFrom', dateFrom);
      if (dateTo) params.set('dateTo', dateTo + 'T23:59:59');
      const qs = params.toString();
      const data: { leads: Lead[] } = await api.get(`/api/crm/leads${qs ? '?' + qs : ''}`);
      setAllLeads(data.leads);
    } catch (e: any) { setError(e.message || 'Erro ao carregar leads'); }
    finally { setLoading(false); }
  }, [sourceFilter, dateFrom, dateTo]);

  useEffect(() => { fetchLeads(); }, [fetchLeads]);

  const filtered = allLeads.filter((l) => {
    const matchSearch = l.name.toLowerCase().includes(search.toLowerCase()) || l.id.toLowerCase().includes(search.toLowerCase());
    const matchDate = (!dateFrom || l.created_at >= dateFrom) && (!dateTo || l.created_at <= dateTo + 'T23:59:59');
    return matchSearch && matchDate;
  });

  const byStatus = (s: Status) => filtered.filter((l) => l.status === s);
  const moveCount = (id: string, to: Status) => allLeads.filter((l) => l.id === id && l.status !== to).length;

  const handleDragStart = (id: string) => setDragging(id);
  const handleDragOver = (e: React.DragEvent) => e.preventDefault();
  const handleDrop = async (to: Status) => {
    if (!dragging) return;
    const lead = allLeads.find((l) => l.id === dragging);
    if (!lead || lead.status === to) { setDragging(null); return; }
    setSaving(dragging);
    try {
      await api.put(`/api/crm/leads/${dragging}`, { status: to });
      setAllLeads((prev) => prev.map((l) => (l.id === dragging ? { ...l, status: to, updated_at: new Date().toISOString() } : l)));
    } catch (e: any) { alert(`Erro: ${e.message}`); }
    finally { setDragging(null); setSaving(null); }
  };

  const handleStatusClick = async (lead: Lead, next: Status) => {
    if (lead.status === next) return;
    setSaving(lead.id);
    try {
      await api.put(`/api/crm/leads/${lead.id}`, { status: next });
      setAllLeads((prev) => prev.map((l) => (l.id === lead.id ? { ...l, status: next, updated_at: new Date().toISOString() } : l)));
    } catch (e: any) { alert(`Erro: ${e.message}`); }
    finally { setSaving(null); }
  };

  return (
    <div className="space-y-5">
      {/* Filters */}
      <Card variant="glass" className="p-4">
        <div className="flex items-center gap-2 mb-3">
          <Filter className="h-4 w-4 text-primary" />
          <span className="text-sm font-semibold text-foreground">Filtros</span>
        </div>
        <div className="grid grid-cols-1 tablet:grid-cols-4 gap-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <input type="text" placeholder="Buscar nome ou ID..." value={search} onChange={(e) => setSearch(e.target.value)} className="glass-input pl-10 w-full text-sm" />
          </div>
          <select value={sourceFilter} onChange={(e) => setSourceFilter(e.target.value as SourceFilter)} className="glass-input text-sm py-2">
            {(Object.keys(SOURCE_LABELS) as SourceFilter[]).map((s) => <option key={s} value={s}>{SOURCE_LABELS[s]}</option>)}
          </select>
          <div className="flex gap-2">
            <input type="date" value={dateFrom} onChange={(e) => setDateFrom(e.target.value)} className="glass-input text-sm py-2 flex-1" />
            <input type="date" value={dateTo} onChange={(e) => setDateTo(e.target.value)} className="glass-input text-sm py-2 flex-1" />
          </div>
        </div>
        <div className="flex items-center gap-2 mt-3">
          <Button variant="primary" size="sm" onClick={fetchLeads}><Clock className="mr-1.5 h-4 w-4" /> Atualizar</Button>
          {(sourceFilter !== 'all' || dateFrom || dateTo || search) && (
            <Button variant="ghost" size="sm" onClick={() => { setSearch(''); setSourceFilter('all'); setDateFrom(''); setDateTo(''); }}>Limpar</Button>
          )}
        </div>
      </Card>

      {error && (
        <div className="rounded-xl border border-error-red/30 bg-error-red/5 p-4 text-center">
          <p className="text-sm text-error-red">{error}</p>
          <Button variant="primary" size="sm" onClick={fetchLeads} className="mt-2">Tentar novamente</Button>
        </div>
      )}

      {loading ? (
        <div className="px-4 py-8 text-center text-muted-foreground">Carregando pipeline...</div>
      ) : (
        /* Kanban board */
        <div className="grid grid-cols-1 tablet:grid-cols-3 desktop:grid-cols-6 gap-3 overflow-x-auto pb-2">
          {STATUSES.map((status) => {
            const items = byStatus(status);
            return (
              <div key={status} className="min-w-[240px] tablet:min-w-0" onDragOver={handleDragOver} onDrop={() => handleDrop(status)}>
                <div className={`mb-2 flex items-center justify-between rounded-lg border px-3 py-2 ${STATUS_COLORS[status]}`}>
                  <span className="text-[11px] font-semibold uppercase tracking-wider">{STATUS_LABELS[status]}</span>
                  <span className="text-xs font-bold">{items.length}</span>
                </div>
                <div className="space-y-2 min-h-[80px]">
                  {items.slice(0, STATUS_LIMITS[status]).map((lead) => (
                    <div key={lead.id} draggable onDragStart={() => handleDragStart(lead.id)} onDragEnd={() => setDragging(null)} className={`cursor-grab rounded-lg border border-border bg-muted/60 p-3 transition-all hover:border-primary/40 hover:shadow-lg ${dragging === lead.id ? 'opacity-50 shadow-xl shadow-primary/200' : ''}`}>
                      <div className="flex items-start gap-2">
                        <GripVertical className="mt-0.5 h-3.5 w-3.5 flex-shrink-0 text-muted-foreground opacity-50" />
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2">
                            <div className="flex h-7 w-7 items-center justify-center rounded-full bg-primary/15 text-primary text-[10px] font-bold flex-shrink-0">{lead.name.charAt(0)}</div>
                            <div className="min-w-0">
                              <p className="truncate text-xs font-medium text-foreground">{lead.name}</p>
                              <p className="text-[10px] text-muted-foreground">{lead.id.slice(0, 8)}</p>
                            </div>
                          </div>
                          {/* Status quick-switch */}
                          <div className="mt-2 flex flex-wrap gap-1">
                            {STATUSES.filter((s) => s !== status).map((s) => (
                              <button key={s} onClick={() => handleStatusClick(lead, s)} className={`rounded-full border px-1.5 py-0 text-[9px] font-medium transition-colors ${STATUS_COLORS[s]} hover:opacity-80`} title={`Mover para ${STATUS_LABELS[s]}`}>{STATUS_LABELS[s]}</button>
                            ))}
                          </div>
                          <p className="mt-1.5 text-[10px] text-muted-foreground">{SOURCE_LABELS[lead.source] || lead.source} · Score {lead.score}</p>
                        </div>
                      </div>
                      {saving === lead.id && <div className="mt-2 h-1 w-full rounded-full bg-primary/30 animate-pulse" />}
                    </div>
                  ))}
                  {items.length === 0 && <div className="py-6 text-center text-[11px] text-muted-foreground">Vazio</div>}
                  {items.length > STATUS_LIMITS[status] && <p className="text-center text-[10px] text-muted-foreground">+{items.length - STATUS_LIMITS[status]} mais</p>}
                </div>
              </div>
            );
          })}
        </div>
      )}

      <p className="text-[11px] text-muted-foreground">{filtered.length} de {allLeads.length} leads</p>
    </div>
  );
}