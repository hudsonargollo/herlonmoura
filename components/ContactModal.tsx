'use client';

import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, MessageCircle, Loader2, CheckCircle2, ShieldCheck, ArrowLeft } from 'lucide-react';
import {
  buildWhatsappLink,
  SCHEDULER_URL,
  type ContactLead,
  type InsuranceChoice,
} from '@/lib/contact';

interface ContactModalProps {
  isOpen: boolean;
  onClose: () => void;
  /** Context shown in the modal + carried into the WhatsApp message. */
  context?: string;
  /** Heading override. */
  title?: string;
}

const POPULAR_PLANS = ['Bradesco Saúde', 'SulAmérica', 'Unimed', 'Amil', 'Hapvida', 'Geap'];

export function ContactModal({ isOpen, onClose, context, title }: ContactModalProps) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [insurance, setInsurance] = useState<InsuranceChoice>('particular');
  const [plan, setPlan] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [waLink, setWaLink] = useState<string | null>(null);

  // Reset whenever the modal is (re)opened
  useEffect(() => {
    if (isOpen) {
      setError(null);
      setWaLink(null);
      setSubmitting(false);
    }
  }, [isOpen]);

  // Escape to close + lock scroll
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen && !submitting) onClose();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [isOpen, onClose, submitting]);

  useEffect(() => {
    if (isOpen) document.body.style.overflow = 'hidden';
    else document.body.style.overflow = '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!name.trim()) return setError('Por favor, informe seu nome.');
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))
      return setError('Informe um e-mail válido.');
    if (insurance === 'convenio' && !plan.trim())
      return setError('Informe o nome do seu convênio.');

    const lead: ContactLead = {
      name: name.trim(),
      email: email.trim(),
      insurance,
      insuranceName: insurance === 'convenio' ? plan.trim() : undefined,
    };

    setSubmitting(true);

    // Direct-to-database ingestion — save as a prospect and capture the row ID.
    let leadId: string | undefined;
    try {
      const res = await fetch('/api/crm/leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: lead.name,
          whatsapp: '',
          email: lead.email,
          source: 'whatsapp_cta',
          source_detail: context ?? null,
          notes: lead.insurance === 'convenio' ? `Convênio: ${lead.insuranceName}` : 'Particular',
          insurance: lead.insurance,
          insurance_name: lead.insuranceName ?? null,
        }),
      });
      const result = (await res.json().catch(() => ({}))) as { id?: string };
      leadId = result.id;
    } catch {
      // ignore — WhatsApp link still works
    }

    const wa = buildWhatsappLink(lead, context, leadId);
    setWaLink(wa);
    setSubmitting(false);
    // Auto-redirect to WhatsApp as soon as the lead is saved.
    window.open(wa, '_blank', 'noopener,noreferrer');
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-3 sm:p-5 overflow-y-auto">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={() => !submitting && onClose()}
            className="fixed inset-0 bg-surface-overlay/85 backdrop-blur-md"
            aria-hidden="true"
          />

          <motion.div
            initial={{ opacity: 0, scale: 0.96, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: 10 }}
            transition={{ duration: 0.22, ease: 'easeOut' }}
            role="dialog"
            aria-modal="true"
            aria-labelledby="contact-modal-title"
            className="relative z-10 w-full max-w-md my-auto overflow-hidden rounded-3xl border border-surgical-teal/30 bg-surface shadow-2xl"
          >
            {/* Header */}
            <div className="flex items-center justify-between border-b border-default px-5 py-3.5">
              <div className="flex items-center gap-2.5">
                <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-500/15 text-emerald-500">
                  <MessageCircle className="h-4 w-4" />
                </span>
                <div>
                  <h3 id="contact-modal-title" className="text-sm sm:text-base font-bold text-primary">
                    {title ?? 'Agendar Consulta'}
                  </h3>
                  {context && <p className="text-[11px] text-tertiary">{context}</p>}
                </div>
              </div>
              <button
                onClick={() => !submitting && onClose()}
                aria-label="Fechar"
                className="rounded-lg p-1.5 text-tertiary hover:bg-surface-raised hover:text-primary transition-colors"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            {!waLink ? (
              <form onSubmit={handleSubmit} className="px-5 py-5 space-y-4">
                <p className="text-xs text-secondary">
                  Preencha seus dados e seguiremos no WhatsApp com a secretária. É rápido.
                </p>

                {/* Name */}
                <div>
                  <label htmlFor="cm-name" className="block text-xs font-semibold text-secondary mb-1.5">
                    Nome completo
                  </label>
                  <input
                    id="cm-name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Seu nome"
                    autoComplete="name"
                    className="w-full rounded-xl border border-default bg-surface-raised px-3.5 py-2.5 text-sm text-primary placeholder:text-tertiary focus:border-surgical-teal focus:outline-none focus:ring-2 focus:ring-surgical-teal/20"
                  />
                </div>

                {/* Email */}
                <div>
                  <label htmlFor="cm-email" className="block text-xs font-semibold text-secondary mb-1.5">
                    E-mail
                  </label>
                  <input
                    id="cm-email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="voce@email.com"
                    autoComplete="email"
                    className="w-full rounded-xl border border-default bg-surface-raised px-3.5 py-2.5 text-sm text-primary placeholder:text-tertiary focus:border-surgical-teal focus:outline-none focus:ring-2 focus:ring-surgical-teal/20"
                  />
                </div>

                {/* Insurance choice */}
                <div>
                  <span className="block text-xs font-semibold text-secondary mb-1.5">
                    Tipo de atendimento
                  </span>
                  <div className="grid grid-cols-2 gap-2">
                    {(['particular', 'convenio'] as InsuranceChoice[]).map((opt) => (
                      <button
                        key={opt}
                        type="button"
                        onClick={() => setInsurance(opt)}
                        className={`rounded-xl border px-3 py-2.5 text-sm font-semibold capitalize transition-all ${
                          insurance === opt
                            ? 'border-surgical-teal bg-surgical-teal/15 text-surgical-teal'
                            : 'border-default bg-surface-raised text-secondary hover:border-surgical-teal/40'
                        }`}
                      >
                        {opt === 'particular' ? 'Particular' : 'Convênio'}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Plan (only when convênio) */}
                {insurance === 'convenio' && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    className="space-y-2 overflow-hidden"
                  >
                    <label htmlFor="cm-plan" className="block text-xs font-semibold text-secondary">
                      Qual convênio?
                    </label>
                    <input
                      id="cm-plan"
                      value={plan}
                      onChange={(e) => setPlan(e.target.value)}
                      placeholder="Ex.: Bradesco Saúde"
                      className="w-full rounded-xl border border-default bg-surface-raised px-3.5 py-2.5 text-sm text-primary placeholder:text-tertiary focus:border-surgical-teal focus:outline-none focus:ring-2 focus:ring-surgical-teal/20"
                    />
                    <div className="flex flex-wrap gap-1.5">
                      {POPULAR_PLANS.map((p) => (
                        <button
                          key={p}
                          type="button"
                          onClick={() => setPlan(p)}
                          className="rounded-full border border-default bg-surface-raised px-2.5 py-1 text-[11px] text-secondary hover:border-surgical-teal/40 hover:text-surgical-teal transition-colors"
                        >
                          {p}
                        </button>
                      ))}
                    </div>
                  </motion.div>
                )}

                {error && (
                  <p className="rounded-lg bg-error-red/10 px-3 py-2 text-xs font-medium text-error-red">
                    {error}
                  </p>
                )}

                <button
                  type="submit"
                  disabled={submitting}
                  className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-emerald-600 px-5 py-3 text-sm font-bold text-white shadow-lg shadow-emerald-900/20 transition-all hover:bg-emerald-500 active:scale-98 disabled:opacity-60"
                >
                  {submitting ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" /> Enviando...
                    </>
                  ) : (
                    <>
                      <MessageCircle className="h-4 w-4" /> Continuar no WhatsApp
                    </>
                  )}
                </button>

                <p className="flex items-center justify-center gap-1.5 text-[11px] text-tertiary">
                  <ShieldCheck className="h-3.5 w-3.5 text-surgical-teal" />
                  Seus dados são usados apenas para o contato.
                </p>
              </form>
            ) : (
              <div className="px-5 py-6 text-center space-y-4">
                <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-emerald-500/15 text-emerald-500">
                  <CheckCircle2 className="h-7 w-7" />
                </div>
                <h4 className="text-lg font-bold text-primary">Tudo pronto, {name.split(' ')[0]}!</h4>
                <p className="text-sm text-secondary">
                  Clique abaixo para abrir o WhatsApp com os dados do seu lead preenchidos.
                </p>
                <a
                  href={waLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-emerald-600 px-5 py-3.5 text-sm font-bold text-white shadow-lg shadow-emerald-900/20 transition-all hover:bg-emerald-500"
                >
                  <MessageCircle className="h-5 w-5" /> Abrir WhatsApp
                </a>
                <div className="flex items-center justify-between pt-2">
                  <a
                    href={SCHEDULER_URL}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs text-surgical-teal hover:underline"
                  >
                    📅 Agende diretamente no calendário
                  </a>
                  <button
                    onClick={() => setWaLink(null)}
                    className="inline-flex items-center gap-1 text-xs text-tertiary hover:text-primary"
                  >
                    <ArrowLeft className="h-3 w-3" /> Editar dados
                  </button>
                </div>
              </div>
            )}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
