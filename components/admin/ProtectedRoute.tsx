'use client';

import React from 'react';
import { useAuth } from '@/lib/admin/auth';
import { useRouter } from 'next/navigation';
import { Loader2, Shield } from 'lucide-react';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

export function ProtectedRoute({ children }: ProtectedRouteProps) {
  const { isAuthenticated, user } = useAuth();
  const router = useRouter();
  const [checking, setChecking] = React.useState(true);

  React.useEffect(() => {
    const timer = setTimeout(() => {
      setChecking(false);
      if (!isAuthenticated) {
        router.replace('/admin');
      }
    }, 300);
    return () => clearTimeout(timer);
  }, [isAuthenticated, router]);

  if (checking) {
    return (
      <div className="flex h-screen items-center justify-center bg-background">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  return <>{children}</>;
}