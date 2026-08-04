import { PublishedPage } from '@/app/page/[slug]/page';

interface SharedWishlistPublishedPageProps {
  params: Promise<{ token: string }>;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}

export const dynamic = 'force-dynamic';

export default async function SharedWishlistPublishedPage({
  params,
  searchParams,
}: SharedWishlistPublishedPageProps) {
  const { token } = await params;
  return (
    <PublishedPage
      slug="shared-wishlist"
      routeParams={{ slug: 'shared-wishlist', token }}
      searchParams={await searchParams}
    />
  );
}
