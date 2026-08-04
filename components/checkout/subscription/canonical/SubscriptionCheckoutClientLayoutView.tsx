import type { SubscriptionCheckoutData } from './subscriptionCheckoutRuntime';
import { SubscriptionCheckoutClientLayout } from './SubscriptionCheckoutClientLayout';
import { subscriptionCheckoutPreview } from './preview';
import { loadSubscriptionCheckoutRuntime } from './subscriptionCheckoutRuntime';
import {
  puckTransparentSlotProps,
  type SubscriptionCheckoutSlot,
} from './types';

interface Props {
  checkoutData?: SubscriptionCheckoutData | null;
  header?: SubscriptionCheckoutSlot;
  steps?: SubscriptionCheckoutSlot;
  leftColumn?: SubscriptionCheckoutSlot;
  rightColumn?: SubscriptionCheckoutSlot;
  puck?: { isEditing?: boolean };
}

export const puckComponentName = 'SubscriptionCheckoutClientLayout';
export const puckLabel = 'Subscription Checkout Layout';
export const puckCategory = 'Checkout';
export const puckFields = {
  header: { type: 'slot' as const, allow: ['SubscriptionCheckoutHeader'] },
  steps: { type: 'slot' as const, allow: ['SubscriptionCheckoutSteps'] },
  leftColumn: {
    type: 'slot' as const,
    allow: [
      'SubscriptionCustomerInfoSection',
      'SubscriptionShippingAddressSection',
      'SubscriptionBillingTermsSection',
      'SubscriptionCheckoutErrorCondition',
    ],
  },
  rightColumn: {
    type: 'slot' as const,
    allow: [
      'SubscriptionCartSummaryPanel',
      'SubscriptionPricingPreviewPanel',
      'SubscriptionSummaryPanel',
      'SubscriptionCheckoutActions',
    ],
  },
};
export const puckDefaults = {
  header: [],
  steps: [],
  leftColumn: [],
  rightColumn: [],
};
export const puckAst = {
  kind: 'runtime',
  slots: ['header', 'steps', 'leftColumn', 'rightColumn'],
  sourceJsxNames: ['SubscriptionCheckoutSlotLayout'],
  sourceImportPaths: ['@/components/checkout/subscription/canonical/SubscriptionCheckoutSlotLayout'],
  role: 'subscription-checkout-client-layout',
  runtimeSignals: ['cart', 'sellingPlans', 'pricingPreview'],
};

export async function puckDataFetcher(
  _props: Props,
  context?: Parameters<typeof loadSubscriptionCheckoutRuntime>[0],
) {
  return { checkoutData: await loadSubscriptionCheckoutRuntime(context) };
}

export function SubscriptionCheckoutClientLayoutView({
  checkoutData = null,
  header,
  steps,
  leftColumn,
  rightColumn,
  puck,
}: Props) {
  const resolvedCheckoutData = puck?.isEditing
    ? subscriptionCheckoutPreview
    : checkoutData;

  if (!resolvedCheckoutData) {
    return null;
  }

  return (
    <SubscriptionCheckoutClientLayout
      {...resolvedCheckoutData}
      header={header?.(puckTransparentSlotProps)}
      steps={steps?.(puckTransparentSlotProps)}
      leftColumn={leftColumn?.(puckTransparentSlotProps)}
      rightColumn={rightColumn?.(puckTransparentSlotProps)}
    />
  );
}
