import type { ReactNode } from 'react';
import { getCart } from '@/lib/api/services/cart';
import type { PuckFetcherContext } from '@/lib/puck-route-metadata';

interface CartStateSectionViewProps {
  state?: string;
  itemCount?: number;
  filled?: (props?: Record<string, unknown>) => ReactNode;
  empty?: (props?: Record<string, unknown>) => ReactNode;
}

export const puckComponentName = 'CartStateSection';
export const puckLabel = 'Cart State Section';
export const puckCategory = 'Cart';

export const puckFields = {
  state: {
    type: 'select' as const,
    label: 'Preview State',
    options: [
      { label: 'Filled', value: 'filled' },
      { label: 'Empty', value: 'empty' },
    ],
  },
  itemCount: { type: 'number' as const, label: 'Item Count' },
  filled: { type: 'slot' as const },
  empty: { type: 'slot' as const },
};

export const puckDefaults = {
  state: 'filled',
  itemCount: 2,
};

export const puckAst = {
  kind: 'runtime',
  topLevel: true,
  slots: ['filled', 'empty'],
  runtimeSignals: ['cart'],
  matches: [
    { pageIncludes: ['app/cart/page.tsx'], component: 'CartStateSection' },
  ],
};

export async function puckDataFetcher(
  _props: CartStateSectionViewProps,
  context?: PuckFetcherContext,
) {
  const cart = await getCart({ cookies: context?.metadata?.requestCookies });
  const itemCount = cart.items?.length || 0;
  return {
    itemCount,
    state: itemCount > 0 ? 'filled' : 'empty',
  };
}

export function CartStateSectionView({ state = 'filled', filled, empty }: CartStateSectionViewProps) {
  return <>{state === 'empty' ? empty?.() : filled?.()}</>;
}
