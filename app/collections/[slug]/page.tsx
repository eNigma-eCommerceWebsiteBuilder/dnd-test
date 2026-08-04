import { PublishedPage } from '@/app/page/[slug]/page';

type Props = {
  params: Promise<{ slug: string }>;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

export const dynamic = 'force-dynamic';

// The source detail route owns its not-found state, so preserve every requested slug.
export default async function PublishedCollectionDetail({ params, searchParams }: Props) {
  const { slug: collectionSlug } = await params;
  return (
    <PublishedPage
      slug="collection-detail"
      routeParams={{ slug: 'collection-detail', collectionSlug }}
      searchParams={await searchParams}
    />
  );
}
