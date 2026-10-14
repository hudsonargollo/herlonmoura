'use client';

import React, { useState, useEffect } from 'react';
import { Header, Footer, CliniqIcon, EdgeButton, ContactModal } from '@/components';
import { motion } from 'framer-motion';
import dynamic from 'next/dynamic';
import { Stethoscope, ArrowRight, MessageCircle, Phone } from 'lucide-react';
import { initSectionTracking, trackCtaClick } from '@/lib/analytics';
import { medicalProcedureSchema } from '@/lib/structured-data';

const ProceduresSlider = dynamic(
  () => import('@/components/ProceduresSlider').then(mod => mod.ProceduresSlider),
  {
    ssr: false,
    loading: () => (
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 6 }).map((_, i) => (
          <div
            key={i}
            className="card-edge h-64 animate-pulse bg-[var(--s-color-bg-surface)] opacity-30"
          />
        ))}
      </div>
    ),
  },
);

const TOKEN = {
  heading: 'var(--s-color-content-heading)',
  body: 'var(--s-color-content-body)',
  muted: 'var(--s-color-content-muted)',
  actionPrimary: 'var(--s-color-action-primary)',
  cardBorder: 'var(--c-card-border)',
  canvas: 'var(--s-color-bg-canvas)',
  surface: 'var(--s-color-bg-surface)',
  border: 'var(--border-subtle)',
} as const;

const headingStyle: React.CSSProperties = {
  fontFamily: 'var(--font-montserrat), var(--font-inter), system-ui, sans-serif',
  color: TOKEN.heading,
};

const bodyStyle: React.CSSProperties = { color: TOKEN.body };
const mutedStyle: React.CSSProperties = { color: TOKEN.muted };

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.06, delayChildren: 0.1 } },
};

export default function ConsultasProcedimentosPage() {
  // Which procedure (if any) the visitor asked about — drives the modal and
  // travels into the WhatsApp message + CRM lead.
  const [contact, setContact] = useState<{ interest?: string; sectionId: string } | null>(null);

  useEffect(() => {
    const teardown = initSectionTracking();
    return teardown;
  }, []);

  return (
    <main className="min-h-screen overflow-x-clip" style={{ backgroundColor: TOKEN.canvas, color: TOKEN.body }}>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(medicalProcedureSchema()) }}
      />
      <Header />

      {/* Hero */}
      <section data-analytics-section="procedimentos-hero" className="relative overflow-hidden py-16 sm:py-24" style={{ backgroundColor: TOKEN.surface }}>
        <div
          className="pointer-events-none absolute -top-32 left-1/2 -z-10 h-96 w-[600px] -translate-x-1/2 rounded-full blur-[100px]"
          style={{ backgroundColor: 'color-mix(in srgb, var(--s-color-action-primary) 10%, transparent)' }}
        />
        <div className="mx-auto w-full max-w-container px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
            className="mx-auto max-w-3xl text-center"
          >
            <div
              className="glass mb-5 inline-flex items-center gap-2 rounded-full px-3.5 py-1.5 text-xs font-semibold"
              style={{ color: TOKEN.actionPrimary }}
            >
              <Stethoscope className="h-4 w-4" />
              <span>Consultas e Procedimentos</span>
            </div>
            <h1 className="text-3xl font-extrabold sm:text-5xl" style={{ ...headingStyle, lineHeight: 1.15 }}>
              Consultas e{' '}
              <span
                className="bg-clip-text text-transparent"
                style={{
                  backgroundImage:
                    'linear-gradient(to right, var(--s-color-action-primary), var(--s-color-action-gold))',
                }}
              >
                Procedimentos
              </span>
            </h1>
            <p className="mx-auto mt-4 max-w-2xl text-base sm:text-lg" style={bodyStyle}>
              Conheça os procedimentos vasculares realizados pelo Dr. Herlon Moura — do diagnóstico por
              Eco-Doppler a cirurgias minimamente invasivas, com avaliação individual de cada caso.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Procedures Slider */}
      <section data-analytics-section="procedimentos-grid" className="py-16 sm:py-20" style={{ backgroundColor: TOKEN.canvas }}>
        <div className="mx-auto w-full max-w-container px-4 sm:px-6 lg:px-8">
          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-80px' }}
          >
            <ProceduresSlider
              onCtaClick={(sectionId, interest) =>
                setContact({ sectionId, interest })
              }
            />
          </motion.div>
        </div>
      </section>

      {/* CTA */}
      <section
        data-analytics-section="procedimentos-cta"
        className="border-t py-16 sm:py-24"
        style={{ borderColor: TOKEN.border, backgroundColor: TOKEN.surface }}
      >
        <div className="mx-auto w-full max-w-container px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="mx-auto max-w-3xl text-center"
          >
            <h2 className="text-2xl font-extrabold sm:text-4xl" style={headingStyle}>
              Agende sua consulta com o Dr. Herlon Moura
            </h2>
            <p className="mx-auto mt-4 max-w-xl text-base" style={bodyStyle}>
              Atendimento humanizado e tecnologia de ponta em angiologia e cirurgia vascular no bairro da
              Graça, Salvador.
            </p>
            <div className="mt-8 flex flex-col items-center justify-center gap-4 sm:flex-row">
              <EdgeButton
                variant="whatsapp"
                onClick={() => {
                  trackCtaClick('procedimentos-cta', 'Agendar pelo WhatsApp');
                  setContact({ sectionId: 'procedimentos-cta' });
                }}
              >
                <MessageCircle className="h-4 w-4" />
                <span>Agendar pelo WhatsApp</span>
              </EdgeButton>
              <EdgeButton variant="outline" href="tel:+5571983449737">
                <Phone className="h-4 w-4" />
                <span>(71) 98344-9737</span>
              </EdgeButton>
            </div>
            <div
              className="mt-8 flex flex-col items-center justify-center gap-2 text-sm sm:flex-row sm:gap-6"
              style={mutedStyle}
            >
              <span>📍 R. Eng. Célso Tôrres, 654 - Graça, Salvador - BA</span>
              <span>📞 (71) 98344-9737 / (71) 99915-9975</span>
            </div>
          </motion.div>
        </div>
      </section>

      <Footer />

      <ContactModal
        isOpen={contact !== null}
        onClose={() => setContact(null)}
        sectionId={contact?.sectionId}
        interest={contact?.interest}
        context={contact?.interest ? `Interesse em: ${contact.interest}` : 'Agendamento de consulta'}
      />
    </main>
  );
}
