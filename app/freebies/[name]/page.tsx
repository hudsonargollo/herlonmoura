'use client';

import { useState } from 'react';
import { Header, Footer, Container, Button, FormInput } from '@/components';
import { Download, CheckCircle, ArrowLeft } from 'lucide-react';
import Link from 'next/link';

export default function FreebiePage({ params }: { params: Promise<{ name: string }> }) {
  const [step, setStep] = useState<'form' | 'thanks'>('form');
  const [sending, setSending] = useState(false);

  const handleSubmit = async (formData: FormData) => {
    setSending(true);
    try {
      await fetch('/api/crm/leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          source: 'freebie',
          freebie: (await params).name,
          name: formData.get('name'),
          whatsapp: formData.get('whatsapp'),
          email: formData.get('email'),
        }),
      });
      setStep('thanks');
    } catch (e) {
      console.error(e);
    } finally {
      setSending(false);
    }
  };

  return (
    <main className="min-h-screen bg-dark-elevated">
      <Header />
      <section className="relative overflow-hidden bg-gradient-to-b from-slate-950 via-dark-elevated to-slate-900 py-16 sm:py-24">
        <div className="pointer-events-none absolute -top-32 left-1/2 -z-10 h-96 w-[600px] -translate-x-1/2 rounded-full bg-surgical-teal/10 blur-[100px]" />
        <div className="container mx-auto px-4 text-center">
          <Download className="mx-auto mb-4 h-12 w-12 text-surgical-teal" />
          <h1 className="text-3xl font-extrabold sm:text-5xl text-white">Guia Completo</h1>
          <p className="mt-4 text-base text-slate-300 max-w-lg mx-auto">
            Preencha os dados para baixar seu material gratuito em PDF.
          </p>
        </div>
      </section>

      <section className="py-12 bg-dark-elevated">
        <Container className="max-w-md mx-auto">
          {step === 'form' ? (
            <form action={handleSubmit} className="space-y-4 rounded-xl border border-glass bg-glass p-6">
              <FormInput name="name" label="Nome completo" placeholder="Dr. Fulano" required />
              <FormInput name="whatsapp" label="WhatsApp" placeholder="(71) 99999-9999" required />
              <FormInput name="email" label="E-mail" type="email" placeholder="fulano@email.com" required />
              <Button variant="primary" size="lg" className="w-full" disabled={sending}>
                {sending ? 'Enviando...' : 'Baixar PDF Gratuitamente'}
              </Button>
            </form>
          ) : (
            <div className="text-center py-12">
              <CheckCircle className="mx-auto mb-4 h-16 w-16 text-surgical-teal" />
              <h2 className="mb-3 text-heading-2 font-heading font-semibold text-neutral-light">
                Obrigado!
              </h2>
              <p className="mb-6 text-sm text-neutral-medium">
                Seu material está pronto. Verifique seu e-mail para o download.
              </p>
              <Link href="/"><Button variant="primary">Voltar ao site</Button></Link>
            </div>
          )}
        </Container>
      </section>

      <Footer />
    </main>
  );
}