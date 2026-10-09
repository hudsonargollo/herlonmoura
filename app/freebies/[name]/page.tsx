import FreebieDetail from './FreebieDetail';

export async function generateStaticParams() {
  return [{ name: '_' }];
}

export default function Page({ params }: { params: Promise<{ name: string }> }) {
  return <FreebieDetail params={params} />;
}
