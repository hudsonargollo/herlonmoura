'use client';

import React, { useEffect } from 'react';
import { AuthProvider, useAuth } from '@/lib/admin/auth';
import { LoginForm } from '@/components/admin/LoginForm';
import { ProtectedRoute } from '@/components/admin/ProtectedRoute';

function AdminRoot() {
  const { isAuthenticated } = useAuth();

  if (isAuthenticated) {
    return (
      <ProtectedRoute requiredRole="viewer">
        <div className="flex items-center justify-center min-h-screen bg-surface-dark">
          <p className="text-neutral-medium text-sm">Redirecionando...</p>
        </div>
      </ProtectedRoute>
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
