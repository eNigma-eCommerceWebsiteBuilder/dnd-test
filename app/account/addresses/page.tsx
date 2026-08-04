import { PublishedPage } from '@/app/page/[slug]/page';

type Props = { searchParams: Promise<Record<string, string | string[] | undefined>>; };

export const dynamic = 'force-dynamic';

// Preserve the production account URL while Puck renders the canonical seed.
export default async function PublishedAddresses({ searchParams }: Props) {
  return <PublishedPage slug="account-addresses" routeParams={{ slug: 'account-addresses' }} searchParams={await searchParams} />;
}
