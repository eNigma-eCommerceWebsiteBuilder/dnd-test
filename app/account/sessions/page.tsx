import { PublishedPage } from '@/app/page/[slug]/page';

type Props = {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

export const dynamic = 'force-dynamic';

// Preserve the production account URL while rendering the published Puck seed.
export default async function PublishedSessions({ searchParams }: Props) {
  return <PublishedPage slug="account-sessions" routeParams={{ slug: 'account-sessions' }} searchParams={await searchParams} />;
}
