'use client';

import { Header, Footer, DVTRiskCalculator } from '@/components';
import { ShieldCheck, Activity, Phone, MessageCircle } from 'lucide-react';
import Link from 'next/link';

export default function DVTRiskCalculatorPage() {
  return (
    <main className="min-h-screen bg-dark-elevated text-slate-100">
      <Header />

      {/* Hero / Intro banner */}
      <section className="relative overflow-hidden bg-gradient-to-b from-slate-950 via-dark-elevated to-slate-900 py-12 sm:py-16">
        <div className="pointer-events-none absolute -top-32 left-1/2 -z-10 h-96 w-[600px] -translate-x-1/2 rounded-full bg-surgical-teal/10 blur-[100px]" />
        <div className="container mx-auto px-4 text-center">
          <div className="inline-flex items-center gap-2 rounded-full border border-surgical-teal/30 bg-surgical-teal/10 px-3.5 py-1.5 text-xs font-semibold text-surgical-teal mb-4">
            <Activity className="h-4 w-4" />
            <span>Ferramenta Clínica de Triagem Prévia</span>
          </div>
          <h1 className="text-3xl font-extrabold sm:text-5xl text-white">
            Calculadora de Risco de{' '}
            <span className="bg-gradient-to-r from-surgical-teal to-emerald-400 bg-clip-text text-transparent">
              Trombose Venosa Profunda (TVP)
            </span>
          </h1>
          <p className="mt-4 max-w-2xl mx-auto text-sm sm:text-base text-slate-300">
            Avalie seus fatores de risco individuais de forma anônima, rápida e fundamentada em parâmetros vasculares estabelecidos.
          </p>
        </div>
      </section>

      {/* Main Interactive Calculator Area */}
      <section className="py-10 px-4">
        <DVTRiskCalculator />
      </section>

      {/* FAQ & Medical Context */}
      <section className="py-16 px-4 border-t border-slate-800 bg-slate-950/70">
        <div className="container mx-auto max-w-4xl">
          <div className="text-center mb-12">
            <h2 className="text-2xl sm:text-3xl font-bold text-white">
              Entenda a Trombose Venosa Profunda
            </h2>
            <p className="mt-2 text-sm text-slate-400">
              Informações elaboradas pelo Dr. Herlon Moura dos Santos (CRM/BA 23904)
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-6">
              <h3 className="text-lg font-bold text-teal-300 mb-2">O que é a TVP?</h3>
              <p className="text-sm text-slate-300 leading-relaxed">
                A Trombose Venosa Profunda é a formação de coágulos (trombos) no interior de veias profundas, ocorrendo com maior frequência nos membros inferiores. O principal perigo é o desprendimento do coágulo em direção aos pulmões, gerando a embolia pulmonar.
              </p>
            </div>

            <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-6">
              <h3 className="text-lg font-bold text-teal-300 mb-2">Quando consultar um cirurgião vascular?</h3>
              <p className="text-sm text-slate-300 leading-relaxed">
                Qualquer dor unilateral na perna, edema (inchaço) recente, sensação de peso intensa ou pele brilhante e avermelhada exige exame clínico imediato e realização de Eco-Doppler Vascular.
              </p>
            </div>

            <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-6">
              <h3 className="text-lg font-bold text-teal-300 mb-2">Como é feito o diagnóstico?</h3>
              <p className="text-sm text-slate-300 leading-relaxed">
                O exame padrão-ouro é o Ultrassom Doppler Vascular colorido, um procedimento indolor, não invasivo e realizado diretamente no consultório pelo Dr. Herlon Moura.
              </p>
            </div>

            <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-6">
              <h3 className="text-lg font-bold text-teal-300 mb-2">Medidas de Prevenção</h3>
              <p className="text-sm text-slate-300 leading-relaxed">
                Manter boa hidratação, praticar atividades físicas regulares, utilizar meias elásticas medicinais orientadas por especialista e evitar períodos estáticos prolongados em viagens longas.
              </p>
            </div>
          </div>

          {/* Quick Doctor Banner */}
          <div className="mt-12 rounded-3xl border border-surgical-teal/30 bg-gradient-to-r from-slate-900 via-teal-950/40 to-slate-900 p-8 flex flex-col sm:flex-row items-center justify-between gap-6 text-center sm:text-left">
            <div>
              <h3 className="text-xl font-bold text-white">Precisa de orientação vascular especializada?</h3>
              <p className="mt-1 text-sm text-slate-300">
                Atendimento humanizado no bairro da Graça em Salvador.
              </p>
            </div>
            <a
              href="https://wa.me/5571999159975?text=Olá%20Dr.%20Herlon,%20gostaria%20de%20agendar%20uma%20consulta%20vascular."
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-xl bg-emerald-600 px-6 py-3.5 text-sm font-bold text-white shadow-lg shadow-emerald-950/40 hover:bg-emerald-500 transition-all flex-shrink-0"
            >
              <MessageCircle className="h-4 w-4" />
              Agendar no WhatsApp
            </a>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
