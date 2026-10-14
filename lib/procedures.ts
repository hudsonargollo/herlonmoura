import type { CliniqIconName } from '@/components/CliniqIcon';

/* ============================================
   Procedures — single source of truth.

   Titles and descriptions are taken verbatim from the source site
   (herlonmoura.com.br/consultas-e-procedimentos/). The `icon` field maps
   each procedure to its ORIGINAL cliniq-theme glyph, extracted from the
   live page markup — not a lookalike.

   Descriptions for the vascular-treatment entries were expanded from the
   source site's one-line summaries into patient-facing copy; the clinical
   claims stay within what the source states.
   ============================================ */

export interface Procedure {
  /** URL-safe id, also used as the anchor. */
  slug: string;
  title: string;
  subtitle: string;
  description: string;
  /** Original cliniq glyph from the source site. */
  icon: CliniqIconName;
  tag: string;
  /**
   * Three very short scannable facts shown in the lead modal. Each is a
   * fragment (3-6 words), not a sentence — the modal must stay light.
   */
  quickFacts: string[];
}

export const PROCEDURES: Procedure[] = [
  {
    slug: 'doppler-vascular',
    title: 'Doppler Vascular',
    subtitle: 'Exame de Ultrassom do Fluxo Sanguíneo',
    description:
      'O Doppler vascular é um exame de ultrassom que analisa o fluxo sanguíneo em artérias e veias. É indolor, não invasivo e pode ser realizado em diversas partes do corpo. Na mesma sessão é possível identificar estreitamentos, obstruções, refluxo venoso e trombos, com o resultado explicado em linguagem clara.',
    icon: 'doppler',
    quickFacts: [
      'Indolor e não invasivo',
      'Resultado na hora',
      'Sem preparo especial',
    ],
    tag: 'Diagnóstico',
  },
  {
    slug: 'varizes-laser',
    title: 'Tratamento de Varizes com Laser',
    subtitle: 'Procedimento Minimamente Invasivo',
    description:
      'É um procedimento minimamente invasivo que utiliza a energia do laser para destruir as veias doentes. Existem diferentes tipos, como o transdérmico e o endovenoso. A escolha da técnica depende do calibre da veia e da sua localização, e o retorno às atividades costuma ser rápido.',
    icon: 'laser',
    quickFacts: [
      'Sem cortes',
      'Anestesia local',
      'Retorno rápido',
    ],
    tag: 'Laser',
  },
  {
    slug: 'escleroterapia-espuma',
    title: 'Escleroterapia com Espuma Densa',
    subtitle: 'Tratamento em Consultório',
    description:
      'Tratamento para varizes e pequenos vasinhos que consiste na injeção de uma espuma na veia. O procedimento é minimamente invasivo e pode ser realizado em consultório, sem necessidade de internação, sendo indicado tanto para vasos de pequeno calibre quanto para varizes maiores.',
    icon: 'foam',
    quickFacts: [
      'Feito no consultório',
      'Sem internação',
      'Vasinhos e varizes',
    ],
    tag: 'Espuma',
  },
  {
    slug: 'microcirurgia-varizes',
    title: 'Microcirurgia de Varizes',
    subtitle: 'Flebectomia Ambulatorial',
    description:
      'Procedimento que remove varizes pequenas e médias por meio de pequenas incisões. É um procedimento minimamente invasivo que pode ser realizado no consultório. É também conhecida como flebectomia ambulatória, e costuma ser combinada com laser ou espuma para um resultado mais completo.',
    icon: 'microsurgery',
    quickFacts: [
      'Incisões milimétricas',
      'Ambulatorial',
      'Alta no mesmo dia',
    ],
    tag: 'Cirúrgico',
  },
  {
    slug: 'cateter-port-o-cath',
    title: 'Implante de Cateter Port-o-Cath',
    subtitle: 'Acesso para Quimioterapia',
    description:
      'O cateter Port-a-Cath é um dispositivo totalmente implantável que facilita a aplicação de quimioterapia e outros tratamentos. Fica sob a pele e permite a administração de medicamentos e a coleta de exames sem punções repetidas, preservando as veias periféricas.',
    icon: 'portocath',
    quickFacts: [
      'Totalmente implantável',
      'Menos punções',
      'Para quimioterapia',
    ],
    tag: 'Oncológico',
  },
  {
    slug: 'cateter-permcath',
    title: 'Implante de Cateter Permcath',
    subtitle: 'Acesso para Hemodiálise',
    description:
      'O cateter Permcath é um cateter de longa permanência que é implantado em uma veia profunda do paciente para realizar hemodiálise. É indicado quando o acesso é necessário com urgência ou enquanto uma fístula arteriovenosa não está pronta para uso.',
    icon: 'permcath',
    quickFacts: [
      'Acesso imediato',
      'Longa permanência',
      'Para hemodiálise',
    ],
    tag: 'Vascular',
  },
  {
    slug: 'fistula-arteriovenosa',
    title: 'Fístula Arteriovenosa (FAV)',
    subtitle: 'Acesso para Hemodiálise',
    description:
      'A confecção de uma fístula arteriovenosa (FAV) para hemodiálise é um procedimento cirúrgico que une uma artéria a uma veia. É o melhor acesso vascular para hemodiálise, por ser o mais duradouro e o de menor risco de infecção, exigindo avaliação prévia do mapa vascular.',
    icon: 'fistula',
    quickFacts: [
      'Melhor acesso',
      'Mais duradouro',
      'Menos infecção',
    ],
    tag: 'Cirúrgico',
  },
  {
    slug: 'trombose-venosa',
    title: 'Tratamento de Trombose Venosa',
    subtitle: 'Anticoagulação e Reabsorção do Coágulo',
    description:
      'O tratamento para trombose venosa pode envolver anticoagulantes, fibrinolíticos, ou filtros na veia cava inferior. O objetivo é evitar a formação de coágulos ou, se já houver, promover a sua reabsorção e prevenir que o trombo se desloque para os pulmões.',
    icon: 'thrombosisVenous',
    quickFacts: [
      'Avaliação prioritária',
      'Anticoagulação',
      'Previne embolia',
    ],
    tag: 'Tratamento',
  },
  {
    slug: 'trombose-arterial',
    title: 'Tratamento de Trombose Arterial',
    subtitle: 'Restauração do Fluxo Sanguíneo',
    description:
      'O tratamento para trombose arterial pode envolver medicamentos, procedimentos cirúrgicos ou ambos. O tratamento depende da localização e gravidade do coágulo. A interrupção súbita do fluxo em uma artéria é uma emergência e exige avaliação imediata.',
    icon: 'thrombosisArterial',
    quickFacts: [
      'Emergência vascular',
      'Restaura o fluxo',
      'Avaliação imediata',
    ],
    tag: 'Tratamento',
  },
  {
    slug: 'obstrucao-arterial-cronica',
    title: 'Tratamento de Obstrução Arterial Crônica',
    subtitle: 'Revascularização e Controle de Fatores de Risco',
    description:
      'O tratamento para obstrução arterial crônica pode incluir mudanças de hábitos, medicamentos, e cirurgia. A doença costuma se manifestar como dor ao caminhar que melhora com o repouso, e o controle de diabetes, pressão e tabagismo faz parte do tratamento.',
    icon: 'chronicObstruction',
    quickFacts: [
      'Dor ao caminhar',
      'Controle dos fatores',
      'Tratamento gradual',
    ],
    tag: 'Tratamento',
  },
  {
    slug: 'angioplastia-membros-inferiores',
    title: 'Angioplastia de Membros Inferiores',
    subtitle: 'Desobstrução de Artérias',
    description:
      'A angioplastia de membros inferiores é um procedimento cirúrgico que desobstrui artérias estreitadas ou bloqueadas nas pernas e pés. Pode ser realizada por técnica endovascular, com cateter e balão, ou associada a stent, dependendo da extensão da lesão.',
    icon: 'angioplasty',
    quickFacts: [
      'Técnica endovascular',
      'Sem grandes cortes',
      'Melhora a circulação',
    ],
    tag: 'Cirúrgico',
  },
  {
    slug: 'obstrucoes-carotidas',
    title: 'Tratamento de Obstruções das Carótidas',
    subtitle: 'Prevenção de Derrame',
    description:
      'O tratamento de obstruções das carótidas depende da gravidade da obstrução e do risco de derrame. A avaliação com Doppler identifica o grau de estreitamento e orienta a indicação de acompanhamento clínico ou de intervenção cirúrgica.',
    icon: 'carotid',
    quickFacts: [
      'Previne derrame',
      'Doppler define',
      'Acompanhamento',
    ],
    tag: 'Tratamento',
  },
  {
    slug: 'aneurisma-aorta',
    title: 'Tratamento Endovascular de Aneurismas da Aorta',
    subtitle: 'Colocação de Endoprótese',
    description:
      'O tratamento endovascular de aneurismas da aorta é um procedimento minimamente invasivo que consiste na colocação de uma endoprótese na aorta. A prótese é introduzida por pequenas incisões na virilha, sem a necessidade de abrir o abdômen, o que reduz o tempo de recuperação.',
    icon: 'aorticAneurysm',
    quickFacts: [
      'Sem abrir o abdômen',
      'Pequenas incisões',
      'Recuperação menor',
    ],
    tag: 'Endovascular',
  },
  {
    slug: 'disseccao-aorta',
    title: 'Tratamento Endovascular de Dissecção da Aorta',
    subtitle: 'Reparo Minimamente Invasivo',
    description:
      'É um procedimento minimamente invasivo que pode ser usado para tratar lesões traumáticas, aneurismas, hematomas intramurais, e úlceras penetrantes. A técnica endovascular permite corrigir a lesão da parede da aorta por dentro do vaso, com menor agressão cirúrgica.',
    icon: 'aorticDissection',
    quickFacts: [
      'Correção por dentro',
      'Minimamente invasivo',
      'Menos agressivo',
    ],
    tag: 'Endovascular',
  },
  {
    slug: 'aneurismas-viscerais',
    title: 'Tratamento de Aneurismas Viscerais',
    subtitle: 'Cirurgia Aberta ou Endovascular',
    description:
      'Os tratamentos para aneurismas viscerais podem ser cirurgia aberta ou endovascular. A escolha do tratamento depende do tipo e localização do aneurisma, da saúde geral do paciente, e do risco de cirurgia, sendo definida após estudo de imagem detalhado.',
    icon: 'visceralAneurysm',
    quickFacts: [
      'Estudo por imagem',
      'Aberta ou endovascular',
      'Casos selecionados',
    ],
    tag: 'Cirúrgico',
  },
];
