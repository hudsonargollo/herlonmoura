'use client';

import { HeroSection, Logo, Header, Footer } from '@/components';

export default function Home() {
  const navItems = [
    { label: 'Sobre', href: '/sobre' },
    { label: 'Condições', href: '/condicoes' },
    { label: 'Serviços', href: '/servicos' },
    { label: 'Blog', href: '/blog' },
    { label: 'Contato', href: '/contato' },
  ];

  const footerSections = [
    {
      title: 'Sobre',
      links: [
        { label: 'Dr. Herlon Moura', href: '/sobre' },
        { label: 'Credenciais', href: '/sobre#credenciais' },
        { label: 'Experiência', href: '/sobre#experiencia' },
      ],
    },
    {
      title: 'Condições',
      links: [
        { label: 'Trombose Venosa Profunda', href: '/condicoes/dvt' },
        { label: 'Varizes', href: '/condicoes/varizes' },
        { label: 'Insuficiência Venosa', href: '/condicoes/insuficiencia-venosa' },
      ],
    },
    {
      title: 'Recursos',
      links: [
        { label: 'Blog', href: '/blog' },
        { label: 'Calculadora de Risco DVT', href: '/calculadora-dvt' },
        { label: 'Navegador de Sintomas', href: '/sintomas' },
      ],
    },
    {
      title: 'Legal',
      links: [
        { label: 'Privacidade', href: '/privacidade' },
        { label: 'Termos de Serviço', href: '/termos' },
        { label: 'Contato', href: '/contato' },
      ],
    },
  ];

  return (
    <main className="min-h-screen bg-dark-elevated">
      <Header
        logo={<Logo size="md" animated={false} />}
        navItems={navItems}
        ctaButton={{ label: 'Agendar Consulta', href: '/agendamento' }}
      />
      <HeroSection
        headline="Dr. Herlon Moura"
        subheadline="Especialista em Angiologia e Cirurgia Vascular em Salvador"
        logoSvg={<Logo size="lg" animated={true} />}
        primaryCTA={{ label: 'Agendar Consulta', href: '/agendamento' }}
        secondaryCTA={{ label: 'Saiba Mais', href: '/sobre' }}
      />
      <Footer
        sections={footerSections}
        copyright={`© ${new Date().getFullYear()} Dr. Herlon Moura. Todos os direitos reservados.`}
      />
    </main>
  );
}
