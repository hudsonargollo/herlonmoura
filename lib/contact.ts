// Central contact configuration.
// The WhatsApp number below is the SECRETARY's line: all CTAs route here.
export const SECRETARY_WHATSAPP = '5571999159975';
export const CLINIC_PHONE = '(71) 98344-9737';
export const CLINIC_PHONE_TEL = '+5571993449737';
export const CLINIC_ADDRESS = 'R. Eng. Célso Tôrres, 654 - Graça, Salvador - BA';

export type InsuranceChoice = 'particular' | 'convenio';

export interface ContactLead {
  name: string;
  email: string;
  insurance: InsuranceChoice;
  insuranceName?: string;
}

/** Build a prefilled WhatsApp (wa.me) deep link that carries the lead's details. */
export function buildWhatsappLink(lead: ContactLead, extra?: string): string {
  const lines: string[] = [];
  lines.push(`Olá! Gostaria de falar com a secretaria do Dr. Herlon Moura.`);
  lines.push('');
  lines.push(`Nome: ${lead.name}`);
  lines.push(`E-mail: ${lead.email}`);
  lines.push(
    lead.insurance === 'convenio'
      ? `Atendimento: Convênio${lead.insuranceName ? ` — ${lead.insuranceName}` : ''}`
      : 'Atendimento: Particular'
  );
  if (extra) {
    lines.push('');
    lines.push(extra);
  }
  const text = encodeURIComponent(lines.join('\n'));
  return `https://wa.me/${SECRETARY_WHATSAPP}?text=${text}`;
}
