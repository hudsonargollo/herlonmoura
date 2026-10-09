'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ChevronRight,
  ChevronLeft,
  AlertCircle,
  CheckCircle2,
  AlertTriangle,
  RotateCcw,
  MessageCircle,
  Activity,
  Shield,
  Clock,
  HeartPulse,
  ArrowRight,
  Scissors,
  Mail,
  User,
} from 'lucide-react';

export interface DVTCalculatorState {
  currentStep: number;
  direction: number;
  responses: {
    ageRange: string;
    mobility: string;
    recentSurgery: boolean | null;
    clinicalFactors: string[];
  };
  riskScore: number | null;
  riskCategory: 'low' | 'moderate' | 'high' | 'critical' | null;
  email: string;
  name: string;
}

export function DVTRiskCalculator({
  className = '',
  inModal = false,
  onComplete,
}: {
  className?: string;
  inModal?: boolean;
  onComplete?: () => void;
}) {
  const [state, setState] = useState<DVTCalculatorState>({
    currentStep: 0,
    direction: 1,
    responses: {
      ageRange: '',
      mobility: '',
      recentSurgery: null,
      clinicalFactors: [],
    },
    riskScore: null,
    riskCategory: null,
    email: '',
    name: '',
  });

  const TOTAL_STEPS = 5;
  const CONTACT_STEP = 5;

  const computeScore = (responses: DVTCalculatorState['responses']) => {
    let score = 0;
    if (responses.ageRange === '41-60') score += 1;
    else if (responses.ageRange === '61-80') score += 2;
    else if (responses.ageRange === '80+') score += 3;

    if (responses.mobility === 'sedentary') score += 1;
    else if (responses.mobility === 'travel') score += 1;
    else if (responses.mobility === 'bedridden') score += 3;

    if (responses.recentSurgery === true) score += 2;

    responses.clinicalFactors.forEach((factor) => {
      if (factor === 'pregnancy') score += 2;
      else if (factor !== 'none') score += 1;
    });

    let category: 'low' | 'moderate' | 'high' | 'critical' = 'low';
    if (score >= 9) category = 'critical';
    else if (score >= 6) category = 'high';
    else if (score >= 3) category = 'moderate';
    else category = 'low';

    return { score, category };
  };

  const handleContactSubmit = () => {
    fetch('/api/crm/leads', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: state.name, whatsapp: '', email: state.email, source: 'dvt-calculator', source_detail: 'TVP calculator', tags: ['dvt-test'], visitor_id: null }),
    }).catch(() => {});
    setState(prev => ({ ...prev, currentStep: prev.currentStep + 1 }));
  };

  const handleNext = () => {
    if (state.currentStep === CONTACT_STEP) { handleContactSubmit(); return; }
    if (state.currentStep === TOTAL_STEPS) {
      const { score, category } = computeScore(state.responses);
      setState((prev) => ({ ...prev, currentStep: 6, direction: 1, riskScore: score, riskCategory: category }));
      if (onComplete) onComplete();
    } else {
      setState((prev) => ({ ...prev, currentStep: prev.currentStep + 1, direction: 1 }));
    }
  };

  const handleBack = () => {
    if (state.currentStep > 0) {
      setState((prev) => ({
        ...prev,
        currentStep: prev.currentStep - 1,
        direction: -1,
      }));
    }
  };

  const handleReset = () => {
    setState({
      currentStep: 0,
      direction: -1,
      responses: { ageRange: '', mobility: '', recentSurgery: null, clinicalFactors: [] },
      riskScore: null,
      riskCategory: null,
      email: '',
      name: '',
    });
  };

  const selectAge = (val: string) => {
    setState((prev) => ({ ...prev, responses: { ...prev.responses, ageRange: val } }));
  };

  const selectMobility = (val: string) => {
    setState((prev) => ({ ...prev, responses: { ...prev.responses, mobility: val } }));
  };

  const selectSurgery = (val: boolean) => {
    setState((prev) => ({ ...prev, responses: { ...prev.responses, recentSurgery: val } }));
  };

  const toggleFactor = (val: string) => {
    setState((prev) => {
      let current = [...prev.responses.clinicalFactors];
      if (val === 'none') {
        current = ['none'];
      } else {
        current = current.filter((f) => f !== 'none');
        if (current.includes(val)) {
          current = current.filter((f) => f !== val);
        } else {
          current.push(val);
        }
      }
      return {
        ...prev,
        responses: { ...prev.responses, clinicalFactors: current },
      };
    });
  };

  const isStepValid = () => {
    switch (state.currentStep) {
      case 0: return true;
      case 1: return state.responses.ageRange !== '';
      case 2: return state.responses.mobility !== '';
      case 3: return state.responses.recentSurgery !== null;
      case 4: return state.responses.clinicalFactors.length > 0;
      case CONTACT_STEP: return state.name.trim().length > 0 && state.email.trim().includes('@');
      default: return true;
    }
  };

  const slideVariants = {
    enter: (direction: number) => ({ x: direction > 0 ? 25 : -25, opacity: 0 }),
    center: { x: 0, opacity: 1, transition: { duration: 0.22, ease: 'easeOut' } },
    exit: (direction: number) => ({ x: direction > 0 ? -25 : 25, opacity: 0, transition: { duration: 0.18, ease: 'easeIn' } }),
  };

  return (
    <div
      className={`mx-auto w-full max-w-2xl rounded-3xl ${
        inModal
          ? 'bg-transparent p-1'
          : 'border border-primary/25 bg-card/95 p-5 sm:p-7 shadow-2xl backdrop-blur-xl'
      } ${className}`}
    >
      {state.currentStep > 0 && state.currentStep <= TOTAL_STEPS && (
        <div className="mb-4 flex items-center justify-between border-b border-border/50 pb-3">
          <div className="flex items-center gap-2">
            <span className="flex h-6 w-6 items-center justify-center rounded-full bg-primary/20 text-xs font-bold text-primary">
              {state.currentStep}
            </span>
            <span className="text-xs font-medium text-muted-foreground">
              Etapa {state.currentStep} de {TOTAL_STEPS}
            </span>
          </div>
          <div className="flex items-center gap-1.5">
            {[1, 2, 3, 4].map((step) => (
              <div
                key={step}
                className={`h-1.5 rounded-full transition-all duration-300 ${
                  step === state.currentStep
                    ? 'w-6 bg-primary'
                    : step < state.currentStep
                    ? 'w-3 bg-secondary'
                    : 'w-2 bg-muted'
                }`}
              />
            ))}
          </div>
        </div>
      )}

      <div className="relative min-h-[300px] flex flex-col justify-center">
        <AnimatePresence mode="wait" custom={state.direction}>
          {state.currentStep === 0 && (
            <motion.div
              key="step-0"
              custom={state.direction}
              variants={slideVariants}
              initial="enter"
              animate="center"
              exit="exit"
              className="text-center py-2"
            >
              <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/20 text-primary border border-primary/30 shadow-lg shadow-primary/20">
                <HeartPulse className="h-6 w-6 animate-pulse" />
              </div>
              <h3 className="text-xl sm:text-2xl font-black text-foreground">
                Calculadora de Risco de TVP
              </h3>
              <p className="mt-1.5 text-xs sm:text-sm text-muted-foreground max-w-md mx-auto leading-relaxed">
                Responda a 4 perguntas rápidas para estimar sua probabilidade clínica de trombose venosa profunda.
              </p>
              <div className="mt-4 grid grid-cols-3 gap-2 text-left max-w-sm mx-auto">
                <div className="rounded-xl border border-border/50 bg-muted/30 p-2 text-center">
                  <Clock className="mx-auto h-3.5 w-3.5 text-primary mb-0.5" />
                  <span className="block text-[11px] font-semibold text-foreground">1 Minuto</span>
                  <span className="block text-[9px] text-muted-foreground">Rápido & Ágil</span>
                </div>
                <div className="rounded-xl border border-border/50 bg-muted/30 p-2 text-center">
                  <Shield className="mx-auto h-3.5 w-3.5 text-secondary mb-0.5" />
                  <span className="block text-[11px] font-semibold text-foreground">100% Privado</span>
                  <span className="block text-[9px] text-muted-foreground">Sem Cadastro</span>
                </div>
                <div className="rounded-xl border border-border/50 bg-muted/30 p-2 text-center">
                  <Activity className="mx-auto h-3.5 w-3.5 text-primary mb-0.5" />
                  <span className="block text-[11px] font-semibold text-foreground">Score Clínico</span>
                  <span className="block text-[9px] text-muted-foreground">Dr. Herlon Moura</span>
                </div>
              </div>
              <div className="mt-5">
                <button
                  onClick={handleNext}
                  className="inline-flex items-center justify-center gap-2 rounded-xl bg-primary px-6 py-2.5 text-sm font-bold text-primary-foreground shadow-lg shadow-primary/30 transition-all hover:bg-primary-hover active:scale-95"
                >
                  <span>Iniciar Avaliação</span>
                  <ArrowRight className="h-4 w-4" />
                </button>
              </div>
            </motion.div>
          )}

          {state.currentStep === 1 && (
            <motion.div
              key="step-1"
              custom={state.direction}
              variants={slideVariants}
              initial="enter"
              animate="center"
              exit="exit"
              className="py-1"
            >
              <h4 className="text-base sm:text-lg font-bold text-foreground text-center">
                Qual é a sua faixa etária?
              </h4>
              <p className="mt-0.5 text-xs text-muted-foreground text-center mb-4">
                A idade influencia diretamente a elasticidade venosa e a coagulação.
              </p>
              <div className="grid grid-cols-2 gap-2.5 max-w-md mx-auto">
                {[
                  { id: '18-40', label: '18 a 40 anos', desc: 'Risco basal jovem' },
                  { id: '41-60', label: '41 a 60 anos', desc: 'Início de elevação' },
                  { id: '61-80', label: '61 a 80 anos', desc: 'Risco moderado' },
                  { id: '80+', label: 'Mais de 80 anos', desc: 'Atenção redobrada' },
                ].map((item) => {
                  const isSelected = state.responses.ageRange === item.id;
                  return (
                    <button
                      key={item.id}
                      onClick={() => selectAge(item.id)}
                      className={`flex flex-col items-start rounded-2xl border p-3 text-left transition-all active:scale-98 ${
                        isSelected
                          ? 'border-primary bg-primary/20 shadow-md shadow-primary/20'
                          : 'border-border/60 bg-muted/30 hover:border-border hover:bg-muted/30'
                      }`}
                    >
                      <div className="flex w-full items-center justify-between">
                        <span className={`text-sm font-bold ${isSelected ? 'text-primary' : 'text-foreground'}`}>
                          {item.label}
                        </span>
                        <span
                          className={`h-4 w-4 rounded-full border flex items-center justify-center ${
                            isSelected ? 'border-primary bg-primary text-primary-foreground' : 'border-border'
                          }`}
                        >
                          {isSelected && <span className="h-1.5 w-1.5 rounded-full bg-primary" />}
                        </span>
                      </div>
                      <span className="mt-0.5 text-[11px] text-muted-foreground">{item.desc}</span>
                    </button>
                  );
                })}
              </div>
            </motion.div>
          )}

          {state.currentStep === 2 && (
            <motion.div
              key="step-2"
              custom={state.direction}
              variants={slideVariants}
              initial="enter"
              animate="center"
              exit="exit"
              className="py-1"
            >
              <h4 className="text-base sm:text-lg font-bold text-foreground text-center">
                Qual é o seu nível recente de movimentação?
              </h4>
              <p className="mt-0.5 text-xs text-muted-foreground text-center mb-4">
                A estase sanguínea prolongada nas pernas é um gatilho para coágulos.
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-w-lg mx-auto">
                {[
                  { id: 'normal', label: 'Rotina ativa / normal', desc: 'Caminha e se movimenta diariamente' },
                  { id: 'sedentary', label: 'Muitas horas sentado', desc: 'Trabalho em escritório sem pausas' },
                  { id: 'travel', label: 'Viagem longa (> 4 horas)', desc: 'Voo ou viagem recente de carro/ônibus' },
                  { id: 'bedridden', label: 'Acamado ou gessado (> 3 dias)', desc: 'Imobilidade por lesão ou internação' },
                ].map((item) => {
                  const isSelected = state.responses.mobility === item.id;
                  return (
                    <button
                      key={item.id}
                      onClick={() => selectMobility(item.id)}
                      className={`flex flex-col items-start rounded-2xl border p-2.5 sm:p-3 text-left transition-all active:scale-98 ${
                        isSelected
                          ? 'border-primary bg-primary/20 shadow-md shadow-primary/20'
                          : 'border-border/60 bg-muted/30 hover:border-border hover:bg-muted/30'
                      }`}
                    >
                      <div className="flex w-full items-center justify-between">
                        <span className={`text-xs sm:text-sm font-bold ${isSelected ? 'text-primary' : 'text-foreground'}`}>
                          {item.label}
                        </span>
                        <span
                          className={`h-3.5 w-3.5 rounded-full border flex items-center justify-center flex-shrink-0 ml-1 ${
                            isSelected ? 'border-primary bg-primary text-primary-foreground' : 'border-border'
                          }`}
                        >
                          {isSelected && <span className="h-1 w-1 rounded-full bg-primary" />}
                        </span>
                      </div>
                      <span className="mt-0.5 text-[10px] sm:text-[11px] text-muted-foreground">{item.desc}</span>
                    </button>
                  );
                })}
              </div>
            </motion.div>
          )}

          {state.currentStep === 3 && (
            <motion.div
              key="step-3"
              custom={state.direction}
              variants={slideVariants}
              initial="enter"
              animate="center"
              exit="exit"
              className="py-1"
            >
              <h4 className="text-base sm:text-lg font-bold text-foreground text-center">
                Passou por cirurgia ou trauma recente?
              </h4>
              <p className="mt-0.5 text-xs text-muted-foreground text-center mb-4">
                Procedimentos de médio/grande porte aumentam temporariamente a coagulação.
              </p>
              <div className="grid grid-cols-2 gap-3 max-w-sm mx-auto">
                <button
                  onClick={() => selectSurgery(true)}
                  className={`flex flex-col items-center justify-center rounded-2xl border p-4 text-center transition-all active:scale-98 ${
                    state.responses.recentSurgery === true
                      ? 'border-primary bg-primary/25 shadow-lg shadow-primary/20'
                      : 'border-border/60 bg-muted/30 hover:border-border hover:bg-muted/30'
                  }`}
                >
                  <Scissors className={`h-6 w-6 mb-1.5 ${state.responses.recentSurgery === true ? 'text-primary' : 'text-muted-foreground'}`} />
                  <span className="text-sm font-bold text-foreground">Sim</span>
                  <span className="mt-0.5 text-[10px] text-muted-foreground">Cirurgia/gesso nos últimos 3 meses</span>
                </button>
                <button
                  onClick={() => selectSurgery(false)}
                  className={`flex flex-col items-center justify-center rounded-2xl border p-4 text-center transition-all active:scale-98 ${
                    state.responses.recentSurgery === false
                      ? 'border-secondary bg-secondary/25 shadow-lg shadow-secondary/30'
                      : 'border-border/60 bg-muted/30 hover:border-border hover:bg-muted/30'
                  }`}
                >
                  <CheckCircle2 className={`h-6 w-6 mb-1.5 ${state.responses.recentSurgery === false ? 'text-secondary' : 'text-muted-foreground'}`} />
                  <span className="text-sm font-bold text-foreground">Não</span>
                  <span className="mt-0.5 text-[10px] text-muted-foreground">Sem cirurgias no período</span>
                </button>
              </div>
            </motion.div>
          )}

          {state.currentStep === 4 && (
            <motion.div
              key="step-4"
              custom={state.direction}
              variants={slideVariants}
              initial="enter"
              animate="center"
              exit="exit"
              className="py-1"
            >
              <h4 className="text-base sm:text-lg font-bold text-foreground text-center">
                Apresenta algum destes fatores adicionais?
              </h4>
              <p className="mt-0.5 text-xs text-muted-foreground text-center mb-3">
                Selecione todas as opções correspondentes.
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-w-lg mx-auto">
                {[
                  { id: 'family', label: 'Histórico familiar de trombose' },
                  { id: 'hormonal', label: 'Anticoncepcional ou reposição TRH' },
                  { id: 'pregnancy', label: 'Gestante ou pós-parto (< 6 semanas)' },
                  { id: 'varicose', label: 'Varizes volumosas ou inchaço frequente' },
                  { id: 'smoking', label: 'Tabagismo ativo (fumante diário)' },
                  { id: 'none', label: 'Nenhum dos fatores acima' },
                ].map((item) => {
                  const isSelected = state.responses.clinicalFactors.includes(item.id);
                  return (
                    <button
                      key={item.id}
                      onClick={() => toggleFactor(item.id)}
                      className={`flex items-center justify-between rounded-xl border px-3 py-2 text-left text-xs font-semibold transition-all active:scale-98 ${
                        isSelected
                          ? (item.id === 'none'
                            ? 'border-secondary bg-secondary/25 text-secondary-hover'
                            : 'border-primary bg-primary/25 text-primary')
                          : 'border-border/60 bg-muted/30 text-muted-foreground hover:bg-muted/30 hover:text-foreground'
                      }`}
                    >
                      <span>{item.label}</span>
                      <span
                        className={`h-4 w-4 rounded flex items-center justify-center border ${
                          isSelected ? 'border-primary bg-primary text-primary-foreground' : 'border-border'
                        }`}
                      >
                        {isSelected && <span className="text-[10px] font-black">✓</span>}
                      </span>
                    </button>
                  );
                })}
              </div>
            </motion.div>
          )}

          {state.currentStep === CONTACT_STEP && (
            <motion.div
              key="step-contact"
              custom={state.direction}
              variants={slideVariants}
              initial="enter"
              animate="center"
              exit="exit"
              className="py-2 text-center"
            >
              <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/20 text-primary border border-primary/30">
                <Mail className="h-6 w-6" />
              </div>
              <h4 className="text-heading-3 font-heading font-bold text-foreground mb-1">
                Quase lá — nos contate
              </h4>
              <p className="text-xs text-muted-foreground mb-5">
                Informe nome e e-mail para receber seu resultado e acompanhar sua saúde vascular.
              </p>
              <div className="space-y-3 max-w-sm mx-auto">
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <input
                    type="text"
                    value={state.name}
                    onChange={(e) => setState(prev => ({ ...prev, name: e.target.value }))}
                    placeholder="Nome completo"
                    className="glass-input pl-10 w-full text-sm"
                  />
                </div>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <input
                    type="email"
                    value={state.email}
                    onChange={(e) => setState(prev => ({ ...prev, email: e.target.value }))}
                    placeholder="fulano@email.com"
                    className="glass-input pl-10 w-full text-sm"
                  />
                </div>
              </div>
              <div className="mt-4 flex flex-col sm:flex-row items-center justify-center gap-2.5">
                <button
                  onClick={handleContactSubmit}
                  disabled={!isStepValid()}
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-xl bg-primary px-5 py-2.5 text-xs font-bold text-primary-foreground transition-all hover:bg-primary-hover disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  <ArrowRight className="h-4 w-4" />
                  <span>Ver Resultado</span>
                </button>
              </div>
            </motion.div>
          )}

          {state.currentStep === 6 && (
            <motion.div
              key="step-result"
              custom={state.direction}
              variants={slideVariants}
              initial="enter"
              animate="center"
              exit="exit"
              className="text-center py-2"
            >
              {state.riskCategory === 'low' && (
                <div>
                  <div className="mx-auto mb-2 flex h-12 w-12 items-center justify-center rounded-2xl bg-secondary/20 text-secondary border border-secondary/30">
                    <CheckCircle2 className="h-6 w-6" />
                  </div>
                  <span className="inline-block rounded-full bg-secondary/20 px-3 py-0.5 text-xs font-extrabold text-secondary border border-secondary/30">
                    Baixo Risco Estimado (Score: {state.riskScore} pts)
                  </span>
                  <h4 className="mt-1.5 text-lg font-bold text-foreground">Parâmetros Dentro da Normalidade</h4>
                  <p className="mt-1 text-xs text-muted-foreground max-w-md mx-auto leading-relaxed">
                    Você não apresenta acúmulo de fatores críticos de TVP. Mantenha boa hidratação, caminhadas diárias e pausas ativas em viagens longas.
                  </p>
                </div>
              )}

              {state.riskCategory === 'moderate' && (
                <div>
                  <div className="mx-auto mb-2 flex h-12 w-12 items-center justify-center rounded-2xl bg-amber-500/20 text-amber-400 border border-amber-500/30">
                    <AlertTriangle className="h-6 w-6" />
                  </div>
                  <span className="inline-block rounded-full bg-amber-500/20 px-3 py-0.5 text-xs font-extrabold text-amber-400 border border-amber-500/30">
                    Risco Moderado de TVP (Score: {state.riskScore} pts)
                  </span>
                  <h4 className="mt-1.5 text-lg font-bold text-foreground">Atenção Preventiva Recomendada</h4>
                  <p className="mt-1 text-xs text-muted-foreground max-w-md mx-auto leading-relaxed">
                    Fatores combinados indicam a importância de um Eco-Doppler Vascular preventivo no consultório do Dr. Herlon Moura para avaliar a circulação.
                  </p>
                </div>
              )}

              {(state.riskCategory === 'high' || state.riskCategory === 'critical') && (
                <div>
                  <div className="mx-auto mb-2 flex h-12 w-12 items-center justify-center rounded-2xl bg-rose-500/20 text-rose-400 border border-rose-500/30 animate-pulse">
                    <AlertCircle className="h-6 w-6" />
                  </div>
                  <span className="inline-block rounded-full bg-rose-500/20 px-3 py-0.5 text-xs font-extrabold text-rose-400 border border-rose-500/30">
                    {state.riskCategory === 'critical' ? 'Risco Crítico / Atenção' : 'Alto Risco Identificado'} (Score: {state.riskScore} pts)
                  </span>
                  <h4 className="mt-1.5 text-lg font-bold text-foreground">Avaliação Vascular Prioritária</h4>
                  <p className="mt-1 text-xs text-muted-foreground max-w-md mx-auto leading-relaxed">
                    Múltiplos fatores de risco vascular associados. Se sentir dor na panturrilha ou inchaço assimétrico, consulte um cirurgião vascular com prioridade.
                  </p>
                </div>
              )}

              <div className="mt-4 flex flex-col sm:flex-row items-center justify-center gap-2.5">
                <a
                  href={`https://wa.me/5571999159975?text=${encodeURIComponent(
                    `Olá Dr. Herlon Moura, realizei a Calculadora de TVP no site e meu resultado foi ${
                      state.riskCategory === 'low'
                        ? 'Baixo Risco'
                        : state.riskCategory === 'moderate'
                        ? 'Risco Moderado'
                        : 'Alto Risco'
                    } (${state.riskScore} pts). Gostaria de agendar uma consulta vascular.`
                  )}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-xl bg-secondary px-5 py-2.5 text-xs sm:text-sm font-bold text-secondary-foreground shadow-lg shadow-secondary/50 transition-all hover:bg-secondary-hover active:scale-95"
                >
                  <MessageCircle className="h-4 w-4" />
                  <span>Agendar no WhatsApp com Dr. Herlon</span>
                </a>
                <button
                  onClick={handleReset}
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-1.5 rounded-xl border border-border/50 bg-muted/20 px-4 py-2.5 text-xs font-semibold text-muted-foreground hover:bg-muted/40 hover:text-foreground"
                >
                  <RotateCcw className="h-3.5 w-3.5" />
                  <span>Refazer Teste</span>
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {state.currentStep > 0 && state.currentStep <= TOTAL_STEPS && (
        <div className="mt-4 flex items-center justify-between border-t border-border/60 pt-3">
          <button
            onClick={handleBack}
            className="inline-flex items-center gap-1 text-xs font-semibold text-muted-foreground transition-colors hover:text-foreground"
          >
            <ChevronLeft className="h-4 w-4" />
            <span>Voltar</span>
          </button>
          <button
            onClick={handleNext}
            disabled={!isStepValid()}
            className="inline-flex items-center gap-1.5 rounded-xl bg-primary px-5 py-2 text-xs font-bold text-primary-foreground transition-all hover:bg-primary-hover hover:text-primary disabled:opacity-40 disabled:cursor-not-allowed"
          >
            <span>{state.currentStep === TOTAL_STEPS ? 'Ver Resultado' : state.currentStep === CONTACT_STEP ? 'Avançar' : 'Próxima'}</span>
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>
      )}
    </div>
  );
}
