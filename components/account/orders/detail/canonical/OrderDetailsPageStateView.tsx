import type { Order } from '@/lib/api/types';
import { OrderDetailsPageState } from '@/enigma-components/orders/canonical/OrderDetailsPageState';
import { loadOrderDetailsRuntime } from './orderDetailsRuntime';
import { puckTransparentSlotProps, type OrderDetailsSlot } from './types';
import { resolveOrderDetailsOrder } from './viewData';

interface Props { content?: OrderDetailsSlot; order?: Order | null; puck?: { isEditing?: boolean }; }

export const puckComponentName = 'OrderDetailsPageState';
export const puckLabel = 'Order Details Page State';
export const puckCategory = 'Account';
export const puckFields = { content: { type: 'slot' as const, allow: ['OrderDetailsPageLayout'] } };
export const puckDefaults = { content: [] };
export const puckAst = {
  kind: 'runtime', topLevel: true, slots: ['content'],
  sourceJsxNames: ['OrderDetailsPageState'],
  sourceImportPaths: ['@/components/orders/canonical/OrderDetailsPageState'],
  role: 'order-details-page-state', conditional: '!order => notFound()', runtimeSignals: ['params.id'],
};

export async function puckDataFetcher(_props: Props, context?: Parameters<typeof loadOrderDetailsRuntime>[0]) {
  return loadOrderDetailsRuntime(context);
}

export function OrderDetailsPageStateView(props: Props) {
  const order = resolveOrderDetailsOrder(props);
  return <OrderDetailsPageState order={order} content={props.content?.(puckTransparentSlotProps)} />;
}
