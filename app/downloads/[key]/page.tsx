import { PublishedPage } from '@/app/page/[slug]/page';

interface DownloadPublishedPageProps {
  params: Promise<{ key: string }>;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}

export const dynamic = 'force-dynamic';

export default async function DownloadPublishedPage({
  params,
  searchParams,
}: DownloadPublishedPageProps) {
  const { key } = await params;

  return (
    <PublishedPage
      slug="downloads"
      routeParams={{ slug: 'downloads', key }}
      searchParams={await searchParams}
    />
  );
}
