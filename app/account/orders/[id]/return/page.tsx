import { PublishedPage } from '@/app/page/[slug]/page';

type Props = {
  params: Promise<{ id: string }>;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

export const dynamic = 'force-dynamic';

// Keep the production URL and provide the order identity to source-backed Puck regions.
export default async function PublishedOrderReturn({ params, searchParams }: Props) {
  const { id } = await params;
  return (
    <PublishedPage
      slug="account-order-return"
      routeParams={{ slug: 'account-order-return', id }}
      searchParams={await searchParams}
    />
  );
}
