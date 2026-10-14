// Central contact configuration.
// The WhatsApp number below is the SECRETARY's line: all CTAs route here.
export const SECRETARY_WHATSAPP = '5571999159975';
export const CLINIC_PHONE = '(71) 98344-9737';
export const CLINIC_PHONE_TEL = '+5571983449737';
export const CLINIC_ADDRESS = 'R. Eng. Célso Tôrres, 654 - Graça, Salvador - BA';

/** Base URL for the live site (used to build absolute links in WhatsApp messages). */
export const ADMIN_BASE_URL = 'https://www.herlonmoura.clubemkt.digital';
/** Path prefix for the secretary's CRM patient cards. */
export const ADMIN_CRMLINK_PATH = '/admin/crm';

/** Cal.com self-hosted scheduler URL for direct appointment booking. */
export const SCHEDULER_URL = 'https://cal.herlonmoura.clubemkt.digital';

export type InsuranceChoice = 'particular' | 'convenio';

export interface ContactLead {
  name: string;
  email: string;
  insurance: InsuranceChoice;
  insuranceName?: string;
}

/**
 * Build a prefilled WhatsApp (wa.me) deep link that carries the lead's details.
 *
 * The message format starts with "Agendar consulta." followed by the lead's
 * name, email, and insurance type. It ends with "gostaria de agendar uma
 * consulta..." — keeping it concise and action-oriented per user preference
 * (no "Gostaria de falar com a secretaria" preamble).
 */
export function buildWhatsappLink(
  lead: ContactLead,
  extra?: string,
  leadId?: string
): string {
  const lines: string[] = [];
  lines.push('Agendar consulta.');
  lines.push(`Nome: ${lead.name}`);
  lines.push(`E-mail: ${lead.email}`);
  lines.push(
    lead.insurance === 'convenio'
      ? `Atendimento: Convênio — ${lead.insuranceName || 'não informado'}`
      : 'Atendimento: Particular'
  );
  lines.push('gostaria de agendar uma consulta...');
  if (extra) {
    lines.push('');
    lines.push(extra);
  }
  if (leadId) {
    lines.push('');
    lines.push(
      `Ficha do paciente: ${ADMIN_BASE_URL}${ADMIN_CRMLINK_PATH}/${leadId}`
    );
  }
  const text = encodeURIComponent(lines.join('\n'));
  return `https://wa.me/${SECRETARY_WHATSAPP}?text=${text}`;
}
