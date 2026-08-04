import { PublishedPage } from '@/app/page/[slug]/page';

type Props = {
  params: Promise<{ id: string }>;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

export const dynamic = 'force-dynamic';

// Keep the production subscription-detail URL while the published Puck seed
// resolves its source-equivalent runtime data from the dynamic id.
export default async function PublishedSubscriptionDetails({
  params,
  searchParams,
}: Props) {
  const { id } = await params;
  return (
    <PublishedPage
      slug="account-subscription-detail"
      routeParams={{ slug: 'account-subscription-detail', id }}
      searchParams={await searchParams}
    />
  );
}
