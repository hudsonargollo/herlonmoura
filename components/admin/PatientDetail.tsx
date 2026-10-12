'use client';

import React, { useState, useEffect } from 'react';
import {
  User, Mail, Phone, Calendar, Clock, MapPin, Stethoscope,
  Activity, AlertCircle, CheckCircle2, MessageSquare, ArrowLeft,
} from 'lucide-react';
import { Button } from '@/components/Button';
import { Card } from '@/components/Card';
import { api } from '@/lib/admin/api';

interface PatientDetailProps {
  patientId: string;
  onBack: () => void;
}

interface Patient {
  id: string; name: string; email: string | null; phone: string | null;
  whatsapp: string; source: string; status: string; leadScore: number;
  updated_at: string; created_at: string;
}

interface Interaction {
  id: string; lead_id: string; type: string; metadata: string; created_at: string;
}

export function PatientDetail({ patientId, onBack }: PatientDetailProps) {
  const [lead, setLead] = useState<Patient | null>(null);
  const [interactions, setInteractions] = useState<Interaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function load() {
      setLoading(true);
      setError(null);
      try {
        const data = await api.get<{ lead: Patient; interactions: Interaction[] }>(`/api/crm/leads/${patientId}`);
        setLead(data.lead);
        setInteractions(data.interactions || []);
      } catch (e: any) {
        setError(e.message || 'Erro ao carregar');
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [patientId]);

  if (loading) return <div className="text-center text-neutral-medium py-8">Carregando...</div>;

  if (error || !lead) {
    return (
      <div className="rounded-xl border border-error-red/30 bg-error-red/5 p-8 text-center">
        <AlertCircle className="mx-auto h-10 w-10 text-warning-amber" />
        <p className="mt-3 text-neutral-medium">{error || 'Lead não encontrado.'}</p>
        <Button variant="ghost" size="sm" onClick={onBack} className="mt-3">Voltar à lista</Button>
      </div>
    );
  }

  return (
    <div className="space-y-5">
      <div className="flex items-center gap-3">
        <Button variant="ghost" size="sm" onClick={onBack}><ArrowLeft className="mr-1.5 h-4 w-4" /> Voltar</Button>
        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-surgical-teal/15 text-surgical-teal text-lg font-bold">{lead.name.charAt(0)}</div>
        <div>
          <h2 className="text-heading-3 font-heading font-semibold text-neutral-light">{lead.name}</h2>
          <p className="text-xs text-neutral-medium">{lead.id}</p>
        </div>
        <span className={`ml-auto inline-flex items-center rounded-full border px-2.5 py-0.5 text-[11px] font-medium ${lead.status === 'active' ? 'bg-success-green/15 text-success-green border-success-green/30' : 'bg-warning-amber/15 text-warning-amber border-warning-amber/30'}`}>{lead.status}</span>
      </div>

      <div className="grid grid-cols-1 tablet:grid-cols-2 gap-4">
        <Card variant="glass">
          <div className="space-y-3">
            <div className="flex items-start gap-3"><Mail className="mt-0.5 h-4 w-4 flex-shrink-0 text-surgical-teal" /><div><p className="text-[11px] uppercase tracking-wider text-neutral-medium">E-mail</p><p className="text-sm text-neutral-light">{lead.email || '—'}</p></div></div>
            <div className="flex items-start gap-3"><Phone className="mt-0.5 h-4 w-4 flex-shrink-0 text-surgical-teal" /><div><p className="text-[11px] uppercase tracking-wider text-neutral-medium">WhatsApp</p><p className="text-sm text-neutral-light">{lead.whatsapp}</p></div></div>
            <div className="flex items-start gap-3"><Activity className="mt-0.5 h-4 w-4 flex-shrink-0 text-surgical-teal" /><div><p className="text-[11px] uppercase tracking-wider text-neutral-medium">Score</p><p className="text-sm text-neutral-light">{lead.leadScore}/100</p></div></div>
          </div>
        </Card>
        <Card variant="glass">
          <div className="space-y-3">
            <div className="flex items-start gap-3"><Calendar className="mt-0.5 h-4 w-4 flex-shrink-0 text-surgical-teal" /><div><p className="text-[11px] uppercase tracking-wider text-neutral-medium">Última interação</p><p className="text-sm text-neutral-light">{lead.updated_at?.slice(0, 10) || '—'}</p></div></div>
            <div className="flex items-start gap-3"><Clock className="mt-0.5 h-4 w-4 flex-shrink-0 text-surgical-teal" /><div><p className="text-[11px] uppercase tracking-wider text-neutral-medium">Criado</p><p className="text-sm text-neutral-light">{lead.created_at?.slice(0, 10) || '—'}</p></div></div>
            <div className="flex items-start gap-3"><MapPin className="mt-0.5 h-4 w-4 flex-shrink-0 text-surgical-teal" /><div><p className="text-[11px] uppercase tracking-wider text-neutral-medium">Fonte</p><p className="text-sm text-neutral-light">{lead.source}</p></div></div>
          </div>
        </Card>
      </div>

      {interactions.length > 0 && (
        <Card variant="glass">
          <h3 className="text-heading-3 font-heading font-semibold text-neutral-light mb-3">Interações</h3>
          <div className="space-y-2">
            {interactions.map((i) => (
              <div key={i.id} className="flex items-center justify-between rounded-lg border border-neutral-dark/60 px-3 py-2">
                <span className="text-xs text-neutral-light">{i.type}</span>
                <span className="text-[11px] text-neutral-medium">{i.created_at?.slice(0, 16)}</span>
              </div>
            ))}
          </div>
        </Card>
      )}
    </div>
  );
}