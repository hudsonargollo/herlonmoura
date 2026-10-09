'use client';

import { Header, Footer, HeroSection, Button, Container, Card, Grid } from '@/components';
import { HeartPulse, Activity, ShieldCheck, Zap, MessageCircle, Phone, MapPin, Clock, ArrowRight, Sparkles, Waves, Award, CheckCircle2, Stethoscope } from 'lucide-react';
import Link from 'next/link';

const METADATA = {
  title: "Dr. Herlon Moura — Plataforma de Saúde Vascular Completa",
  description: "Portal do Dr. Herlon Moura: angiologista e cirurgião vascular em Salvador, BA. Blog educativo, calculadora de risco TVP, agendamento WhatsApp, CRM com lead capture.",
};

const FEATURES = [
  { icon: HeartPulse, title: "Blog Educativo", desc: "40+ artigos em português sobre varizes, trombose, Doppler e prevenção vascular." },
  { icon: Activity, title: "Calculadora de Risco TVP", desc: "Avaliação interativa de risco de Trombose Venosa Profunda com score personalizado." },
  { icon: MessageCircle, title: "Avaliação Varizes", desc: "Questionário interativo de avaliação de varizes com scoring e recomendação." },
  { icon: ShieldCheck, title: "Screening Trombose", desc: "Rastreamento de sinais de trombose com identificação de risco alto/moderado/baixo." },
  { icon: Zap, title: "PDF Gratuito", desc: "Download de material educativo com capture de nome, WhatsApp e e-mail." },
  { icon: Clock, title: "CRM Dashboard", desc: "Painel de leads com filtros, timeline de interações e fila de aprovação de artigos." },
];

export default function Plataforma() {
  return (
    <main className="min-h-screen bg-background text-foreground">
      <Header />

      {/* Hero */}
      <section className="relative overflow-hidden bg-gradient-to-b from-muted/30 via-background to-muted/30 py-16 sm:py-24">
        <div className="pointer-events-none absolute -top-32 left-1/2 -z-10 h-96 w-[600px] -translate-x-1/2 rounded-full bg-primary/10 blur-[100px]" />
        <Container className="text-center">
          <span className="inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-3 py-1 text-xs font-semibold text-primary mb-3">
            <Sparkles className="h-3 w-3" />
            Plataforma Completa de Saúde Vascular
          </span>
          <h1 className="mt-2 text-3xl font-extrabold sm:text-4xl lg:text-5xl text-foreground">
            Cuidado Vascular com Tecnologia de Ponta
          </h1>
          <p className="mt-4 text-base text-muted-foreground max-w-2xl mx-auto">
            O portal completo do Dr. Herlon Moura: informação médica de qualidade, ferramentas de triagem e um sistema CRM para gerenciar seus pacientes e conteúdo.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-4">
            <Link href="/blog"><Button variant="primary" size="lg">Explorar Blog</Button></Link>
            <a href="https://wa.me/5571999159975?text=Olá%20Dr.%20Herlon%20Moura" target="_blank" rel="noopener"><Button variant="secondary" size="lg"><MessageCircle className="mr-2 h-4 w-4" /> WhatsApp</Button></a>
          </div>
        </Container>
      </section>

      {/* Features Grid */}
      <section className="py-16 bg-background">
        <Container>
          <h2 className="text-2xl font-bold text-foreground text-center mb-10">Tudo o que você precisa, em um só lugar</h2>
          <Grid className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {FEATURES.map(({ icon: Icon, title, desc }) => (
              <Card key={title} variant="glass" className="p-6">
                <Icon className="h-8 w-8 text-primary mb-3" />
                <h3 className="text-heading-3 font-heading font-semibold text-foreground mb-2">{title}</h3>
                <p className="text-sm text-muted-foreground">{desc}</p>
              </Card>
            ))}
          </Grid>
        </Container>
      </section>

      {/* System Architecture */}
      <section className="py-16 bg-muted/30 border-t border-border">
        <Container>
          <h2 className="text-2xl font-bold text-foreground text-center mb-10">Arquitetura da Plataforma</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card variant="glass" className="p-5">
              <h3 className="text-heading-3 font-heading font-semibold text-primary mb-3">Frontend</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>• Next.js 15 com App Router</li>
                <li>• Server Components + Server Actions</li>
                <li>• Tailwind CSS + Design System</li>
                <li>• Static export → Cloudflare Pages</li>
              </ul>
            </Card>
            <Card variant="glass" className="p-5">
              <h3 className="text-heading-3 font-heading font-semibold text-primary mb-3">Backend</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>• Cloudflare Workers (API REST)</li>
                <li>• D1 Database (PostgreSQL compat)</li>
                <li>• JWT Auth + Cookies</li>
                <li>• KV para cache</li>
              </ul>
            </Card>
            <Card variant="glass" className="p-5">
              <h3 className="text-heading-3 font-heading font-semibold text-primary mb-3">CRM</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>• Lead capture de questionnaires</li>
                <li>• Timeline de interações</li>
                <li>• Email sequences automatizadas</li>
                <li>• Filtros por fonte/status/data</li>
              </ul>
            </Card>
            <Card variant="glass" className="p-5">
              <h3 className="text-heading-3 font-heading font-semibold text-primary mb-3">Conteúdo</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>• 40+ artigos em draft/approval</li>
                <li>• Blog com busca + filtros</li>
                <li>• Aprovação no dashboard</li>
                <li>• Cron: 5 posts/dia</li>
              </ul>
            </Card>
          </div>
        </Container>
      </section>

      {/* Stats */}
      <section className="py-16 bg-background">
        <Container>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            <div>
              <p className="text-3xl font-bold text-primary">40+</p>
              <p className="text-sm text-muted-foreground">Artigos no Blog</p>
            </div>
            <div>
              <p className="text-3xl font-bold text-secondary">5</p>
              <p className="text-sm text-muted-foreground">Ferramentas de Triagem</p>
            </div>
            <div>
              <p className="text-3xl font-bold text-secondary">5</p>
              <p className="text-sm text-muted-foreground">Email Sequences</p>
            </div>
            <div>
              <p className="text-3xl font-bold text-primary">24/7</p>
              <p className="text-sm text-muted-foreground">Monitoramento</p>
            </div>
          </div>
        </Container>
      </section>

      {/* CTA */}
      <section className="py-16 bg-muted/30 border-t border-border">
        <Container className="text-center">
          <h2 className="text-2xl font-bold text-foreground mb-4">Pronto para cuidar da sua saúde vascular?</h2>
          <p className="text-muted-foreground mb-8 max-w-lg mx-auto">Agende sua consulta com o Dr. Herlon Moura e tenha acesso a todas as ferramentas desta plataforma.</p>
          <div className="flex flex-wrap justify-center gap-4">
            <a href="https://wa.me/5571999159975?text=Olá%20Dr.%20Herlon%20Moura" target="_blank" rel="noopener">
              <Button variant="primary" size="lg"><MessageCircle className="mr-2 h-4 w-4" /> WhatsApp</Button>
            </a>
            <Link href="/calculadora-dvt"><Button variant="secondary" size="lg">Calculadora de Risco TVP</Button></Link>
          </div>
        </Container>
      </section>

      <Footer />
    </main>
  );
}
