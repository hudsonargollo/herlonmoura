import CRMLeadDetail from './CRMLeadDetail';
import { ProtectedRoute } from '@/components/admin/ProtectedRoute';

export async function generateStaticParams() {
  return [{ id: '_' }];
}

export default function Page({ params }: { params: Promise<{ id: string }> }) {
  return (
    <ProtectedRoute requiredRole="editor">
      <CRMLeadDetail params={params} />
    </ProtectedRoute>
  );
}
