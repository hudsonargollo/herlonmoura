'use client';

import React from 'react';
import { useAuth } from '@/lib/admin/auth';
import { Loader2, Shield } from 'lucide-react';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredRole?: 'admin' | 'editor' | 'reviewer' | 'viewer';
}

const ROLE_HIERARCHY: Record<string, number> = {
  admin: 4,
  editor: 3,
  reviewer: 2,
  viewer: 1,
};

export function ProtectedRoute({ children, requiredRole = 'viewer' }: ProtectedRouteProps) {
  const { isAuthenticated, user } = useAuth();
  const [checking, setChecking] = React.useState(true);
  const [restricted, setRestricted] = React.useState(false);

  React.useEffect(() => {
    const timer = setTimeout(() => {
      setChecking(false);
      if (!isAuthenticated) {
        // Redirect to admin login
        if (typeof window !== 'undefined') {
          window.location.href = '/admin';
        }
      } else if (user && requiredRole) {
        const userLevel = ROLE_HIERARCHY[user.role] ?? 0;
        const requiredLevel = ROLE_HIERARCHY[requiredRole] ?? 0;
        if (userLevel < requiredLevel) {
          setRestricted(true);
        }
      }
    }, 300);
    return () => clearTimeout(timer);
  }, [isAuthenticated, user, requiredRole]);

  if (checking) {
    return (
      <div className="flex h-screen items-center justify-center bg-dark-elevated">
        <Loader2 className="h-8 w-8 animate-spin text-surgical-teal" />
      </div>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  if (restricted) {
    return (
      <div className="flex h-screen items-center justify-center bg-dark-elevated">
        <div className="text-center">
          <Shield className="h-12 w-12 mx-auto mb-4 text-error-red" />
          <p className="text-heading-3 font-heading font-semibold text-neutral-light">
            Acesso restrito
          </p>
          <p className="mt-2 text-body-small text-neutral-medium">
            Seu perfil ({user?.role}) não tem permissão para esta página.
          </p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}