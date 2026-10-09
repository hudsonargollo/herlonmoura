import CRMLeadDetail from './CRMLeadDetail';

export async function generateStaticParams() {
  return [{ id: '_' }];
}

export default function Page({ params }: { params: Promise<{ id: string }> }) {
  return <CRMLeadDetail params={params} />;
}
