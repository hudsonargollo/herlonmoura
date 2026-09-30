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
  MapPin,
  Phone,
  MessageCircle,
  ShieldCheck,
  ArrowRight,
  HeartPulse,
  Award,
  Clock,
  Check,
} from 'lucide-react';

export default function Home() {
  const [isCalculatorModalOpen, setIsCalculatorModalOpen] = useState(false);

  const PROCEDURES = [
    {
      title: 'Doppler Vascular Colorido',
      subtitle: 'Diagnóstico Não Invasivo',
      description:
        'Exame de ultrassom com Doppler que analisa o fluxo sanguíneo em artérias e veias em tempo real. Essencial para detectar trombose venosa, varizes e insuficiência circulatória com máxima precisão.',
      icon: Waves,
      tag: 'No próprio consultório',
    },
    {
      title: 'Tratamento de Varizes com Laser',
      subtitle: 'Tecnologia Endovenosa e Transdérmica',
      description:
        'Procedimento moderno e minimamente invasivo que utiliza energia térmica a laser para fechar veias doentes sem cortes agressivos, permitindo retorno rápido às atividades normais.',
      icon: Zap,
      tag: 'Recuperação Rápida',
    },
    {
      title: 'Escleroterapia com Espuma Densa',
      subtitle: 'Tratamento Ecoguiado em Consultório',
      description:
        'Aplicação de microespuma medicamentosa direcionada sob ultrassom em veias calibrosas e vasinhos estéticos. Excelente alternativa com alta eficácia e sem necessidade de internação.',
      icon: Sparkles,
      tag: 'Minimamente Invasivo',
    },
    {
      title: 'Microcirurgia de Varizes',
      subtitle: 'Flebectomia Ambulatorial',
      description:
        'Remoção de trajetos varicosos pequenos e médios através de microincisões milimétricas imperceptíveis, com excelente resultado estético e anestesia local.',
      icon: Activity,
      tag: 'Alta Estética',
    },
    {
      title: 'Implante de Cateter Port-a-Cath',
      subtitle: 'Acesso para Quimioterapia',
      description:
        'Dispositivo cirúrgico totalmente implantável sob a pele, proporcionando conforto, segurança e preservação das veias periféricas durante o tratamento oncológico.',
      icon: ShieldCheck,
      tag: 'Cuidado Oncológico',
    },
    {
      title: 'Implante de Cateter Permcath',
      subtitle: 'Acesso Vascular para Hemodiálise',
      description:
        'Procedimento vascular especializado que viabiliza o acesso prolongado para pacientes que necessitam de hemodiálise, assegurando fluxo adequado e reduzido risco de infecção.',
      icon: Stethoscope,
      tag: 'Acesso Vascular',
    },
  ];

  const LEG_SYMPTOMS = [
    'Dor, queimação ou inchaço constante nos membros inferiores',
    'Sensação de peso e fadiga nas pernas ao final do dia',
    'Formigamento e dormência nas mãos, pés ou panturrilhas',
    'Cãibras noturnas recorrentes que atrapalham o sono',
    'Aparecimento de veias dilatadas, azuladas ou arroxeadas',
    'Sensação de calor ou manchas escuras nos tornozelos',
  ];

  const NECK_SYMPTOMS = [
    'Dor cervical intensa de início súbito',
    'Tonturas, sensação de desmaio ou desequilíbrio inexplicado',
    'Perda repentina ou turvação visual transitória',
    'Dormência, fraqueza motora ou perda de força em um lado do corpo',
    'Alterações momentâneas na fala ou compreensão',
    'Sopro carotídeo ou histórico de doença das carótidas',
  ];

  return (
    <main className="min-h-screen bg-dark-elevated text-slate-100">
      <Header onOpenCalculator={() => setIsCalculatorModalOpen(true)} />

      {/* Hero Section with Doctor Photo & Real Branding */}
      <HeroSection onOpenCalculator={() => setIsCalculatorModalOpen(true)} />

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

      {/* Why Choose / Diferenciais do Atendimento */}
      <section className="py-16 sm:py-24 bg-gradient-to-b from-dark-elevated to-slate-950">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-3xl text-center">
            <span className="inline-block rounded-full border border-surgical-teal/30 bg-surgical-teal/10 px-3 py-1 text-xs font-semibold text-surgical-teal mb-3">
              Atendimento Humanizado & Alta Tecnologia
            </span>
            <h2 className="text-3xl font-extrabold sm:text-4xl text-white">
              Por que escolher o atendimento do{' '}
              <span className="text-surgical-teal">Dr. Herlon Moura</span>?
            </h2>
            <p className="mt-4 text-base text-slate-300">
              O angiologista e cirurgião vascular é o especialista habilitado a diagnosticar e tratar todas as doenças das artérias, veias e vasos linfáticos. Nosso foco é devolver sua saúde circulatória com conforto e segurança.
            </p>
          </div>

          <div className="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-6 transition-all hover:border-surgical-teal/50 hover:bg-slate-900">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-surgical-teal/15 text-surgical-teal mb-5">
                <Zap className="h-6 w-6" />
              </div>
              <h3 className="text-lg font-bold text-white mb-2">Tratamentos Minimamente Invasivos</h3>
              <p className="text-sm text-slate-300 leading-relaxed">
                Técnicas com laser e microespuma que dispensam internações prolongadas, proporcionando recuperação rápida e confortável.
              </p>
            </div>

            <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-6 transition-all hover:border-surgical-teal/50 hover:bg-slate-900">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-500/15 text-emerald-400 mb-5">
                <HeartPulse className="h-6 w-6" />
              </div>
              <h3 className="text-lg font-bold text-white mb-2">Consultas Humanizadas</h3>
              <p className="text-sm text-slate-300 leading-relaxed">
                Tempo dedicado para escutar sua história, examinar detalhadamente e propor um plano terapêutico personalizado com afeto e rigor técnico.
              </p>
            </div>

            <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-6 transition-all hover:border-surgical-teal/50 hover:bg-slate-900">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-surgical-teal/15 text-surgical-teal mb-5">
                <Waves className="h-6 w-6" />
              </div>
              <h3 className="text-lg font-bold text-white mb-2">Doppler no Consultório</h3>
              <p className="text-sm text-slate-300 leading-relaxed">
                Diagnóstico vascular por imagem realizado pelo próprio cirurgião durante a consulta, sem necessidade de esperar laudos externos.
              </p>
            </div>

            <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-6 transition-all hover:border-surgical-teal/50 hover:bg-slate-900">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-500/15 text-emerald-400 mb-5">
                <ShieldCheck className="h-6 w-6" />
              </div>
              <h3 className="text-lg font-bold text-white mb-2">Consultório na Graça</h3>
              <p className="text-sm text-slate-300 leading-relaxed">
                Ambiente sofisticado, seguro e acessível em um dos bairros médicos mais tradicionais de Salvador, com estacionamento e conforto.
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

      {/* Symptom Mapping Section (Braços & Pernas / Tronco & Pescoço) */}
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
            {/* Legs & Arms */}
            <div className="rounded-3xl border border-surgical-teal/30 bg-slate-900/80 p-8 shadow-xl">
              <div className="flex items-center gap-3 mb-6">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-surgical-teal/20 text-surgical-teal">
                  <Activity className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-white">Membros Inferiores & Superiores</h3>
                  <p className="text-xs text-slate-400">Pernas, pés, coxas, panturrilhas e braços</p>
                </div>
              </div>

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

            {/* Neck & Trunk */}
            <div className="rounded-3xl border border-emerald-500/30 bg-slate-900/80 p-8 shadow-xl">
              <div className="flex items-center gap-3 mb-6">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-500/20 text-emerald-400">
                  <HeartPulse className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-white">Tronco, Carótidas & Pescoço</h3>
                  <p className="text-xs text-slate-400">Fluxo arterial cerebral e circulação central</p>
                </div>
              </div>

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
                  Agendar Avaliação Arterial
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

      {/* Location and Consultation CTA */}
      <section id="contato" className="py-16 sm:py-24 bg-dark-elevated">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="rounded-3xl border border-surgical-teal/30 bg-gradient-to-r from-slate-900 via-slate-900 to-teal-950/40 p-8 sm:p-12 shadow-2xl">
            <div className="grid gap-8 lg:grid-cols-12 items-center">
              <div className="lg:col-span-8 space-y-4">
                <span className="inline-block rounded-md bg-emerald-950/60 px-2.5 py-1 text-xs font-semibold text-emerald-400 border border-emerald-800/40">
                  Agendamento Facilitado
                </span>
                <h2 className="text-3xl font-extrabold text-white sm:text-4xl">
                  Vamos agendar sua consulta vascular?
                </h2>
                <p className="text-base text-slate-300 max-w-xl">
                  Fale diretamente com nossa equipe no WhatsApp para escolher o melhor dia e horário para o seu atendimento em Salvador.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 pt-2 text-sm text-slate-300">
                  <div className="flex items-center gap-2">
                    <MapPin className="h-4 w-4 text-surgical-teal flex-shrink-0" />
                    <span>R. Eng. Célso Tôrres, 654 - Graça, Salvador - BA</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Phone className="h-4 w-4 text-surgical-teal flex-shrink-0" />
                    <span>(71) 98344-9737 / (71) 99915-9975</span>
                  </div>
                </div>
              </div>

              <div className="lg:col-span-4 flex flex-col gap-3">
                <a
                  href="https://wa.me/5571999159975?text=Olá%20Dr.%20Herlon%20Moura,%20gostaria%20de%20agendar%20uma%20consulta."
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-2.5 rounded-xl bg-emerald-600 px-6 py-4 text-base font-bold text-white shadow-xl shadow-emerald-950/50 hover:bg-emerald-500 transition-all"
                >
                  <MessageCircle className="h-5 w-5" />
                  <span>Chamar no WhatsApp</span>
                </a>
                <Link
                  href="/calculadora-dvt"
                  className="inline-flex items-center justify-center gap-2 rounded-xl border border-surgical-teal/40 bg-surgical-teal/10 px-6 py-3.5 text-sm font-semibold text-surgical-teal hover:bg-surgical-teal hover:text-slate-950 transition-all text-center"
                >
                  <Activity className="h-4 w-4" />
                  <span>Acessar Calculadora de TVP</span>
                </Link>
              </div>
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
