'use client';

import type { ReactNode } from 'react';

import type { Cart } from '@/lib/api/types/cart';
import type {
  ProductSellingPlansResponse,
  SubscriptionPreview,
} from '@/lib/api/types/selling-plans';
import SubscriptionCheckoutContentLayout from '@/enigma-components/checkout/subscription/SubscriptionCheckoutContentLayout';

import { SubscriptionCheckoutFlowProvider } from './SubscriptionCheckoutFlowContext';

export function SubscriptionCheckoutClientLayout({
  cart,
  sellingPlans,
  pricingPreview,
  header,
  steps,
  leftColumn,
  rightColumn,
}: {
  cart?: Cart | null;
  sellingPlans?: ProductSellingPlansResponse | null;
  pricingPreview?: SubscriptionPreview | null;
  header?: ReactNode;
  steps?: ReactNode;
  leftColumn?: ReactNode;
  rightColumn?: ReactNode;
}) {
  if (!cart) {
    return null;
  }

  return (
    <SubscriptionCheckoutFlowProvider
      cart={cart}
      sellingPlans={sellingPlans ?? null}
      pricingPreview={pricingPreview ?? null}
    >
      <SubscriptionCheckoutContentLayout
        header={header}
        steps={steps}
        leftColumn={leftColumn}
        rightColumn={rightColumn}
      />
    </SubscriptionCheckoutFlowProvider>
  );
}
