'use client';

import type { Cart } from '@/lib/api/types/cart';
import { CheckoutPageSlotLayout } from './canonical/CheckoutPageSlotLayout';
import {
  CheckoutConfirmationCondition,
  CheckoutErrorCondition,
  CheckoutOrderSummaryPanel,
  CheckoutPageHeader,
  CheckoutPaymentCondition,
  CheckoutReviewCondition,
  CheckoutShippingSection,
  CheckoutStepsRegion,
} from './canonical/CheckoutPageRegions';

interface CheckoutPageClientProps {
  initialCart: Cart;
  initialEmail?: string;
}

// The native route uses the same slot-capable production hierarchy as Puck.
export default function CheckoutPageClient({
  initialCart,
  initialEmail,
}: CheckoutPageClientProps) {
  return (
    <CheckoutPageSlotLayout
      initialCart={initialCart}
      initialEmail={initialEmail}
      steps={<CheckoutStepsRegion />}
      header={<CheckoutPageHeader />}
      error={<CheckoutErrorCondition />}
      shipping={<CheckoutShippingSection />}
      payment={<CheckoutPaymentCondition />}
      review={<CheckoutReviewCondition />}
      confirmation={<CheckoutConfirmationCondition />}
      summary={<CheckoutOrderSummaryPanel />}
    />
  );
}
