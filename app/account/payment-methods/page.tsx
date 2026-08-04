import { PublishedPage } from '@/app/page/[slug]/page';

type Props = { searchParams: Promise<Record<string, string | string[] | undefined>>; };

export const dynamic = 'force-dynamic';

// Keep the production account URL while Puck supplies the canonical seed.
export default async function PublishedPaymentMethods({ searchParams }: Props) {
  return <PublishedPage slug="account-payment-methods" routeParams={{ slug: 'account-payment-methods' }} searchParams={await searchParams} />;
}
