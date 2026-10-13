'use client';

import React, { useEffect } from 'react';
import { AuthProvider, useAuth } from '@/lib/admin/auth';
import { LoginForm } from '@/components/admin/LoginForm';
import { ProtectedRoute } from '@/components/admin/ProtectedRoute';
import AdminRootContent from './page';
import { useRouter } from 'next/navigation';

function AdminRoot() {
  const { isAuthenticated } = useAuth();
  const router = useRouter();

  if (isAuthenticated) {
    router.replace('/admin/crm');
    return null;
  }

  return <LoginForm />;
}

export default function AdminPage() {
  // Force dark mode for admin panel
  useEffect(() => {
    const root = document.documentElement;
    root.classList.remove('light');
    root.classList.add('dark');
  }, []);

  return (
    <div className="dark">
      <style jsx global>{`
        :root {
          --color-bg-primary: #0f172a !important;
          --color-bg-secondary: #1e293b !important;
          --color-bg-tertiary: #020617 !important;
          --color-bg-card: rgba(15, 23, 42, 0.7) !important;
          --color-bg-card-hover: rgba(15, 23, 42, 0.85) !important;
          --color-text-primary: #f8fafc !important;
          --color-text-secondary: #94a3b8 !important;
          --color-text-tertiary: #64748b !important;
          --color-text-inverse: #0f172a !important;
          --color-border-default: rgba(148, 163, 184, 0.15) !important;
          --color-border-subtle: rgba(148, 163, 184, 0.08) !important;
          --color-border-strong: rgba(148, 163, 184, 0.3) !important;
          --color-surface: #0f172a !important;
          --color-surface-raised: #1e293b !important;
          --color-surface-overlay: rgba(15, 23, 42, 0.95) !important;
          --color-glass-surface: rgba(15, 23, 42, 0.7) !important;
          --color-glass-surface-hover: rgba(15, 23, 42, 0.85) !important;
          --color-glass-border: rgba(20, 184, 166, 0.2) !important;
          --color-glass-border-hover: rgba(20, 184, 166, 0.4) !important;
          --color-glass-overlay: rgba(15, 23, 42, 0.4) !important;
          --shadow-glass: 0 10px 30px 0 rgba(0, 0, 0, 0.35) !important;
          --shadow-sm: 0 1px 2px 0 rgba(0, 0, 0, 0.05) !important;
          --shadow-md: 0 4px 6px -1px rgba(0, 0, 0, 0.1) !important;
          --shadow-lg: 0 10px 15px -3px rgba(0, 0, 0, 0.1) !important;
        }
      `}</style>
      <AuthProvider>
        <AdminRoot />
      </AuthProvider>
    </div>
  );
}
