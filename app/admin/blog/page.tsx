'use client';

import React, { useState } from 'react';
import { Edit3, Save, Send, Trash2, Eye, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/Button';
import { BlogEditor } from '@/components/admin/BlogEditor';
import { BlogEditorList } from '@/components/admin/BlogEditorList';
import { api } from '@/lib/admin/api';

type View = 'list' | 'editor';
type Action = 'edit' | 'new' | 'publish' | 'delete';

export default function BlogPage() {
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
        <Button variant="ghost" size="sm" onClick={handleBack} className="mb-4"><ArrowLeft className="mr-1.5 h-4 w-4" /> Voltar à lista</Button>
        <BlogEditor
          initialPost={undefined}
          onSave={() => { setView('list'); setEditingSlug(null); }}
        />
      </div>
    );
  }

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-display-md font-heading font-semibold text-neutral-light">Blog Editor</h1>
          <p className="text-sm text-neutral-medium">Crie e gerencie artigos do blog.</p>
        </div>
        <Button variant="primary" size="sm" onClick={handleNew}><Edit3 className="mr-1.5 h-4 w-4" /> Novo Artigo</Button>
      </div>

      {/* Action bar */}
      {selectedSlug && (
        <div className="flex items-center gap-2 rounded-xl border border-surgical-teal/20 bg-surgical-teal/5 px-4 py-3">
          <span className="text-sm text-neutral-light">Selecionado: {selectedSlug}</span>
          <Button variant="primary" size="sm" onClick={() => handlePublish(selectedSlug)}><Send className="mr-1.5 h-4 w-4" /> Publicar</Button>
          <Button variant="secondary" size="sm" onClick={() => handleEdit(selectedSlug)}><Edit3 className="mr-1.5 h-4 w-4" /> Editar</Button>
          <Button variant="ghost" size="sm" className="text-error-red border-error-red/30" onClick={() => handleDelete(selectedSlug)}><Trash2 className="mr-1.5 h-4 w-4" /> Excluir</Button>
        </div>
      )}

      <BlogEditorList onSelectPost={setSelectedSlug} selectedPost={selectedSlug} />
    </div>
  );
}