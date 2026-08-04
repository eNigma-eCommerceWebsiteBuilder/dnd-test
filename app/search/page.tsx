import { PublishedPage } from '@/app/page/[slug]/page';

type Props = {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

export const dynamic = 'force-dynamic';

// Preserve production search URLs for source components that navigate to /search.
export default async function PublishedSearch({ searchParams }: Props) {
  return <PublishedPage slug="search" routeParams={{ slug: 'search' }} searchParams={await searchParams} />;
}
