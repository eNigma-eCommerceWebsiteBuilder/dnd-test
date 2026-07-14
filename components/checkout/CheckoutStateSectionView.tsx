import type { ReactNode } from 'react';
import { getCart } from '@/lib/api/services/cart';
import type { PuckFetcherContext } from '@/lib/puck-route-metadata';

interface CheckoutStateSectionViewProps {
  state?: string;
  ready?: (props?: Record<string, unknown>) => ReactNode;
  empty?: (props?: Record<string, unknown>) => ReactNode;
}

export const puckComponentName = 'CheckoutStateSection';
export const puckLabel = 'Checkout State Section';
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
  ready: { type: 'slot' as const },
  empty: { type: 'slot' as const },
};

export const puckDefaults = {
  state: 'ready',
};

export const puckAst = {
  kind: 'runtime',
  topLevel: true,
  slots: ['ready', 'empty'],
  runtimeSignals: ['cart', 'session'],
  matches: [
    { pageIncludes: ['app/checkout/page.tsx'], component: 'CheckoutStateSection' },
  ],
};

export async function puckDataFetcher(
  _props: CheckoutStateSectionViewProps,
  context?: PuckFetcherContext,
) {
  const cart = await getCart({ cookies: context?.metadata?.requestCookies });
  return { state: cart.items && cart.items.length > 0 ? 'ready' : 'empty' };
}

export function CheckoutStateSectionView({ state = 'ready', ready, empty }: CheckoutStateSectionViewProps) {
  return <>{state === 'empty' ? empty?.() : ready?.()}</>;
}
