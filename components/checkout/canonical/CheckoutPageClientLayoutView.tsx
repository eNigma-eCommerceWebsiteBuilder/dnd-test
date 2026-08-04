import { CheckoutPageClientLayout } from './CheckoutPageClientLayout';
import { checkoutPreview } from './preview';
import type { CheckoutPageData } from './checkoutPageRuntime';
import { loadCheckoutPageRuntime } from './checkoutPageRuntime';
import { puckTransparentSlotProps, type CheckoutSlot } from './types';

interface Props {
  checkoutData?: CheckoutPageData;
  steps?: CheckoutSlot;
  header?: CheckoutSlot;
  error?: CheckoutSlot;
  shipping?: CheckoutSlot;
  payment?: CheckoutSlot;
  review?: CheckoutSlot;
  confirmation?: CheckoutSlot;
  summary?: CheckoutSlot;
  puck?: { isEditing?: boolean };
}

export const puckComponentName = 'CheckoutPageClientLayout';
export const puckLabel = 'Checkout Page Layout';
export const puckCategory = 'Checkout';
export const puckFields = {
  steps: { type: 'slot' as const, allow: ['CheckoutStepsRegion'] },
  header: { type: 'slot' as const, allow: ['CheckoutPageHeader'] },
  error: { type: 'slot' as const, allow: ['CheckoutErrorCondition'] },
  shipping: { type: 'slot' as const, allow: ['CheckoutShippingSection'] },
  payment: { type: 'slot' as const, allow: ['CheckoutPaymentCondition'] },
  review: { type: 'slot' as const, allow: ['CheckoutReviewCondition'] },
  confirmation: { type: 'slot' as const, allow: ['CheckoutConfirmationCondition'] },
  summary: { type: 'slot' as const, allow: ['CheckoutOrderSummaryPanel'] },
};
export const puckDefaults = {
  steps: [],
  header: [],
  error: [],
  shipping: [],
  payment: [],
  review: [],
  confirmation: [],
  summary: [],
};
export const puckAst = {
  kind: 'runtime',
  slots: ['steps', 'header', 'error', 'shipping', 'payment', 'review', 'confirmation', 'summary'],
  sourceJsxNames: ['CheckoutPageSlotLayout'],
  sourceImportPaths: ['@/components/templates/checkout/canonical/CheckoutPageSlotLayout'],
  role: 'checkout-page-client-layout',
  runtimeSignals: ['cart', 'session.user.email'],
};

export async function puckDataFetcher(
  _props: Props,
  context?: Parameters<typeof loadCheckoutPageRuntime>[0],
) {
  return {
    checkoutData: await loadCheckoutPageRuntime(context),
  };
}

export function CheckoutPageClientLayoutView({
  checkoutData,
  steps,
  header,
  error,
  shipping,
  payment,
  review,
  confirmation,
  summary,
  puck,
}: Props) {
  const resolvedCheckoutData = puck?.isEditing ? checkoutPreview : checkoutData;

  if (!resolvedCheckoutData?.cart) {
    return null;
  }

  return (
    <CheckoutPageClientLayout
      {...resolvedCheckoutData}
      steps={steps?.(puckTransparentSlotProps)}
      header={header?.(puckTransparentSlotProps)}
      error={error?.(puckTransparentSlotProps)}
      shipping={shipping?.(puckTransparentSlotProps)}
      payment={payment?.(puckTransparentSlotProps)}
      review={review?.(puckTransparentSlotProps)}
      confirmation={confirmation?.(puckTransparentSlotProps)}
      summary={summary?.(puckTransparentSlotProps)}
    />
  );
}
