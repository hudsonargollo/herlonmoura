'use client';

import React, { useState } from 'react';
import { FileText, Hash, Calendar, Clock, Tag, Search, Plus, MoreHorizontal, Edit3, Trash2, Eye } from 'lucide-react';
import { Button } from '@/components/Button';
import { BlogEditor, type BlogEditorFormData } from './BlogEditor';

interface BlogPost {
  slug: string;
  title: string;
  excerpt: string;
  date: string;
  category: string;
  author: string;
  status: 'draft' | 'approved' | 'published';
  readingTime: string;
}

const MOCK_POSTS: BlogPost[] = [
  {
    slug: 'aneurisma-aorta-abdominal-deteccao-tratamento',
    title: 'Aneurisma de Aorta Abdominal: Detecção Precoce e Tratamento',
    excerpt: '',
    date: '2026-05-11',
    category: 'Cirurgia Vascular',
    author: 'Dr. Herlon Moura',
    status: 'draft' as const,
    readingTime: '',
  },
  {
    slug: 'angiografia-mapeamento-vascular',
    title: 'Angiografia: Mapeamento Completo do Sistema Vascular',
    excerpt: '',
    date: '2026-07-28',
    category: 'Cirurgia Vascular',
    author: 'Dr. Herlon Moura',
    status: 'draft' as const,
    readingTime: '',
  },
  {
    slug: 'anticoagulacao-warfarina-heparina-novos',
    title: 'Anticoagulação: Warfarina, Heparina e Novos Anticoagulantes',
    excerpt: '',
    date: '2026-08-08',
    category: 'Trombose',
    author: 'Dr. Herlon Moura',
    status: 'draft' as const,
    readingTime: '',
  },
  {
    slug: 'cirurgia-vascular-procedimentos-recuperacao',
    title: 'Cirurgia Vascular: Procedimentos, Recuperação e Cuidados Pós-Operatórios',
    excerpt: '',
    date: '2026-04-04',
    category: 'Cirurgia Vascular',
    author: 'Dr. Herlon Moura',
    status: 'draft' as const,
    readingTime: '',
  },
  {
    slug: 'doenca-buerger-tabagismo-vascular',
    title: 'Doença de Buerger: Tabagismo e Inflamação Vascular',
    excerpt: '',
    date: '2026-05-15',
    category: 'Doenças Vasculares',
    author: 'Dr. Herlon Moura',
    status: 'draft' as const,
    readingTime: '',
  },
  {
    slug: 'doenca-carotidea-avc-estenose',
    title: 'Doença Carotídea: AVC e Estenose Carotídea',
    excerpt: '',
    date: '2026-06-24',
    category: 'Doenças Vasculares',
    author: 'Dr. Herlon Moura',
    status: 'draft' as const,
    readingTime: '',
  },
  {
    slug: 'doenca-oclusiva-periferica-claudicacao',
    title: 'Doença Oclusiva Periférica: Claudicação e Exercício',
    excerpt: '',
    date: '2026-08-12',
    category: 'Doenças Arteriais',
    author: 'Dr. Herlon Moura',
    status: 'draft' as const,
    readingTime: '',
  },
  {
    slug: 'doenca-raynaud-dedos-frios-violeta',
    title: 'Doença de Raynaud: Dedos Frios e Violeta',
    excerpt: '',
    date: '2026-05-12',
    category: 'Doenças Vasculares',
    author: 'Dr. Herlon Moura',
    status: 'draft' as const,
    readingTime: '',
  },
  {
    slug: 'doencas-arteriais-perifericas-sintomas',
    title: 'Doenças Arteriais Periféricas: Sintomas e Tratamento',
    excerpt: '',
    date: '2026-04-07',
    category: 'Doenças Arteriais',
    author: 'Dr. Herlon Moura',
    status: 'draft' as const,
    readingTime: '',
  },
  {
    slug: 'doppler-duplo-avaliacao-artrias-veias',
    title: 'Doppler Duplo: Como Avaliar Artérias e Veias Simultaneamente',
    excerpt: '',
    date: '2026-06-22',
    category: 'Doppler Vascular',
    author: 'Dr. Herlon Moura',
    status: 'draft' as const,
    readingTime: '',
  },
  {
    slug: 'doppler-vascular-o-que-e-como-funciona',
    title: 'Doppler Vascular: O Que É, Como Funciona e Por Que é Essencial',
    excerpt: '',
    date: '2026-04-15',
    category: 'Doppler Vascular',
    author: 'Dr. Herlon Moura',
    status: 'published' as const,
    readingTime: '',
  },
  {
    slug: 'edema-membros-inferiores-causas',
    title: 'Edema nos Membros Inferiores: Causas Vasculares e Não Vasculares',
    excerpt: '',
    date: '2026-06-23',
    category: 'Prevenção',
    author: 'Dr. Herlon Moura',
    status: 'draft' as const,
    readingTime: '',
  },
  {
    slug: 'embolia-pulmonar-diagnostico-tratamento',
    title: 'Embolia Pulmonar: Diagnóstico e Tratamento de Emergência',
    excerpt: '',
    date: '2026-08-10',
    category: 'Trombose',
    author: 'Dr. Herlon Moura',
    status: 'draft' as const,
    readingTime: '',
  },
  {
    slug: 'entendendo-varizes-tratamentos-modernos',
    title: 'Entendendo as Varizes: Causas, Tratamentos e Quando Procurar Ajuda',
    excerpt: '',
    date: '2026-04-10',
    category: 'Varizes',
    author: 'Dr. Herlon Moura',
    status: 'published' as const,
    readingTime: '',
  },
  {
    slug: 'escleroterapia-varizes-vasos-cosmeticos',
    title: 'Escleroterapia: Técnica para Varizes e Vasos Cosméticos',
    excerpt: '',
    date: '2026-06-17',
    category: 'Varizes',
    author: 'Dr. Herlon Moura',
    status: 'draft' as const,
    readingTime: '',
  },
  {
    slug: 'flebectomia-ambulatorial-varizes-procedimento',
    title: 'Flebectomia Ambulatorial: Procedimento para Varizes',
    excerpt: '',
    date: '2026-05-16',
    category: 'Cirurgia Vascular',
    author: 'Dr. Herlon Moura',
    status: 'draft' as const,
    readingTime: '',
  },
  {
    slug: 'flebografia-quando-doppler-nao-basta',
    title: 'Flebografia: Quando o Doppler Não Basta',
    excerpt: '',
    date: '2026-07-27',
    category: 'Doppler Vascular',
    author: 'Dr. Herlon Moura',
    status: 'draft' as const,
    readingTime: '',
  },
  {
    slug: 'glomerulonefrite-hipertensao-conexao-vascular',
    title: 'Glomerulonefrite e Hipertensão: A Conexão Vascular',
    excerpt: '',
    date: '2026-06-18',
    category: 'Doenças Vasculares',
    author: 'Dr. Herlon Moura',
    status: 'draft' as const,
    readingTime: '',
  },
  {
    slug: 'hipertensao-portal-causas-manejo',
    title: 'Hipertensão Portal: Causas e Manejo Vascular',
    excerpt: '',
    date: '2026-06-20',
    category: 'Cirurgia Vascular',
    author: 'Dr. Herlon Moura',
    status: 'draft' as const,
    readingTime: '',
  },
  {
    slug: 'insuficiencia-venosa-cronica-estagios-tratamento',
    title: 'Insuficiência Venosa Crônica: Estágios e Tratamento',
    excerpt: '',
    date: '2026-05-10',
    category: 'Varizes',
    author: 'Dr. Herlon Moura',
    status: 'draft' as const,
    readingTime: '',
  },
  {
    slug: 'isquemia-membro-superior-causas',
    title: 'Isquemia de Membro Superior: Causas e Tratamento',
    excerpt: '',
    date: '2026-07-25',
    category: 'Doenças Arteriais',
    author: 'Dr. Herlon Moura',
    status: 'draft' as const,
    readingTime: '',
  },
  {
    slug: 'laser-vascular-tratamento-varizes',
    title: 'Laser Vascular: Tratamento a Laser para Varizes e Vasos Faciais',
    excerpt: '',
    date: '2026-04-05',
    category: 'Laser Vascular',
    author: 'Dr. Herlon Moura',
    status: 'draft' as const,
    readingTime: '',
  },
  {
    slug: 'linfedema-causas-estagios-tratamento',
    title: 'Linfedema: Causas, Estágios e Tratamento Completo',
    excerpt: '',
    date: '2026-04-08',
    category: 'Linfedema',
    author: 'Dr. Herlon Moura',
    status: 'draft' as const,
    readingTime: '',
  },
  {
    slug: 'livedo-reticular-causas-significado',
    title: 'Livedo Reticular: Manchas Violeta na Pele',
    excerpt: '',
    date: '2026-07-01',
    category: 'Doenças Vasculares',
    author: 'Dr. Herlon Moura',
    status: 'draft' as const,
    readingTime: '',
  },
  {
    slug: 'malformacoes-vascuais-tipos-tratamento',
    title: 'Malformações Vasculares: Tipos e Tratamento',
    excerpt: '',
    date: '2026-05-14',
    category: 'Doenças Vasculares',
    author: 'Dr. Herlon Moura',
    status: 'draft' as const,
    readingTime: '',
  },
  {
    slug: 'microcirurgia-vascular-reconstrucao-vasos',
    title: 'Microcirurgia Vascular: Reconstrução de Vasos Minúsculos',
    excerpt: '',
    date: '2026-08-06',
    category: 'Cirurgia Vascular',
    author: 'Dr. Herlon Moura',
    status: 'draft' as const,
    readingTime: '',
  },
  {
    slug: 'paget-schroetter-trombose-subclavia',
    title: 'Doença de Paget-Schroetter: Trombose de Subclávia',
    excerpt: '',
    date: '2026-07-03',
    category: 'Trombose',
    author: 'Dr. Herlon Moura',
    status: 'draft' as const,
    readingTime: '',
  },
  {
    slug: 'pos-operatorio-cirurgia-vascular-guia',
    title: 'Pós-operatório de Cirurgia Vascular: O Guia Completo',
    excerpt: '',
    date: '2026-07-02',
    category: 'Cirurgia Vascular',
    author: 'Dr. Herlon Moura',
    status: 'draft' as const,
    readingTime: '',
  },
  {
    slug: 'prevencao-doencas-vascular-idoso-50',
    title: 'Prevenção de Doenças Vasculares no Idoso: 50 Passos Essenciais',
    excerpt: '',
    date: '2026-04-18',
    category: 'Prevenção',
    author: 'Dr. Herlon Moura',
    status: 'draft' as const,
    readingTime: '',
  },
  {
    slug: 'sindrome-pos-trombotica-sequelas-tvp',
    title: 'Síndrome Pós-Trombótica: Sequelas de TVP',
    excerpt: '',
    date: '2026-07-04',
    category: 'Trombose',
    author: 'Dr. Herlon Moura',
    status: 'draft' as const,
    readingTime: '',
  },
  {
    slug: 'terapia-compressao-meias-bandagens',
    title: 'Terapia de Compressão: Meias e Bandagens que Funcionam',
    excerpt: '',
    date: '2026-06-21',
    category: 'Prevenção',
    author: 'Dr. Herlon Moura',
    status: 'draft' as const,
    readingTime: '',
  },
  {
    slug: 'terapia-endovascular-procedimentos-minimamente-invasivos',
    title: 'Terapia Endovascular: Procedimentos Minimamente Invasivos',
    excerpt: '',
    date: '2026-08-11',
    category: 'Cirurgia Vascular',
    author: 'Dr. Herlon Moura',
    status: 'draft' as const,
    readingTime: '',
  },
  {
    slug: 'tromboflebite-superficial-tratamento',
    title: 'Tromboflebite Superficial: O Que Fazer e Quando se Preocupar',
    excerpt: '',
    date: '2026-05-13',
    category: 'Trombose',
    author: 'Dr. Herlon Moura',
    status: 'draft' as const,
    readingTime: '',
  },
  {
    slug: 'trombose-venosa-profunda-sintomas-risco',
    title: 'Trombose Venosa Profunda: Sintomas e Fatores de Risco',
    excerpt: '',
    date: '2026-04-03',
    category: 'Trombose',
    author: 'Dr. Herlon Moura',
    status: 'draft' as const,
    readingTime: '',
  },
  {
    slug: 'trombose-venosa-profunda-sintomas-riscos',
    title: 'Trombose Venosa Profunda: Sintomas, Riscos e Prevenção',
    excerpt: '',
    date: '2026-04-01',
    category: 'Trombose',
    author: 'Dr. Herlon Moura',
    status: 'draft' as const,
    readingTime: '',
  },
  {
    slug: 'ulcera-venosa-causas-tratamento-cicatrizacao',
    title: 'Úlcera Venosa: Causas, Tratamento e Cicatrização',
    excerpt: '',
    date: '2026-04-06',
    category: 'Úlcera Venosa',
    author: 'Dr. Herlon Moura',
    status: 'draft' as const,
    readingTime: '',
  },
  {
    slug: 'ultrassom-vascular-diagnostico-primeira-linha',
    title: 'Ultrassom Vascular: Primeira Linha no Diagnóstico',
    excerpt: '',
    date: '2026-08-07',
    category: 'Doppler Vascular',
    author: 'Dr. Herlon Moura',
    status: 'draft' as const,
    readingTime: '',
  },
  {
    slug: 'varizes-esofagicas-causas-tratamento',
    title: 'Varizes Esofágicas: Causas, Diagnóstico e Tratamento',
    excerpt: '',
    date: '2026-06-19',
    category: 'Doenças Vasculares',
    author: 'Dr. Herlon Moura',
    status: 'draft' as const,
    readingTime: '',
  },
  {
    slug: 'varizes-gravidez-causas-prevencao',
    title: 'Varizes na Gravidez: Causas, Prevenção e Tratamento Seguro',
    excerpt: '',
    date: '2026-05-09',
    category: 'Varizes',
    author: 'Dr. Herlon Moura',
    status: 'draft' as const,
    readingTime: '',
  },
  {
    slug: 'varizes-infertilidade-conexao-venosa',
    title: 'Varizes e Infertilidade: A Conexão Venosa',
    excerpt: '',
    date: '2026-08-05',
    category: 'Varizes',
    author: 'Dr. Herlon Moura',
    status: 'draft' as const,
    readingTime: '',
  },
  {
    slug: 'varizes-reticulares-telangiectasias-tratamento',
    title: 'Varizes Reticulares e Telangiectasias: Tratamento Estético',
    excerpt: '',
    date: '2026-08-09',
    category: 'Varizes',
    author: 'Dr. Herlon Moura',
    status: 'draft' as const,
    readingTime: '',
  },
  {
    slug: 'vasculite-sistemica-tipos-tratamento',
    title: 'Vasculite Sistêmica: Inflamação dos Vasos Sanguíneos',
    excerpt: '',
    date: '2026-07-26',
    category: 'Doenças Vasculares',
    author: 'Dr. Herlon Moura',
    status: 'draft' as const,
    readingTime: '',
  }
];

const STATUS_LABELS = {
  draft: 'Rascunho',
  approved: 'Aprovado',
  published: 'Publicado',
};

const STATUS_COLORS = {
  draft: 'bg-neutral-medium/15 text-neutral-medium border-neutral-medium/30',
  approved: 'bg-warning-amber/15 text-warning-amber border-warning-amber/30',
  published: 'bg-success-green/15 text-success-green border-success-green/30',
};

export function BlogEditorList() {
  const [posts, setPosts] = useState<BlogPost[]>(MOCK_POSTS);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [editingPost, setEditingPost] = useState<string | null>(null);
  const [showNew, setShowNew] = useState(false);

  const filtered = posts.filter((p) => {
    const matchSearch =
      p.title.toLowerCase().includes(search.toLowerCase()) ||
      p.slug.toLowerCase().includes(search.toLowerCase());
    const matchStatus = statusFilter === 'all' || p.status === statusFilter;
    return matchSearch && matchStatus;
  });

  const handleSave = (data: BlogEditorFormData) => {
    const newPost: BlogPost = {
      slug: data.title.toLowerCase().replace(/\s+/g, '-'),
      title: data.title,
      excerpt: data.excerpt,
      date: new Date().toISOString().split('T')[0],
      category: data.category,
      author: data.author,
      status: data.status,
      readingTime: `${Math.max(1, Math.ceil(data.content.split(/\s+/).filter(Boolean).length / 200))} min`,
    };
    setPosts((prev) => [newPost, ...prev]);
    setShowNew(false);
  };

  const handleDelete = (slug: string) => {
    setPosts((prev) => prev.filter((p) => p.slug !== slug));
  };

  // If editing a post, show the editor
  if (editingPost) {
    const post = posts.find((p) => p.slug === editingPost);
    return (
      <div>
        <Button variant="ghost" size="sm" onClick={() => setEditingPost(null)} className="mb-4">
          ← Voltar à lista
        </Button>
        <BlogEditor
          initialPost={
            post
              ? {
                  title: post.title,
                  excerpt: post.excerpt,
                  category: post.category,
                  author: post.author,
                  content: '',
                  status: post.status,
                }
              : undefined
          }
          onSave={(data) => {
            handleSave(data);
            setEditingPost(null);
          }}
        />
      </div>
    );
  }

  // If creating new post
  if (showNew) {
    return (
      <div>
        <Button variant="ghost" size="sm" onClick={() => setShowNew(false)} className="mb-4">
          ← Voltar à lista
        </Button>
        <BlogEditor onSave={(data) => { handleSave(data); setShowNew(false); }} />
      </div>
    );
  }

  return (
    <div className="space-y-5">
      {/* Toolbar */}
      <div className="flex flex-col gap-3 tablet:flex-row tablet:items-center tablet:justify-between">
        <div className="relative max-w-sm">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-neutral-medium" />
          <input
            type="text"
            placeholder="Buscar artigo..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="glass-input pl-10 w-full text-sm"
          />
        </div>
        <div className="flex items-center gap-2">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="glass-input text-sm py-2"
          >
            <option value="all">Todos os status</option>
            <option value="published">Publicado</option>
            <option value="approved">Aprovado</option>
            <option value="draft">Rascunho</option>
          </select>
          <Button variant="primary" size="sm" onClick={() => setShowNew(true)}>
            <Plus className="mr-1.5 h-4 w-4" /> Novo Artigo
          </Button>
        </div>
      </div>

      {/* Posts table */}
      <div className="overflow-hidden rounded-xl border border-neutral-dark bg-neutral-dark/60">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-neutral-dark/60 bg-neutral-dark/40">
              <th className="px-4 py-3 text-left text-xs font-semibold text-neutral-medium uppercase">
                Artigo
              </th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-neutral-medium uppercase">
                Categoria
              </th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-neutral-medium uppercase">
                Status
              </th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-neutral-medium uppercase">
                Data
              </th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-neutral-medium uppercase">
                Leitura
              </th>
              <th className="px-4 py-3 text-right text-xs font-semibold text-neutral-medium uppercase">
                Ações
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-neutral-dark/40">
            {filtered.map((post) => (
              <tr
                key={post.slug}
                className="transition-colors hover:bg-surgical-teal/5"
              >
                <td className="px-4 py-3">
                  <div className="flex items-center gap-3">
                    <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-surgical-teal/15 text-surgical-teal flex-shrink-0">
                      <FileText className="h-4 w-4" />
                    </div>
                    <div>
                      <p className="font-medium text-neutral-light text-sm">{post.title}</p>
                      <p className="text-[11px] text-neutral-medium">{post.slug}</p>
                    </div>
                  </div>
                </td>
                <td className="px-4 py-3 text-neutral-light">{post.category}</td>
                <td className="px-4 py-3">
                  <span
                    className={`inline-flex items-center rounded-full border px-2 py-0.5 text-[11px] font-medium ${STATUS_COLORS[post.status]}`}
                  >
                    {STATUS_LABELS[post.status]}
                  </span>
                </td>
                <td className="px-4 py-3 text-neutral-medium">{post.date}</td>
                <td className="px-4 py-3 text-neutral-medium">{post.readingTime}</td>
                <td className="px-4 py-3 text-right">
                  <div className="flex items-center justify-end gap-1">
                    <button className="rounded p-1.5 text-neutral-medium hover:bg-surgical-teal/10 hover:text-surgical-teal" title="Preview">
                      <Eye className="h-4 w-4" />
                    </button>
                    <button onClick={() => setEditingPost(post.slug)} className="rounded p-1.5 text-neutral-medium hover:bg-surgical-teal/10 hover:text-surgical-teal" title="Editar">
                      <Edit3 className="h-4 w-4" />
                    </button>
                    <button onClick={() => handleDelete(post.slug)} className="rounded p-1.5 text-neutral-medium hover:bg-error-red/10 hover:text-error-red" title="Excluir">
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {filtered.length === 0 && (
          <div className="px-4 py-8 text-center text-neutral-medium">
            Nenhum artigo encontrado.
          </div>
        )}
      </div>

      <p className="text-[11px] text-neutral-medium">
        {filtered.length} de {posts.length} artigos
      </p>
    </div>
  );
}