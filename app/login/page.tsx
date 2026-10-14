'use client';

import React, { useState, useEffect } from 'react';
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
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [mounted, setMounted] = useState(false);

  // Avoid hydration mismatch — only set dark theme after mount
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', 'dark');
    setMounted(true);
  }, []);

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
        {[
          { Icon: HeartPulse, pos: 'left-[8%] top-[15%]', size: 'h-12 w-12', iconSize: 'h-6 w-6', color: 'text-surgical-teal/60', border: 'border-surgical-teal/20', bg: 'bg-surgical-teal/5', delay: '0s', dur: '3s' },
          { Icon: Activity, pos: 'right-[12%] top-[20%]', size: 'h-10 w-10', iconSize: 'h-5 w-5', color: 'text-surgical-teal/50', border: 'border-surgical-teal/20', bg: 'bg-surgical-teal/5', delay: '1s', dur: '4s' },
          { Icon: Stethoscope, pos: 'bottom-[18%] left-[15%]', size: 'h-10 w-10', iconSize: 'h-5 w-5', color: 'text-gold/50', border: 'border-gold/20', bg: 'bg-gold/5', delay: '2s', dur: '3.5s' },
          { Icon: Shield, pos: 'bottom-[25%] right-[8%]', size: 'h-14 w-14', iconSize: 'h-7 w-7', color: 'text-surgical-teal/40', border: 'border-surgical-teal/15', bg: 'bg-surgical-teal/5', delay: '0.5s', dur: '4.5s' },
        ].map(({ Icon, pos, size, iconSize, color, border, bg, delay, dur }, i) => (
          <div
            key={i}
            className={`absolute ${pos} ${size} animate-pulse rounded-2xl border ${border} ${bg} backdrop-blur-sm`}
            style={{ animationDelay: delay, animationDuration: dur }}
          >
            <div className="flex h-full w-full items-center justify-center">
              <Icon className={`${iconSize} ${color}`} />
            </div>
          </div>
        ))}
      </div>

      {/* Login Card */}
      <div className="relative z-10 w-full max-w-md px-4">
        <div
          className="rounded-3xl border p-8 shadow-2xl"
          style={{
            borderColor: 'rgba(20, 184, 166, 0.15)',
            backgroundColor: 'rgba(10, 22, 40, 0.75)',
            backdropFilter: 'blur(24px) saturate(180%)',
            WebkitBackdropFilter: 'blur(24px) saturate(180%)',
            boxShadow:
              'inset 0 1px 0 rgba(255,255,255,0.08), 0 24px 48px -12px rgba(0,0,0,0.5)',
          }}
        >
          {/* Logo */}
          <div className="mb-4 text-center">
            <div
              className="mx-auto flex h-16 w-auto items-center justify-center rounded-2xl px-5"
              style={{ backgroundColor: 'rgba(248, 250, 252, 0.95)' }}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/images/brand/logo.png"
                alt="Dr. Herlon Moura"
                className="h-12 w-auto object-contain"
              />
            </div>
          </div>

          {/* Doctor Photo */}
          <div className="mb-6 flex justify-center">
            <div
              className="relative h-24 w-24 overflow-hidden rounded-full border-2"
              style={{
                borderColor: 'rgba(20, 184, 166, 0.4)',
                boxShadow: '0 0 20px rgba(20, 184, 166, 0.15)',
              }}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/images/brand/dr-photoroom.png"
                alt="Dr. Herlon Moura"
                className="h-full w-full object-cover object-top"
              />
            </div>
          </div>

          {/* Title */}
          <div className="mb-6 text-center">
            <h1
              className="text-xl font-bold"
              style={{
                fontFamily: 'var(--font-montserrat), system-ui, sans-serif',
                color: '#f8fafc',
              }}
            >
              Painel Administrativo
            </h1>
            <p className="mt-1 text-xs text-slate-400">
              Dr. Herlon Moura — Sistema de Gestão
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4" noValidate>
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

          <p className="mt-4 text-center text-[11px] text-slate-500">
            Acesso restrito à equipe Dr. Herlon Moura
          </p>
        </div>
      </div>
    </div>
  );
}
