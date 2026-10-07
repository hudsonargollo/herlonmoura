'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { Clock, CheckCircle2, XCircle, Send, Eye, FileText, Filter, ArrowUpDown } from 'lucide-react';
import { Button } from '@/components/Button';
import { Card } from '@/components/Card';
import { FormInput } from '@/components/FormInput';
import { api } from '@/lib/admin/api';

interface BlogPost {
  slug: string; title: string; excerpt: string; date: string; category: string;
  author: string; status: 'draft' | 'approval' | 'published' | 'archived';
  readingTime: string; content: string; meta_title: string; meta_description: string;
  questionnaire_enabled: boolean; freebie_name: string | null;
}

const STATUS_LABELS: Record<string, string> = { draft: 'Rascunho', approval: 'Aprovação', published: 'Publicado', archived: 'Arquivado' };
const STATUS_COLORS: Record<string, string> = { draft: 'bg-neutral-medium/15 text-neutral-medium border-neutral-medium/30', approval: 'bg-warning-amber/15 text-warning-amber border-warning-amber/30', published: 'bg-success-green/15 text-success-green border-success-green/30', archived: 'bg-neutral-medium/15 text-neutral-medium border-neutral-medium/30' };

export default function BlogApprovalQueue() {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [authorFilter, setAuthorFilter] = useState('all');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [actionMsg, setActionMsg] = useState<string | null>(null);

  const fetchPosts = useCallback(async () => {
    setLoading(true); setError(null);
    try {
      const data: { posts: BlogPost[] } = await api.get('/api/blog/approval-queue');
      setPosts(data.posts);
    } catch (e: any) { setError(e.message || 'Erro ao carregar fila'); }
    finally { setLoading(false); }
  }, []);

  useEffect(() => { fetchPosts(); }, [fetchPosts]);

  const categories = [...new Set(posts.map((p) => p.category))];
  const authors = [...new Set(posts.map((p) => p.author))];
  const filtered = posts.filter((p) => {
    if (categoryFilter !== 'all' && p.category !== categoryFilter) return false;
    if (authorFilter !== 'all' && p.author !== authorFilter) return false;
    return true;
  });

  const handleApprove = async (slug: string) => {
    try {
      await api.put(`/api/blog/${slug}`, { status: 'approval' });
      setActionMsg(`${slug} aprovado!`);
      fetchPosts();
    } catch (e: any) { alert(`Erro: ${e.message}`); }
  };

  const handleReject = async (slug: string) => {
    if (!confirm(`Rejeitar "${slug}"?`)) return;
    try {
      await api.put(`/api/blog/${slug}`, { status: 'draft' });
      setActionMsg(`${slug} rejeitado, voltou para rascunho.`);
      fetchPosts();
    } catch (e: any) { alert(`Erro: ${e.message}`); }
  };

  const handlePublish = async (slug: string) => {
    if (!confirm(`Publicar "${slug}"?`)) return;
    try {
      await api.put(`/api/blog/${slug}`, { status: 'published' });
      setActionMsg(`${slug} publicado!`);
      fetchPosts();
    } catch (e: any) { alert(`Erro: ${e.message}`); }
  };

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-display-md font-heading font-semibold text-neutral-light">Fila de Aprovação</h1>
          <p className="text-sm text-neutral-medium">Revise e aprove artigos antes da publicação.</p>
        </div>
        <Button variant="primary" size="sm" onClick={fetchPosts}><Clock className="mr-1.5 h-4 w-4" /> Atualizar</Button>
      </div>

      {actionMsg && (
        <div className="rounded-xl border border-success-green/30 bg-success-green/5 px-4 py-3 text-sm text-success-green">{actionMsg}</div>
      )}

      {/* Filters */}
      <Card variant="glass" className="p-4">
        <div className="flex items-center gap-2 mb-3"><Filter className="h-4 w-4 text-surgical-teal" /><span className="text-sm font-semibold text-neutral-light">Filtros</span></div>
        <div className="grid grid-cols-1 tablet:grid-cols-2 gap-3">
          <select value={categoryFilter} onChange={(e) => setCategoryFilter(e.target.value)} className="glass-input text-sm py-2">
            <option value="all">Todas as categorias</option>
            {categories.map((c) => <option key={c} value={c}>{c}</option>)}
          </select>
          <select value={authorFilter} onChange={(e) => setAuthorFilter(e.target.value)} className="glass-input text-sm py-2">
            <option value="all">Todos os autores</option>
            {authors.map((a) => <option key={a} value={a}>{a}</option>)}
          </select>
        </div>
      </Card>

      {error && (
        <div className="rounded-xl border border-error-red/30 bg-error-red/5 p-4 text-center">
          <p className="text-sm text-error-red">{error}</p>
          <Button variant="primary" size="sm" onClick={fetchPosts} className="mt-2">Tentar novamente</Button>
        </div>
      )}

      {loading ? (
        <div className="px-4 py-8 text-center text-neutral-medium">Carregando fila...</div>
      ) : (
        <>
          <div className="flex items-center justify-between">
            <p className="text-sm text-neutral-medium">{filtered.length} artigo(s) na fila de {posts.length}</p>
          </div>
          <div className="overflow-hidden rounded-xl border border-neutral-dark bg-neutral-dark/60">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-neutral-dark/60 bg-neutral-dark/40">
                  <th className="px-4 py-3 text-left text-xs font-semibold text-neutral-medium uppercase">Artigo</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-neutral-medium uppercase">Categoria</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-neutral-medium uppercase">Autor</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-neutral-medium uppercase">Status</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-neutral-medium uppercase">Data</th>
                  <th className="px-4 py-3 text-right text-xs font-semibold text-neutral-medium uppercase">Ações</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-dark/40">
                {filtered.map((post) => (
                  <tr key={post.slug} className="transition-colors hover:bg-surgical-teal/5">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-warning-amber/15 text-warning-amber flex-shrink-0"><FileText className="h-4 w-4" /></div>
                        <div>
                          <p className="font-medium text-neutral-light text-sm">{post.title}</p>
                          <p className="text-[11px] text-neutral-medium">{post.slug}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-neutral-light">{post.category}</td>
                    <td className="px-4 py-3 text-neutral-medium">{post.author}</td>
                    <td className="px-4 py-3"><span className={`inline-flex items-center rounded-full border px-2 py-0.5 text-[11px] font-medium ${STATUS_COLORS[post.status]}`}>{STATUS_LABELS[post.status] || post.status}</span></td>
                    <td className="px-4 py-3 text-neutral-medium">{post.date?.slice(0, 10)}</td>
                    <td className="px-4 py-3 text-right">
                      <div className="flex items-center justify-end gap-1">
                        <Button variant="ghost" size="sm" title="Preview"><Eye className="h-4 w-4" /></Button>
                        <Button variant="ghost" size="sm" className="text-success-green border-success-green/30" title="Aprovar" onClick={() => handleApprove(post.slug)}><CheckCircle2 className="h-4 w-4" /></Button>
                        <Button variant="ghost" size="sm" className="text-warning-amber border-warning-amber/30" title="Rejeitar" onClick={() => handleReject(post.slug)}><XCircle className="h-4 w-4" /></Button>
                        <Button variant="ghost" size="sm" className="text-surgical-teal border-surgical-teal/30" title="Publicar" onClick={() => handlePublish(post.slug)}><Send className="h-4 w-4" /></Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {filtered.length === 0 && <div className="px-4 py-8 text-center text-neutral-medium">Nenhum artigo na fila.</div>}
          </div>
        </>
      )}
    </div>
  );
}