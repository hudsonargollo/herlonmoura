'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import {
  Header,
  HeroSection,
  Footer,
  DVTRiskCalculator,
  DVTModal,
} from '@/components';
import {
  Activity,
  CheckCircle2,
  Stethoscope,
  Sparkles,
  Waves,
  Zap,
  ShieldCheck,
  ArrowRight,
  HeartPulse,
  Award,
  Clock,
  Check,
  MessageCircle,
} from 'lucide-react';

export default function Home() {
  const [isCalculatorModalOpen, setIsCalculatorModalOpen] = useState(false);

  const PROCEDURES = [
    {
      title: 'Doppler Vascular',
      subtitle: 'Exame de Ultrassom do Fluxo Sanguíneo',
      description:
        'O Doppler vascular é um exame de ultrassom que analisa o fluxo sanguíneo em artérias e veias. É indolor, não invasivo e pode ser realizado em diversas partes do corpo.',
      icon: Waves,
      tag: 'Diagnóstico',
    },
    {
      title: 'Tratamento de Varizes com Laser',
      subtitle: 'Procedimento Minimamente Invasivo',
      description:
        'É um procedimento minimamente invasivo que utiliza a energia do laser para destruir as veias doentes.',
      icon: Zap,
      tag: 'Laser',
    },
    {
      title: 'Escleroterapia com Espuma Densa',
      subtitle: 'Tratamento em Consultório',
      description:
        'Tratamento para varizes e pequenos vasinhos que consiste na injeção de uma espuma na veia. O procedimento é minimamente invasivo e pode ser realizado em consultório.',
      icon: Sparkles,
      tag: 'Espuma',
    },
    {
      title: 'Microcirurgia de Varizes',
      subtitle: 'Flebectomia Ambulatorial',
      description:
        'Procedimento que remove varizes pequenas e médias por meio de pequenas incisões. É um procedimento minimamente invasivo que pode ser realizado no consultório. É também conhecida como flebectomia ambulatória.',
      icon: Activity,
      tag: 'Cirúrgico',
    },
    {
      title: 'Implante de Cateter Port-o-Cath',
      subtitle: 'Acesso para Quimioterapia',
      description:
        'O cateter Port-a-Cath é um dispositivo totalmente implantável que facilita a aplicação de quimioterapia e outros tratamentos.',
      icon: ShieldCheck,
      tag: 'Oncológico',
    },
    {
      title: 'Implante de Cateter Permcath',
      subtitle: 'Acesso para Hemodiálise',
      description:
        'O cateter Permcath é um cateter de longa permanência que é implantado em uma veia profunda do paciente para realizar hemodiálise.',
      icon: Stethoscope,
      tag: 'Vascular',
    },
    {
      title: 'Fístula Arteriovenosa (FAV)',
      subtitle: 'Acesso para Hemodiálise',
      description:
        'A confecção de uma fístula arteriovenosa (FAV) para hemodiálise é um procedimento cirúrgico que une uma artéria a uma veia. É o melhor acesso vascular para hemodiálise.',
      icon: Activity,
      tag: 'Cirúrgico',
    },
  ];

  const LEG_SYMPTOMS = [
    'Dor e/ou inchaço constante nos braços e pernas',
    'Formigamento e/ou dormência nas mãos ou nos pés',
    'Sensação de peso nas pernas',
    'Cãibras recorrentes',
    'Cansaço sem motivo aparente',
    'Dificuldade para caminhar',
    'Aparecimento de veias azuladas ou arroxeadas',
    'Sensação de queimação nas pernas e pés',
  ];

  const NECK_SYMPTOMS = [
    'Dor no pescoço, geralmente intensa e unilateral',
    'Dor de cabeça súbita e intensa',
    'Perda repentina da visão de um dos olhos',
    'Dormência, perda da força e sensibilidade em um dos lados do corpo',
    'Distúrbios da fala ou da compreensão',
    'Alterações do equilíbrio',
    'Tonturas ou desequilíbrio',
    'Perda de audição',
  ];

  return (
    <main className="min-h-screen bg-dark-elevated text-slate-100">
      <Header onOpenCalculator={() => setIsCalculatorModalOpen(true)} />

      {/* Hero Section with Doctor Photo & Real Branding */}
      <HeroSection
        headline="Dr. Herlon Moura — Angiologista e Cirurgião Vascular em Salvador"
        subheadline="Angiologista é um médico especialista em diagnosticar e tratar doenças que afetam os vasos sanguíneos e o sistema linfático. Ele atua no sistema circulatório de braços, pernas, tronco e pescoço."
        onOpenCalculator={() => setIsCalculatorModalOpen(true)}
      />

      {/* Trust & Credibility Ticker Bar */}
      <section className="border-y border-surgical-teal/20 bg-slate-950/80 py-6 backdrop-blur-md">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-4 sm:gap-6 text-center">
            <div className="rounded-xl border border-white/5 bg-slate-900/40 p-4">
              <span className="block text-2xl sm:text-3xl font-black text-surgical-teal">15+</span>
              <span className="mt-1 block text-xs sm:text-sm text-slate-300">Anos de Prática Clínica</span>
            </div>
            <div className="rounded-xl border border-white/5 bg-slate-900/40 p-4">
              <span className="block text-2xl sm:text-3xl font-black text-emerald-400">UFBA</span>
              <span className="mt-1 block text-xs sm:text-sm text-slate-300">Formação Médica de Elite</span>
            </div>
            <div className="rounded-xl border border-white/5 bg-slate-900/40 p-4">
              <span className="block text-2xl sm:text-3xl font-black text-surgical-teal">RQE</span>
              <span className="mt-1 block text-xs sm:text-sm text-slate-300">Nº 19791 / 22436</span>
            </div>
            <div className="rounded-xl border border-white/5 bg-slate-900/40 p-4">
              <span className="block text-2xl sm:text-3xl font-black text-emerald-400">Graça</span>
              <span className="mt-1 block text-xs sm:text-sm text-slate-300">Consultório em Salvador</span>
            </div>
          </div>
        </div>
      </section>

      {/* Why Choose — matches WordPress "Por que escolher meu atendimento?" */}
      <section className="py-16 sm:py-24 bg-gradient-to-b from-dark-elevated to-slate-950">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-3xl text-center">
            <span className="inline-block rounded-full border border-surgical-teal/30 bg-surgical-teal/10 px-3 py-1 text-xs font-semibold text-surgical-teal mb-3">
              Atendimento Humanizado & Alta Tecnologia
            </span>
            <h2 className="text-3xl font-extrabold sm:text-4xl text-white">
              Por que escolher meu atendimento?
            </h2>
          </div>

          <div className="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-6 transition-all hover:border-surgical-teal/50 hover:bg-slate-900">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-surgical-teal/15 text-surgical-teal mb-5">
                <CheckCircle2 className="h-6 w-6" />
              </div>
              <h3 className="text-lg font-bold text-white mb-2">Tratamentos Minimamente Invasivos</h3>
              <p className="text-sm text-slate-300 leading-relaxed">
                Tratamentos minimamente invasivos com recuperação rápida
              </p>
            </div>

            <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-6 transition-all hover:border-surgical-teal/50 hover:bg-slate-900">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-500/15 text-emerald-400 mb-5">
                <HeartPulse className="h-6 w-6" />
              </div>
              <h3 className="text-lg font-bold text-white mb-2">Consultas Humanizadas</h3>
              <p className="text-sm text-slate-300 leading-relaxed">
                Consultas humanizadas com foco no seu bem-estar
              </p>
            </div>

            <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-6 transition-all hover:border-surgical-teal/50 hover:bg-slate-900">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-surgical-teal/15 text-surgical-teal mb-5">
                <Waves className="h-6 w-6" />
              </div>
              <h3 className="text-lg font-bold text-white mb-2">Ambiente Confortável</h3>
              <p className="text-sm text-slate-300 leading-relaxed">
                Ambiente confortável e seguro em Salvador e região metropolitana
              </p>
            </div>

            <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-6 transition-all hover:border-surgical-teal/50 hover:bg-slate-900">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-500/15 text-emerald-400 mb-5">
                <ShieldCheck className="h-6 w-6" />
              </div>
              <h3 className="text-lg font-bold text-white mb-2">Convênios Selecionados</h3>
              <p className="text-sm text-slate-300 leading-relaxed">
                Atendimento particular e convênios selecionados
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Procedures Section */}
      <section id="procedimentos" className="py-16 sm:py-24 bg-slate-950">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-surgical-teal">
                Especialidades Cirúrgicas
              </span>
              <h2 className="mt-2 text-3xl font-extrabold sm:text-4xl text-white">
                Procedimentos e Tratamentos Especializados
              </h2>
              <p className="mt-3 text-base text-slate-300 max-w-2xl">
                Soluções vasculares modernas para eliminação de varizes, alívio de sintomas circulatórios e procedimentos de alta precisão.
              </p>
            </div>
            <a
              href="https://wa.me/5571999159975?text=Olá%20Dr.%20Herlon,%20gostaria%20de%20saber%20mais%20sobre%20os%20procedimentos."
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-xl bg-emerald-600 px-5 py-3 text-sm font-semibold text-white hover:bg-emerald-500 transition-colors flex-shrink-0"
            >
              <MessageCircle className="h-4 w-4" />
              Tirar Dúvidas no WhatsApp
            </a>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {PROCEDURES.map((proc) => {
              const Icon = proc.icon;
              return (
                <div
                  key={proc.title}
                  className="group relative flex flex-col justify-between rounded-2xl border border-slate-800 bg-slate-900/60 p-6 transition-all duration-300 hover:border-surgical-teal/40 hover:bg-slate-900/90 hover:shadow-xl hover:shadow-surgical-teal/5"
                >
                  <div>
                    <div className="flex items-center justify-between gap-3 mb-4">
                      <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-surgical-teal/15 text-surgical-teal transition-transform group-hover:scale-105">
                        <Icon className="h-5 w-5" />
                      </div>
                      <span className="rounded-full bg-slate-800/80 px-2.5 py-1 text-[11px] font-semibold text-teal-300 border border-teal-500/20">
                        {proc.tag}
                      </span>
                    </div>
                    <h3 className="text-xl font-bold text-white group-hover:text-surgical-teal transition-colors">
                      {proc.title}
                    </h3>
                    <div className="text-xs font-medium text-slate-400 mt-0.5 mb-3">
                      {proc.subtitle}
                    </div>
                    <p className="text-sm text-slate-300 leading-relaxed">
                      {proc.description}
                    </p>
                  </div>

                  <div className="mt-6 pt-4 border-t border-slate-800/60">
                    <a
                      href={`https://wa.me/5571999159975?text=${encodeURIComponent(
                        `Olá Dr. Herlon Moura, gostaria de agendar uma consulta sobre ${proc.title}.`
                      )}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 text-xs font-semibold text-surgical-teal hover:text-teal-300 transition-colors"
                    >
                      <span>Consultar disponibilidade</span>
                      <ArrowRight className="h-3.5 w-3.5" />
                    </a>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Symptom Mapping Section — matches WordPress structure */}
      <section id="sintomas" className="py-16 sm:py-24 bg-dark-elevated">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-3xl text-center mb-16">
            <span className="text-xs font-bold uppercase tracking-wider text-surgical-teal">
              Identificação de Sinais
            </span>
            <h2 className="mt-2 text-3xl font-extrabold sm:text-4xl text-white">
              Você apresenta algum destes sintomas circulatórios?
            </h2>
            <p className="mt-3 text-base text-slate-300">
              O diagnóstico vascular precoce previne complicações graves como úlceras de perna, trombose e insuficiência venosa crônica.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Braços e Pernas — matches WP exactly */}
            <div className="rounded-3xl border border-surgical-teal/30 bg-slate-900/80 p-8 shadow-xl">
              <div className="flex items-center gap-3 mb-6">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-surgical-teal/20 text-surgical-teal">
                  <Activity className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-white">Braços e Pernas</h3>
                  <p className="text-xs text-slate-400">Sintomas em membros superiores e inferiores</p>
                </div>
              </div>

              <p className="mb-4 text-sm font-semibold text-surgical-teal">
                Se você tem algum dos sintomas abaixo, podemos te ajudar.
              </p>

              <ul className="space-y-3">
                {LEG_SYMPTOMS.map((symp) => (
                  <li key={symp} className="flex items-start gap-3 text-sm text-slate-200">
                    <span className="flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full bg-surgical-teal/20 text-surgical-teal text-xs mt-0.5">
                      ✓
                    </span>
                    <span>{symp}</span>
                  </li>
                ))}
              </ul>

              <div className="mt-8 pt-6 border-t border-slate-800">
                <a
                  href="https://wa.me/5571999159975?text=Olá%20Dr.%20Herlon,%20sinto%20dores/inchaço%20nas%20pernas%20e%20gostaria%20de%20uma%20avaliação."
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-surgical-teal/20 border border-surgical-teal/40 px-5 py-3 text-sm font-semibold text-surgical-teal hover:bg-surgical-teal hover:text-slate-950 transition-all"
                >
                  <MessageCircle className="h-4 w-4" />
                  Agendar Exame das Pernas
                </a>
              </div>
            </div>

            {/* Tronco e Pescoço — matches WP exactly */}
            <div className="rounded-3xl border border-emerald-500/30 bg-slate-900/80 p-8 shadow-xl">
              <div className="flex items-center gap-3 mb-6">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-500/20 text-emerald-400">
                  <HeartPulse className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-white">Tronco e Pescoço</h3>
                  <p className="text-xs text-slate-400">Sintomas vasculares centrais</p>
                </div>
              </div>

              <p className="mb-4 text-sm font-semibold text-emerald-400">
                Possíveis sintomas para procurar um angiologista:
              </p>

              <ul className="space-y-3">
                {NECK_SYMPTOMS.map((symp) => (
                  <li key={symp} className="flex items-start gap-3 text-sm text-slate-200">
                    <span className="flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full bg-emerald-500/20 text-emerald-400 text-xs mt-0.5">
                      ✓
                    </span>
                    <span>{symp}</span>
                  </li>
                ))}
              </ul>

              <div className="mt-8 pt-6 border-t border-slate-800">
                <a
                  href="https://wa.me/5571999159975?text=Olá%20Dr.%20Herlon,%20gostaria%20de%20uma%20avaliação%20para%20sintomas%20vasculares."
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-emerald-500/20 border border-emerald-500/40 px-5 py-3 text-sm font-semibold text-emerald-300 hover:bg-emerald-500 hover:text-slate-950 transition-all"
                >
                  <MessageCircle className="h-4 w-4" />
                  FALE CONOSCO
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Interactive DVT Risk Calculator Anchor Section */}
      <section id="calculadora-tvp" className="py-20 sm:py-28 bg-gradient-to-b from-slate-950 via-dark-elevated to-slate-950 relative overflow-hidden">
        <div className="pointer-events-none absolute top-1/2 left-1/2 -z-10 h-[600px] w-[900px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-teal-500/10 blur-[130px]" />
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-3xl text-center mb-10">
            <div className="inline-flex items-center gap-2 rounded-full border border-surgical-teal/40 bg-surgical-teal/10 px-3.5 py-1.5 text-xs font-semibold text-surgical-teal mb-3">
              <Activity className="h-4 w-4" />
              <span>Triagem Vascular Rápida</span>
            </div>
            <h2 className="text-3xl font-extrabold sm:text-5xl text-white">
              Calculadora de Risco de Trombose (TVP)
            </h2>
            <p className="mt-4 text-base text-slate-300">
              Responda às 4 etapas e receba instantaneamente a pontuação do seu risco tromboembólico, com orientações clínicas do Dr. Herlon Moura.
            </p>
            <div className="mt-4">
              <button
                type="button"
                onClick={() => setIsCalculatorModalOpen(true)}
                className="inline-flex items-center gap-2 rounded-xl bg-surgical-teal/15 border border-surgical-teal/40 px-4 py-2 text-xs font-bold text-surgical-teal hover:bg-surgical-teal hover:text-slate-950 transition-all shadow-sm"
              >
                <HeartPulse className="h-4 w-4" />
                <span>Abrir em Modo Janela Flutuante</span>
              </button>
            </div>
          </div>

          {/* Animated DVT Calculator Component */}
          <DVTRiskCalculator />
        </div>
      </section>

      {/* Doctor Bio & Credentials Section */}
      <section id="sobre" className="py-20 sm:py-24 bg-slate-950 border-t border-slate-800">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid items-center gap-12 lg:grid-cols-12">
            <div className="lg:col-span-5 flex justify-center">
              <div className="relative w-full max-w-[380px]">
                <div className="absolute inset-0 rounded-3xl bg-surgical-teal/20 blur-2xl" />
                <div className="relative z-10 overflow-hidden rounded-3xl border border-white/10 bg-slate-900 shadow-2xl p-2">
                  <Image
                    src="/images/dr-herlon-moura.png"
                    alt="Dr. Herlon Moura dos Santos"
                    width={380}
                    height={520}
                    className="h-auto w-full rounded-2xl object-cover"
                  />
                </div>
              </div>
            </div>

            <div className="lg:col-span-7 space-y-6">
              <div className="inline-flex items-center gap-2 rounded-full border border-surgical-teal/30 bg-surgical-teal/10 px-3 py-1 text-xs font-semibold text-surgical-teal">
                <Award className="h-4 w-4" />
                <span>Formação de Excelência</span>
              </div>
              <h2 className="text-3xl font-extrabold sm:text-4xl text-white">
                Dr. Herlon Moura dos Santos
              </h2>
              <p className="text-base text-teal-300 font-medium">
                Cirurgião Vascular e Endovascular – CRM/BA 23904 • RQE Nº 19791 / RQE Nº 22436
              </p>
              <p className="text-sm sm:text-base text-slate-300 leading-relaxed">
                Com graduação médica pela conceituada <strong>Universidade Federal da Bahia (UFBA)</strong> e especializações em Cirurgia Vascular e Endovascular, ofereço um atendimento acolhedor, ético e personalizado em Salvador.
              </p>
              <p className="text-sm sm:text-base text-slate-300 leading-relaxed">
                Combinamos a mais alta tecnologia de imagem diagnóstica (Eco-Doppler colorido) e procedimentos minimamente invasivos a laser com a escuta clínica atenta, cuidando do paciente de forma integral.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4 border-t border-slate-800">
                <div className="flex items-center gap-3">
                  <CheckCircle2 className="h-5 w-5 text-surgical-teal flex-shrink-0" />
                  <span className="text-sm text-slate-200">Membro da SBACV</span>
                </div>
                <div className="flex items-center gap-3">
                  <CheckCircle2 className="h-5 w-5 text-surgical-teal flex-shrink-0" />
                  <span className="text-sm text-slate-200">Especialista em Cirurgia Endovascular</span>
                </div>
                <div className="flex items-center gap-3">
                  <CheckCircle2 className="h-5 w-5 text-surgical-teal flex-shrink-0" />
                  <span className="text-sm text-slate-200">Laser e Espuma Densa Ecoguiada</span>
                </div>
                <div className="flex items-center gap-3">
                  <CheckCircle2 className="h-5 w-5 text-surgical-teal flex-shrink-0" />
                  <span className="text-sm text-slate-200">Acessos para Quimioterapia e Hemodiálise</span>
                </div>
              </div>

              <div className="pt-4">
                <a
                  href="https://wa.me/5571999159975?text=Olá%20Dr.%20Herlon,%20gostaria%20de%20agendar%20uma%20consulta."
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 rounded-xl bg-emerald-600 px-6 py-3.5 text-sm font-bold text-white shadow-lg shadow-emerald-950/40 hover:bg-emerald-500 transition-all"
                >
                  <MessageCircle className="h-5 w-5" />
                  <span>Agendar Consulta com Dr. Herlon</span>
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA — matches WordPress "Vamos agendar sua consulta?" */}
      <section id="contato" className="py-20 sm:py-28 bg-slate-950 border-t border-slate-800">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-3xl text-center">
            <span className="inline-block rounded-full border border-surgical-teal/30 bg-surgical-teal/10 px-3 py-1 text-xs font-semibold text-surgical-teal mb-3">
              Agendamento Facilitado
            </span>
            <h2 className="text-3xl font-extrabold sm:text-4xl text-white mb-4">
              Vamos agendar sua consulta?
            </h2>
            <p className="text-base text-slate-300 mb-6">
              Fale conosco e agenda já!
            </p>
            <p className="text-sm text-slate-400 mb-8">
              Nosso foco é o melhor atendimento pensando em seu bem estar. Atendimento humanizado com muito amor.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-6">
              <a
                href="https://wa.me/5571999159975?text=Olá%20Dr.%20Herlon%20Moura,%20gostaria%20de%20agendar%20uma%20consulta."
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2.5 rounded-xl bg-emerald-600 px-7 py-4 text-base font-bold text-white shadow-xl shadow-emerald-950/50 hover:bg-emerald-500 transition-all"
              >
                <MessageCircle className="h-5 w-5" />
                <span>WhatsApp</span>
              </a>
              <a
                href="https://wa.me/5571999159975?text=Olá%20Dr.%20Herlon%20Moura,%20gostaria%20de%20agendar%20uma%20consulta."
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 rounded-xl border border-surgical-teal/40 bg-surgical-teal/10 px-6 py-3.5 text-sm font-semibold text-surgical-teal hover:bg-surgical-teal hover:text-slate-950 transition-all"
              >
                <MessageCircle className="h-4 w-4" />
                Fale no WhatsApp
              </a>
            </div>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-6 text-sm text-slate-400">
              <span>📍 R. Eng. Célso Tôrres, 654 - Graça, Salvador - BA</span>
              <span>📞 (71) 98344-9737 / (71) 99915-9975</span>
            </div>
          </div>
        </div>
      </section>

      <Footer />

      {/* Quick Floating Test Trigger Button */}
      <aside className="fixed bottom-5 right-5 z-30 hidden sm:block" aria-label="Acesso rápido ao teste de risco">
        <button
          type="button"
          onClick={() => setIsCalculatorModalOpen(true)}
          className="group flex items-center gap-2.5 rounded-full bg-slate-900/90 border border-surgical-teal/50 px-4 py-2.5 text-xs font-bold text-white shadow-2xl backdrop-blur-xl transition-all hover:bg-surgical-teal hover:text-slate-950 hover:shadow-surgical-teal/30 hover:scale-105 active:scale-95"
          aria-label="Abrir teste rápido de TVP"
        >
          <span className="flex h-6 w-6 items-center justify-center rounded-full bg-surgical-teal/20 text-surgical-teal group-hover:bg-slate-950 group-hover:text-surgical-teal">
            <HeartPulse className="h-3.5 w-3.5" />
          </span>
          <span>Teste de Risco TVP</span>
        </button>
      </aside>

      {/* DVT Modal with zero scroll */}
      <DVTModal
        isOpen={isCalculatorModalOpen}
        onClose={() => setIsCalculatorModalOpen(false)}
      />
    </main>
  );
}
