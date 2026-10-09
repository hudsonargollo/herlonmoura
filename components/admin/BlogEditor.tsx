'use client';

import React, { useState } from 'react';
import { Eye, Save, Send, FileText, Tag, Calendar, Clock, Hash } from 'lucide-react';
import { Button } from '@/components/Button';
import { FormInput } from '@/components/FormInput';
import { api } from '@/lib/admin/api';

interface BlogEditorProps {
  initialPost?: {
    title: string;
    excerpt: string;
    category: string;
    author: string;
    content: string;
    status: 'draft' | 'approval';
  };
  onSave?: (post: BlogEditorFormData) => void;
  onPreview?: (post: BlogEditorFormData) => void;
}

export interface BlogEditorFormData {
  title: string;
  excerpt: string;
  category: string;
  author: string;
  content: string;
  status: 'draft' | 'approval';
}

const CATEGORIES = [
  'Varizes',
  'Trombose',
  'Diagnóstico',
  'Prevenção',
  'Procedimentos',
  'Tratamentos',
];

const DEFAULT_CONTENT = `## Introdução

Escreva o conteúdo do artigo aqui usando **markdown**.

## Seção 1

- Primeiro ponto
- Segundo ponto
- Terceiro ponto

## Seção 2

Parágrafo com mais detalhes sobre o tema.
`;

export function BlogEditor({ initialPost, onSave, onPreview }: BlogEditorProps) {
  const [formData, setFormData] = useState<BlogEditorFormData>({
    title: initialPost?.title ?? '',
    excerpt: initialPost?.excerpt ?? '',
    category: initialPost?.category ?? CATEGORIES[0],
    author: initialPost?.author ?? 'Dr. Herlon Moura',
    content: initialPost?.content ?? DEFAULT_CONTENT,
    status: initialPost?.status ?? 'draft',
  });
  const [showPreview, setShowPreview] = useState(false);
  const [saving, setSaving] = useState(false);
  const [saveMsg, setSaveMsg] = useState<string | null>(null);

  const update = (field: keyof BlogEditorFormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSave = async () => {
    setSaving(true);
    setSaveMsg(null);
    try {
      const slug = formData.title.toLowerCase().replace(/\s+/g, '-');
      if (initialPost?.title) {
        await api.put(slug, formData);
      } else {
        await api.post<any>('/api/blog', formData);
      }
      setSaveMsg('Salvo com sucesso!');
      onSave?.(formData);
    } catch (e: any) {
      setSaveMsg(`Erro: ${e.message}`);
    } finally {
      setSaving(false);
    }
  };

  const handlePreview = () => {
    onPreview?.(formData);
    setShowPreview(true);
  };

  const handleStatusChange = (status: BlogEditorFormData['status']) => {
    update('status', status);
  };

  const renderPreview = (md: string) => {
    return md
      .replace(/^### (.+)$/gm, '<h3 class="text-heading-2 font-heading font-semibold text-foreground mt-4 mb-2">$1</h3>')
      .replace(/^## (.+)$/gm, '<h2 class="text-heading-1 font-heading font-semibold text-foreground mt-6 mb-3">$1</h2>')
      .replace(/^# (.+)$/gm, '<h1 class="text-display-md font-heading font-bold text-foreground mt-4 mb-3">$1</h1>')
      .replace(/\*\*(.+?)\*\*/g, '<strong class="text-foreground font-semibold">$1</strong>')
      .replace(/\*(.+?)\*/g, '<em class="text-foreground">$1</em>')
      .replace(/^- (.+)$/gm, '<li class="text-sm text-foreground ml-4 list-disc">$1</li>')
      .replace(/\n\n/g, '</p><p class="text-sm text-foreground leading-relaxed mb-3">')
      .replace(/\n/g, '<br/>');
  };

  return (
    <div className="space-y-5">
      {/* Toolbar */}
      <div className="flex flex-col gap-3 tablet:flex-row tablet:items-center tablet:justify-between">
        <div className="flex items-center gap-2">
          <Button variant="primary" size="sm" onClick={handleSave} disabled={saving}>
            <Save className="mr-1.5 h-4 w-4" /> {saving ? 'Salvando...' : 'Salvar'}
          </Button>
          <Button variant="secondary" size="sm" onClick={handlePreview}>
            <Eye className="mr-1.5 h-4 w-4" /> Preview
          </Button>
        </div>
        {saveMsg && <span className="text-xs text-primary">{saveMsg}</span>}
        <div className="flex items-center gap-2">
          {(['draft', 'approval'] as const).map((s) => {
            const colors = {
              draft: 'border-neutral-medium/30  bg-muted/50/10 text-muted-foreground',
              approval: 'border-warning-amber/30 bg-warning-amber/10 text-warning-amber',
            };
            const labels = { draft: 'Rascunho', approval: 'Aprovação' };
            return (
              <button
                key={s}
                onClick={() => handleStatusChange(s)}
                className={`rounded-full border px-3 py-1 text-[11px] font-medium transition-colors ${
                  formData.status === s
                    ? colors[s] + ' ring-1 ring-current'
                    : 'bg-transparent text-muted-foreground hover:bg-muted'
                }`}
              >
                {labels[s]}
              </button>
            );
          })}
        </div>
      </div>

      <div className="grid grid-cols-1 tablet:grid-cols-3 gap-5">
        {/* Editor */}
        <div className="tablet:col-span-2 space-y-4">
          {/* Frontmatter fields */}
          <div className="rounded-xl border border-border/60 bg-muted/40 p-5">
            <h4 className="text-heading-3 font-heading font-semibold text-foreground mb-4 flex items-center gap-2">
              <FileText className="h-4 w-4 text-primary" />
              Conteúdo
            </h4>

            <div className="space-y-4">
              <FormInput
                label="Título"
                value={formData.title}
                onChange={(e) => update('title', e.target.value)}
                placeholder="Título do artigo"
              />

              <FormInput
                label="Extrato"
                value={formData.excerpt}
                onChange={(e) => update('excerpt', e.target.value)}
                placeholder="Breve descrição para listagem"
              />

              <div className="grid grid-cols-2 gap-3">
                <FormInput
                  label="Categoria"
                  value={formData.category}
                  onChange={(e) => update('category', e.target.value)}
                  list="category-list"
                />
                <datalist id="category-list">
                  {CATEGORIES.map((c) => (
                    <option key={c} value={c} />
                  ))}
                </datalist>

                <FormInput
                  label="Autor"
                  value={formData.author}
                  onChange={(e) => update('author', e.target.value)}
                />
              </div>
            </div>
          </div>

          {/* Markdown content */}
          <div className="rounded-xl border border-border/60 bg-muted/40 p-5">
            <h4 className="text-heading-3 font-heading font-semibold text-foreground mb-4 flex items-center gap-2">
              <FileText className="h-4 w-4 text-primary" />
              Corpo (Markdown)
            </h4>
            <textarea
              value={formData.content}
              onChange={(e) => update('content', e.target.value)}
              className="w-full min-h-[320px] rounded-lg border border-border bg-muted px-4 py-3 text-sm text-foreground font-mono placeholder-neutral-medium transition-all duration-300 focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/25 resize-y"
              spellCheck={false}
            />
            <p className="mt-2 text-[11px] text-muted-foreground">
              Use Markdown: # títulos, **negrito**, *itálico*, listas com -, links [text](url)
            </p>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-4">
          {/* Status card */}
          <div className="rounded-xl border border-border/60 bg-muted/40 p-4">
            <h4 className="text-heading-3 font-heading font-semibold text-foreground mb-3 flex items-center gap-2">
              <Tag className="h-4 w-4 text-primary" />
              Status
            </h4>
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Status</span>
                <span
                  className={`inline-flex items-center rounded-full border px-2 py-0.5 text-[11px] font-medium ${
                    formData.status === 'approval'
                      ? 'border-warning-amber/30 bg-warning-amber/15 text-warning-amber'
                      : 'border-neutral-medium/30  bg-muted/50/10 text-muted-foreground'
                  }`}
                >
                  {formData.status === 'draft'
                    ? 'Rascunho'
                    : formData.status === 'approval'
                    ? 'Aprovação'
                    : 'Publicado'}
                </span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Categoria</span>
                <span className="text-foreground">{formData.category}</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Autor</span>
                <span className="text-foreground">{formData.author}</span>
              </div>
            </div>
          </div>

          {/* Content stats */}
          <div className="rounded-xl border border-border/60 bg-muted/40 p-4">
            <h4 className="text-heading-3 font-heading font-semibold text-foreground mb-3 flex items-center gap-2">
              <FileText className="h-4 w-4 text-primary" />
              Estatísticas
            </h4>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Palavras</span>
                <span className="text-foreground">
                  {formData.content.split(/\s+/).filter(Boolean).length}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Caracteres</span>
                <span className="text-foreground">{formData.content.length}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Linhas</span>
                <span className="text-foreground">
                  {formData.content.split('\n').length}
                </span>
              </div>
            </div>
          </div>

          {/* Quick actions */}
          <div className="rounded-xl border border-border/60 bg-muted/40 p-4">
            <h4 className="text-heading-3 font-heading font-semibold text-foreground mb-3">
              Ações Rápidas
            </h4>
            <div className="space-y-2">
              <Button variant="secondary" size="sm" className="w-full" onClick={handlePreview}>
                <Eye className="mr-1.5 h-4 w-4" /> Preview
              </Button>
              <Button variant="primary" size="sm" className="w-full" onClick={handleSave}>
                <Save className="mr-1.5 h-4 w-4" /> Salvar
              </Button>
              {formData.status !== 'approval' && (
                <Button variant="secondary" size="sm" className="w-full text-success-green border-success-green/30">
                  <Send className="mr-1.5 h-4 w-4" /> Publicar
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Preview modal */}
      {showPreview && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-glass-overlay p-4" onClick={() => setShowPreview(false)}>
          <div
            className="glass-card w-full max-w-3xl max-h-[80vh] overflow-y-auto p-8"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-heading-2 font-heading font-semibold text-foreground">Preview</h2>
              <Button variant="ghost" size="sm" onClick={() => setShowPreview(false)}>
                ✕ Fechar
              </Button>
            </div>
            <article
              className="prose prose-invert max-w-none"
              dangerouslySetInnerHTML={{ __html: renderPreview(formData.content) }}
            />
          </div>
        </div>
      )}
    </div>
  );
}
