'use client';

import { useState } from 'react';
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
} from 'lucide-react';
import { Button } from './Button';
import { Card } from './Card';

export interface DVTCalculatorState {
  currentStep: number;
  direction: number;
  responses: {
    ageRange: string;
    immobilityDuration: string;
    recentSurgery: boolean | null;
    familyHistory: boolean | null;
    pregnancyStatus: string;
    additionalFactors: string[];
  };
  riskScore: number | null;
  riskCategory: 'low' | 'moderate' | 'high' | 'critical' | null;
}

const RISK_FACTOR_WEIGHTS = {
  ageRange: {
    '18-40': 0,
    '41-60': 1,
    '61-80': 2,
    '80+': 3,
  },
  immobilityDuration: {
    '0-3': 0,
    '4-7': 1,
    '8-14': 2,
    '15+': 3,
  },
  recentSurgery: { true: 2, false: 0 },
  familyHistory: { true: 1, false: 0 },
  pregnancyStatus: {
    'not-applicable': 0,
    'not-pregnant': 0,
    'pregnant': 2,
    'postpartum-6weeks': 2,
    'postpartum-6months': 1,
  },
};

const ADDITIONAL_FACTORS = [
  { id: 'hormonal', label: 'Uso de anticoncepcional oral ou reposição hormonal (TRH)' },
  { id: 'smoking', label: 'Tabagismo ativo (fumante diário)' },
  { id: 'obesity', label: 'Obesidade ou sobrepeso significativo (IMC > 30)' },
  { id: 'cancer', label: 'Histórico oncológico ativo ou tratamento recente de câncer' },
  { id: 'heart', label: 'Insuficiência cardíaca ou histórico de infarto prévio' },
  { id: 'varicose', label: 'Varizes volumosas, inchaço crônico ou queimação nas pernas' },
];

export function DVTRiskCalculator({ className = '' }: { className?: string }) {
  const [state, setState] = useState<DVTCalculatorState>({
    currentStep: 0,
    direction: 1,
    responses: {
      ageRange: '',
      immobilityDuration: '',
      recentSurgery: null,
      familyHistory: null,
      pregnancyStatus: '',
      additionalFactors: [],
    },
    riskScore: null,
    riskCategory: null,
  });

  const computeRiskScore = (
    responses: DVTCalculatorState['responses']
  ): { score: number; category: 'low' | 'moderate' | 'high' | 'critical' } => {
    let score = 0;

    if (responses.ageRange) {
      score +=
        RISK_FACTOR_WEIGHTS.ageRange[
          responses.ageRange as keyof typeof RISK_FACTOR_WEIGHTS.ageRange
        ] || 0;
    }
    if (responses.immobilityDuration) {
      score +=
        RISK_FACTOR_WEIGHTS.immobilityDuration[
          responses.immobilityDuration as keyof typeof RISK_FACTOR_WEIGHTS.immobilityDuration
        ] || 0;
    }
    if (responses.recentSurgery !== null) {
      score += RISK_FACTOR_WEIGHTS.recentSurgery[responses.recentSurgery ? 'true' : 'false'];
    }
    if (responses.familyHistory !== null) {
      score += RISK_FACTOR_WEIGHTS.familyHistory[responses.familyHistory ? 'true' : 'false'];
    }
    if (responses.pregnancyStatus) {
      score +=
        RISK_FACTOR_WEIGHTS.pregnancyStatus[
          responses.pregnancyStatus as keyof typeof RISK_FACTOR_WEIGHTS.pregnancyStatus
        ] || 0;
    }
    score += responses.additionalFactors.length;

    let category: 'low' | 'moderate' | 'high' | 'critical' = 'low';
    if (score >= 9) category = 'critical';
    else if (score >= 6) category = 'high';
    else if (score >= 3) category = 'moderate';

    return { score, category };
  };

  const handleNext = () => {
    if (state.currentStep < 6) {
      setState((prev) => ({
        ...prev,
        direction: 1,
        currentStep: prev.currentStep + 1,
      }));
    } else {
      const { score, category } = computeRiskScore(state.responses);
      setState((prev) => ({
        ...prev,
        direction: 1,
        currentStep: 7,
        riskScore: score,
        riskCategory: category,
      }));
    }
  };

  const handleBack = () => {
    if (state.currentStep > 0) {
      setState((prev) => ({
        ...prev,
        direction: -1,
        currentStep: prev.currentStep - 1,
      }));
    }
  };

  const handleResponseChange = (field: keyof DVTCalculatorState['responses'], value: any) => {
    setState((prev) => ({
      ...prev,
      responses: {
        ...prev.responses,
        [field]: value,
      },
    }));
  };

  const handleAdditionalFactorToggle = (factorLabel: string) => {
    setState((prev) => ({
      ...prev,
      responses: {
        ...prev.responses,
        additionalFactors: prev.responses.additionalFactors.includes(factorLabel)
          ? prev.responses.additionalFactors.filter((f) => f !== factorLabel)
          : [...prev.responses.additionalFactors, factorLabel],
      },
    }));
  };

  const handleReset = () => {
    setState({
      currentStep: 0,
      direction: -1,
      responses: {
        ageRange: '',
        immobilityDuration: '',
        recentSurgery: null,
        familyHistory: null,
        pregnancyStatus: '',
        additionalFactors: [],
      },
      riskScore: null,
      riskCategory: null,
    });
  };

  const getRiskBadgeDetails = (category: string) => {
    switch (category) {
      case 'low':
        return {
          title: 'Baixo Risco',
          subtitle: 'Probabilidade reduzida de trombose venosa',
          color: 'bg-emerald-950/70 text-emerald-300 border-emerald-500/40',
          textColor: 'text-emerald-400',
          recommendation:
            'Seu risco calculado é baixo. Mantenha hábitos de vida saudáveis, hidratação adequada e pausas para caminhada durante viagens longas.',
        };
      case 'moderate':
        return {
          title: 'Risco Moderado',
          subtitle: 'Fatores combinados exigem monitoramento preventivo',
          color: 'bg-amber-950/70 text-amber-300 border-amber-500/40',
          textColor: 'text-amber-400',
          recommendation:
            'Você apresenta fatores de risco que merecem atenção clínica. Recomendamos uma consulta com o Dr. Herlon Moura para mapeamento com Eco-Doppler e orientações preventivas personalizadas.',
        };
      case 'high':
        return {
          title: 'Alto Risco',
          subtitle: 'Indicação clara para avaliação vascular especializada',
          color: 'bg-orange-950/70 text-orange-300 border-orange-500/40',
          textColor: 'text-orange-400',
          recommendation:
            'Atenção: seus fatores indicam probabilidade elevada de trombose venosa profunda. É altamente recomendado agendar uma consulta com o Dr. Herlon Moura para avaliação e profilaxia vascular o quanto antes.',
        };
      case 'critical':
        return {
          title: 'Risco Crítico / Alerta',
          subtitle: 'Múltiplos fatores de risco graves associados',
          color: 'bg-rose-950/80 text-rose-200 border-rose-500/50',
          textColor: 'text-rose-400',
          recommendation:
            'Urgência preventiva: se você apresentar dor súbita na perna, panturrilha empastada, inchaço assimétrico ou falta de ar, procure atendimento de emergência ou contate o consultório imediatamente via WhatsApp.',
        };
      default:
        return {
          title: 'Avaliação Concluída',
          subtitle: '',
          color: 'bg-slate-800 text-slate-100 border-slate-700',
          textColor: 'text-slate-100',
          recommendation: '',
        };
    }
  };

  const progressPercentage = ((state.currentStep + 1) / 8) * 100;

  const slideVariants = {
    enter: (direction: number) => ({
      x: direction > 0 ? 30 : -30,
      opacity: 0,
    }),
    center: {
      x: 0,
      opacity: 1,
      transition: { duration: 0.3, ease: 'easeOut' },
    },
    exit: (direction: number) => ({
      x: direction > 0 ? -30 : 30,
      opacity: 0,
      transition: { duration: 0.2, ease: 'easeIn' },
    }),
  };

  const whatsappMessage = encodeURIComponent(
    `Olá Dr. Herlon Moura, realizei a Calculadora de Risco de TVP no seu site. Meu resultado indicou Risco ${
      state.riskCategory ? state.riskCategory.toUpperCase() : 'CALCULADO'
    } (Pontuação: ${state.riskScore || 0}). Gostaria de agendar uma consulta para avaliação vascular.`
  );

  return (
    <div className={`w-full max-w-3xl mx-auto ${className}`}>
      <div className="relative overflow-hidden rounded-3xl border border-surgical-teal/25 bg-slate-900/90 p-6 sm:p-10 shadow-2xl backdrop-blur-xl">
        {/* Decorative Top Accent */}
        <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-surgical-teal via-emerald-400 to-teal-600" />

        {/* Progress & Header */}
        <div className="mb-8">
          <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
            <div className="flex items-center gap-2.5">
              <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-surgical-teal/20 text-surgical-teal font-bold text-sm">
                <HeartPulse className="h-5 w-5" />
              </span>
              <div>
                <h2 className="text-lg font-bold text-white sm:text-xl">
                  Calculadora de Risco de TVP
                </h2>
                <p className="text-xs text-slate-400">Trombose Venosa Profunda • Protocolo Clínico</p>
              </div>
            </div>
            <span className="rounded-full bg-slate-800 px-3 py-1 text-xs font-semibold text-teal-300 border border-teal-500/20">
              {state.currentStep === 7 ? 'Resultado' : `Etapa ${state.currentStep + 1} de 7`}
            </span>
          </div>

          {/* Animated Progress Bar */}
          <div className="relative h-2 w-full overflow-hidden rounded-full bg-slate-800">
            <motion.div
              className="h-full bg-gradient-to-r from-surgical-teal to-emerald-400"
              initial={{ width: 0 }}
              animate={{ width: `${progressPercentage}%` }}
              transition={{ duration: 0.4, ease: 'easeOut' }}
            />
          </div>
        </div>

        {/* Form Container with Animated Transitions */}
        <AnimatePresence custom={state.direction} mode="wait">
          {/* Step 0: Introdução */}
          {state.currentStep === 0 && (
            <motion.div
              key="step-0"
              custom={state.direction}
              variants={slideVariants}
              initial="enter"
              animate="center"
              exit="exit"
              className="space-y-6"
            >
              <div>
                <span className="inline-block rounded-md bg-teal-950/60 px-2.5 py-1 text-xs font-medium text-teal-400 border border-teal-800/40 mb-3">
                  Autoavaliação Rápida (2 minutos)
                </span>
                <h3 className="text-2xl font-bold text-white sm:text-3xl leading-snug">
                  Descubra seu nível de risco para Trombose Venosa Profunda (TVP)
                </h3>
                <p className="mt-3 text-slate-300 leading-relaxed text-sm sm:text-base">
                  A TVP ocorre quando um coágulo sanguíneo se forma em veias profundas, frequentemente nas pernas, podendo causar complicações graves como embolia pulmonar. Responda a 6 perguntas breves baseadas em critérios clínicos validados.
                </p>
              </div>

              <div className="rounded-xl border border-surgical-teal/20 bg-slate-950/50 p-4 text-xs text-slate-300 leading-relaxed">
                <div className="flex items-start gap-2.5">
                  <Shield className="h-5 w-5 text-surgical-teal flex-shrink-0 mt-0.5" />
                  <div>
                    <strong className="text-white block mb-0.5">Privacidade e Sigilo Médico:</strong>
                    Suas respostas são processadas em tempo real exclusivamente no seu navegador. Nenhum dado de saúde é armazenado ou enviado a servidores terceiros. Esta ferramenta é educativa e não substitui a consulta médica.
                  </div>
                </div>
              </div>

              <button
                onClick={handleNext}
                className="w-full inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-surgical-teal to-emerald-500 px-6 py-4 text-base font-bold text-slate-950 shadow-lg shadow-teal-900/30 transition-all hover:opacity-95 hover:shadow-teal-700/40 active:scale-[0.99]"
              >
                <span>Iniciar Avaliação de Risco</span>
                <ChevronRight className="h-5 w-5" />
              </button>
            </motion.div>
          )}

          {/* Step 1: Faixa Etária */}
          {state.currentStep === 1 && (
            <motion.div
              key="step-1"
              custom={state.direction}
              variants={slideVariants}
              initial="enter"
              animate="center"
              exit="exit"
              className="space-y-6"
            >
              <div>
                <h3 className="text-xl font-bold text-white sm:text-2xl">
                  Qual é a sua faixa etária?
                </h3>
                <p className="mt-1 text-sm text-slate-400">
                  O risco de eventos tromboembólicos aumenta progressivamente com a idade.
                </p>
              </div>

              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                {[
                  { value: '18-40', label: '18 a 40 anos', desc: 'Risco basal jovem' },
                  { value: '41-60', label: '41 a 60 anos', desc: 'Início da elevação do risco' },
                  { value: '61-80', label: '61 a 80 anos', desc: 'Risco moderadamente elevado' },
                  { value: '80+', label: 'Mais de 80 anos', desc: 'Alta suscetibilidade vascular' },
                ].map((opt) => {
                  const isSelected = state.responses.ageRange === opt.value;
                  return (
                    <label
                      key={opt.value}
                      onClick={() => handleResponseChange('ageRange', opt.value)}
                      className={`flex cursor-pointer flex-col rounded-xl border p-4 transition-all ${
                        isSelected
                          ? 'border-surgical-teal bg-surgical-teal/15 text-white shadow-md shadow-surgical-teal/20 ring-1 ring-surgical-teal'
                          : 'border-slate-700 bg-slate-800/60 text-slate-200 hover:border-slate-500 hover:bg-slate-800'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-semibold text-base">{opt.label}</span>
                        <span
                          className={`h-4 w-4 rounded-full border flex items-center justify-center ${
                            isSelected ? 'border-surgical-teal bg-surgical-teal' : 'border-slate-500'
                          }`}
                        >
                          {isSelected && <span className="h-1.5 w-1.5 rounded-full bg-slate-950" />}
                        </span>
                      </div>
                      <span className="mt-1 text-xs text-slate-400">{opt.desc}</span>
                    </label>
                  );
                })}
              </div>

              <div className="flex gap-4 pt-4 border-t border-slate-800">
                <Button onClick={handleBack} variant="secondary" className="flex-1">
                  <ChevronLeft className="w-4 h-4 mr-1" />
                  Voltar
                </Button>
                <Button onClick={handleNext} disabled={!state.responses.ageRange} className="flex-1">
                  Avançar
                  <ChevronRight className="w-4 h-4 ml-1" />
                </Button>
              </div>
            </motion.div>
          )}

          {/* Step 2: Tempo de Imobilidade */}
          {state.currentStep === 2 && (
            <motion.div
              key="step-2"
              custom={state.direction}
              variants={slideVariants}
              initial="enter"
              animate="center"
              exit="exit"
              className="space-y-6"
            >
              <div>
                <h3 className="text-xl font-bold text-white sm:text-2xl">
                  Esteve em repouso prolongado ou imobilidade recentemente?
                </h3>
                <p className="mt-1 text-sm text-slate-400">
                  Considere internação hospitalar, repouso no leito, gesso/tala ou viagens aéreas longas.
                </p>
              </div>

              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                {[
                  { value: '0-3', label: '0 a 3 dias', desc: 'Atividade normal ou repouso breve' },
                  { value: '4-7', label: '4 a 7 dias', desc: 'Confinamento domiciliar moderado' },
                  { value: '8-14', label: '8 a 14 dias', desc: 'Imobilidade prolongada' },
                  { value: '15+', label: 'Mais de 15 dias', desc: 'Repouso contínuo acamado' },
                ].map((opt) => {
                  const isSelected = state.responses.immobilityDuration === opt.value;
                  return (
                    <label
                      key={opt.value}
                      onClick={() => handleResponseChange('immobilityDuration', opt.value)}
                      className={`flex cursor-pointer flex-col rounded-xl border p-4 transition-all ${
                        isSelected
                          ? 'border-surgical-teal bg-surgical-teal/15 text-white shadow-md ring-1 ring-surgical-teal'
                          : 'border-slate-700 bg-slate-800/60 text-slate-200 hover:border-slate-500 hover:bg-slate-800'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-semibold text-base">{opt.label}</span>
                        <span
                          className={`h-4 w-4 rounded-full border flex items-center justify-center ${
                            isSelected ? 'border-surgical-teal bg-surgical-teal' : 'border-slate-500'
                          }`}
                        >
                          {isSelected && <span className="h-1.5 w-1.5 rounded-full bg-slate-950" />}
                        </span>
                      </div>
                      <span className="mt-1 text-xs text-slate-400">{opt.desc}</span>
                    </label>
                  );
                })}
              </div>

              <div className="flex gap-4 pt-4 border-t border-slate-800">
                <Button onClick={handleBack} variant="secondary" className="flex-1">
                  <ChevronLeft className="w-4 h-4 mr-1" />
                  Voltar
                </Button>
                <Button onClick={handleNext} disabled={!state.responses.immobilityDuration} className="flex-1">
                  Avançar
                  <ChevronRight className="w-4 h-4 ml-1" />
                </Button>
              </div>
            </motion.div>
          )}

          {/* Step 3: Cirurgia Recente */}
          {state.currentStep === 3 && (
            <motion.div
              key="step-3"
              custom={state.direction}
              variants={slideVariants}
              initial="enter"
              animate="center"
              exit="exit"
              className="space-y-6"
            >
              <div>
                <h3 className="text-xl font-bold text-white sm:text-2xl">
                  Realizou cirurgia de médio ou grande porte nos últimos 3 meses?
                </h3>
                <p className="mt-1 text-sm text-slate-400">
                  Cirurgias ortopédicas (prótese de joelho/quadril), abdominais, pélvicas ou bariátricas são especialmente relevantes.
                </p>
              </div>

              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                {[
                  { value: true, label: 'Sim, realizei cirurgia recente', desc: 'Intervenção cirúrgica nos últimos 90 dias' },
                  { value: false, label: 'Não, nenhuma cirurgia', desc: 'Sem procedimentos cirúrgicos no período' },
                ].map((opt) => {
                  const isSelected = state.responses.recentSurgery === opt.value;
                  return (
                    <label
                      key={String(opt.value)}
                      onClick={() => handleResponseChange('recentSurgery', opt.value)}
                      className={`flex cursor-pointer flex-col rounded-xl border p-4 transition-all ${
                        isSelected
                          ? 'border-surgical-teal bg-surgical-teal/15 text-white shadow-md ring-1 ring-surgical-teal'
                          : 'border-slate-700 bg-slate-800/60 text-slate-200 hover:border-slate-500 hover:bg-slate-800'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-semibold text-base">{opt.label}</span>
                        <span
                          className={`h-4 w-4 rounded-full border flex items-center justify-center ${
                            isSelected ? 'border-surgical-teal bg-surgical-teal' : 'border-slate-500'
                          }`}
                        >
                          {isSelected && <span className="h-1.5 w-1.5 rounded-full bg-slate-950" />}
                        </span>
                      </div>
                      <span className="mt-1 text-xs text-slate-400">{opt.desc}</span>
                    </label>
                  );
                })}
              </div>

              <div className="flex gap-4 pt-4 border-t border-slate-800">
                <Button onClick={handleBack} variant="secondary" className="flex-1">
                  <ChevronLeft className="w-4 h-4 mr-1" />
                  Voltar
                </Button>
                <Button onClick={handleNext} disabled={state.responses.recentSurgery === null} className="flex-1">
                  Avançar
                  <ChevronRight className="w-4 h-4 ml-1" />
                </Button>
              </div>
            </motion.div>
          )}

          {/* Step 4: Histórico Familiar */}
          {state.currentStep === 4 && (
            <motion.div
              key="step-4"
              custom={state.direction}
              variants={slideVariants}
              initial="enter"
              animate="center"
              exit="exit"
              className="space-y-6"
            >
              <div>
                <h3 className="text-xl font-bold text-white sm:text-2xl">
                  Existe histórico familiar direto de Trombose ou Embolia?
                </h3>
                <p className="mt-1 text-sm text-slate-400">
                  Pais, irmãos ou filhos diagnosticados com TVP, embolia pulmonar ou trombofilia congênita.
                </p>
              </div>

              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                {[
                  { value: true, label: 'Sim, há histórico familiar', desc: 'Parentes de primeiro grau com histórico' },
                  { value: false, label: 'Não ou desconheço', desc: 'Sem episódios conhecidos na família direta' },
                ].map((opt) => {
                  const isSelected = state.responses.familyHistory === opt.value;
                  return (
                    <label
                      key={String(opt.value)}
                      onClick={() => handleResponseChange('familyHistory', opt.value)}
                      className={`flex cursor-pointer flex-col rounded-xl border p-4 transition-all ${
                        isSelected
                          ? 'border-surgical-teal bg-surgical-teal/15 text-white shadow-md ring-1 ring-surgical-teal'
                          : 'border-slate-700 bg-slate-800/60 text-slate-200 hover:border-slate-500 hover:bg-slate-800'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-semibold text-base">{opt.label}</span>
                        <span
                          className={`h-4 w-4 rounded-full border flex items-center justify-center ${
                            isSelected ? 'border-surgical-teal bg-surgical-teal' : 'border-slate-500'
                          }`}
                        >
                          {isSelected && <span className="h-1.5 w-1.5 rounded-full bg-slate-950" />}
                        </span>
                      </div>
                      <span className="mt-1 text-xs text-slate-400">{opt.desc}</span>
                    </label>
                  );
                })}
              </div>

              <div className="flex gap-4 pt-4 border-t border-slate-800">
                <Button onClick={handleBack} variant="secondary" className="flex-1">
                  <ChevronLeft className="w-4 h-4 mr-1" />
                  Voltar
                </Button>
                <Button onClick={handleNext} disabled={state.responses.familyHistory === null} className="flex-1">
                  Avançar
                  <ChevronRight className="w-4 h-4 ml-1" />
                </Button>
              </div>
            </motion.div>
          )}

          {/* Step 5: Gestação / Puerpério */}
          {state.currentStep === 5 && (
            <motion.div
              key="step-5"
              custom={state.direction}
              variants={slideVariants}
              initial="enter"
              animate="center"
              exit="exit"
              className="space-y-6"
            >
              <div>
                <h3 className="text-xl font-bold text-white sm:text-2xl">
                  Condição gestacional ou puerpério
                </h3>
                <p className="mt-1 text-sm text-slate-400">
                  Alterações hormonais e compressão vascular elevam naturalmente a hipercoagulabilidade.
                </p>
              </div>

              <div className="space-y-2.5">
                {[
                  { value: 'not-applicable', label: 'Não se aplica (homens ou sem gestação)' },
                  { value: 'not-pregnant', label: 'Não gestante no momento' },
                  { value: 'pregnant', label: 'Gestante (qualquer trimestre)' },
                  { value: 'postpartum-6weeks', label: 'Pós-parto recente (até 6 semanas)' },
                  { value: 'postpartum-6months', label: 'Pós-parto (6 semanas a 6 meses)' },
                ].map((opt) => {
                  const isSelected = state.responses.pregnancyStatus === opt.value;
                  return (
                    <label
                      key={opt.value}
                      onClick={() => handleResponseChange('pregnancyStatus', opt.value)}
                      className={`flex cursor-pointer items-center justify-between rounded-xl border p-3.5 transition-all ${
                        isSelected
                          ? 'border-surgical-teal bg-surgical-teal/15 text-white shadow-md ring-1 ring-surgical-teal'
                          : 'border-slate-700 bg-slate-800/60 text-slate-200 hover:border-slate-500 hover:bg-slate-800'
                      }`}
                    >
                      <span className="font-medium text-sm sm:text-base">{opt.label}</span>
                      <span
                        className={`h-4 w-4 rounded-full border flex items-center justify-center ${
                          isSelected ? 'border-surgical-teal bg-surgical-teal' : 'border-slate-500'
                        }`}
                      >
                        {isSelected && <span className="h-1.5 w-1.5 rounded-full bg-slate-950" />}
                      </span>
                    </label>
                  );
                })}
              </div>

              <div className="flex gap-4 pt-4 border-t border-slate-800">
                <Button onClick={handleBack} variant="secondary" className="flex-1">
                  <ChevronLeft className="w-4 h-4 mr-1" />
                  Voltar
                </Button>
                <Button onClick={handleNext} disabled={!state.responses.pregnancyStatus} className="flex-1">
                  Avançar
                  <ChevronRight className="w-4 h-4 ml-1" />
                </Button>
              </div>
            </motion.div>
          )}

          {/* Step 6: Fatores Adicionais */}
          {state.currentStep === 6 && (
            <motion.div
              key="step-6"
              custom={state.direction}
              variants={slideVariants}
              initial="enter"
              animate="center"
              exit="exit"
              className="space-y-6"
            >
              <div>
                <h3 className="text-xl font-bold text-white sm:text-2xl">
                  Selecione os fatores que se aplicam a você:
                </h3>
                <p className="mt-1 text-sm text-slate-400">
                  Marque todas as opções correspondentes (pode selecionar mais de uma ou nenhuma).
                </p>
              </div>

              <div className="space-y-2.5">
                {ADDITIONAL_FACTORS.map((factor) => {
                  const isChecked = state.responses.additionalFactors.includes(factor.label);
                  return (
                    <label
                      key={factor.id}
                      onClick={() => handleAdditionalFactorToggle(factor.label)}
                      className={`flex cursor-pointer items-center gap-3 rounded-xl border p-3.5 transition-all ${
                        isChecked
                          ? 'border-surgical-teal bg-surgical-teal/15 text-white shadow-md ring-1 ring-surgical-teal'
                          : 'border-slate-700 bg-slate-800/60 text-slate-200 hover:border-slate-500 hover:bg-slate-800'
                      }`}
                    >
                      <input
                        type="checkbox"
                        checked={isChecked}
                        onChange={() => {}}
                        className="h-4 w-4 rounded border-slate-600 text-surgical-teal focus:ring-surgical-teal"
                      />
                      <span className="text-sm font-medium leading-relaxed">{factor.label}</span>
                    </label>
                  );
                })}
              </div>

              <div className="flex gap-4 pt-4 border-t border-slate-800">
                <Button onClick={handleBack} variant="secondary" className="flex-1">
                  <ChevronLeft className="w-4 h-4 mr-1" />
                  Voltar
                </Button>
                <Button onClick={handleNext} className="flex-1 bg-gradient-to-r from-surgical-teal to-emerald-500 text-slate-950 font-bold">
                  Calcular Meu Risco
                  <Activity className="w-4 h-4 ml-1.5" />
                </Button>
              </div>
            </motion.div>
          )}

          {/* Step 7: Resultado Final */}
          {state.currentStep === 7 && state.riskCategory && (
            <motion.div
              key="step-7"
              custom={state.direction}
              variants={slideVariants}
              initial="enter"
              animate="center"
              exit="exit"
              className="space-y-6"
            >
              {(() => {
                const details = getRiskBadgeDetails(state.riskCategory);
                const isUrgent = state.riskCategory === 'high' || state.riskCategory === 'critical';

                return (
                  <>
                    {/* Result Header Badge */}
                    <div className={`rounded-2xl border p-6 sm:p-8 ${details.color}`}>
                      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                        <div className="flex items-center gap-4">
                          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-black/30 backdrop-blur-md">
                            {isUrgent ? (
                              <AlertTriangle className={`h-8 w-8 ${details.textColor} animate-bounce`} />
                            ) : (
                              <CheckCircle2 className={`h-8 w-8 ${details.textColor}`} />
                            )}
                          </div>
                          <div>
                            <span className="text-xs font-semibold uppercase tracking-wider opacity-80">
                              Resultado Clínico Estimado
                            </span>
                            <h3 className={`text-2xl sm:text-3xl font-black ${details.textColor}`}>
                              {details.title}
                            </h3>
                            <p className="text-xs sm:text-sm opacity-90 mt-0.5">{details.subtitle}</p>
                          </div>
                        </div>

                        <div className="rounded-xl bg-black/40 px-4 py-3 text-right">
                          <span className="block text-xs uppercase tracking-wider text-slate-400">
                            Score Clínico
                          </span>
                          <span className="text-2xl font-black text-white">
                            {state.riskScore} <span className="text-sm font-normal text-slate-400">pts</span>
                          </span>
                        </div>
                      </div>

                      {/* Recommendation text */}
                      <div className="mt-5 rounded-xl bg-black/30 p-4 border border-white/10">
                        <p className="text-sm sm:text-base leading-relaxed text-slate-100">
                          {details.recommendation}
                        </p>
                      </div>
                    </div>

                    {/* Educational Guidance */}
                    <div className="rounded-xl border border-slate-800 bg-slate-950/60 p-5">
                      <h4 className="font-semibold text-white text-sm mb-3 flex items-center gap-2">
                        <Shield className="h-4 w-4 text-surgical-teal" />
                        Sinais de Alerta para Trombose (TVP):
                      </h4>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 text-xs text-slate-300">
                        <div className="flex items-start gap-2">
                          <span className="text-rose-400 font-bold">•</span>
                          <span>Inchaço súbito ou progressivo em apenas uma das pernas</span>
                        </div>
                        <div className="flex items-start gap-2">
                          <span className="text-rose-400 font-bold">•</span>
                          <span>Dor ou sensação de queimação na panturrilha ao pisar</span>
                        </div>
                        <div className="flex items-start gap-2">
                          <span className="text-rose-400 font-bold">•</span>
                          <span>Pele avermelhada, arroxeada ou com temperatura aumentada</span>
                        </div>
                        <div className="flex items-start gap-2">
                          <span className="text-rose-400 font-bold">•</span>
                          <span>Falta de ar súbita ou dor no peito (alerta de embolia)</span>
                        </div>
                      </div>
                    </div>

                    {/* WhatsApp Action Buttons */}
                    <div className="flex flex-col gap-3 pt-2">
                      <a
                        href={`https://wa.me/5571999159975?text=${whatsappMessage}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center justify-center gap-2.5 rounded-xl bg-emerald-600 px-6 py-4 text-base font-bold text-white shadow-xl shadow-emerald-950/40 transition-all hover:bg-emerald-500 hover:shadow-emerald-700/50"
                      >
                        <MessageCircle className="h-5 w-5" />
                        <span>Falar com Dr. Herlon Moura sobre este Resultado</span>
                      </a>

                      <button
                        onClick={handleReset}
                        className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-700 bg-slate-800/80 px-4 py-3 text-sm font-semibold text-slate-300 transition-colors hover:bg-slate-700 hover:text-white"
                      >
                        <RotateCcw className="h-4 w-4" />
                        <span>Refazer Avaliação</span>
                      </button>
                    </div>
                  </>
                );
              })()}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
