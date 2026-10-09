'use client';

import { useState } from 'react';
import { Header, Footer, Container, Button, FormInput } from '@/components';
import { HeartPulse, ArrowLeft, Mail, User } from 'lucide-react';
import Link from 'next/link';
import { captureUtm } from '@/lib/leads';

interface SymptomAnswers {
  legSwelling: string;
  legPain: string;
  warmth: string;
  redness: string;
  duration: string;
  riskFactors: string[];
}

const QUESTIONS = [
  { id: 'legSwelling', question: 'Você tem inchaço em uma das pernas?', options: ['Não', 'Leve', 'Moderado', 'Intenso'] },
  { id: 'legPain', question: 'Tem dor ou sensibilidade na perna (ao caminhar ou repouso)?', options: ['Não', 'Leve', 'Moderado', 'Intenso'] },
  { id: 'warmth', question: 'A pele da área afetada está mais quente que o normal?', options: ['Não', 'Sim, levemente', 'Sim, moderadamente', 'Sim, muito'] },
  { id: 'redness', question: 'Há vermelhidão ou descoloração na pele?', options: ['Não', 'Leve', 'Moderado', 'Intenso'] },
  { id: 'duration', question: 'Há quanto tempo os sintomas persistem?', options: ['Menos de 24h', '1-3 dias', '4-7 dias', 'Mais de 7 dias'] },
];

const RISK_FACTORS = [
  'Histórico familiar de trombose',
  'Uso de anticoncepcional/hormônios',
  'Imobilidade prolongada (viagem, repouso)',
  'Cirurgia recente (últimos 3 meses)',
  'Câncer ou quimioterapia',
  'Obesidade (IMC > 30)',
  'Tabagismo',
  'Idade > 60 anos',
  'Gestante/pós-parto',
];

export default function QuestionnairePage() {
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<SymptomAnswers>({
    legSwelling: '',
    legPain: '',
    warmth: '',
    redness: '',
    duration: '',
    riskFactors: [],
  });
  const [submitted, setSubmitted] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [contactStep, setContactStep] = useState(false);

  const toggleRiskFactor = (factor: string) => {
    setAnswers(prev => ({
      ...prev,
      riskFactors: prev.riskFactors.includes(factor)
        ? prev.riskFactors.filter(f => f !== factor)
        : [...prev.riskFactors, factor],
    }));
  };

  const handleAnswer = (value: string) => {
    const key = QUESTIONS[step].id as keyof SymptomAnswers;
    setAnswers(prev => ({ ...prev, [key]: value }));
    if (step < QUESTIONS.length - 1) {
      setStep(step + 1);
    }
  };

  const handleSubmit = async () => {
    setContactStep(false);
    setSubmitted(true);
    const riskScore = answers.riskFactors.length;
    fetch('/api/crm/leads', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...captureUtm(), name, whatsapp: '', email, source: 'questionnaire', symptoms: { legSwelling: answers.legSwelling, legPain: answers.legPain, warmth: answers.warmth, redness: answers.redness, duration: answers.duration }, riskFactors: answers.riskFactors, riskScore }),
    }).catch(() => {});
  };

  if (contactStep) {
    return (
      <main className="min-h-screen bg-background">
        <Header />
        <Container className="py-16 text-center">
          <h2 className="text-heading-2 font-heading font-bold text-foreground mb-2">Seus dados</h2>
          <p className="text-sm text-muted-foreground mb-6">Informe nome e e-mail antes de enviar.</p>
          <div className="mx-auto max-w-sm space-y-3">
            <div className="relative">
              <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <input type="text" value={name} onChange={e => setName(e.target.value)} placeholder="Nome completo" className="glass-input pl-10 w-full text-sm" />
            </div>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="fulano@email.com" className="glass-input pl-10 w-full text-sm" />
            </div>
            <Button variant="primary" size="lg" onClick={handleSubmit} disabled={!name || !email.includes('@')}>Enviar Respostas</Button>
          </div>
        </Container>
        <Footer />
      </main>
    );
  }

  if (submitted) {
    return (
      <main className="min-h-screen bg-background">
        <Header />
        <Container className="py-20 text-center">
          <HeartPulse className="mx-auto mb-6 h-16 w-16 text-primary" />
          <h1 className="mb-4 text-display-lg font-heading font-semibold text-foreground">
            Obrigado por responder
          </h1>
          <p className="mb-8 text-body-regular text-muted-foreground">
            Nossa equipe vai entrar em contato em breve com os próximos passos.
          </p>
          <Link href="/contato">
            <Button variant="primary" size="lg">Entre em Contato</Button>
          </Link>
        </Container>
        <Footer />
      </main>
    );
  }

  if (step < QUESTIONS.length) {
    const q = QUESTIONS[step];
    return (
      <main className="min-h-screen bg-background">
        <Header />
        <Container className="py-16">
          <div className="mx-auto max-w-xl">
            <div className="mb-8 flex items-center gap-3">
              <Link href="/contato" className="text-primary hover:underline text-sm">
                ← Voltar
              </Link>
            </div>
            <p className="mb-2 text-sm text-primary">Pergunta {step + 1} de {QUESTIONS.length}</p>
            <h2 className="mb-8 text-heading-2 font-heading font-semibold text-foreground">
              {q.question}
            </h2>
            <div className="space-y-3">
              {q.options.map(opt => (
                <button
                  key={opt}
                  onClick={() => handleAnswer(opt)}
                  className="w-full rounded-lg border border-glass bg-glass px-6 py-4 text-left text-body-regular text-foreground transition-all hover:border-primary hover:bg-glass-hover"
                >
                  {opt}
                </button>
              ))}
            </div>
          </div>
        </Container>
      </main>
    );
  }

  // Risk factors step
  return (
    <main className="min-h-screen bg-background">
      <Header />
      <Container className="py-16">
        <div className="mx-auto max-w-xl">
          <p className="mb-2 text-sm text-primary">Pergunta {step + 1} de {QUESTIONS.length + 1}</p>
          <h2 className="mb-8 text-heading-2 font-heading font-semibold text-foreground">
            Selecione os fatores de risco que se aplicam:
          </h2>
          <div className="space-y-3">
            {RISK_FACTORS.map(factor => (
              <button
                key={factor}
                onClick={() => toggleRiskFactor(factor)}
                className={`w-full rounded-lg border px-6 py-4 text-left text-body-regular transition-all ${
                  answers.riskFactors.includes(factor)
                    ? 'border-primary bg-primary/10 text-primary'
                    : 'border-border bg-muted/30 text-foreground hover:border-primary hover:bg-muted'
                }`}
              >
                {factor}
              </button>
            ))}
          </div>
          <Button
            variant="primary"
            size="lg"
            className="mt-8 w-full"
            onClick={() => setContactStep(true)}
          >
            Enviar Respostas
          </Button>
        </div>
      </Container>
      <Footer />
    </main>
  );
}