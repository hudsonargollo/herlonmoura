import { describe, it, expect } from 'vitest';
import { buildWhatsappLink, type ContactLead, type InsuranceChoice } from '../contact';

describe('buildWhatsappLink', () => {
  const baseLead: ContactLead = {
    name: 'Hudson',
    email: 'hudsonargollo@gmail.com',
    insurance: 'convenio',
    insuranceName: 'Bradesco Saúde',
  };

  describe('Message Format', () => {
    it('starts with "Agendar consulta." (no "Olá" preamble)', () => {
      const link = buildWhatsappLink(baseLead);
      const decoded = decodeURIComponent(link.split('text=')[1]);
      const firstLine = decoded.split('\n')[0];
      expect(firstLine).toBe('Agendar consulta.');
    });

    it('includes name, email, and insurance type', () => {
      const link = buildWhatsappLink(baseLead);
      const decoded = decodeURIComponent(link.split('text=')[1]);
      expect(decoded).toContain('Nome: Hudson');
      expect(decoded).toContain('E-mail: hudsonargollo@gmail.com');
      expect(decoded).toContain('Atendimento: Convênio — Bradesco Saúde');
    });

    it('ends with "gostaria de agendar uma consulta..."', () => {
      const link = buildWhatsappLink(baseLead);
      const decoded = decodeURIComponent(link.split('text=')[1]);
      const lines = decoded.split('\n');
      const lastRealLine = lines.filter(l => l.trim().length > 0).pop();
      expect(lastRealLine).toBe('gostaria de agendar uma consulta...');
    });

    it('does NOT include "Gostaria de falar com a secretaria"', () => {
      const link = buildWhatsappLink(baseLead);
      const decoded = decodeURIComponent(link.split('text=')[1]);
      expect(decoded).not.toContain('Gostaria de falar com a secretaria');
      expect(decoded).not.toContain('secretaria do Dr. Herlon Moura');
    });
  });

  describe('Insurance Types', () => {
    it('shows "Particular" for particular insurance', () => {
      const lead: ContactLead = { ...baseLead, insurance: 'particular' as InsuranceChoice };
      const link = buildWhatsappLink(lead);
      const decoded = decodeURIComponent(link.split('text=')[1]);
      expect(decoded).toContain('Atendimento: Particular');
    });

    it('shows "Convênio — <name>" for convenio insurance', () => {
      const lead: ContactLead = { ...baseLead, insurance: 'convenio', insuranceName: 'SulAmérica' };
      const link = buildWhatsappLink(lead);
      const decoded = decodeURIComponent(link.split('text=')[1]);
      expect(decoded).toContain('Atendimento: Convênio — SulAmérica');
    });
  });

  describe('Lead ID', () => {
    it('includes patient card link when leadId is provided', () => {
      const link = buildWhatsappLink(baseLead, undefined, 't_12345');
      const decoded = decodeURIComponent(link.split('text=')[1]);
      expect(decoded).toContain('https://www.herlonmoura.clubemkt.digital/admin/crm/t_12345');
    });

    it('does NOT include patient card link when leadId is omitted', () => {
      const link = buildWhatsappLink(baseLead);
      const decoded = decodeURIComponent(link.split('text=')[1]);
      expect(decoded).not.toContain('/admin/crm/');
    });
  });

  describe('Extra Context', () => {
    it('includes extra context after the main info', () => {
      const link = buildWhatsappLink(baseLead, 'Vindo da landing page de varizes');
      const decoded = decodeURIComponent(link.split('text=')[1]);
      expect(decoded).toContain('Vindo da landing page de varizes');
    });
  });

  describe('WhatsApp URL', () => {
    it('targets the secretary WhatsApp number', () => {
      const link = buildWhatsappLink(baseLead);
      expect(link).toContain('https://wa.me/5571999159975');
    });
  });
});
