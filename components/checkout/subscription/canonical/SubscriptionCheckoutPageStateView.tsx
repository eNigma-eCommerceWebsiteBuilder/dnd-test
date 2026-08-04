import type { SubscriptionCheckoutData } from './subscriptionCheckoutRuntime';
import { SubscriptionCheckoutPageState } from './SubscriptionCheckoutPageState';
import { subscriptionCheckoutPreview } from './preview';
import { loadSubscriptionCheckoutRuntime } from './subscriptionCheckoutRuntime';
import {
  puckTransparentSlotProps,
  type SubscriptionCheckoutSlot,
} from './types';

interface Props {
  checkoutData?: SubscriptionCheckoutData | null;
  content?: SubscriptionCheckoutSlot;
  puck?: { isEditing?: boolean };
}

export const puckComponentName = 'SubscriptionCheckoutPageState';
export const puckLabel = 'Subscription Checkout Page State';
export const puckCategory = 'Checkout';
export const puckFields = {
  content: { type: 'slot' as const, allow: ['SubscriptionCheckoutPageLayout'] },
};
export const puckDefaults = { content: [] };
export const puckAst = {
  kind: 'runtime',
  topLevel: true,
  slots: ['content'],
  sourceJsxNames: ['SubscriptionCheckoutPageState'],
  sourceImportPaths: ['@/components/checkout/subscription/canonical/SubscriptionCheckoutPageState'],
  role: 'subscription-checkout-page-state',
  conditional: '!checkoutData => redirect(ROUTES.CART)',
  runtimeSignals: ['cart.items'],
};

export async function puckDataFetcher(
  _props: Props,
  context?: Parameters<typeof loadSubscriptionCheckoutRuntime>[0],
) {
  return { checkoutData: await loadSubscriptionCheckoutRuntime(context) };
}

export function SubscriptionCheckoutPageStateView({
  checkoutData = null,
  content,
  puck,
}: Props) {
  const resolvedCheckoutData = puck?.isEditing
    ? subscriptionCheckoutPreview
    : checkoutData;

  return (
    <SubscriptionCheckoutPageState checkoutData={resolvedCheckoutData}>
      {content?.(puckTransparentSlotProps)}
    </SubscriptionCheckoutPageState>
  );
}
