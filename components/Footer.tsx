import React from 'react';
import Link from 'next/link';
import { Logo } from './Logo';
import { MapPin, Phone, MessageCircle, ShieldCheck } from 'lucide-react';

interface FooterSection {
  title: string;
  links: Array<{ label: string; href: string }>;
}

interface FooterProps {
  sections?: FooterSection[];
  socialLinks?: Array<{ label: string; href: string; icon?: React.ReactNode }>;
  copyright?: string;
}

export function Footer({
  sections = [
    {
      title: 'Procedimentos',
      links: [
        { label: 'Doppler Vascular', href: '/#procedimentos' },
        { label: 'Varizes com Laser', href: '/#procedimentos' },
        { label: 'Escleroterapia com Espuma', href: '/#procedimentos' },
        { label: 'Microcirurgia de Varizes', href: '/#procedimentos' },
        { label: 'Cateter Port-a-Cath', href: '/#procedimentos' },
        { label: 'Cateter Permcath', href: '/#procedimentos' },
      ],
    },
    {
      title: 'Ferramentas & Recursos',
      links: [
        { label: 'Calculadora de Risco de TVP', href: '/calculadora-dvt' },
        { label: 'Mapeamento de Sintomas', href: '/#sintomas' },
        { label: 'Sobre o Especialista', href: '/sobre' },
        { label: 'Contato & Localização', href: '/contato' },
      ],
    },
  ],
  copyright = `© ${new Date().getFullYear()} Dr. Herlon Moura dos Santos. Todos os direitos reservados.`,
}: FooterProps) {
  const heading = { color: 'var(--s-color-content-heading)' } as React.CSSProperties;

  return (
    <footer
      className="border-t"
      style={{
        borderColor: 'var(--c-card-border)',
        backgroundColor: 'var(--s-color-bg-surface)',
        color: 'var(--s-color-content-muted)',
      }}
    >
      <div className="mx-auto w-full max-w-container px-4 py-12 sm:px-6 lg:py-16">
        <div className="grid grid-cols-1 gap-10 md:grid-cols-2 lg:grid-cols-4">
          {/* Brand Info */}
          <div className="space-y-4">
            <Link href="/" className="inline-block">
              <Logo size="md" />
            </Link>
            <p className="text-caption leading-relaxed" style={{ color: 'var(--s-color-content-muted)' }}>
              Dr. Herlon Moura dos Santos
              <br />
              <strong style={heading}>Cirurgião Vascular e Endovascular</strong>
              <br />
              CRM/BA 23904 • RQE Nº 19791 / RQE Nº 22436
              <br />
              Graduação pela Universidade Federal da Bahia (UFBA)
            </p>
            <div className="flex items-center gap-1.5 text-caption" style={{ color: 'var(--s-color-action-primary)' }}>
              <ShieldCheck className="h-4 w-4" />
              <span>Atendimento em conformidade com o CFM</span>
            </div>
          </div>

          {/* Links sections */}
          {sections.map((section) => (
            <div key={section.title}>
              <h3 className="mb-4 text-body-small font-bold uppercase tracking-wider" style={heading}>
                {section.title}
              </h3>
              <ul className="space-y-2.5 text-caption">
                {section.links.map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      style={{ color: 'var(--s-color-content-muted)' }}
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}

          {/* Contact Details */}
          <div>
            <h3 className="mb-4 text-body-small font-bold uppercase tracking-wider" style={heading}>
              Consultório Salvador
            </h3>
            <ul className="space-y-3 text-caption" style={{ color: 'var(--s-color-content-muted)' }}>
              <li className="flex items-start gap-2">
                <MapPin className="mt-0.5 h-4 w-4 flex-shrink-0" style={{ color: 'var(--s-color-action-primary)' }} />
                <span>R. Eng. Célso Tôrres, 654 - Graça, Salvador - BA</span>
              </li>
              <li className="flex items-center gap-2">
                <Phone className="h-4 w-4 flex-shrink-0" style={{ color: 'var(--s-color-action-primary)' }} />
                <a href="tel:+5571983449737" style={{ color: 'var(--s-color-content-muted)' }}>
                  (71) 98344-9737
                </a>
              </li>
              <li className="flex items-center gap-2">
                <MessageCircle className="h-4 w-4 flex-shrink-0" style={{ color: 'var(--g-color-success)' }} />
                <a
                  href="https://wa.me/5571999159975"
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{ color: 'var(--g-color-success)' }}
                >
                  WhatsApp: (71) 99915-9975
                </a>
              </li>
            </ul>
            <div className="mt-5">
              <a
                href="https://wa.me/5571999159975?text=Olá%20Dr.%20Herlon,%20gostaria%20de%20agendar%20uma%20consulta."
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex w-full items-center justify-center gap-2 px-4 py-2.5 text-caption"
                style={{
                  backgroundColor: 'var(--c-button-primary-bg)',
                  color: 'var(--c-button-primary-text)',
                  borderRadius: 'var(--c-button-radius)',
                  fontWeight: 600,
                }}
              >
                <MessageCircle className="h-4 w-4" />
                Agendar no WhatsApp
              </a>
            </div>
          </div>
        </div>

        {/* Legal notice & Copyright */}
        <div
          className="mt-12 border-t pt-8 text-center text-caption"
          style={{ borderColor: 'var(--c-card-border)', color: 'var(--s-color-content-muted)' }}
        >
          <p className="mx-auto mb-4 max-w-3xl leading-relaxed" style={{ color: 'var(--s-color-content-muted)' }}>
            Aviso Legal: As informações contidas neste website têm caráter puramente informativo e educativo, destinadas à orientação do público e não substituem o diagnóstico ou consulta presencial realizada por médico especialista, em conformidade com as resoluções do Conselho Federal de Medicina (CFM).
          </p>
          <p>{copyright}</p>
        </div>
      </div>
    </footer>
  );
}
