import { PublishedPage } from '@/app/page/[slug]/page';

interface CheckoutSuccessPublishedPageProps {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}

export const dynamic = 'force-dynamic';

export default async function CheckoutSuccessPublishedPage({
  searchParams,
}: CheckoutSuccessPublishedPageProps) {
  return (
    <PublishedPage
      slug="checkout-success"
      routeParams={{ slug: 'checkout-success' }}
      searchParams={await searchParams}
    />
  );
}
