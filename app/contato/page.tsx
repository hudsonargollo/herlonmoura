'use client';

import { Header, Footer, Container, FormInput, Label, Button, ErrorMessage } from '@/components';
import { Logo } from '@/components';
import { motion } from 'framer-motion';
import { useState } from 'react';
import { Mail, Phone, MapPin } from 'lucide-react';

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
    <main className="min-h-screen bg-background">
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
            <h1 className="mb-lg text-display-lg font-bold text-foreground md:text-display-lg">
              Entre em Contato
            </h1>
            <p className="mx-auto max-w-2xl text-body-lg text-muted-foreground">
              Estamos aqui para responder suas perguntas e agendar sua consulta
            </p>
          </motion.div>
        </Container>
      </section>

      {/* Contact Information */}
      <section className="py-20 md:py-32">
        <Container>
          <motion.div
            className="grid gap-lg md:grid-cols-3"
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
                href: 'tel:+5571983449737',
              },
              {
                icon: Phone,
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
                href: '#',
              },
            ].map((contact, index) => {
              const Icon = contact.icon;
              return (
                <motion.a
                  key={index}
                  href={contact.href}
                  className="rounded-xl border border-glass bg-glass p-lg transition-all hover:border-primary hover:bg-glass-hover"
                  variants={itemVariants}
                >
                  <Icon className="mb-md h-8 w-8 text-primary" />
                  <h3 className="mb-md text-heading-3 font-semibold text-foreground">{contact.title}</h3>
                  <p className="text-body-regular text-muted-foreground">{contact.value}</p>
                </motion.a>
              );
            })}
          </motion.div>
        </Container>
      </section>

      {/* Contact Form */}
      <section className="bg-muted py-20 md:py-32">
        <Container>
          <motion.div
            className="mx-auto max-w-2xl"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="mb-lg text-heading-1 font-bold text-foreground">Envie uma Mensagem</h2>

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
                  className={`w-full rounded-lg border px-lg py-md font-regular text-foreground placeholder-neutral-medium transition-all ${
                    errors.message
                      ? 'border-error-red bg-error-red bg-opacity-10'
                      : 'border-glass bg-glass hover:border-primary focus:border-primary focus:outline-none'
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
