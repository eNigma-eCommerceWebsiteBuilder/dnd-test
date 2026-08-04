import { PublishedPage } from '@/app/page/[slug]/page';

interface CartPublishedPageProps {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}

export const dynamic = 'force-dynamic';

export default async function CartPublishedPage({ searchParams }: CartPublishedPageProps) {
  return (
    <PublishedPage
      slug="cart"
      routeParams={{ slug: 'cart' }}
      searchParams={await searchParams}
    />
  );
}
