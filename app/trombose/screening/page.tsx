'use client';

import { useState } from 'react';
import { Header, Footer, Container, Button, FormInput } from '@/components';
import { Activity, ArrowLeft, AlertTriangle } from 'lucide-react';
import Link from 'next/link';

interface TromboseAnswers {
  legSwelling: string;
  legPain: string;
  warmth: string;
  redness: string;
  duration: string;
  riskFactors: string[];
}

const QUESTIONS = [
  { id: 'legSwelling', question: 'Inchaço em uma das pernas?', options: ['Não', 'Leve', 'Moderado', 'Intenso'] },
  { id: 'legPain', question: 'Dor ou sensibilidade na perna?', options: ['Não', 'Leve', 'Moderado', 'Intenso'] },
  { id: 'warmth', question: 'Pele mais quente na área afetada?', options: ['Não', 'Sim, levemente', 'Sim, moderadamente', 'Sim, muito'] },
  { id: 'redness', question: 'Vermelhidão ou descoloração?', options: ['Não', 'Leve', 'Moderado', 'Intenso'] },
  { id: 'duration', question: 'Há quanto tempo os sintomas?', options: ['Menos de 24h', '1-3 dias', '4-7 dias', 'Mais de 7 dias'] },
];

const RISK_FACTORS = [
  'Histórico familiar de trombose',
  'Uso de anticoncepcional/hormônios',
  'Imobilidade prolongada',
  'Cirurgia recente (3 meses)',
  'Câncer/quimioterapia',
  'Obesidade (IMC > 30)',
  'Tabagismo',
  'Idade > 60 anos',
  'Gestante/pós-parto',
];

function calculateRisk(a: TromboseAnswers): number {
  let score = a.riskFactors.length;
  if (a.legSwelling !== 'Não') score += 2;
  if (a.legPain !== 'Não') score += 1;
  if (a.warmth.startsWith('Sim')) score += 2;
  if (a.redness !== 'Não') score += 1;
  if (a.duration === '1-3 dias') score += 1;
  if (a.duration === '4-7 dias' || a.duration === 'Mais de 7 dias') score += 3;
  return Math.min(score, 20);
}

export default function TromboseScreeningPage() {
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<TromboseAnswers>({
    legSwelling: '', legPain: '', warmth: '', redness: '', duration: '', riskFactors: [],
  });
  const [submitted, setSubmitted] = useState(false);
  const [riskScore, setRiskScore] = useState(0);

  const toggleRisk = (f: string) => {
    setAnswers(prev => ({
      ...prev,
      riskFactors: prev.riskFactors.includes(f)
        ? prev.riskFactors.filter(x => x !== f)
        : [...prev.riskFactors, f],
    }));
  };

  const handleAnswer = (val: string) => {
    const key = QUESTIONS[step].id as keyof TromboseAnswers;
    setAnswers(prev => ({ ...prev, [key]: val }));
    if (step < QUESTIONS.length - 1) setStep(step + 1);
    else {
      const score = calculateRisk(answers);
      setRiskScore(score);
      setSubmitted(true);
      fetch('/api/crm/leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ source: 'trombose-screening', answers, riskScore: score, status: 'new' }),
      }).catch(() => {});
    }
  };

  if (submitted) {
    const level = riskScore <= 3 ? 'Baixo' : riskScore <= 8 ? 'Moderado' : 'Alto risco';
    const color = riskScore <= 3 ? 'text-success-green' : riskScore <= 8 ? 'text-warning-amber' : 'text-error-red';
    return (
      <main className="min-h-screen bg-dark-elevated">
        <Header />
        <Container className="py-16">
          <div className="mx-auto max-w-lg text-center">
            <AlertTriangle className={`mx-auto mb-6 h-16 w-16 ${color}`} />
            <h1 className="mb-3 text-display-lg font-heading font-bold text-neutral-light">Avaliação Trombose</h1>
            <p className={`mb-4 text-4xl font-extrabold ${color}`}>{level} — Score: {riskScore}/20</p>
            <p className="mb-8 text-sm text-neutral-medium">
              {level === 'Baixo' ? 'Sem sinais alarmantes.' :
               level === 'Moderado' ? 'Monitoramento recomendado.' :
               'Procure atendimento urgente se houver dor intensa ou inchaço unilateral.'}
            </p>
            <Link href="/contato"><Button variant="primary" size="lg">Marcar Consulta</Button></Link>
          </div>
        </Container>
        <Footer />
      </main>
    );
  }

  const q = QUESTIONS[step];
  return (
    <main className="min-h-screen bg-dark-elevated">
      <Header />
      <Container className="py-16">
        <div className="mx-auto max-w-xl">
          <Link href="/" className="text-surgical-teal hover:underline text-sm">← Voltar</Link>
          <p className="mt-2 mb-2 text-sm text-surgical-teal">Pergunta {step + 1} de {QUESTIONS.length}</p>
          <h2 className="mb-8 text-heading-2 font-heading font-semibold text-neutral-light">{q.question}</h2>
          <div className="space-y-3">
            {q.options.map(opt => (
              <button key={opt} onClick={() => handleAnswer(opt)}
                className="w-full rounded-lg border border-glass bg-glass px-6 py-4 text-left text-body-regular text-neutral-light transition-all hover:border-surgical-teal hover:bg-glass-hover">
                {opt}
              </button>
            ))}
          </div>
          <div className="mt-6 h-2 rounded bg-neutral-dark">
            <div className="h-2 rounded bg-surgical-teal transition-all" style={{ width: `${((step + 1) / QUESTIONS.length) * 100}%` }} />
          </div>
        </div>
      </Container>
      <Footer />
    </main>
  );
}