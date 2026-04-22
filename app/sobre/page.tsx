'use client';

import { Header, Footer, Container, Card, Button } from '@/components';
import { Logo } from '@/components';
import { motion } from 'framer-motion';
import Link from 'next/link';

export default function AboutPage(): JSX.Element {
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

  const credentials = [
    { title: 'Licença Médica', value: 'CRM-BA 12345' },
    { title: 'Especialização', value: 'Angiologia e Cirurgia Vascular' },
    { title: 'Anos de Experiência', value: '15+' },
    { title: 'Certificações', value: 'SBACV, SBACV-Endovascular' },
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: 'easeOut',
      },
    },
  };

  return (
    <main className="min-h-screen bg-dark-elevated">
      <Header
        logo={<Logo size="md" animated={false} />}
        navItems={navItems}
        ctaButton={{ label: 'Agendar Consulta', href: '/agendamento' }}
      />

      {/* Hero Section */}
      <section className="relative bg-gradient-to-b from-dark-elevated to-neutral-dark py-20 md:py-32">
        <Container>
          <motion.div
            className="text-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h1 className="mb-lg text-display-lg font-bold text-neutral-light md:text-display-lg">
              Sobre Dr. Herlon Moura
            </h1>
            <p className="mx-auto max-w-2xl text-body-lg text-neutral-medium">
              Especialista em Angiologia e Cirurgia Vascular com mais de 15 anos de experiência
            </p>
          </motion.div>
        </Container>
      </section>

      {/* Biography Section */}
      <section className="py-20 md:py-32">
        <Container>
          <motion.div
            className="grid gap-3xl md:grid-cols-2 md:items-center"
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            {/* Image Placeholder */}
            <motion.div
              className="flex items-center justify-center rounded-xl bg-gradient-to-br from-surgical-teal to-surgical-teal-dark p-3xl"
              variants={itemVariants}
            >
              <div className="text-center">
                <Logo size="lg" animated={false} />
                <p className="mt-lg text-neutral-light">Dr. Herlon Moura</p>
              </div>
            </motion.div>

            {/* Biography Text */}
            <motion.div
              className="space-y-lg"
              variants={itemVariants}
            >
              <h2 className="text-heading-1 font-bold text-neutral-light">Biografia</h2>
              <p className="text-body-regular text-neutral-medium">
                Dr. Herlon Moura é um especialista renomado em Angiologia e Cirurgia Vascular, dedicado a
                fornecer cuidado de excelência para pacientes com condições vasculares em Salvador, Bahia.
              </p>
              <p className="text-body-regular text-neutral-medium">
                Com mais de 15 anos de experiência clínica, Dr. Moura combina conhecimento médico profundo
                com uma abordagem humanizada ao cuidado do paciente. Sua prática se concentra em diagnóstico
                preciso e tratamento eficaz de condições vasculares complexas.
              </p>
              <p className="text-body-regular text-neutral-medium">
                Comprometido com a educação contínua e as melhores práticas médicas, Dr. Moura mantém-se
                atualizado com os avanços mais recentes em angiologia e cirurgia vascular.
              </p>
            </motion.div>
          </motion.div>
        </Container>
      </section>

      {/* Credentials Section */}
      <section id="credenciais" className="bg-neutral-dark py-20 md:py-32">
        <Container>
          <motion.div
            className="mb-3xl text-center"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-heading-1 font-bold text-neutral-light">Credenciais e Certificações</h2>
            <p className="mt-md text-body-regular text-neutral-medium">
              Qualificações profissionais e certificações médicas
            </p>
          </motion.div>

          <motion.div
            className="grid gap-lg md:grid-cols-2 lg:grid-cols-4"
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            {credentials.map((credential, index) => (
              <motion.div
                key={index}
                variants={itemVariants}
              >
                <Card variant="glass" className="h-full">
                  <div className="space-y-md">
                    <h3 className="text-heading-3 font-semibold text-surgical-teal">{credential.title}</h3>
                    <p className="text-body-regular text-neutral-light">{credential.value}</p>
                  </div>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        </Container>
      </section>

      {/* Experience Section */}
      <section id="experiencia" className="py-20 md:py-32">
        <Container>
          <motion.div
            className="mb-3xl text-center"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-heading-1 font-bold text-neutral-light">Experiência Profissional</h2>
            <p className="mt-md text-body-regular text-neutral-medium">
              Trajetória de excelência em cuidado vascular
            </p>
          </motion.div>

          <motion.div
            className="space-y-lg"
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            {[
              {
                year: '2008-2010',
                title: 'Residência em Cirurgia Geral',
                institution: 'Hospital Universitário de Salvador',
              },
              {
                year: '2010-2012',
                title: 'Especialização em Angiologia e Cirurgia Vascular',
                institution: 'Instituto de Cirurgia Vascular de São Paulo',
              },
              {
                year: '2012-Presente',
                title: 'Prática Clínica Privada',
                institution: 'Consultório em Salvador, Bahia',
              },
            ].map((experience, index) => (
              <motion.div
                key={index}
                className="border-l-4 border-surgical-teal pl-lg"
                variants={itemVariants}
              >
                <p className="text-sm font-semibold text-surgical-teal">{experience.year}</p>
                <h3 className="mt-md text-heading-3 font-semibold text-neutral-light">{experience.title}</h3>
                <p className="mt-md text-body-regular text-neutral-medium">{experience.institution}</p>
              </motion.div>
            ))}
          </motion.div>
        </Container>
      </section>

      {/* Practice Philosophy Section */}
      <section className="bg-neutral-dark py-20 md:py-32">
        <Container>
          <motion.div
            className="mb-3xl text-center"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-heading-1 font-bold text-neutral-light">Filosofia de Prática</h2>
          </motion.div>

          <motion.div
            className="grid gap-lg md:grid-cols-3"
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            {[
              {
                title: 'Cuidado Humanizado',
                description: 'Cada paciente é tratado com compaixão e respeito, considerando suas necessidades individuais.',
              },
              {
                title: 'Excelência Médica',
                description: 'Aplicação rigorosa de conhecimento médico e técnicas avançadas para melhores resultados.',
              },
              {
                title: 'Educação do Paciente',
                description: 'Empoderamento dos pacientes através de informações claras e compreensíveis sobre sua saúde.',
              },
            ].map((philosophy, index) => (
              <motion.div
                key={index}
                variants={itemVariants}
              >
                <Card variant="glass">
                  <h3 className="mb-md text-heading-3 font-semibold text-surgical-teal">{philosophy.title}</h3>
                  <p className="text-body-regular text-neutral-medium">{philosophy.description}</p>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        </Container>
      </section>

      {/* CTA Section */}
      <section className="py-20 md:py-32">
        <Container>
          <motion.div
            className="rounded-xl bg-gradient-to-r from-surgical-teal to-surgical-teal-dark p-3xl text-center"
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="mb-lg text-heading-1 font-bold text-dark-elevated">
              Pronto para Agendar sua Consulta?
            </h2>
            <p className="mb-2xl text-body-lg text-dark-elevated">
              Entre em contato conosco para marcar uma consulta com Dr. Herlon Moura
            </p>
            <Link
              href="/agendamento"
              className="inline-flex items-center justify-center rounded-lg bg-dark-elevated px-2xl py-lg font-semibold text-surgical-teal transition-all hover:bg-neutral-light"
            >
              Agendar Consulta
            </Link>
          </motion.div>
        </Container>
      </section>

      <Footer
        sections={footerSections}
        copyright={`© ${new Date().getFullYear()} Dr. Herlon Moura. Todos os direitos reservados.`}
      />
    </main>
  );
}
