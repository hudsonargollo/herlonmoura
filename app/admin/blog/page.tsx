'use client';

import React, { useState } from 'react';
import { Edit3, Save, Send, Trash2, Eye, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/Button';
import { BlogEditor } from '@/components/admin/BlogEditor';
import { BlogEditorList } from '@/components/admin/BlogEditorList';
import { api } from '@/lib/admin/api';
import { ProtectedRoute } from '@/components/admin/ProtectedRoute';

type View = 'list' | 'editor';
type Action = 'edit' | 'new' | 'publish' | 'delete';

export default function BlogPage() {
  return (
    <ProtectedRoute requiredRole="editor">
      <BlogPageContent />
    </ProtectedRoute>
  );
}

function BlogPageContent() {
  const [view, setView] = useState<View>('list');
  const [editingSlug, setEditingSlug] = useState<string | null>(null);
  const [action, setAction] = useState<Action | null>(null);
  const [selectedSlug, setSelectedSlug] = useState<string | null>(null);

  const handleEdit = (slug: string) => { setEditingSlug(slug); setView('editor'); };
  const handleNew = () => { setEditingSlug(null); setView('editor'); };
  const handleBack = () => { setView('list'); setEditingSlug(null); setAction(null); };

  const handlePublish = async (slug: string) => {
    if (!confirm(`Publicar "${slug}"?`)) return;
    try {
      await api.put(`/api/blog/${slug}`, { status: 'published' });
      alert('Publicado com sucesso!');
    } catch (e: any) { alert(`Erro: ${e.message}`); }
  };

  const handleDelete = async (slug: string) => {
    if (!confirm(`Excluir "${slug}" permanentemente?`)) return;
    try {
      await api.delete(`/api/blog/${slug}`);
      alert('Excluído!');
      setView('list');
    } catch (e: any) { alert(`Erro: ${e.message}`); }
  };

  if (view === 'editor') {
    return (
      <div>
        <Button variant="ghost" size="sm" onClick={handleBack} className="mb-4">
          <ArrowLeft className="mr-1.5 h-4 w-4" /> Voltar à lista
        </Button>
        <BlogEditor initialPost={undefined} onSave={() => { setView('list'); setEditingSlug(null); }} />
      </div>
    );
  }

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-display-md font-heading font-semibold text-white">Blog Editor</h1>
          <p className="text-sm text-slate-400">Crie e gerencie artigos do blog.</p>
        </div>
        <button
          onClick={handleNew}
          className="flex items-center gap-2 rounded-3xl bg-brand-accent px-5 py-2.5 text-sm font-semibold text-slate-900 hover:bg-brand-accent/90 transition-colors"
        >
          <Edit3 className="h-4 w-4" /> Novo Artigo
        </button>
      </div>

      {/* Action bar */}
      {selectedSlug && (
        <div className="flex items-center gap-2 rounded-2xl border border-brand-accent/20 bg-brand-accent/5 px-4 py-3">
          <span className="text-sm text-white">Selecionado: {selectedSlug}</span>
          <button onClick={() => handlePublish(selectedSlug)} className="flex items-center gap-1.5 rounded-2xl bg-brand-accent/15 px-4 py-1.5 text-xs font-semibold text-brand-accent hover:bg-brand-accent/25 transition-colors">
            <Send className="h-3.5 w-3.5" /> Publicar
          </button>
          <button onClick={() => handleEdit(selectedSlug)} className="flex items-center gap-1.5 rounded-2xl bg-surface-cardDark/60 px-4 py-1.5 text-xs font-semibold text-slate-300 hover:bg-surface-cardDark transition-colors">
            <Edit3 className="h-3.5 w-3.5" /> Editar
          </button>
          <button onClick={() => handleDelete(selectedSlug)} className="flex items-center gap-1.5 rounded-2xl bg-red-500/10 px-4 py-1.5 text-xs font-semibold text-red-400 hover:bg-red-500/20 transition-colors">
            <Trash2 className="h-3.5 w-3.5" /> Excluir
          </button>
        </div>
      )}

      <BlogEditorList onSelectPost={setSelectedSlug} selectedPost={selectedSlug} />
    </div>
  );
}
