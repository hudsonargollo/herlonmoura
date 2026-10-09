'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { ArrowLeft, Mail, Phone, Calendar, Clock, MapPin, Activity, MessageSquare, AlertCircle, GitBranch, Target, Save } from 'lucide-react';
import { Button } from '@/components/Button';
import { Card } from '@/components/Card';
import { api } from '@/lib/admin/api';
import {
  canTransition,
  LEAD_STATUSES,
  LEAD_STATUS_LABELS,
  type LeadStatus,
  type StatusHistoryEntry,
} from '@/lib/leads';

interface Lead {
  id: string; name: string; whatsapp: string; email: string | null;
  source: string; source_detail: string | null; status: LeadStatus; score: number;
  tags: string; notes: string; next_action: string;
  status_history: StatusHistoryEntry[]; status_changed_at: string | null;
  utm_source: string | null; utm_medium: string | null; utm_campaign: string | null;
  landing_page: string | null;
  created_at: string; updated_at: string;
}

interface Interaction {
  id: string; lead_id: string; type: string; metadata: string; created_at: string;
}

const STATUS_COLORS: Record<LeadStatus, string> = {
  new: 'bg-muted/50 text-muted-foreground border-border/30',
  contacted: 'bg-primary/15 text-primary border-primary/30',
  qualified: 'bg-info/15 text-info border-info/30',
  appointment: 'bg-warning-amber/15 text-warning-amber border-warning-amber/30',
  converted: 'bg-success-green/15 text-success-green border-success-green/30',
  lost: 'bg-error-red/15 text-error-red border-error-red/30',
};

export default function CRMLeadDetail({ params }: { params: Promise<{ id: string }> }) {
  const [lead, setLead] = useState<Lead | null>(null);
  const [interactions, setInteractions] = useState<Interaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [note, setNote] = useState('');
  const [saving, setSaving] = useState(false);
  const [transitioning, setTransitioning] = useState<LeadStatus | null>(null);
  const [nextAction, setNextAction] = useState('');
  const [savingAction, setSavingAction] = useState(false);

  const load = useCallback(async () => {
    const { id } = await params;
    setLoading(true); setError(null);
    try {
      const data: { lead: Lead; interactions: Interaction[] } = await api.get(`/api/crm/leads/${id}`);
      setLead(data.lead);
      setNextAction(data.lead.next_action || '');
      setInteractions(data.interactions || []);
    } catch (e: any) { setError(e.message || 'Erro ao carregar'); }
    finally { setLoading(false); }
  }, [params]);

  useEffect(() => { load(); }, [load]);

  const handleTransition = async (to: LeadStatus) => {
    if (!lead || !canTransition(lead.status, to)) return;
    setTransitioning(to);
    try {
      const { id } = await params;
      const data = await api.patch<{ lead: Lead }>(`/api/crm/leads/${id}`, { status: to });
      setLead(data.lead);
      await load();
    } catch (e: any) { alert(`Erro: ${e.message}`); }
    finally { setTransitioning(null); }
  };

  const handleSaveNextAction = async () => {
    if (!lead) return;
    setSavingAction(true);
    try {
      const { id } = await params;
      const data = await api.patch<{ lead: Lead }>(`/api/crm/leads/${id}`, { next_action: nextAction });
      setLead(data.lead);
    } catch (e: any) { alert(`Erro: ${e.message}`); }
    finally { setSavingAction(false); }
  };

  const handleAddNote = async () => {
    if (!note.trim()) return;
    setSaving(true);
    try {
      const { id } = await params;
      const iid = crypto.randomUUID();
      await api.post('/api/crm/interactions', { id: iid, lead_id: id, type: 'note', metadata: JSON.stringify({ note }) });
      setInteractions((prev) => [{ id: iid, lead_id: id, type: 'note', metadata: JSON.stringify({ note }), created_at: new Date().toISOString() }, ...prev]);
      setNote('');
    } catch (e: any) { alert(`Erro: ${e.message}`); }
    finally { setSaving(false); }
  };

  if (loading) return <div className="text-center text-muted-foreground py-8">Carregando...</div>;
  if (error || !lead) return (
    <div className="rounded-xl border border-error-red/30 bg-error-red/5 p-8 text-center">
      <AlertCircle className="mx-auto h-10 w-10 text-warning-amber" />
      <p className="mt-3 text-muted-foreground">{error || 'Lead não encontrado.'}</p>
      <Button variant="ghost" size="sm" onClick={() => window.history.back()} className="mt-3">Voltar</Button>
    </div>
  );

  const sourceLabels: Record<string, string> = {
    contact: 'Contato', questionnaire: 'Questionário', whatsapp: 'WhatsApp',
    referral: 'Indicação', social: 'Social', freebie: 'Material gratuito',
    'trombose-screening': 'Triagem Trombose', 'varizes-assessment': 'Avaliação Varizes',
    'dvt-calculator': 'Calculadora TVP',
  };
  const typeIcons: Record<string, React.ReactNode> = {
    note: <MessageSquare className="h-3.5 w-3.5" />, email: <Mail className="h-3.5 w-3.5" />,
    phone: <Phone className="h-3.5 w-3.5" />, whatsapp: <Phone className="h-3.5 w-3.5" />,
    appointment: <Calendar className="h-3.5 w-3.5" />, status_change: <GitBranch className="h-3.5 w-3.5" />,
  };

  const history = lead.status_history || [];
  const available = LEAD_STATUSES.filter((s) => canTransition(lead.status, s));

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex items-center gap-3">
        <Button variant="ghost" size="sm" onClick={() => window.history.back()}><ArrowLeft className="mr-1.5 h-4 w-4" /> Voltar</Button>
        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/15 text-primary text-lg font-bold">{lead.name.charAt(0)}</div>
        <div>
          <h2 className="text-heading-3 font-heading font-semibold text-foreground">{lead.name}</h2>
          <p className="text-xs text-muted-foreground">{lead.id}</p>
        </div>
        <span className={`ml-auto inline-flex items-center rounded-full border px-2.5 py-0.5 text-[11px] font-medium ${STATUS_COLORS[lead.status] || STATUS_COLORS.new}`}>
          {LEAD_STATUS_LABELS[lead.status] || lead.status}
        </span>
      </div>

      {/* Status transitions */}
      <Card variant="glass">
        <h3 className="text-heading-3 font-heading font-semibold text-foreground mb-1 flex items-center gap-2">
          <GitBranch className="h-4 w-4 text-primary" /> Mover no Pipeline
        </h3>
        <p className="mb-3 text-[11px] text-muted-foreground">
          Status atual: <span className="font-medium text-foreground">{LEAD_STATUS_LABELS[lead.status]}</span>
          {lead.status_changed_at && <> · desde {lead.status_changed_at.slice(0, 16).replace('T', ' ')}</>}
        </p>
        {available.length === 0 ? (
          <p className="text-sm text-muted-foreground">Nenhuma transição disponível.</p>
        ) : (
          <div className="flex flex-wrap gap-2">
            {available.map((s) => (
              <button
                key={s}
                onClick={() => handleTransition(s)}
                disabled={transitioning !== null}
                className={`rounded-full border px-3 py-1 text-xs font-medium transition-opacity hover:opacity-80 disabled:opacity-40 ${STATUS_COLORS[s]}`}
              >
                {transitioning === s ? 'Movendo...' : `→ ${LEAD_STATUS_LABELS[s]}`}
              </button>
            ))}
          </div>
        )}
      </Card>

      {/* Next action */}
      <Card variant="glass">
        <h3 className="text-heading-3 font-heading font-semibold text-foreground mb-3 flex items-center gap-2">
          <Target className="h-4 w-4 text-primary" /> Próxima Ação
        </h3>
        <div className="flex gap-3">
          <input
            type="text"
            value={nextAction}
            onChange={(e) => setNextAction(e.target.value)}
            placeholder="Ex: ligar para agendar consulta"
            className="glass-input w-full text-sm"
          />
          <Button variant="primary" size="sm" onClick={handleSaveNextAction} disabled={savingAction || nextAction === (lead.next_action || '')}>
            <Save className="mr-1.5 h-4 w-4" /> {savingAction ? 'Salvando...' : 'Salvar'}
          </Button>
        </div>
      </Card>

      {/* Info cards */}
      <div className="grid grid-cols-1 tablet:grid-cols-2 gap-4">
        <Card variant="glass">
          <div className="space-y-3">
            <div className="flex items-start gap-3"><Mail className="mt-0.5 h-4 w-4 flex-shrink-0 text-primary" /><div><p className="text-[11px] uppercase tracking-wider text-muted-foreground">E-mail</p><p className="text-sm text-foreground">{lead.email || '—'}</p></div></div>
            <div className="flex items-start gap-3"><Phone className="mt-0.5 h-4 w-4 flex-shrink-0 text-primary" /><div><p className="text-[11px] uppercase tracking-wider text-muted-foreground">WhatsApp</p><p className="text-sm text-foreground">{lead.whatsapp || '—'}</p></div></div>
            <div className="flex items-start gap-3"><MapPin className="mt-0.5 h-4 w-4 flex-shrink-0 text-primary" /><div><p className="text-[11px] uppercase tracking-wider text-muted-foreground">Fonte</p><p className="text-sm text-foreground">{sourceLabels[lead.source] || lead.source}{lead.source_detail ? ` · ${lead.source_detail}` : ''}</p></div></div>
          </div>
        </Card>
        <Card variant="glass">
          <div className="space-y-3">
            <div className="flex items-start gap-3"><Activity className="mt-0.5 h-4 w-4 flex-shrink-0 text-primary" /><div><p className="text-[11px] uppercase tracking-wider text-muted-foreground">Score</p><p className="text-sm text-foreground">{lead.score}/100</p></div></div>
            <div className="flex items-start gap-3"><Clock className="mt-0.5 h-4 w-4 flex-shrink-0 text-primary" /><div><p className="text-[11px] uppercase tracking-wider text-muted-foreground">Última atualização</p><p className="text-sm text-foreground">{lead.updated_at?.slice(0, 16).replace('T', ' ') || '—'}</p></div></div>
            <div className="flex items-start gap-3"><Calendar className="mt-0.5 h-4 w-4 flex-shrink-0 text-primary" /><div><p className="text-[11px] uppercase tracking-wider text-muted-foreground">Criado</p><p className="text-sm text-foreground">{lead.created_at?.slice(0, 16).replace('T', ' ') || '—'}</p></div></div>
          </div>
        </Card>
      </div>

      {/* Attribution */}
      {(lead.utm_source || lead.utm_campaign || lead.landing_page) && (
        <Card variant="glass">
          <h3 className="text-heading-3 font-heading font-semibold text-foreground mb-3">Origem da Campanha</h3>
          <div className="grid grid-cols-2 tablet:grid-cols-4 gap-3 text-sm">
            <div><p className="text-[11px] uppercase tracking-wider text-muted-foreground">utm_source</p><p className="text-foreground">{lead.utm_source || '—'}</p></div>
            <div><p className="text-[11px] uppercase tracking-wider text-muted-foreground">utm_medium</p><p className="text-foreground">{lead.utm_medium || '—'}</p></div>
            <div><p className="text-[11px] uppercase tracking-wider text-muted-foreground">utm_campaign</p><p className="text-foreground">{lead.utm_campaign || '—'}</p></div>
            <div><p className="text-[11px] uppercase tracking-wider text-muted-foreground">landing_page</p><p className="text-foreground break-all">{lead.landing_page || '—'}</p></div>
          </div>
        </Card>
      )}

      {/* Tags & Notes */}
      {(lead.tags || lead.notes) && (
        <Card variant="glass">
          <h3 className="text-heading-3 font-heading font-semibold text-foreground mb-3">Informações</h3>
          {lead.tags && <p className="text-sm text-foreground mb-2">Tags: {lead.tags}</p>}
          {lead.notes && <p className="text-sm text-muted-foreground">{lead.notes}</p>}
        </Card>
      )}

      {/* Status history */}
      <Card variant="glass">
        <h3 className="text-heading-3 font-heading font-semibold text-foreground mb-3 flex items-center gap-2">
          <GitBranch className="h-4 w-4 text-primary" /> Histórico de Status
        </h3>
        {history.length === 0 ? (
          <p className="text-sm text-muted-foreground py-2">Sem histórico registrado.</p>
        ) : (
          <ol className="space-y-2">
            {history.map((h, idx) => (
              <li key={`${h.status}-${h.timestamp}-${idx}`} className="flex items-center gap-3 text-sm">
                <span className={`inline-flex items-center rounded-full border px-2 py-0.5 text-[11px] font-medium ${STATUS_COLORS[h.status] || STATUS_COLORS.new}`}>
                  {LEAD_STATUS_LABELS[h.status] || h.status}
                </span>
                <span className="text-[11px] text-muted-foreground">{h.timestamp?.slice(0, 16).replace('T', ' ')}</span>
                {h.note && <span className="text-[11px] text-muted-foreground">· {h.note}</span>}
              </li>
            ))}
          </ol>
        )}
      </Card>

      {/* Add note */}
      <Card variant="glass">
        <h3 className="text-heading-3 font-heading font-semibold text-foreground mb-3">Adicionar Nota</h3>
        <div className="flex gap-3">
          <textarea value={note} onChange={(e) => setNote(e.target.value)} placeholder="Escreva uma nota..." className="w-full min-h-[80px] rounded-lg border border-border bg-muted px-4 py-3 text-sm text-foreground placeholder-neutral-medium transition-all duration-300 focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/25 resize-y" />
          <Button variant="primary" size="sm" onClick={handleAddNote} disabled={saving || !note.trim()}>{saving ? 'Salvando...' : 'Salvar'}</Button>
        </div>
      </Card>

      {/* Interaction Timeline */}
      <Card variant="glass">
        <h3 className="text-heading-3 font-heading font-semibold text-foreground mb-3 flex items-center gap-2"><Clock className="h-4 w-4 text-primary" /> Timeline de Interações</h3>
        {interactions.length === 0 ? (
          <p className="text-sm text-muted-foreground py-4">Nenhuma interação registrada.</p>
        ) : (
          <div className="space-y-0">
            {interactions.map((i, idx) => {
              let meta: any;
              try { meta = JSON.parse(i.metadata); } catch { meta = {}; }
              return (
                <div key={i.id} className={`flex gap-4 ${idx < interactions.length - 1 ? 'border-b border-border/40 pb-3 mb-3' : ''}`}>
                  <div className="flex flex-col items-center">
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/15 text-primary">{typeIcons[i.type] || <MessageSquare className="h-3.5 w-3.5" />}</div>
                    {idx < interactions.length - 1 && <div className="w-px flex-1 bg-muted/60 mt-1" />}
                  </div>
                  <div className="flex-1 pb-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium text-foreground capitalize">{i.type.replace(/_/g, ' ')}</span>
                      <span className="text-[11px] text-muted-foreground">{i.created_at?.slice(0, 16).replace('T', ' ')}</span>
                    </div>
                    {i.type === 'status_change' && meta.from && (
                      <p className="text-xs text-muted-foreground mt-1">
                        {LEAD_STATUS_LABELS[meta.from as LeadStatus] || meta.from} → {LEAD_STATUS_LABELS[meta.to as LeadStatus] || meta.to}
                      </p>
                    )}
                    {meta.note && <p className="text-xs text-muted-foreground mt-1">{meta.note}</p>}
                    {meta.subject && <p className="text-xs text-muted-foreground mt-1">Assunto: {meta.subject}</p>}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </Card>
    </div>
  );
}
