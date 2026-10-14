'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/Button';
import { Shield, User, Lock, HeartPulse, Activity, Stethoscope } from 'lucide-react';
import dynamic from 'next/dynamic';

const VascularScene = dynamic(() => import('@/components/Hero3D').then(m => m.VascularScene), {
  ssr: false,
  loading: () => (
    <div className="absolute inset-0 flex items-center justify-center">
      <div className="h-8 w-8 animate-spin rounded-full border-2 border-surgical-teal border-t-transparent" />
    </div>
  ),
});

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');
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
      router.push('/admin/crm');
    } catch {
      setError('Erro de conexão.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[#0a1628]">
      {/* 3D Vascular Background */}
      <div className="absolute inset-0 opacity-60">
        <VascularScene />
      </div>

      {/* Gradient overlay for readability */}
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            'linear-gradient(135deg, rgba(10,22,40,0.92) 0%, rgba(10,22,40,0.75) 50%, rgba(10,22,40,0.85) 100%)',
        }}
      />

      {/* Floating medical icons */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div
          className="absolute left-[8%] top-[15%] h-12 w-12 animate-pulse rounded-2xl border border-surgical-teal/20 bg-surgical-teal/5 backdrop-blur-sm"
          style={{ animationDelay: '0s', animationDuration: '3s' }}
        >
          <div className="flex h-full w-full items-center justify-center">
            <HeartPulse className="h-6 w-6 text-surgical-teal/60" />
          </div>
        </div>
        <div
          className="absolute right-[12%] top-[20%] h-10 w-10 animate-pulse rounded-2xl border border-surgical-teal/20 bg-surgical-teal/5 backdrop-blur-sm"
          style={{ animationDelay: '1s', animationDuration: '4s' }}
        >
          <div className="flex h-full w-full items-center justify-center">
            <Activity className="h-5 w-5 text-surgical-teal/50" />
          </div>
        </div>
        <div
          className="absolute bottom-[18%] left-[15%] h-10 w-10 animate-pulse rounded-2xl border border-gold/20 bg-gold/5 backdrop-blur-sm"
          style={{ animationDelay: '2s', animationDuration: '3.5s' }}
        >
          <div className="flex h-full w-full items-center justify-center">
            <Stethoscope className="h-5 w-5 text-gold/50" />
          </div>
        </div>
        <div
          className="absolute bottom-[25%] right-[8%] h-14 w-14 animate-pulse rounded-2xl border border-surgical-teal/15 bg-surgical-teal/5 backdrop-blur-sm"
          style={{ animationDelay: '0.5s', animationDuration: '4.5s' }}
        >
          <div className="flex h-full w-full items-center justify-center">
            <Shield className="h-7 w-7 text-surgical-teal/40" />
          </div>
        </div>
        <div
          className="absolute left-[45%] top-[8%] h-8 w-8 animate-pulse rounded-full border border-surgical-teal/15 bg-surgical-teal/5 backdrop-blur-sm"
          style={{ animationDelay: '1.5s', animationDuration: '3.8s' }}
        >
          <div className="flex h-full w-full items-center justify-center">
            <HeartPulse className="h-4 w-4 text-surgical-teal/40" />
          </div>
        </div>
      </div>

      {/* Login Card */}
      <div className="relative z-10 w-full max-w-md px-4">
        <div
          className="rounded-3xl border p-8 shadow-2xl"
          style={{
            borderColor: 'rgba(20, 184, 166, 0.15)',
            backgroundColor: 'rgba(10, 22, 40, 0.75)',
            backdropFilter: 'blur(24px)',
            WebkitBackdropFilter: 'blur(24px)',
            boxShadow:
              'inset 0 1px 0 rgba(255,255,255,0.08), 0 24px 48px -12px rgba(0,0,0,0.5)',
          }}
        >
          {/* Logo */}
          <div className="mb-8 text-center">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl border border-surgical-teal/20 bg-surgical-teal/10">
              <HeartPulse className="h-9 w-9 text-surgical-teal" />
            </div>
            <h1
              className="text-2xl font-bold"
              style={{
                fontFamily: 'var(--font-montserrat), system-ui, sans-serif',
                color: '#f8fafc',
              }}
            >
              Painel Administrativo
            </h1>
            <p className="mt-1.5 text-sm text-slate-400">
              Dr. Herlon Moura — Sistema de Gestão
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5" noValidate>
            {/* Email */}
            <div>
              <label className="mb-1.5 block text-xs font-medium text-slate-400">
                E-mail
              </label>
              <div className="relative">
                <User className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full rounded-xl border border-slate-700/50 bg-slate-800/50 py-3 pl-10 pr-4 text-sm text-slate-200 placeholder-slate-500 outline-none transition-all focus:border-surgical-teal/50 focus:ring-2 focus:ring-surgical-teal/20"
                  placeholder="admin@herlonmoura.com"
                  required
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label className="mb-1.5 block text-xs font-medium text-slate-400">
                Senha
              </label>
              <div className="relative">
                <Lock className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full rounded-xl border border-slate-700/50 bg-slate-800/50 py-3 pl-10 pr-4 text-sm text-slate-200 placeholder-slate-500 outline-none transition-all focus:border-surgical-teal/50 focus:ring-2 focus:ring-surgical-teal/20"
                  placeholder="••••••••"
                  required
                />
              </div>
            </div>

            {error && (
              <p className="text-center text-xs text-red-400" role="alert">
                {error}
              </p>
            )}

            <Button type="submit" variant="primary" size="lg" className="w-full" isLoading={loading}>
              Entrar
            </Button>
          </form>

          <p className="mt-5 text-center text-[11px] text-slate-500">
            Acesso restrito à equipe Dr. Herlon Moura
          </p>
        </div>
      </div>
    </div>
  );
}
