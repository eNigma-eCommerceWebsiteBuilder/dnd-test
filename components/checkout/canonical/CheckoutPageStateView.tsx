import { CheckoutPageState } from '@/enigma-components/templates/checkout/canonical/CheckoutPageState';
import type { CheckoutPageData } from './checkoutPageRuntime';
import { loadCheckoutPageRuntime } from './checkoutPageRuntime';
import { checkoutPreview } from './preview';
import { puckTransparentSlotProps, type CheckoutSlot } from './types';

interface Props {
  checkoutData?: CheckoutPageData;
  content?: CheckoutSlot;
  puck?: { isEditing?: boolean };
}

export const puckComponentName = 'CheckoutPageState';
export const puckLabel = 'Checkout Page State';
export const puckCategory = 'Checkout';
export const puckFields = {
  content: { type: 'slot' as const, allow: ['CheckoutPageClientLayout'] },
};
export const puckDefaults = { content: [] };
export const puckAst = {
  kind: 'runtime',
  topLevel: true,
  slots: ['content'],
  sourceJsxNames: ['CheckoutPageState'],
  sourceImportPaths: ['@/components/templates/checkout/canonical/CheckoutPageState'],
  role: 'checkout-page-state',
  conditional: '!checkoutData.cart?.items?.length => redirect(ROUTES.CART)',
  runtimeSignals: ['requestCookies', 'cart.items', 'session.user.email'],
};

export async function puckDataFetcher(
  _props: Props,
  context?: Parameters<typeof loadCheckoutPageRuntime>[0],
) {
  return {
    checkoutData: await loadCheckoutPageRuntime(context),
  };
}

export function CheckoutPageStateView({ checkoutData, content, puck }: Props) {
  const resolvedCheckoutData = puck?.isEditing ? checkoutPreview : checkoutData;

  if (!resolvedCheckoutData) {
    return null;
  }

  return (
    <CheckoutPageState checkoutData={resolvedCheckoutData}>
      {content?.(puckTransparentSlotProps)}
    </CheckoutPageState>
  );
}
