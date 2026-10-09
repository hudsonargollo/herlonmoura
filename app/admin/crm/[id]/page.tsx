'use client';

import React, { useState, useEffect } from 'react';
import { ArrowLeft, User, Mail, Phone, Calendar, Clock, MapPin, Activity, MessageSquare, TrendingUp, AlertCircle } from 'lucide-react';
import { Button } from '@/components/Button';
import { Card } from '@/components/Card';
import { FormInput } from '@/components/FormInput';
import { api } from '@/lib/admin/api';

interface Lead {
  id: string; name: string; whatsapp: string; email: string | null;
  source: string; status: string; score: number; tags: string; notes: string;
  created_at: string; updated_at: string;
}

interface Interaction {
  id: string; lead_id: string; type: string; metadata: string; created_at: string;
}

export default function CRMLeadDetail({ params }: { params: Promise<{ id: string }> }) {
  const [lead, setLead] = useState<Lead | null>(null);
  const [interactions, setInteractions] = useState<Interaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [note, setNote] = useState('');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    async function load() {
      const { id } = await params;
      setLoading(true); setError(null);
      try {
        const data: { lead: Lead; interactions: Interaction[] } = await api.get(`/api/crm/leads/${id}`);
        setLead(data.lead);
        setInteractions(data.interactions || []);
      } catch (e: any) { setError(e.message || 'Erro ao carregar'); }
      finally { setLoading(false); }
    }
    load();
  }, [params]);

  const handleAddNote = async () => {
    if (!note.trim()) return;
    setSaving(true);
    try {
      const iid = crypto.randomUUID();
      await api.post('/api/crm/interactions', { id: iid, lead_id: (await params).id, type: 'note', metadata: JSON.stringify({ note }) });
      const lid = (await params).id;
      setInteractions((prev) => [{ id: iid, lead_id: lid, type: "note", metadata: JSON.stringify({ note }), created_at: new Date().toISOString() }, ...prev]);
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

  const sourceLabels: Record<string, string> = { contact: 'Contato', questionnaire: 'Questionário', whatsapp: 'WhatsApp', referral: 'Indicação', social: 'Social' };
  const typeIcons: Record<string, React.ReactNode> = { note: <MessageSquare className="h-3.5 w-3.5" />, email: <Mail className="h-3.5 w-3.5" />, phone: <Phone className="h-3.5 w-3.5" />, whatsapp: <Phone className="h-3.5 w-3.5" />, appointment: <Calendar className="h-3.5 w-3.5" /> };

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex items-center gap-3">
        <Button variant="ghost" size="sm" onClick={() => window.history.back()}><ArrowLeft className="mr-1.5 h-4 w-4" /> Voltar</Button>
        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/15 text-primarytext-lg font-bold">{lead.name.charAt(0)}</div>
        <div>
          <h2 className="text-heading-3 font-heading font-semibold text-foreground">{lead.name}</h2>
          <p className="text-xs text-muted-foreground">{lead.id}</p>
        </div>
        <span className={`ml-auto inline-flex items-center rounded-full border px-2.5 py-0.5 text-[11px] font-medium ${lead.status === 'active' || lead.status === 'converted' ? 'bg-success-green/15 text-success-green border-success-green/30' : 'bg-warning-amber/15 text-warning-amber border-warning-amber/30'}`}>{lead.status}</span>
      </div>

      {/* Info cards */}
      <div className="grid grid-cols-1 tablet:grid-cols-2 gap-4">
        <Card variant="glass">
          <div className="space-y-3">
            <div className="flex items-start gap-3"><Mail className="mt-0.5 h-4 w-4 flex-shrink-0 text-primary" /><div><p className="text-[11px] uppercase tracking-wider text-muted-foreground">E-mail</p><p className="text-sm text-foreground">{lead.email || '—'}</p></div></div>
            <div className="flex items-start gap-3"><Phone className="mt-0.5 h-4 w-4 flex-shrink-0 text-primary" /><div><p className="text-[11px] uppercase tracking-wider text-muted-foreground">WhatsApp</p><p className="text-sm text-foreground">{lead.whatsapp}</p></div></div>
            <div className="flex items-start gap-3"><MapPin className="mt-0.5 h-4 w-4 flex-shrink-0 text-primary" /><div><p className="text-[11px] uppercase tracking-wider text-muted-foreground">Fonte</p><p className="text-sm text-foreground">{sourceLabels[lead.source] || lead.source}</p></div></div>
          </div>
        </Card>
        <Card variant="glass">
          <div className="space-y-3">
            <div className="flex items-start gap-3"><Activity className="mt-0.5 h-4 w-4 flex-shrink-0 text-primary" /><div><p className="text-[11px] uppercase tracking-wider text-muted-foreground">Score</p><p className="text-sm text-foreground">{lead.score}/100</p></div></div>
            <div className="flex items-start gap-3"><Clock className="mt-0.5 h-4 w-4 flex-shrink-0 text-primary" /><div><p className="text-[11px] uppercase tracking-wider text-muted-foreground">Última interação</p><p className="text-sm text-foreground">{lead.updated_at?.slice(0, 16) || '—'}</p></div></div>
            <div className="flex items-start gap-3"><Calendar className="mt-0.5 h-4 w-4 flex-shrink-0 text-primary" /><div><p className="text-[11px] uppercase tracking-wider text-muted-foreground">Criado</p><p className="text-sm text-foreground">{lead.created_at?.slice(0, 16) || '—'}</p></div></div>
          </div>
        </Card>
      </div>

      {/* Tags & Notes */}
      {(lead.tags || lead.notes) && (
        <Card variant="glass">
          <h3 className="text-heading-3 font-heading font-semibold text-foreground mb-3">Informações</h3>
          {lead.tags && <p className="text-sm text-foreground mb-2">Tags: {lead.tags}</p>}
          {lead.notes && <p className="text-sm text-muted-foreground">{lead.notes}</p>}
        </Card>
      )}

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
                      <span className="text-sm font-medium text-foreground capitalize">{i.type.replace('_', ' ')}</span>
                      <span className="text-[11px] text-muted-foreground">{i.created_at?.slice(0, 16)}</span>
                    </div>
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