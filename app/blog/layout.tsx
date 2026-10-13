import type { Metadata } from 'next';

export const metadata: Metadata = {
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

export default function BlogLayout({ children }: { children: React.ReactNode }) {
  return children;
}
