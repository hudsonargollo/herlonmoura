'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { FileText, Hash, Calendar, Clock, Tag, Search, Plus, MoreHorizontal, Edit3, Trash2, Eye } from 'lucide-react';
import { Button } from '@/components/Button';
import { BlogEditor, type BlogEditorFormData } from './BlogEditor';
import { api } from '@/lib/admin/api';

interface BlogPost {
  slug: string;
  title: string;
  excerpt: string;
  date: string;
  category: string;
  author: string;
  status: 'draft' | 'approval' | 'published' | 'archived';
  readingTime: string;
  content: string;
  meta_title: string;
  meta_description: string;
  questionnaire_enabled: boolean;
  freebie_name: string | null;
}

const STATUS_LABELS: Record<string, string> = {
  draft: 'Rascunho',
  approval: 'Aprovação',
  published: 'Publicado',
  archived: 'Arquivado',
};

const STATUS_COLORS: Record<string, string> = {
  draft: ' bg-muted/50/15 text-muted-foreground border-neutral-medium/30',
  approval: 'bg-warning-amber/15 text-warning-amber border-warning-amber/30',
  published: 'bg-success-green/15 text-success-green border-success-green/30',
  archived: ' bg-muted/50/15 text-muted-foreground border-neutral-medium/30',
};

interface BlogEditorListProps {
  onSelectPost?: (slug: string) => void;
  selectedPost?: string | null;
}

export function BlogEditorList({ onSelectPost, selectedPost }: BlogEditorListProps = {}) {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [editingPost, setEditingPost] = useState<string | null>(null);
  const [showNew, setShowNew] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchPosts = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const status = statusFilter !== 'all' ? statusFilter : undefined;
      const q = status ? `?status=${status}` : '';
      const data: { posts: BlogPost[] } = await api.get(`/api/blog${q}`);
      setPosts(data.posts);
    } catch (e: any) {
      setError(e.message || 'Erro ao carregar posts');
    } finally {
      setLoading(false);
    }
  }, [statusFilter]);

  useEffect(() => { fetchPosts(); }, [fetchPosts]);

  const filtered = posts.filter((p) => {
    const matchSearch = p.title.toLowerCase().includes(search.toLowerCase()) || p.slug.toLowerCase().includes(search.toLowerCase());
    const matchStatus = statusFilter === 'all' || p.status === statusFilter;
    return matchSearch && matchStatus;
  });

  const handleSave = async (data: BlogEditorFormData) => {
    try {
      if (editingPost) {
        await api.put(editingPost, data);
      } else {
        await api.post('/api/blog', data);
      }
      setShowNew(false);
      setEditingPost(null);
      fetchPosts();
    } catch (e: any) {
      alert(`Erro ao salvar: ${e.message}`);
    }
  };

  const handleDelete = async (slug: string) => {
    if (!confirm(`Excluir "${slug}"?`)) return;
    try {
      await api.delete(slug);
      fetchPosts();
    } catch (e: any) {
      alert(`Erro ao excluir: ${e.message}`);
    }
  };

  if (editingPost) {
    const post = posts.find((p) => p.slug === editingPost);
    return (
      <div>
        <Button variant="ghost" size="sm" onClick={() => setEditingPost(null)} className="mb-4">← Voltar à lista</Button>
        <BlogEditor
          initialPost={post ? { title: post.title, excerpt: post.excerpt, category: post.category, author: post.author, content: post.content, status: post.status as 'draft' | 'approval' } : undefined}
          onSave={(data) => { handleSave(data); setEditingPost(null); }}
        />
      </div>
    );
  }

  if (showNew) {
    return (
      <div>
        <Button variant="ghost" size="sm" onClick={() => setShowNew(false)} className="mb-4">← Voltar à lista</Button>
        <BlogEditor onSave={(data) => { handleSave(data); setShowNew(false); }} />
      </div>
    );
  }

  return (
    <div className="space-y-5">
      <div className="flex flex-col gap-3 tablet:flex-row tablet:items-center tablet:justify-between">
        <div className="relative max-w-sm">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <input type="text" placeholder="Buscar artigo..." value={search} onChange={(e) => setSearch(e.target.value)} className="glass-input pl-10 w-full text-sm" />
        </div>
        <div className="flex items-center gap-2">
          <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} className="glass-input text-sm py-2">
            <option value="all">Todos os status</option>
            <option value="published">Publicado</option>
            <option value="approval">Aprovação</option>
            <option value="draft">Rascunho</option>
          </select>
          <Button variant="primary" size="sm" onClick={() => setShowNew(true)}><Plus className="mr-1.5 h-4 w-4" /> Novo Artigo</Button>
          <Button variant="ghost" size="sm" onClick={fetchPosts}><Clock className="mr-1.5 h-4 w-4" /> Atualizar</Button>
        </div>
      </div>

      {error && (
        <div className="rounded-xl border border-error-red/30 bg-error-red/5 p-4 text-center">
          <p className="text-sm text-error-red">{error}</p>
          <Button variant="primary" size="sm" onClick={fetchPosts} className="mt-2">Tentar novamente</Button>
        </div>
      )}

      {loading ? (
        <div className="px-4 py-8 text-center text-muted-foreground">Carregando...</div>
      ) : (
        <div className="overflow-hidden rounded-xl border border-border bg-muted/60">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border/60 bg-muted/40">
                <th className="px-4 py-3 text-left text-xs font-semibold text-muted-foreground uppercase">Artigo</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-muted-foreground uppercase">Categoria</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-muted-foreground uppercase">Status</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-muted-foreground uppercase">Data</th>
                <th className="px-4 py-3 text-right text-xs font-semibold text-muted-foreground uppercase">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/40">
              {filtered.map((post) => (
                <tr key={post.slug} className="transition-colors hover:bg-primary/5">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/15 text-primaryflex-shrink-0"><FileText className="h-4 w-4" /></div>
                      <div>
                        <p className="font-medium text-foreground text-sm">{post.title}</p>
                        <p className="text-[11px] text-muted-foreground">{post.slug}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-foreground">{post.category}</td>
                  <td className="px-4 py-3"><span className={`inline-flex items-center rounded-full border px-2 py-0.5 text-[11px] font-medium ${STATUS_COLORS[post.status]}`}>{STATUS_LABELS[post.status] || post.status}</span></td>
                  <td className="px-4 py-3 text-muted-foreground">{post.date?.slice(0, 10)}</td>
                  <td className="px-4 py-3 text-right">
                    <div className="flex items-center justify-end gap-1">
                      <button className="rounded p-1.5 text-muted-foreground hover:bg-primary/10 hover:text-primary" title="Preview"><Eye className="h-4 w-4" /></button>
                      <button onClick={() => setEditingPost(post.slug)} className="rounded p-1.5 text-muted-foreground hover:bg-primary/10 hover:text-primary" title="Editar"><Edit3 className="h-4 w-4" /></button>
                      <button onClick={() => handleDelete(post.slug)} className="rounded p-1.5 text-muted-foreground hover:bg-error-red/10 hover:text-error-red" title="Excluir"><Trash2 className="h-4 w-4" /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {filtered.length === 0 && <div className="px-4 py-8 text-center text-muted-foreground">Nenhum artigo encontrado.</div>}
        </div>
      )}

      <p className="text-[11px] text-muted-foreground">{filtered.length} de {posts.length} artigos</p>
    </div>
  );
}