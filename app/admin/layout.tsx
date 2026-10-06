'use client';

import React from 'react';
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
  return (
    <AuthProvider>
      <AdminRoot />
    </AuthProvider>
  );
}