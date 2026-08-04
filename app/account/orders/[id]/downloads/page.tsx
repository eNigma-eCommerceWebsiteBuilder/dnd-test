import { PublishedPage } from '@/app/page/[slug]/page';

type Props = {
  params: Promise<{ id: string }>;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

export const dynamic = 'force-dynamic';

// Keep the production dynamic URL and forward its identity and guest-email query.
export default async function PublishedOrderDownloads({ params, searchParams }: Props) {
  const { id } = await params;
  return <PublishedPage slug="account-order-downloads" routeParams={{ slug: 'account-order-downloads', id }} searchParams={await searchParams} />;
}
