'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/Button';
import { Shield, User } from 'lucide-react';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = React.useState('admin@herlonmoura.com.br');
  const [password, setPassword] = React.useState('admin2026!');
  const [error, setError] = React.useState('');
  const [loading, setLoading] = React.useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || 'Login falhou');
        return;
      }
      // Token stored in httpOnly cookie by the API — just redirect
      router.push('/admin/crm');
    } catch {
      setError('Erro de conexão.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-dark-elevated px-4">
      <div className="w-full max-w-md">
        <div className="mb-8 text-center">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-surgical-teal/15 text-surgical-teal mb-4">
            <Shield className="h-8 w-8" />
          </div>
          <h1 className="text-heading-2 font-heading font-semibold text-neutral-light">
            Painel Admin
          </h1>
          <p className="mt-2 text-body-small text-neutral-medium">
            Dr. Herlon Moura — Sistema de Gestão
          </p>
        </div>

        <div className="glass-card p-8">
          <form onSubmit={handleSubmit} className="space-y-5" noValidate>
            <div className="flex items-center justify-center mb-4">
              <User className="h-5 w-5 text-neutral-medium" />
            </div>

            <div>
              <label className="block text-xs font-medium text-neutral-medium mb-1">
                E-mail
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="glass-input w-full text-sm"
                placeholder="admin@herlonmoura.com.br"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-neutral-medium mb-1">
                Senha
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="glass-input w-full text-sm"
                placeholder="••••••••"
                required
              />
            </div>

            {error && (
              <p className="text-center text-xs text-error-red" role="alert">
                {error}
              </p>
            )}

            <Button type="submit" variant="primary" size="lg" className="w-full" isLoading={loading}>
              Entrar
            </Button>
          </form>

          <p className="mt-4 text-center text-[11px] text-neutral-medium">
            Credenciais de demonstração: admin@herlonmoura.com.br / admin2026!
          </p>
        </div>
      </div>
    </div>
  );
}