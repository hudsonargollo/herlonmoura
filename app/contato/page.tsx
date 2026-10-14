'use client';

import { Header, Footer, Container, FormInput, Label, Button, ErrorMessage } from '@/components';
import { Logo } from '@/components';
import { motion } from 'framer-motion';
import { useState } from 'react';
import Image from 'next/image';
import { Mail, Phone, MapPin, MessageCircle } from 'lucide-react';
import { contactPageSchema } from '@/lib/structured-data';

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: '',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitted, setSubmitted] = useState(false);

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

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Nome é obrigatório';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email é obrigatório';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Email inválido';
    }

    if (!formData.phone.trim()) {
      newErrors.phone = 'Telefone é obrigatório';
    }

    if (!formData.subject.trim()) {
      newErrors.subject = 'Assunto é obrigatório';
    }

    if (!formData.message.trim()) {
      newErrors.message = 'Mensagem é obrigatória';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    try {
      const res = await fetch('/api/crm/leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: formData.name,
          whatsapp: formData.phone,
          email: formData.email,
          source: 'contact',
          source_detail: formData.subject,
          tags: ['contact-form'],
        }),
      });

      if (!res.ok) throw new Error(`CRM error: ${res.status}`);

      setSubmitted(true);
      setFormData({ name: '', email: '', phone: '', subject: '', message: '' });
      setTimeout(() => setSubmitted(false), 5000);
    } catch (error) {
      console.error('Error submitting form:', error);
    }
  };

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

      {/* Contact Form */}
      <section className="bg-neutral-dark py-20 md:py-32">
        <Container>
          <motion.div
            className="mx-auto max-w-2xl"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="mb-lg text-heading-1 font-bold text-neutral-light">Envie uma Mensagem</h2>

            {submitted && (
              <motion.div
                className="mb-lg rounded-lg border border-success-green bg-success-green bg-opacity-10 p-lg"
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
              >
                <p className="text-body-regular text-success-green">
                  Obrigado! Sua mensagem foi enviada com sucesso. Entraremos em contato em breve.
                </p>
              </motion.div>
            )}

            <form onSubmit={handleSubmit} className="space-y-lg">
              {/* Name Field */}
              <motion.div variants={itemVariants}>
                <Label required>Nome Completo</Label>
                <FormInput
                  type="text"
                  placeholder="Seu nome"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  state={errors.name ? 'error' : 'default'}
                  errorMessage={errors.name}
                />
              </motion.div>

              {/* Email Field */}
              <motion.div variants={itemVariants}>
                <Label required>Email</Label>
                <FormInput
                  type="email"
                  placeholder="seu.email@exemplo.com"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  state={errors.email ? 'error' : 'default'}
                  errorMessage={errors.email}
                />
              </motion.div>

              {/* Phone Field */}
              <motion.div variants={itemVariants}>
                <Label required>Telefone</Label>
                <FormInput
                  type="tel"
                  placeholder="(71) 9999-9999"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  state={errors.phone ? 'error' : 'default'}
                  errorMessage={errors.phone}
                />
              </motion.div>

              {/* Subject Field */}
              <motion.div variants={itemVariants}>
                <Label required>Assunto</Label>
                <FormInput
                  type="text"
                  placeholder="Assunto da sua mensagem"
                  value={formData.subject}
                  onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                  state={errors.subject ? 'error' : 'default'}
                  errorMessage={errors.subject}
                />
              </motion.div>

              {/* Message Field */}
              <motion.div variants={itemVariants}>
                <Label required>Mensagem</Label>
                <textarea
                  placeholder="Sua mensagem aqui..."
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  className={`w-full rounded-lg border px-lg py-md font-regular text-neutral-light placeholder-neutral-medium transition-all ${
                    errors.message
                      ? 'border-error-red bg-error-red bg-opacity-10'
                      : 'border-glass bg-glass hover:border-surgical-teal focus:border-surgical-teal focus:outline-none'
                  }`}
                  rows={6}
                />
                {errors.message && <ErrorMessage message={errors.message} />}
              </motion.div>

              {/* Submit Button */}
              <motion.div variants={itemVariants}>
                <Button
                  type="submit"
                  variant="primary"
                  size="lg"
                  className="w-full"
                >
                  Enviar Mensagem
                </Button>
              </motion.div>
            </form>
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
