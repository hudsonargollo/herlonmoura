/* ============================================
   Modal copy, per interest.

   The contact modal is the conversion step. When a visitor arrives from a
   specific procedure, generic copy ("Preencha seus dados abaixo e a equipe…")
   is both heavy and vague — it says nothing about what they asked for and
   buries the reason they clicked.

   This module supplies a short, specific headline + one-line reason per
   procedure so the modal confirms the visitor's choice and asks for the
   minimum needed. Copy rules:
     - headline: 2-5 words, names the action
     - note: ONE short sentence, ~12 words max
     - facts: reuse the procedure's `quickFacts` (3 fragments)
   ============================================ */

import { PROCEDURES } from './procedures';

export interface InterestCopy {
  headline: string;
  note: string;
  facts: string[];
}

/** Per-procedure modal copy, keyed by procedure slug. */
const BY_SLUG: Record<string, { headline: string; note: string }> = {
  'doppler-vascular': {
    headline: 'Agendar seu Doppler',
    note: 'Exame no consultório, com o resultado explicado na hora.',
  },
  'varizes-laser': {
    headline: 'Avaliar suas varizes',
    note: 'O laser trata a veia doente sem cortes e com retorno rápido.',
  },
  'escleroterapia-espuma': {
    headline: 'Avaliar escleroterapia',
    note: 'A espuma trata vasinhos e varizes no próprio consultório.',
  },
  'microcirurgia-varizes': {
    headline: 'Avaliar microcirurgia',
    note: 'Remoção das varizes por incisões milimétricas, sem internação.',
  },
  'cateter-port-o-cath': {
    headline: 'Falar sobre o Port-o-Cath',
    note: 'Acesso implantável que evita punções repetidas na quimioterapia.',
  },
  'cateter-permcath': {
    headline: 'Falar sobre o Permcath',
    note: 'Acesso de longa permanência para hemodiálise, com avaliação prévia.',
  },
  'fistula-arteriovenosa': {
    headline: 'Avaliar a fístula (FAV)',
    note: 'A FAV é o acesso mais duradouro para hemodiálise.',
  },
  'trombose-venosa': {
    headline: 'Falar sobre trombose',
    note: 'Caso de trombose venosa tem prioridade na agenda.',
  },
  'trombose-arterial': {
    headline: 'Falar sobre trombose arterial',
    note: 'Interrupção súbita do fluxo é emergência — atendimento prioritário.',
  },
  'obstrucao-arterial-cronica': {
    headline: 'Avaliar a obstrução',
    note: 'A avaliação define o tratamento e o controle dos fatores de risco.',
  },
  'angioplastia-membros-inferiores': {
    headline: 'Avaliar angioplastia',
    note: 'Desobstrução das artérias das pernas por técnica endovascular.',
  },
  'obstrucoes-carotidas': {
    headline: 'Avaliar as carótidas',
    note: 'O Doppler mede o estreitamento e orienta a conduta.',
  },
  'aneurisma-aorta': {
    headline: 'Falar sobre o aneurisma',
    note: 'O tratamento endovascular corrige a aorta sem abrir o abdômen.',
  },
  'disseccao-aorta': {
    headline: 'Falar sobre a dissecção',
    note: 'Correção por dentro do vaso, com menor agressão cirúrgica.',
  },
  'aneurismas-viscerais': {
    headline: 'Avaliar o aneurisma',
    note: 'A conduta depende do estudo de imagem de cada caso.',
  },
};

/** Section-level fallbacks, keyed by the analytics section id. */
const BY_SECTION: Record<string, { headline: string; note: string }> = {
  hero: {
    headline: 'Agendar consulta',
    note: 'Atendimento na Graça, em Salvador — particular e convênios.',
  },
  procedimentos: {
    headline: 'Tirar dúvidas',
    note: 'Conte o que você precisa e a equipe orienta o próximo passo.',
  },
  'procedimentos-hero': {
    headline: 'Tirar dúvidas',
    note: 'Conte o que você precisa e a equipe orienta o próximo passo.',
  },
  'procedimentos-cta': {
    headline: 'Agendar consulta',
    note: 'Atendimento na Graça, em Salvador — particular e convênios.',
  },
  sintomas: {
    headline: 'Agendar avaliação',
    note: 'Sintomas circulatórios merecem avaliação vascular.',
  },
  'calculadora-tvp': {
    headline: 'Agendar avaliação',
    note: 'A calculadora é uma triagem — a avaliação confirma o quadro.',
  },
  sobre: {
    headline: 'Agendar consulta',
    note: 'Atendimento humanizado com tecnologia de imagem no consultório.',
  },
  contato: {
    headline: 'Agendar consulta',
    note: 'Atendimento na Graça, em Salvador — particular e convênios.',
  },
};

/**
 * Resolve the modal copy for a section id and optional free-text interest.
 *
 * `sectionId` may be `procedure:<slug>` (from the procedure cards) or a plain
 * section name. Falls back to generic copy rather than showing nothing.
 */
export function getInterestCopy(sectionId?: string, interest?: string): InterestCopy {
  // 1. Procedure section id — the strongest signal.
  if (sectionId?.startsWith('procedure:')) {
    const slug = sectionId.slice('procedure:'.length);
    const proc = PROCEDURES.find((p) => p.slug === slug);
    const copy = BY_SLUG[slug];
    if (copy) {
      return {
        headline: copy.headline,
        note: copy.note,
        facts: proc?.quickFacts ?? [],
      };
    }
  }

  // 2. Section-level fallback.
  if (sectionId && BY_SECTION[sectionId]) {
    const copy = BY_SECTION[sectionId];
    return { headline: copy.headline, note: copy.note, facts: [] };
  }

  // 3. Generic.
  return {
    headline: 'Agendar consulta',
    note: interest
      ? 'Informe seus dados e a equipe continua no WhatsApp.'
      : 'Atendimento na Graça, em Salvador — particular e convênios.',
    facts: [],
  };
}
