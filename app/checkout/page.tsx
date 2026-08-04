import CheckoutPageClient from '@/enigma-components/templates/checkout/CheckoutPageClient';
import { CheckoutPageState } from '@/enigma-components/templates/checkout/canonical/CheckoutPageState';
import { fetchCheckoutPageData } from '@/enigma-components/templates/checkout/canonical/checkoutPageRuntime';

export const dynamic = 'force-dynamic';

export default async function CheckoutPage() {
  const checkoutData = await fetchCheckoutPageData();

  return (
    <CheckoutPageState checkoutData={checkoutData}>
      <CheckoutPageClient
        initialCart={checkoutData.cart!}
        initialEmail={checkoutData.initialEmail}
      />
    </CheckoutPageState>
  );
}
