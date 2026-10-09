'use client';

import React, { useState, useCallback } from 'react';
import { Plus, Trash2, Save, ArrowUp, ArrowDown, Mail, Send, Clock, Filter } from 'lucide-react';
import { Button } from '@/components/Button';
import { Card } from '@/components/Card';
import { FormInput } from '@/components/FormInput';

interface EmailStep {
  id: string;
  delayDays: number;
  subject: string;
  body: string;
  trigger: string;
}

const TRIGGERS = ['lead_created', 'status_changed', 'appointment_scheduled', 'appointment_completed', 'no_response_3d', 'no_response_7d', 'converted'];

const DEFAULT_SEQUENCE: EmailStep[] = [
  { id: '1', delayDays: 0, subject: 'Boas-vindas — Como podemos ajudar?', body: 'Olá! Vejo que entrou em contato recentemente. Como posso ajudar?', trigger: 'lead_created' },
  { id: '2', delayDays: 3, subject: 'Acompanhando sua solicitação', body: 'Só passando para ver se precisa de algo.', trigger: 'no_response_3d' },
  { id: '3', delayDays: 7, subject: 'Última chance — Vamos conversar?', body: 'Estou à disposição para agendar uma avaliação.', trigger: 'no_response_7d' },
];

export default function EmailSequenceDesigner() {
  const [steps, setSteps] = useState<EmailStep[]>(DEFAULT_SEQUENCE);
  const [name, setName] = useState('Sequência Principal');
  const [saving, setSaving] = useState(false);
  const [saveMsg, setSaveMsg] = useState<string | null>(null);

  const updateStep = (id: string, field: keyof EmailStep, value: string | number) => {
    setSteps((prev) => prev.map((s) => (s.id === id ? { ...s, [field]: value } : s)));
  };

  const addStep = () => {
    const newId = String(steps.length + 1);
    setSteps((prev) => [...prev, { id: newId, delayDays: 1, subject: '', body: '', trigger: 'lead_created' }]);
  };

  const removeStep = (id: string) => {
    if (steps.length <= 1) return;
    setSteps((prev) => prev.filter((s) => s.id !== id));
  };

  const moveStep = (id: string, dir: 'up' | 'down') => {
    setSteps((prev) => {
      const idx = prev.findIndex((s) => s.id === id);
      if (idx < 0) return prev;
      const newIdx = dir === 'up' ? idx - 1 : idx + 1;
      if (newIdx < 0 || newIdx >= prev.length) return prev;
      const copy = [...prev];
      [copy[idx], copy[newIdx]] = [copy[newIdx], copy[idx]];
      return copy;
    });
  };

  const handleSave = async () => {
    setSaving(true); setSaveMsg(null);
    try {
      await fetch('/api/crm/email-sequences', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ name, steps }) });
      setSaveMsg('Sequência salva!');
    } catch (e: any) { setSaveMsg(`Erro: ${e.message}`); }
    finally { setSaving(false); }
  };

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-display-md font-heading font-semibold text-foreground">Designador de E-mail Sequência</h1>
          <p className="text-sm text-muted-foreground">Crie e gerencie fluxos de e-mail automáticos.</p>
        </div>
        <Button variant="primary" size="sm" onClick={handleSave} disabled={saving}><Save className="mr-1.5 h-4 w-4" /> {saving ? 'Salvando...' : 'Salvar Sequência'}</Button>
      </div>

      {saveMsg && <div className={`rounded-xl border px-4 py-3 text-sm ${saveMsg.startsWith('Erro') ? 'border-error-red/30 bg-error-red/5 text-error-red' : 'border-success-green/30 bg-success-green/5 text-success-green'}`}>{saveMsg}</div>}

      {/* Name */}
      <Card variant="glass" className="p-4">
        <FormInput label="Nome da Sequência" value={name} onChange={(e) => setName(e.target.value)} placeholder="Ex: Sequência Principal" />
      </Card>

      {/* Steps */}
      <div className="space-y-4">
        {steps.map((step, idx) => (
          <Card key={step.id} variant="glass" className="p-5 relative">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <span className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/15 text-primarytext-sm font-bold">{idx + 1}</span>
                <h3 className="text-heading-3 font-heading font-semibold text-foreground">Passo {idx + 1}</h3>
              </div>
              <div className="flex items-center gap-1">
                <Button variant="ghost" size="sm" disabled={idx === 0} onClick={() => moveStep(step.id, 'up')}><ArrowUp className="h-4 w-4" /></Button>
                <Button variant="ghost" size="sm" disabled={idx === steps.length - 1} onClick={() => moveStep(step.id, 'down')}><ArrowDown className="h-4 w-4" /></Button>
                <Button variant="ghost" size="sm" className="text-error-red border-error-red/30" onClick={() => removeStep(step.id)}><Trash2 className="h-4 w-4" /></Button>
              </div>
            </div>

            <div className="grid grid-cols-1 tablet:grid-cols-3 gap-4">
              <FormInput label="Atraso (dias)" type="number" value={step.delayDays} onChange={(e) => updateStep(step.id, 'delayDays', parseInt(e.target.value) || 0)} />
              <FormInput label="Gatilho" list="trigger-list" value={step.trigger} onChange={(e) => updateStep(step.id, 'trigger', e.target.value)} />
              <datalist id="trigger-list">{TRIGGERS.map((t) => <option key={t} value={t} />)}</datalist>
            </div>
            <div className="mt-3">
              <FormInput label="Assunto" value={step.subject} onChange={(e) => updateStep(step.id, 'subject', e.target.value)} placeholder="Assunto do e-mail" />
            </div>
            <div className="mt-3">
              <label className="mb-2 block text-sm font-medium text-foreground">Corpo</label>
              <textarea value={step.body} onChange={(e) => updateStep(step.id, 'body', e.target.value)} placeholder="Conteúdo do e-mail..." className="w-full min-h-[100px] rounded-lg border border-border bg-muted px-4 py-3 text-sm text-foreground placeholder-neutral-medium transition-all duration-300 focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/25 resize-y" />
            </div>
          </Card>
        ))}
      </div>

      <Button variant="secondary" size="sm" onClick={addStep}><Plus className="mr-1.5 h-4 w-4" /> Adicionar Passo</Button>
    </div>
  );
}