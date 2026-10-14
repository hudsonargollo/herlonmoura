'use client';

import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { AuthProvider, useAuth } from '@/lib/admin/auth';
import { LoginForm } from '@/components/admin/LoginForm';
function AdminRoot() {
  const { isAuthenticated } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (isAuthenticated) {
      router.replace('/admin/crm');
    }
  }, [isAuthenticated, router]);

  if (isAuthenticated) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-surface-dark">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-brand-accent border-t-transparent" />
      </div>
    );
  }

  return <LoginForm />;
}

export default function AdminPage() {
  return (
    <div className="dark admin-scroll">
      <AuthProvider>
        <AdminRoot />
      </AuthProvider>
    </div>
  );
}
