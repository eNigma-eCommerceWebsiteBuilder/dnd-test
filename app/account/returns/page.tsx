import { PublishedPage } from '@/app/page/[slug]/page';

type Props = {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

export const dynamic = 'force-dynamic';

// Preserve the production URL targeted by the filter and pagination controls.
export default async function PublishedReturns({ searchParams }: Props) {
  return <PublishedPage slug="account-returns" routeParams={{ slug: 'account-returns' }} searchParams={await searchParams} />;
}
