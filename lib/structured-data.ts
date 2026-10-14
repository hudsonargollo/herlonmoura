// JSON-LD structured data generators for SEO rich results.
// Each function returns a schema.org-compatible object to be serialized
// into an inline <script type="application/ld+json"> tag.

const SITE_URL = 'https://herlonmoura.clubemkt.digital';
const DOCTOR_NAME = 'Dr. Herlon Moura dos Santos';
const DOCTOR_CRM = 'CRM/BA 23904';
const DOCTOR_RQE = 'RQE Nº 19791 / RQE Nº 22436';
const PHONE_DISPLAY = '(71) 98344-9737';
const PHONE_TEL = '+5571983449737';
const WHATSAPP_TEL = '+5571999159975';
const EMAIL = 'contato@herlonmoura.com.br';
const ADDRESS = 'R. Eng. Célso Tôrres, 654 - Graça, Salvador - BA, Brasil';
const GEO_LAT = -12.9714;
const GEO_LNG = -38.5119;

/** Shared PostalAddress + GeoCoordinates for the practice. */
const practiceAddress = {
  '@type': 'PostalAddress',
  streetAddress: 'R. Eng. Célso Tôrres, 654 - Graça',
  addressLocality: 'Salvador',
  addressRegion: 'BA',
  postalCode: '40150-000',
  addressCountry: 'BR',
};

const geoCoordinates = {
  '@type': 'GeoCoordinates',
  latitude: GEO_LAT,
  longitude: GEO_LNG,
};

// ─── MedicalBusiness (Home) ───────────────────────────────────────────────

export function medicalBusinessSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'MedicalBusiness',
    '@id': `${SITE_URL}/#medicalbusiness`,
    name: 'Dr. Herlon Moura — Angiologia e Cirurgia Vascular',
    url: `${SITE_URL}/`,
    description:
      'Angiologista e Cirurgião Vascular em Salvador, BA. Tratamento de varizes, trombose, doenças arteriais e Eco-Doppler. Atendimento humanizado com tecnologia de ponta.',
    telephone: PHONE_TEL,
    email: EMAIL,
    address: practiceAddress,
    geo: geoCoordinates,
    image: `${SITE_URL}/images/brand/dr-photoroom.png`,
    priceRange: '$$',
    medicalSpecialty: ['Vascular', 'Angiology'],
    availableService: [
      { '@type': 'MedicalProcedure', name: 'Tratamento de Varizes a Laser' },
      { '@type': 'MedicalProcedure', name: 'Espuma Densa Ecoguiada' },
      { '@type': 'MedicalTest', name: 'Eco-Doppler Vascular' },
      { '@type': 'MedicalProcedure', name: 'Escleroterapia' },
    ],
    openingHoursSpecification: [
      {
        '@type': 'OpeningHoursSpecification',
        dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
        opens: '08:00',
        closes: '18:00',
      },
    ],
    hasMap: `https://www.google.com/maps/search/?api=1&query=${GEO_LAT},${GEO_LNG}`,
  };
}

// ─── Physician (About) ────────────────────────────────────────────────────

export function physicianSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'Physician',
    '@id': `${SITE_URL}/sobre/#physician`,
    name: DOCTOR_NAME,
    givenName: 'Herlon',
    familyName: 'Moura dos Santos',
    url: `${SITE_URL}/sobre`,
    image: `${SITE_URL}/images/brand/dr-photoroom.png`,
    telephone: PHONE_TEL,
    email: EMAIL,
    address: practiceAddress,
    geo: geoCoordinates,
    description:
      'Cirurgião Vascular e Endovascular com mais de 15 anos de experiência. Formado pela UFBA, especialização em Cirurgia Vascular e Endovascular. Membro da SBACV.',
    medicalSpecialty: ['Vascular Surgery', 'Angiology'],
    qualification: [
      { '@type': 'EducationalOccupationalCredential', name: 'CRM/BA 23904' },
      { '@type': 'EducationalOccupationalCredential', name: DOCTOR_RQE },
      {
        '@type': 'EducationalOccupationalCredential',
        name: 'Graduação em Medicina — Universidade Federal da Bahia (UFBA)',
      },
      {
        '@type': 'EducationalOccupationalCredential',
        name: 'Especialização em Cirurgia Vascular e Endovascular',
      },
      {
        '@type': 'EducationalOccupationalCredential',
        name: 'Membro da SBACV — Sociedade Brasileira de Angiologia e Cirurgia Vascular',
      },
    ],
    worksFor: {
      '@type': 'MedicalBusiness',
      name: 'Dr. Herlon Moura — Angiologia e Cirurgia Vascular',
      address: practiceAddress,
      geo: geoCoordinates,
    },
    award: ['SBACV', 'SBACV-Endovascular'],
  };
}

// ─── BlogPosting (Blog index) ─────────────────────────────────────────────

export function blogPostingSchema() {
  const posts = [
    {
      slug: 'doenca-oclusiva-periferica-claudicacao',
      title: 'Doença Oclusiva Periférica: Claudicação e Exercício',
      date: '2026-08-12',
    },
    {
      slug: 'terapia-endovascular-procedimentos-minimamente-invasivos',
      title: 'Terapia Endovascular: Procedimentos Minimamente Invasivos',
      date: '2026-08-11',
    },
    {
      slug: 'embolia-pulmonar-diagnostico-tratamento',
      title: 'Embolia Pulmonar: Diagnóstico e Tratamento de Emergência',
      date: '2026-08-10',
    },
    {
      slug: 'varizes-reticulares-telangiectasias-tratamento',
      title: 'Varizes Reticulares e Telangiectasias: Tratamento Estético',
      date: '2026-08-09',
    },
    {
      slug: 'anticoagulacao-warfarina-heparina-novos',
      title: 'Anticoagulação: Warfarina, Heparina e Novos Anticoagulantes',
      date: '2026-08-08',
    },
  ];

  return {
    '@context': 'https://schema.org',
    '@type': 'Blog',
    '@id': `${SITE_URL}/blog/#blog`,
    name: 'Blog — Dr. Herlon Moura',
    url: `${SITE_URL}/blog`,
    description:
      'Artigos, dicas e orientações do Dr. Herlon Moura sobre angiologia, cirurgia vascular e prevenção de doenças circulatórias.',
    author: {
      '@type': 'Person',
      name: DOCTOR_NAME,
      url: `${SITE_URL}/sobre`,
    },
    publisher: {
      '@type': 'Organization',
      name: 'Dr. Herlon Moura — Angiologia e Cirurgia Vascular',
      url: `${SITE_URL}`,
      logo: {
        '@type': 'ImageObject',
        url: `${SITE_URL}/images/brand/dr-photoroom.png`,
      },
    },
    blogPost: posts.map((p) => ({
      '@type': 'BlogPosting',
      headline: p.title,
      datePublished: p.date,
      dateModified: p.date,
      author: { '@type': 'Person', name: DOCTOR_NAME },
      url: `${SITE_URL}/blog/${p.slug}`,
      image: `${SITE_URL}/images/blog/${p.slug}.png`,
      mainEntityOfPage: `${SITE_URL}/blog/${p.slug}`,
    })),
  };
}

// ─── ContactPage (Contato) ────────────────────────────────────────────────

export function contactPageSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'ContactPage',
    '@id': `${SITE_URL}/contato/#contactpage`,
    name: 'Entre em Contato — Dr. Herlon Moura',
    url: `${SITE_URL}/contato`,
    description:
      'Entre em contato com o Dr. Herlon Moura para agendar consultas e esclarecer dúvidas sobre angiologia e cirurgia vascular em Salvador, BA.',
    mainEntity: {
      '@type': 'MedicalBusiness',
      name: 'Dr. Herlon Moura — Angiologia e Cirurgia Vascular',
      telephone: PHONE_TEL,
      email: EMAIL,
      address: practiceAddress,
      geo: geoCoordinates,
    },
  };
}

// ─── MedicalProcedure (Procedures) ────────────────────────────────────────

export function medicalProcedureSchema() {
  const procedures = [
    { slug: 'eco-doppler-vascular', name: 'Eco-Doppler Vascular' },
    { slug: 'tratamento-varizes-laser', name: 'Tratamento de Varizes a Laser' },
    { slug: 'escleroterapia-espuma', name: 'Espuma Densa Ecoguiada' },
    { slug: 'escleroterapia-convencional', name: 'Escleroterapia Convencional' },
    { slug: 'microcirurgia-varizes', name: 'Microcirurgia de Varizes' },
    { slug: 'flebectomia-ambulatorial', name: 'Flebectomia Ambulatorial' },
    { slug: 'catheter-port-o-cath', name: 'Cateter Port-o-Cath' },
    { slug: 'catheter-permcath', name: 'Cateter Permcath' },
    { slug: 'fistula-arteriovenosa', name: 'Fístula Arteriovenosa' },
  ];

  return {
    '@context': 'https://schema.org',
    '@type': 'MedicalProcedure',
    '@id': `${SITE_URL}/consultas-e-procedimentos/#medicalprocedure`,
    name: 'Procedimentos Vasculares — Dr. Herlon Moura',
    url: `${SITE_URL}/consultas-e-procedimentos`,
    description:
      'Procedimentos vasculares realizados pelo Dr. Herlon Moura: Eco-Doppler, tratamento de varizes a laser, escleroterapia, microcirurgia e acessos vasculares.',
    procedureType: 'TherapeuticProcedure',
    bodyLocation: ['Pernas', 'Braços', 'Pescoço'],
    image: `${SITE_URL}/images/brand/banner-segundasecao.jpg`,
    provider: {
      '@type': 'Physician',
      name: DOCTOR_NAME,
      medicalSpecialty: ['Vascular Surgery', 'Angiology'],
      address: practiceAddress,
      telephone: PHONE_TEL,
    },
    mainEntity: procedures.map((p) => ({
      '@type': 'MedicalProcedure',
      name: p.name,
      url: `${SITE_URL}/consultas-e-procedimentos#${p.slug}`,
    })),
  };
}

// ─── MedicalWebPage (DVT Calculator) ──────────────────────────────────────

export function medicalWebPageSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'MedicalWebPage',
    '@id': `${SITE_URL}/calculadora-de-risco-de-tvp/#medicalwebpage`,
    name: 'Calculadora de Risco de Trombose Venosa Profunda (TVP)',
    url: `${SITE_URL}/calculadora-de-risco-de-tvp`,
    description:
      'Avalie seus fatores de risco para Trombose Venosa Profunda (TVP) com a calculadora do Dr. Herlon Moura. Ferramenta gratuita e anônima de triagem vascular.',
    about: {
      '@type': 'MedicalCondition',
      name: 'Trombose Venosa Profunda',
      associatedAnatomy: {
        '@type': 'AnatomicalStructure',
        name: 'Veias Profundas',
      },
    },
    audience: {
      '@type': 'PeopleAudience',
      audienceType: 'Adultos',
    },
    medicalAudience: 'Patient',
    publisher: {
      '@type': 'Organization',
      name: 'Dr. Herlon Moura — Angiologia e Cirurgia Vascular',
      url: `${SITE_URL}`,
    },
    author: {
      '@type': 'Person',
      name: DOCTOR_NAME,
      jobTitle: 'Angiologista e Cirurgião Vascular',
      medicalSpecialty: ['Vascular Surgery', 'Angiology'],
      worksFor: {
        '@type': 'MedicalBusiness',
        name: 'Dr. Herlon Moura — Angiologia e Cirurgia Vascular',
        address: practiceAddress,
      },
    },
    lastReviewed: '2026-10-14',
  };
}
