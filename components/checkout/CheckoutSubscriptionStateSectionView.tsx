import type { ReactNode } from 'react';
import { getCart } from '@/lib/api/services/cart';
import type { PuckFetcherContext } from '@/lib/puck-route-metadata';

interface CheckoutSubscriptionStateSectionViewProps {
  state?: string;
  itemCount?: number;
  ready?: (props?: Record<string, unknown>) => ReactNode;
  empty?: (props?: Record<string, unknown>) => ReactNode;
}

export const puckComponentName = 'CheckoutSubscriptionStateSection';
export const puckLabel = 'Checkout Subscription State Section';
export const puckCategory = 'Checkout';

export const puckFields = {
  state: {
    type: 'select' as const,
    label: 'Preview State',
    options: [
      { label: 'Ready', value: 'ready' },
      { label: 'Empty Cart', value: 'empty' },
    ],
  },
  itemCount: { type: 'number' as const, label: 'Item Count' },
  ready: { type: 'slot' as const },
  empty: { type: 'slot' as const },
};

export const puckDefaults = {
  state: 'ready',
  itemCount: 1,
};

export const puckAst = {
  kind: 'runtime',
  topLevel: true,
  slots: ['ready', 'empty'],
  runtimeSignals: ['cart', 'subscriptionCheckoutData', 'sellingPlans', 'pricingPreview'],
  matches: [
    { pageIncludes: ['app/checkout/subscription/page.tsx'], component: 'CheckoutSubscriptionStateSection' },
  ],
};

export async function puckDataFetcher(
  _props: CheckoutSubscriptionStateSectionViewProps,
  context?: PuckFetcherContext,
) {
  const cart = await getCart({ cookies: context?.metadata?.requestCookies });
  const itemCount = cart.items?.length || 0;
  return {
    itemCount,
    state: itemCount > 0 ? 'ready' : 'empty',
  };
}

export function CheckoutSubscriptionStateSectionView({
  state = 'ready',
  ready,
  empty,
}: CheckoutSubscriptionStateSectionViewProps) {
  return <>{state === 'empty' ? empty?.() : ready?.()}</>;
}
