import type { Order } from '@/lib/api/types';
import { CheckoutSuccessPageState } from './CheckoutSuccessPageState';
import { checkoutSuccessPreviewOrder } from './preview';
import { loadCheckoutSuccessRuntime } from './checkoutSuccessRuntime';
import { puckTransparentSlotProps, type CheckoutSuccessSlot } from './types';

interface Props {
  order?: Order | null;
  content?: CheckoutSuccessSlot;
  puck?: { isEditing?: boolean };
}

export const puckComponentName = 'CheckoutSuccessPageState';
export const puckLabel = 'Checkout Success Page State';
export const puckCategory = 'Checkout';
export const puckFields = {
  content: { type: 'slot' as const, allow: ['CheckoutSuccessPageLayout'] },
};
export const puckDefaults = { content: [] };
export const puckAst = {
  kind: 'runtime',
  topLevel: true,
  slots: ['content'],
  sourceJsxNames: ['CheckoutSuccessPageState'],
  sourceImportPaths: ['@/components/checkout/success/canonical/CheckoutSuccessPageState'],
  role: 'checkout-success-page-state',
  conditional: '!order => redirect(ROUTES.HOME)',
  runtimeSignals: ['searchParams.orderId', 'order'],
};

export async function puckDataFetcher(_props: Props, context?: Parameters<typeof loadCheckoutSuccessRuntime>[0]) {
  const runtime = await loadCheckoutSuccessRuntime(context);
  return { order: runtime.order };
}

export function CheckoutSuccessPageStateView({ order = null, content, puck }: Props) {
  const resolvedOrder = puck?.isEditing ? checkoutSuccessPreviewOrder : order;
  return <CheckoutSuccessPageState order={resolvedOrder} content={content?.(puckTransparentSlotProps)} />;
}
