import React from 'react';
import Link from 'next/link';
import { ArticleCard } from '@/components/ArticleCard';

interface BlogPost {
  slug: string;
  title: string;
  excerpt: string;
  date: string;
  readingTime: string;
  category: string;
  image: string;
}

const BLOG_POSTS: BlogPost[] = [
  {
    slug: 'entendendo-varizes-tratamento-moderno',
    title: 'Entendendo as Varizes: Tratamentos Modernos e Minimamente Invasivos',
    excerpt: 'Descubra as opções atualmente disponíveis para tratamento de varizes, desde escleroterapia a laser até microcirurgia, e saiba quando procurar um angiologista.',
    date: '2025-04-10',
    readingTime: '5 min',
    category: 'Varizes',
    image: '/images/banner-vascular.jpg',
  },
  {
    slug: 'trombose-venosa-profunda-sintomas-risco',
    title: 'Trombose Venosa Profunda: Sintomas e Fatores de Risco',
    excerpt: 'A TVP é uma emergência médica silenciosa. Entenda os sinais de alerta, quem está em risco e como a calculadora de risco do Dr. Herlon Moura pode ajudar.',
    date: '2025-04-03',
    readingTime: '4 min',
    category: 'Trombose',
    image: '/images/banner-home.jpg',
  },
  {
    slug: 'doppler-vascular-o-que-e-como-funciona',
    title: 'Doppler Vascular: O Que É e Como Funciona',
    excerpt: 'Exame fundamental para o diagnóstico vascular, o Doppler colorido avalia o fluxo sanguíneo em tempo real. Saiba mais sobre este procedimento indolor e realizado no consultório.',
    date: '2025-03-28',
    readingTime: '6 min',
    category: 'Diagnóstico',
    image: '/images/banner-vascular.jpg',
  },
  {
    slug: 'prevencao-doencas-vascular-idoso',
    title: 'Prevenção de Doenças Vasculares: Cuidados Após os 50 Anos',
    excerpt: 'A partir dos 50 anos, a saúde vascular exige atenção especial. Conheça os cuidados essenciais, exames recomendados e sinais que não devem ser ignorados.',
    date: '2025-03-20',
    readingTime: '5 min',
    category: 'Prevenção',
    image: '/images/banner-home.jpg',
  },
  {
    slug: 'escleroterapia-espuma-densa-ecoguiada',
    title: 'Escleroterapia com Espuma Densa: O Que Esperar',
    excerpt: 'Procedimento ecoguiado realizado em consultório para varizes e vasinhos estéticos. Saiba como funciona, recuperação e resultados esperados com a técnica de espuma densa.',
    date: '2025-03-14',
    readingTime: '4 min',
    category: 'Procedimentos',
    image: '/images/banner-vascular.jpg',
  },
  {
    slug: 'cirurgia-endovascular-laser',
    title: 'Cirurgia Endovascular a Laser: Tecnologia e Resultados',
    excerpt: 'A tecnologia laser revolucionou o tratamento vascular. Entenda as diferenças entre laser endovenoso e transdérmico, indicações e taxa de satisfação dos pacientes.',
    date: '2025-03-07',
    readingTime: '7 min',
    category: 'Tratamentos',
    image: '/images/banner-home.jpg',
  },
];

export const metadata = {
  title: 'Blog – Dr. Herlon Moura | Angiologia e Cirurgia Vascular',
  description:
    'Artigos sobre saúde vascular, tratamentos de varizes, trombose, Doppler e prevenção. Orientações do Dr. Herlon Moura, angiologista em Salvador.',
  keywords: [
    'blog angiologista Salvador',
    'varizes tratamento',
    'trombose venosa',
    'doppler vascular',
    'cirurgia vascular Salvador',
  ],
  openGraph: {
    title: 'Blog – Dr. Herlon Moura',
    description: 'Artigos sobre saúde vascular e tratamentos modernos.',
    type: 'website',
  },
};

export default function BlogPage() {
  return (
    <main className="min-h-screen bg-dark-elevated text-slate-100">
      <section className="py-16 sm:py-24 bg-gradient-to-b from-slate-950 via-dark-elevated to-dark-elevated">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <span className="inline-block rounded-full border border-surgical-teal/30 bg-surgical-teal/10 px-3 py-1 text-xs font-semibold text-surgical-teal mb-3">
            Blog
          </span>
          <h1 className="mt-2 text-3xl font-extrabold sm:text-4xl lg:text-5xl text-white">
            Saúde Vascular em Dia
          </h1>
          <p className="mt-4 text-base text-slate-300 max-w-2xl mx-auto">
            Artigos, dicas e orientações do Dr. Herlon Moura sobre angiologia, cirurgia vascular e prevenção de doenças circulatórias.
          </p>
          <div className="mt-6 flex flex-wrap justify-center gap-2">
            {['Varizes', 'Trombose', 'Diagnóstico', 'Prevenção', 'Procedimentos', 'Tratamentos'].map((cat) => (
              <span
                key={cat}
                className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-slate-300"
              >
                {cat}
              </span>
            ))}
          </div>
        </div>
      </section>

      <section className="py-12 sm:py-16 bg-dark-elevated">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {BLOG_POSTS.map((post) => (
              <ArticleCard key={post.slug} post={post} />
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}