'use client';

import { useState } from 'react';
import { Header, Footer, Container, Button, FormInput } from '@/components';
import { Shield, ArrowLeft, Mail, User } from 'lucide-react';
import Link from 'next/link';
import { captureUtm } from '@/lib/leads';

interface VarizesAnswers {
  legPain: string;
  visibleVeins: string;
  swelling: string;
  heaviness: string;
  cramps: string;
  skinChanges: string;
  familyHistory: string;
  standingHours: string;
}

const QUESTIONS = [
  { id: 'legPain', question: 'Sente dor ou peso nas pernas, principalmente ao final do dia?', options: ['Não', 'Leve', 'Moderado', 'Intenso'] },
  { id: 'visibleVeins', question: 'Apareceram veias visíveis, dilatadas ou em aranha?', options: ['Não', 'Leve', 'Moderado', 'Intenso'] },
  { id: 'swelling', question: 'Tem inchaço nos tornozelos ou pés ao final do dia?', options: ['Não', 'Leve', 'Moderado', 'Intenso'] },
  { id: 'heaviness', question: 'Sensação de pernas pesadas ou cansadas?', options: ['Não', 'Leve', 'Moderado', 'Intenso'] },
  { id: 'cramps', question: 'Tem câimbras noturnas nas panturrilhas?', options: ['Não', 'Leve', 'Moderado', 'Intenso'] },
  { id: 'skinChanges', question: 'Manchas escuras ou pele áspera nos tornozelos?', options: ['Não', 'Sim, leve', 'Sim, moderado', 'Sim, intensa'] },
  { id: 'familyHistory', question: 'Histórico familiar de varizes ou trombose?', options: ['Não', 'Pai/mãe', 'Irmão/ã', 'Vários familiares'] },
  { id: 'standingHours', question: 'Fica muito tempo em pé no trabalho/dia a dia?', options: ['Não', '2-4h', '4-8h', 'Mais de 8h'] },
];

function calculateRisk(a: VarizesAnswers): number {
  let score = 0;
  const map: Record<string, Record<string, number>> = {
    legPain: { 'Não': 0, 'Leve': 1, 'Moderado': 2, 'Intenso': 3 },
    visibleVeins: { 'Não': 0, 'Leve': 1, 'Moderado': 2, 'Intenso': 3 },
    swelling: { 'Não': 0, 'Leve': 1, 'Moderado': 2, 'Intenso': 3 },
    heaviness: { 'Não': 0, 'Leve': 1, 'Moderado': 2, 'Intenso': 3 },
    cramps: { 'Não': 0, 'Leve': 1, 'Moderado': 2, 'Intenso': 3 },
    skinChanges: { 'Não': 0, 'Sim, leve': 2, 'Sim, moderado': 3, 'Sim, intensa': 4 },
    familyHistory: { 'Não': 0, 'Pai/mãe': 2, 'Irmão/ã': 3, 'Vários familiares': 4 },
    standingHours: { 'Não': 0, '2-4h': 1, '4-8h': 2, 'Mais de 8h': 3 },
  };
  for (const q of QUESTIONS) {
    score += (map[q.id] as Record<string, number>)[a[q.id as keyof VarizesAnswers]] || 0;
  }
  return score;
}

export default function VarizesAssessmentPage() {
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<VarizesAnswers>({
    legPain: '', visibleVeins: '', swelling: '', heaviness: '',
    cramps: '', skinChanges: '', familyHistory: '', standingHours: '',
  });
  const [submitted, setSubmitted] = useState(false);
  const [riskScore, setRiskScore] = useState(0);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [contactStep, setContactStep] = useState(false);

  const update = (val: string) => {
    setAnswers(prev => ({ ...prev, [QUESTIONS[step].id]: val }));
    if (step < QUESTIONS.length - 1) setStep(step + 1);
    else {
      const score = calculateRisk(answers);
      setRiskScore(score);
      setContactStep(true);
    }
  };

  const handleContactSubmit = async () => {
    setContactStep(false);
    setSubmitted(true);
    const score = calculateRisk(answers);
    setRiskScore(score);
    fetch('/api/crm/leads', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...captureUtm(), name, whatsapp: '', email, source: 'varizes-assessment', answers, riskScore: score, status: 'new' }),
    }).catch(() => {});
  };

  if (contactStep) {
    return (
      <main className="min-h-screen bg-background">
        <Header />
        <Container className="py-16">
          <div className="mx-auto max-w-sm text-center space-y-4">
            <h2 className="text-heading-2 font-heading font-bold text-foreground">Seus dados</h2>
            <p className="text-sm text-muted-foreground">Informe nome e e-mail para receber seu resultado.</p>
            <div className="relative">
              <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <input type="text" value={name} onChange={e => setName(e.target.value)} placeholder="Nome completo" className="glass-input pl-10 w-full text-sm" />
            </div>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="fulano@email.com" className="glass-input pl-10 w-full text-sm" />
            </div>
            <Button variant="primary" size="lg" onClick={handleContactSubmit} disabled={!name || !email.includes('@')}>Ver Resultado</Button>
          </div>
        </Container>
        <Footer />
      </main>
    );
  }

  if (submitted) {
    const level = riskScore <= 8 ? 'Baixo' : riskScore <= 16 ? 'Moderado' : 'Alto';
    const color = riskScore <= 8 ? 'text-success-green' : riskScore <= 16 ? 'text-warning-amber' : 'text-error-red';
    return (
      <main className="min-h-screen bg-background">
        <Header />
        <Container className="py-16">
          <div className="mx-auto max-w-lg text-center">
            <Shield className={`mx-auto mb-6 h-16 w-16 ${color}`} />
            <h1 className="mb-3 text-display-lg font-heading font-bold text-foreground">Resultado do Avaliação</h1>
            <p className={`mb-2 text-4xl font-extrabold {color}`}>{level} — Score: {riskScore}/24</p>
            <p className="mb-8 text-sm text-muted-foreground">
              {level === 'Baixo' ? 'Seus hábitos estão em boa fase. Continue monitorando.' :
               level === 'Moderado' ? 'Atenção: considere usar meias de compressão e elevar as pernas.' :
               'Recomendamos consulta com angiologista para avaliação detalhada.'}
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
    <main className="min-h-screen bg-background">
      <Header />
      <Container className="py-16">
        <div className="mx-auto max-w-xl">
          <Link href="/" className="text-primaryhover:underline text-sm">← Voltar</Link>
          <p className="mt-2 mb-2 text-sm text-primary">Pergunta {step + 1} de {QUESTIONS.length}</p>
          <h2 className="mb-8 text-heading-2 font-heading font-semibold text-foreground">{q.question}</h2>
          <div className="space-y-3">
            {q.options.map(opt => (
              <button key={opt} onClick={() => update(opt)}
                className="w-full rounded-lg border border-glass bg-glass px-6 py-4 text-left text-body-regular text-foreground transition-all hover:border-primary hover:bg-glass-hover">
                {opt}
              </button>
            ))}
          </div>
          <div className="mt-6 h-2 rounded bg-muted">
            <div className="h-2 rounded bg-primary ransition-all" style={{ width: `${((step + 1) / QUESTIONS.length) * 100}%` }} />
          </div>
        </div>
      </Container>
      <Footer />
    </main>
  );
}