'use client';

import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, MessageCircle, Loader2, CheckCircle2, ShieldCheck, ArrowLeft, Check, Stethoscope } from 'lucide-react';
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

/** Shared field styling — v2.0 semantic tokens, 6px control radius. */
const FIELD_CLASS =
  'w-full rounded-md border border-[var(--g-color-border-subtle)] bg-[var(--g-color-surface-raised)] px-4 py-3 text-base text-[var(--s-color-content-heading)] placeholder:text-[var(--g-color-text-muted)] transition-all duration-200 focus:border-[var(--s-color-action-primary)] focus:bg-[var(--c-card-bg)] focus:outline-none focus:ring-2 focus:ring-[var(--s-color-action-primary)]/25';

const LABEL_CLASS = 'block text-body-small font-semibold text-[var(--s-color-content-heading)] mb-2';

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

    if (!name.trim()) return setError('Por favor, informe o seu nome completo.');
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
        <div className="fixed inset-0 z-[60] flex items-center justify-center overflow-y-auto p-3 sm:p-5">
          {/* Backdrop — translucent dim + soft brand gradient glow, blurred site behind */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            onClick={() => !submitting && onClose()}
            aria-hidden="true"
            className="fixed inset-0 backdrop-blur-lg"
            style={{
              backgroundColor: 'var(--g-color-glass-overlay)',
              backgroundImage:
                'radial-gradient(120% 90% at 50% 0%, rgba(197, 168, 128, 0.14) 0%, transparent 60%), linear-gradient(180deg, rgba(10, 37, 64, 0.42) 0%, rgba(10, 37, 64, 0.62) 100%)',
            }}
          />

          {/* Card — v2.0 component tokens + refined glass elevation */}
          <motion.div
            initial={{ opacity: 0, scale: 0.96, y: 12 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: 12 }}
            transition={{ duration: 0.24, ease: 'easeOut' }}
            role="dialog"
            aria-modal="true"
            aria-labelledby="contact-modal-title"
            className="relative z-10 my-auto w-full max-w-md overflow-hidden rounded-[var(--c-card-radius)] border border-[var(--c-card-border)] bg-[var(--c-card-bg)]"
            style={{
              boxShadow: 'var(--c-card-shadow)',
              backdropFilter: 'blur(20px)',
              WebkitBackdropFilter: 'blur(20px)',
            }}
          >
            {/* Brand accent edge — navy → vascular blue → champagne gold */}
            <div
              className="h-1 w-full"
              style={{
                backgroundImage:
                  'linear-gradient(90deg, var(--g-color-base-primary) 0%, var(--g-color-base-secondary) 55%, var(--g-color-accent) 100%)',
              }}
              aria-hidden="true"
            />

            {/* Header */}
            <div className="flex items-center justify-between gap-3 px-6 pt-5 pb-4">
              <div className="flex items-center gap-3">
                <span
                  className="flex h-11 w-11 shrink-0 items-center justify-center rounded-md"
                  style={{
                    backgroundColor: 'color-mix(in srgb, var(--s-color-action-gold) 16%, transparent)',
                    color: 'var(--s-color-action-gold)',
                  }}
                >
                  <Stethoscope className="h-5 w-5" />
                </span>
                <div>
                  <h3 id="contact-modal-title" className="font-heading text-heading-3 font-bold text-[var(--s-color-content-heading)]">
                    {title ?? 'Agendar Consulta'}
                  </h3>
                  {context && (
                    <p className="mt-0.5 text-caption text-[var(--s-color-content-muted)]">{context}</p>
                  )}
                </div>
              </div>
              <button
                onClick={() => !submitting && onClose()}
                aria-label="Fechar"
                className="rounded-md p-2 text-[var(--s-color-content-muted)] transition-colors hover:bg-[var(--g-color-surface-raised)] hover:text-[var(--s-color-content-heading)]"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            {!waLink ? (
              <form onSubmit={handleSubmit} className="space-y-5 px-6 pb-6">
                <p className="text-body-small leading-relaxed text-[var(--s-color-content-body)]">
                  Preencha seus dados abaixo e a equipe do Dr. Herlon dará continuidade ao seu
                  atendimento diretamente no WhatsApp. Leva apenas alguns segundos.
                </p>

                {/* Name */}
                <motion.div
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.25, delay: 0.05 }}
                >
                  <label htmlFor="cm-name" className={LABEL_CLASS}>
                    Nome completo
                  </label>
                  <input
                    id="cm-name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Seu nome"
                    autoComplete="name"
                    className={FIELD_CLASS}
                  />
                </motion.div>

                {/* Email */}
                <motion.div
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.25, delay: 0.1 }}
                >
                  <label htmlFor="cm-email" className={LABEL_CLASS}>
                    E-mail
                  </label>
                  <input
                    id="cm-email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="você@email.com"
                    autoComplete="email"
                    className={FIELD_CLASS}
                  />
                </motion.div>

                {/* Insurance choice */}
                <motion.div
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.25, delay: 0.15 }}
                >
                  <span className={LABEL_CLASS}>Tipo de atendimento</span>
                  <div className="grid grid-cols-2 gap-3">
                    {(['particular', 'convenio'] as InsuranceChoice[]).map((opt) => {
                      const selected = insurance === opt;
                      return (
                        <button
                          key={opt}
                          type="button"
                          aria-pressed={selected}
                          onClick={() => setInsurance(opt)}
                          className={`flex items-center justify-center gap-2 rounded-md border px-4 py-3 text-sm font-semibold transition-all duration-200 ${
                            selected
                              ? 'border-[var(--s-color-action-primary)] bg-[var(--s-color-action-primary)] text-white shadow-md'
                              : 'border-[var(--g-color-border-subtle)] bg-[var(--g-color-surface-raised)] text-[var(--s-color-content-body)] hover:border-[var(--s-color-action-primary)]/45'
                          }`}
                        >
                          {selected && <Check className="h-4 w-4" aria-hidden="true" />}
                          {opt === 'particular' ? 'Particular' : 'Convênio'}
                        </button>
                      );
                    })}
                  </div>
                </motion.div>

                {/* Plan (only when convênio) */}
                {insurance === 'convenio' && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    transition={{ duration: 0.25, ease: 'easeOut' }}
                    className="space-y-2.5 overflow-hidden"
                  >
                    <label htmlFor="cm-plan" className={LABEL_CLASS}>
                      Qual convênio?
                    </label>
                    <input
                      id="cm-plan"
                      value={plan}
                      onChange={(e) => setPlan(e.target.value)}
                      placeholder="Ex.: Bradesco Saúde"
                      className={FIELD_CLASS}
                    />
                    <div className="flex flex-wrap gap-2 pt-0.5">
                      {POPULAR_PLANS.map((p) => {
                        const active = plan === p;
                        return (
                          <button
                            key={p}
                            type="button"
                            onClick={() => setPlan(p)}
                            className={`rounded-full border px-3 py-1.5 text-caption font-medium transition-colors duration-200 ${
                              active
                                ? 'border-[var(--s-color-action-gold)] bg-[color-mix(in_srgb,var(--s-color-action-gold)_18%,transparent)] text-[var(--s-color-content-heading)]'
                                : 'border-[var(--g-color-border-subtle)] bg-[var(--g-color-surface-raised)] text-[var(--s-color-content-muted)] hover:border-[var(--s-color-action-gold)]/50 hover:text-[var(--s-color-content-heading)]'
                            }`}
                          >
                            {p}
                          </button>
                        );
                      })}
                    </div>
                  </motion.div>
                )}

                {error && (
                  <motion.p
                    initial={{ opacity: 0, y: -4 }}
                    animate={{ opacity: 1, y: 0 }}
                    role="alert"
                    className="flex items-center gap-2 rounded-md border border-[color-mix(in_srgb,var(--g-color-error)_35%,transparent)] bg-[color-mix(in_srgb,var(--g-color-error)_10%,transparent)] px-3.5 py-2.5 text-body-small font-medium text-[var(--g-color-error)]"
                  >
                    {error}
                  </motion.p>
                )}

                <button
                  type="submit"
                  disabled={submitting}
                  className="inline-flex w-full items-center justify-center gap-2.5 rounded-[var(--c-button-radius)] bg-[var(--c-button-primary-bg)] px-6 py-3.5 text-base font-semibold text-[var(--c-button-primary-text)] shadow-md transition-all duration-200 hover:bg-[var(--s-color-action-hover)] hover:shadow-lg active:scale-[0.985] disabled:opacity-60"
                >
                  {submitting ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" /> Enviando...
                    </>
                  ) : (
                    <>
                      <MessageCircle className="h-5 w-5" aria-hidden="true" /> Continuar no WhatsApp
                    </>
                  )}
                </button>

                {/* Privacy note — legible but appropriately subdued */}
                <p className="flex items-start justify-center gap-2 px-2 text-caption leading-relaxed text-[var(--s-color-content-muted)]">
                  <ShieldCheck
                    className="mt-px h-4 w-4 shrink-0 text-[var(--s-color-action-gold)]"
                    aria-hidden="true"
                  />
                  Seus dados são utilizados exclusivamente para este contato e para o agendamento
                  do seu atendimento.
                </p>
              </form>
            ) : (
              <div className="px-6 py-7 text-center">
                <motion.div
                  initial={{ scale: 0.85, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ duration: 0.25, ease: 'easeOut' }}
                  className="mx-auto flex h-14 w-14 items-center justify-center rounded-full"
                  style={{
                    backgroundColor: 'color-mix(in srgb, var(--s-color-action-primary) 12%, transparent)',
                    color: 'var(--s-color-action-primary)',
                  }}
                >
                  <CheckCircle2 className="h-7 w-7" />
                </motion.div>
                <h4 className="mt-4 font-heading text-heading-3 font-bold text-[var(--s-color-content-heading)]">
                  Tudo pronto, {name.split(' ')[0]}!
                </h4>
                <p className="mx-auto mt-2 max-w-xs text-body-small leading-relaxed text-[var(--s-color-content-body)]">
                  Sua conversa no WhatsApp já foi iniciada com os seus dados preenchidos.
                </p>
                <a
                  href={waLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-5 inline-flex w-full items-center justify-center gap-2 rounded-[var(--c-button-radius)] bg-[var(--c-button-primary-bg)] px-6 py-3.5 text-base font-semibold text-[var(--c-button-primary-text)] shadow-md transition-all duration-200 hover:bg-[var(--s-color-action-hover)] hover:shadow-lg"
                >
                  <MessageCircle className="h-5 w-5" aria-hidden="true" /> Abrir WhatsApp
                </a>
                <div className="mt-5 flex items-center justify-between gap-3 border-t border-[var(--g-color-border-subtle)] pt-4">
                  <a
                    href={SCHEDULER_URL}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 text-body-small font-medium text-[var(--s-color-action-primary)] hover:underline"
                  >
                    📅 Agende diretamente na agenda
                  </a>
                  <button
                    onClick={() => setWaLink(null)}
                    className="inline-flex items-center gap-1 text-body-small text-[var(--s-color-content-muted)] transition-colors hover:text-[var(--s-color-content-heading)]"
                  >
                    <ArrowLeft className="h-3.5 w-3.5" aria-hidden="true" /> Editar dados
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
