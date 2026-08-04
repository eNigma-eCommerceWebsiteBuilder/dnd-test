import { PublishedPage } from '@/app/page/[slug]/page';

type Props = {
  params: Promise<{ id: string }>;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

export const dynamic = 'force-dynamic';

// Preserve the production order-detail URL while the Puck seed resolves the
// same dynamic entity id from route metadata.
export default async function PublishedOrderDetails({ params, searchParams }: Props) {
  const { id } = await params;
  return (
    <PublishedPage
      slug="account-order-detail"
      routeParams={{ slug: 'account-order-detail', id }}
      searchParams={await searchParams}
    />
  );
}
