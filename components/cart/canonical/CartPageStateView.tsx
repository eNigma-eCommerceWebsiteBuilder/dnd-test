import type { Cart } from '@/lib/api/types/cart';
import { getCart } from '@/lib/api/services/cart';
import type { PuckFetcherContext } from '@/lib/puck-route-metadata';
import { CartPageState } from './CartPageState';
import { cartPreview } from './preview';
import { puckTransparentSlotProps, type CartSlot } from './types';

interface Props {
  previewMode?: 'filled' | 'empty';
  initialCart?: Cart | null;
  filled?: CartSlot;
  empty?: CartSlot;
  puck?: { isEditing?: boolean };
}

export const puckComponentName = 'CartPageState';
export const puckLabel = 'Cart Page State';
export const puckCategory = 'Cart';
export const puckFields = {
  previewMode: {
    type: 'select' as const,
    label: 'Preview state',
    options: [
      { label: 'Filled cart', value: 'filled' },
      { label: 'Empty cart', value: 'empty' },
    ],
  },
  filled: { type: 'slot' as const, allow: ['CartPageLayout'] },
  empty: { type: 'slot' as const, allow: ['CartPageEmptyLayout'] },
};
export const puckDefaults = { previewMode: 'filled', filled: [], empty: [] };
export const puckAst = {
  kind: 'runtime', topLevel: true, slots: ['filled', 'empty'],
  sourceJsxNames: ['CartPageState'], sourceImportPaths: ['@/components/templates/cart/canonical/CartPageState'],
  role: 'cart-page-state', runtimeSignals: ['cart'], conditional: '!loading && activeItems.length === 0',
};

export async function puckDataFetcher(_props: Props, context?: PuckFetcherContext) {
  try {
    return { initialCart: await getCart({ cookies: context?.metadata?.requestCookies }) };
  } catch {
    return { initialCart: null };
  }
}

export function CartPageStateView({ previewMode = 'filled', initialCart = null, filled, empty, puck }: Props) {
  const resolvedCart = puck?.isEditing ? (previewMode === 'filled' ? cartPreview : null) : initialCart;
  return <CartPageState initialCart={resolvedCart} filled={filled?.(puckTransparentSlotProps)} empty={empty?.(puckTransparentSlotProps)} />;
}
