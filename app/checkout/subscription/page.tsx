import { PublishedPage } from '@/app/page/[slug]/page';

interface SubscriptionCheckoutPublishedPageProps {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}

export const dynamic = 'force-dynamic';

export default async function SubscriptionCheckoutPublishedPage({
  searchParams,
}: SubscriptionCheckoutPublishedPageProps) {
  return (
    <PublishedPage
      slug="checkout-subscription"
      routeParams={{ slug: 'checkout-subscription' }}
      searchParams={await searchParams}
    />
  );
}
