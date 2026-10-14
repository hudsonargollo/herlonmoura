// Central contact configuration.
// The WhatsApp number below is the SECRETARY's line: all CTAs route here.
export const SECRETARY_WHATSAPP = '5571999159975';
export const CLINIC_PHONE = '(71) 98344-9737';
export const CLINIC_PHONE_TEL = '+5571983449737';
export const CLINIC_ADDRESS = 'R. Eng. Célso Tôrres, 654 - Graça, Salvador - BA';

/** Base URL for the live site (apex custom domain — no www). */
export const ADMIN_BASE_URL = 'https://herlonmoura.clubemkt.digital';
/** CRM patient-card path. Static export bakes only the `_` param. */
export const ADMIN_CRMLINK_PATH = '/admin/crm';

/** Cal.com self-hosted scheduler URL for direct appointment booking. */
export const SCHEDULER_URL = 'https://cal.clubemkt.digital';

export type InsuranceChoice = 'particular' | 'convenio';

export interface ContactLead {
  name: string;
  email: string;
  whatsapp?: string;
  insurance: InsuranceChoice;
  insuranceName?: string;
  /** What the visitor is specifically interested in (procedure, section). */
  interest?: string;
  /** Coarse origin: which section/CTA produced the lead. */
  sourceSection?: string;
}

/**
 * Build a prefilled WhatsApp (wa.me) deep link that carries the lead's details.
 *
 * The message opens with the lead's stated interest when there is one, so the
 * secretary sees what the person wants before anything else. Name, e-mail and
 * insurance follow, then the booking line. Concise and action-oriented.
 */
export function buildWhatsappLink(
  lead: ContactLead,
  extra?: string,
  leadId?: string
): string {
  const lines: string[] = [];

  if (lead.interest) {
    lines.push(`Interesse: ${lead.interest}`);
    lines.push('');
  }

  lines.push('Agendar consulta.');
  lines.push(`Nome: ${lead.name}`);
  lines.push(`E-mail: ${lead.email}`);
  if (lead.whatsapp) lines.push(`WhatsApp: ${lead.whatsapp}`);
  lines.push(
    lead.insurance === 'convenio'
      ? `Atendimento: Convênio — ${lead.insuranceName || 'não informado'}`
      : 'Atendimento: Particular'
  );
  lines.push('gostaria de agendar uma consulta...');

  // `extra` carries the human context. Skip it when it merely repeats the
  // interest already shown at the top of the message.
  const extraRedundant =
    !!extra && !!lead.interest && extra.toLowerCase().includes(lead.interest.toLowerCase());
  if (extra && !extraRedundant) {
    lines.push('');
    lines.push(extra);
  }
  if (leadId) {
    lines.push('');
    // Static export bakes only the `_` param; the real id travels as a query
    // param and CRMLeadDetail reads it when the route param is `_`.
    lines.push(`Ficha do paciente: ${ADMIN_BASE_URL}${ADMIN_CRMLINK_PATH}/_?id=${leadId}`);
  }
  const text = encodeURIComponent(lines.join('\n'));
  return `https://wa.me/${SECRETARY_WHATSAPP}?text=${text}`;
}
