'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/admin/auth';
import { Button } from '@/components/Button';
import { FormInput } from '@/components/FormInput';
import { Shield, Lock } from 'lucide-react';

export function LoginForm() {
  const { login } = useAuth();
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const ok = await login(email, password);
      if (ok) {
        router.push('/admin/crm');
      } else {
        setError('E-mail ou senha incorretos.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-dark-elevated px-4">
      <div className="w-full max-w-md">
        {/* Brand */}
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

        {/* Login Form */}
        <div className="glass-card p-8">
          <form onSubmit={handleSubmit} className="space-y-5" noValidate>
            <div className="flex items-center justify-center mb-4">
              <Lock className="h-5 w-5 text-neutral-medium" />
            </div>

            <FormInput
              label="E-mail"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="admin@herlonmoura.com.br"
              required
            />

            <FormInput
              label="Senha"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              required
            />

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