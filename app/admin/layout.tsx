'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { AuthProvider, useAuth } from '@/lib/admin/auth';
import { LoginForm } from '@/components/admin/LoginForm';

function AdminRoot({
  children,
}: {
  children: React.ReactNode;
}) {
  const { isAuthenticated } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (isAuthenticated) {
      // Stay on the admin landing page (the "just admin" panel) instead of
      // redirecting to the CRM dashboard.
      router.replace('/admin');
    }
  }, [isAuthenticated, router]);

  // When authenticated, render the children (the actual page content).
  // The redirect below runs asynchronously, so we don't show the LoginForm
  // again — that would cause a redirect loop.
  if (!isAuthenticated) {
    return <LoginForm />;
  }

  return children;
}

export default function AdminPage({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="admin-scroll" data-theme="dark">
      <AuthProvider>
        <AdminRoot>{children}</AdminRoot>
      </AuthProvider>
    </div>
  );
}
