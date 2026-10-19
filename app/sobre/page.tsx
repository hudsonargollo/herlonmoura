'use client';

import { Header, Footer, Container, Card, Button, Logo } from '@/components';
import { motion } from 'framer-motion';
import Link from 'next/link';
import Image from 'next/image';
import { physicianSchema } from '@/lib/structured-data';

export default function AboutPage() {
  const navItems = [
    { label: 'Dr. Herlon Moura', href: '/sobre' },
    { label: 'Blog', href: '/blog' },
    { label: 'Procedimentos', href: '/consultas-e-procedimentos' },
    { label: 'Sintomas', href: '/#sintomas' },
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
    <main className="min-h-screen bg-surface">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(physicianSchema()) }}
      />
      <Header
        logo={<Logo size="md" animated={false} />}
        navItems={navItems}
        ctaButton={{ label: 'Agendar Consulta', href: '/agendamento' }}
      />

      {/* Hero Section */}
      <section className="relative bg-gradient-to-b from-surface to-bg-secondary py-20 md:py-32">
        <Container>
          <motion.div
            className="text-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h1 className="mb-4 text-4xl font-bold text-primary md:text-5xl">
              Sobre Dr. Herlon Moura
            </h1>
            <p className="mx-auto max-w-2xl text-lg text-secondary">
              Especialista em Angiologia e Cirurgia Vascular com mais de 15 anos de experiência
            </p>
          </motion.div>
        </Container>
      </section>

      {/* Biography Section */}
      <section className="py-16 md:py-24">
        <Container>
          <motion.div
            className="grid gap-12 md:grid-cols-2 md:items-center"
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            {/* Doctor Photo */}
            <motion.div
              className="relative flex items-center justify-center rounded-3xl border border-default bg-surface-raised p-2 shadow-2xl"
              variants={itemVariants}
            >
              <div className="absolute inset-0 rounded-3xl bg-surgical-teal/20 blur-2xl" />
              <div className="relative z-10 overflow-hidden rounded-2xl">
                <Image
                  src="/images/brand/dr-photoroom.webp"
                  alt="Dr. Herlon Moura dos Santos"
                  width={360}
                  height={520}
                  className="object-cover object-top"
                />
              </div>
            </motion.div>

            {/* Biography Text */}
            <motion.div
              className="space-y-6"
              variants={itemVariants}
            >
              <h2 className="text-3xl font-bold text-primary md:text-4xl">Biografia</h2>
              <p className="text-gray-400">
                Com formação pela Universidade Federal da Bahia (UFBA) e especializações em Cirurgia Vascular e Endovascular, ofereço um atendimento acolhedor e personalizado, combinando tecnologia de ponta e experiência clínica para tratar doenças como varizes, tromboses, aneurismas e obstruções arteriais.
              </p>
              <p className="text-gray-400">
                Consultório muito bem localizado, em Salvador, Bahia. Atendemos toda a região metropolitana.
              </p>
              <p className="text-gray-400">
                Equipamentos de alta tecnologia, o que nos garante resultados precisos, facilitando nos diagnósticos e consequentemente nos tratamentos.
              </p>
            </motion.div>
          </motion.div>
        </Container>
      </section>

      {/* Credentials Section */}
      <section id="credenciais" className="bg-bg-secondary py-16 md:py-24">
        <Container>
          <motion.div
            className="mb-12 text-center"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-3xl font-bold text-primary md:text-4xl">Credenciais e Certificações</h2>
            <p className="mt-3 text-gray-400">
              Qualificações profissionais e certificações médicas
            </p>
          </motion.div>

          <motion.div
            className="grid gap-6 md:grid-cols-2 lg:grid-cols-4"
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
                  <div className="space-y-3">
                    <h3 className="text-lg font-semibold text-surgical-teal">{credential.title}</h3>
                    <p className="text-base text-primary">{credential.value}</p>
                  </div>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        </Container>
      </section>

      {/* Experience Section */}
      <section id="experiencia" className="py-16 md:py-24">
        <Container>
          <motion.div
            className="mb-12 text-center"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-3xl font-bold text-primary md:text-4xl">Experiência Profissional</h2>
            <p className="mt-3 text-gray-400">
              Trajetória de excelência em cuidado vascular
            </p>
          </motion.div>

          <motion.div
            className="space-y-6"
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
                className="border-l-4 border-surgical-teal pl-4"
                variants={itemVariants}
              >
                <p className="text-sm font-semibold text-surgical-teal">{experience.year}</p>
                <h3 className="mt-2 text-xl font-semibold text-primary">{experience.title}</h3>
                <p className="mt-1 text-gray-400">{experience.institution}</p>
              </motion.div>
            ))}
          </motion.div>
        </Container>
      </section>

      {/* Real doctor photos — clinical practice */}
      <section className="py-16 md:py-24">
        <Container>
          <motion.div
            className="mb-12 text-center"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-3xl font-bold text-primary md:text-4xl">Prática Clínica</h2>
            <p className="mt-3 text-gray-400">
              Capturas reais do Dr. Herlon em consultório, com equipamentos de diagnóstico.
            </p>
          </motion.div>

          <motion.div
            className="grid gap-6 md:grid-cols-3"
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            {[
              { src: '/images/fotos/photo-04.webp', alt: 'Dr. Herlon Moura em consultório', caption: 'Foto 04 — consultório' },
              { src: '/images/fotos/photo-08.webp', alt: 'Dr. Herlon sorrindo', caption: 'Foto 08 — atendimento' },
              { src: '/images/fotos/photo-09.webp', alt: 'Dr. Herlon realizando ultrassom', caption: 'Foto 09 — ultrassom' },
            ].map((photo, index) => (
              <div key={photo.src} className="rounded-2xl border p-3" style={{ borderColor: 'var(--c-card-border)' }}>
                <div className="overflow-hidden rounded-xl">
                  <Image
                    src={photo.src}
                    alt={photo.alt}
                    width={360}
                    height={280}
                    className="w-full h-36 object-cover"
                  />
                </div>
                <p className="mt-2 text-center text-caption" style={{ color: 'var(--s-color-content-muted)' }}>{photo.caption}</p>
              </div>
            ))}
          </motion.div>
        </Container>
      </section>

      {/* Practice Philosophy Section */}
      <section className="bg-bg-secondary py-16 md:py-24">
        <Container>
          <motion.div
            className="mb-12 text-center"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-3xl font-bold text-primary md:text-4xl">Filosofia de Prática</h2>
          </motion.div>

          <motion.div
            className="grid gap-6 md:grid-cols-3"
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
                  <h3 className="mb-3 text-lg font-semibold text-surgical-teal">{philosophy.title}</h3>
                  <p className="text-secondary">{philosophy.description}</p>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        </Container>
      </section>

      {/* Location & Technology Section */}
      <section className="py-16 md:py-24" style={{ backgroundColor: 'var(--s-color-bg-canvas)' }}>
        <Container>
          <motion.div
            className="mb-12 text-center"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-3xl font-bold text-primary md:text-4xl">Localização e Tecnologia</h2>
            <p className="mt-3 text-gray-400">
              Consultório equipado com tecnologia de ponta no coração de Salvador
            </p>
          </motion.div>

          <div className="grid gap-8 lg:grid-cols-2 lg:items-center">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="relative overflow-hidden rounded-2xl border"
              style={{ borderColor: 'var(--c-card-border)', boxShadow: 'var(--c-card-shadow)' }}
            >
              <Image
                src="/images/support/clinica-clap-recepcao.webp"
                alt="Recepção do consultório do Dr. Herlon Moura"
                width={600}
                height={400}
                className="h-auto w-full object-cover"
              />
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="space-y-6"
            >
              <div className="space-y-4">
                {[
                  { title: 'Eco-Doppler Colorido', desc: 'Equipamento de última geração para diagnóstico vascular preciso e indolor.' },
                  { title: 'Consultório no Coração da Graça', desc: 'Localização privilegiada em Salvador, com fácil acesso para toda a região metropolitana.' },
                  { title: 'Tecnologia Minimamente Invasiva', desc: 'Equipamentos de ponta para procedimentos com menor tempo de recuperação.' },
                  { title: 'Ambiente Acolhedor', desc: 'Espaço confortável e humanizado, projetado para o bem-estar do paciente.' },
                ].map((feature) => (
                  <div key={feature.title} className="flex items-start gap-4">
                    <div
                      className="mt-0.5 flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full"
                      style={{ backgroundColor: 'var(--s-color-bg-accent)', color: 'var(--g-color-base-primary)' }}
                    >
                      <svg className="h-3.5 w-3.5" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold" style={{ color: 'var(--s-color-content-heading)' }}>{feature.title}</h3>
                      <p className="mt-1 text-body-small" style={{ color: 'var(--s-color-content-muted)' }}>{feature.desc}</p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="rounded-xl border p-6" style={{ borderColor: 'var(--c-card-border)', backgroundColor: 'var(--s-color-bg-surface)' }}>
                <h3 className="mb-3 text-lg font-semibold" style={{ color: 'var(--s-color-content-heading)' }}>Endereço</h3>
                <p className="text-body-regular" style={{ color: 'var(--s-color-content-body)' }}>
                  R. Eng. Célso Tôrres, 654 - Graça<br />
                  Salvador - BA, Brasil
                </p>
              </div>
            </motion.div>
          </div>
        </Container>
      </section>

      {/* CTA Section */}
      <section className="py-16 md:py-24">
        <Container>
          <motion.div
            className="rounded-xl bg-gradient-to-r from-surgical-teal to-surgical-teal-dark p-12 text-center"
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="mb-4 text-3xl font-bold text-dark-elevated md:text-4xl">
              Pronto para Agendar sua Consulta?
            </h2>
            <p className="mb-8 text-lg text-dark-elevated">
              Entre em contato conosco para marcar uma consulta com Dr. Herlon Moura
            </p>
            <Link
              href="/agendamento"
              className="inline-flex items-center justify-center rounded-lg bg-dark-elevated px-8 py-4 font-semibold text-surgical-teal transition-all hover:bg-neutral-light"
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
