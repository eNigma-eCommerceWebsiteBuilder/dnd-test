'use client';

import {
  createContext,
  useContext,
  type ReactNode,
} from 'react';

import type { Cart } from '@/lib/api/types/cart';
import type {
  ProductSellingPlansResponse,
  SubscriptionPreview,
} from '@/lib/api/types/selling-plans';
import { useSubscriptionCheckoutFlow } from '@/enigma-components/checkout/subscription/useSubscriptionCheckoutFlow';

type SubscriptionCheckoutFlow = ReturnType<typeof useSubscriptionCheckoutFlow> & {
  cart: Cart;
  sellingPlans: ProductSellingPlansResponse | null;
  pricingPreview: SubscriptionPreview | null;
};

const SubscriptionCheckoutFlowContext = createContext<SubscriptionCheckoutFlow | null>(null);

export function SubscriptionCheckoutFlowProvider({
  cart,
  sellingPlans,
  pricingPreview,
  children,
}: {
  cart: Cart;
  sellingPlans: ProductSellingPlansResponse | null;
  pricingPreview: SubscriptionPreview | null;
  children: ReactNode;
}) {
  const flow = {
    ...useSubscriptionCheckoutFlow({ cart, sellingPlans, pricingPreview }),
    cart,
    sellingPlans,
    pricingPreview,
  };

  return (
    <SubscriptionCheckoutFlowContext.Provider value={flow}>
      {children}
    </SubscriptionCheckoutFlowContext.Provider>
  );
}

export function useSubscriptionCheckoutFlowContext(): SubscriptionCheckoutFlow {
  const flow = useContext(SubscriptionCheckoutFlowContext);

  if (!flow) {
    throw new Error('Subscription checkout regions must be rendered inside SubscriptionCheckoutFlowProvider.');
  }

  return flow;
}
