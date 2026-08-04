import { PublishedPage } from '@/app/page/[slug]/page';

type Props = {
  params: Promise<{ id: string }>;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

export const dynamic = 'force-dynamic';

// Retain the production dynamic URL while the Puck seed receives its return id.
export default async function PublishedReturnDetails({ params, searchParams }: Props) {
  const { id } = await params;
  return <PublishedPage slug="account-return-detail" routeParams={{ slug: 'account-return-detail', id }} searchParams={await searchParams} />;
}
