'use client';

import { Header, Footer, Container } from '@/components';
import { Logo } from '@/components';
import { motion } from 'framer-motion';
import Image from 'next/image';
import { Mail, Phone, MapPin, MessageCircle } from 'lucide-react';
import { contactPageSchema } from '@/lib/structured-data';

export default function ContactPage() {
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
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(contactPageSchema()) }}
      />
      <Header
        logo={<Logo size="md" animated={false} />}
        navItems={navItems}
        ctaButton={{ label: 'Agendar Consulta', href: '/agendamento' }}
      />

      {/* Hero Section with clinic photo */}
      <section className="relative overflow-hidden py-20 md:py-32" style={{ backgroundColor: 'var(--s-color-bg-surface)' }}>
        <div className="mx-auto w-full max-w-container px-4 sm:px-6 lg:px-8">
          <div className="grid items-center gap-12 lg:grid-cols-2">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              <h1 className="mb-lg text-display-lg font-bold" style={{ color: 'var(--s-color-content-heading)' }}>
                Entre em Contato
              </h1>
              <p className="mx-auto max-w-2xl text-body-lg" style={{ color: 'var(--s-color-content-body)' }}>
                Estamos aqui para responder suas perguntas e agendar sua consulta
              </p>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.15 }}
              className="relative overflow-hidden rounded-2xl border"
              style={{ borderColor: 'var(--c-card-border)', boxShadow: 'var(--c-card-shadow)' }}
            >
              <Image
                src="/images/support/consultorio-recepcao.webp"
                alt="Recepção do consultório do Dr. Herlon Moura em Salvador, BA"
                width={600}
                height={400}
                className="h-auto w-full object-cover"
              />
            </motion.div>
          </div>
        </div>
      </section>

      {/* Precisa de ajuda? */}
      <section className="py-20 md:py-32" style={{ backgroundColor: 'var(--s-color-bg-canvas)' }}>
        <Container>
          <motion.div
            className="mb-12 text-center"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-heading-1 font-bold" style={{ color: 'var(--s-color-content-heading)' }}>
              Precisa de ajuda?
            </h2>
            <p className="mt-3 text-body-lg" style={{ color: 'var(--s-color-content-muted)' }}>
              Escolha o canal de contato que preferir
            </p>
          </motion.div>
          <motion.div
            className="grid gap-lg md:grid-cols-2 lg:grid-cols-4"
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            {[
              {
                icon: Phone,
                title: 'Telefone',
                value: '(71) 98344-9737',
                href: 'tel:+557****9737',
              },
              {
                icon: MessageCircle,
                title: 'WhatsApp',
                value: '(71) 99915-9975',
                href: 'https://api.whatsapp.com/send/?phone=5571999159975',
              },
              {
                icon: Mail,
                title: 'Email',
                value: 'contato@herlonmoura.com.br',
                href: 'mailto:contato@herlonmoura.com.br',
              },
              {
                icon: MapPin,
                title: 'Localização',
                value: 'R. Eng. Célso Tôrres, 654 - Graça, Salvador - BA',
                href: '#mapa',
              },
            ].map((contact, index) => {
              const Icon = contact.icon;
              return (
                <motion.a
                  key={index}
                  href={contact.href}
                  className="rounded-xl border bg-glass p-lg transition-all hover:border-surgical-teal hover:bg-glass-hover"
                  variants={itemVariants}
                >
                  <Icon className="mb-md h-8 w-8 text-surgical-teal" />
                  <h3 className="mb-md text-heading-3 font-semibold text-neutral-light">{contact.title}</h3>
                  <p className="text-body-regular text-neutral-medium">{contact.value}</p>
                </motion.a>
              );
            })}
          </motion.div>
        </Container>
      </section>

      {/* Google Map */}
      <section id="mapa" className="py-20 md:py-32" style={{ backgroundColor: 'var(--s-color-bg-surface)' }}>
        <Container>
          <motion.div
            className="mb-12 text-center"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-heading-1 font-bold" style={{ color: 'var(--s-color-content-heading)' }}>
              Nossa Localização
            </h2>
            <p className="mt-3 text-body-lg" style={{ color: 'var(--s-color-content-muted)' }}>
              R. Eng. Célso Tôrres, 654 - Graça, Salvador - BA
            </p>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="overflow-hidden rounded-xl border"
            style={{ borderColor: 'var(--c-card-border)', boxShadow: 'var(--c-card-shadow)' }}
          >
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3887.5!2d-38.5219!3d-13.0056!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMTPCsDAwJzE3LjgiUyAzOMKwMzEnMTguOCJX!5e0!3m2!1spt-BR!2sbr!4v1697000000000!5m2!1spt-BR!2sbr"
              width="100%"
              height="400"
              style={{ border: 0 }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title="Mapa do Consultório Dr. Herlon Moura"
            />
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
