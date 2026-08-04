import type { Order } from '@/lib/api/types';
import { OrderDetailsHeader } from '@/enigma-components/orders/canonical/OrderDetailsPageSections';
import { loadOrderDetailsRuntime } from './orderDetailsRuntime';
import { puckTransparentSlotProps, type OrderDetailsSlot } from './types';
import { resolveOrderDetailsOrder } from './viewData';

interface Props {
  downloads?: OrderDetailsSlot;
  reorder?: OrderDetailsSlot;
  cancel?: OrderDetailsSlot;
  order?: Order | null;
  puck?: { isEditing?: boolean };
}

export const puckComponentName = 'OrderDetailsHeader';
export const puckLabel = 'Order Details Header';
export const puckCategory = 'Account';
export const puckFields = {
  downloads: { type: 'slot' as const, allow: ['OrderDetailsDownloadAction'] },
  reorder: { type: 'slot' as const, allow: ['OrderDetailsReorderAction'] },
  cancel: { type: 'slot' as const, allow: ['OrderDetailsCancelAction'] },
};
export const puckDefaults = { downloads: [], reorder: [], cancel: [] };
export const puckAst = {
  kind: 'runtime', slots: ['downloads', 'reorder', 'cancel'],
  sourceJsxNames: ['OrderDetailsHeader', 'OrderStatusBadge'],
  sourceImportPaths: ['@/components/orders/canonical/OrderDetailsPageSections'],
  role: 'order-details-header', slotTarget: 'header',
  conditional: 'hasDigitalItems(order) / canCancelOrder(order)', runtimeSignals: ['params.id', 'order.items', 'order.status'],
};
export async function puckDataFetcher(_props: Props, context?: Parameters<typeof loadOrderDetailsRuntime>[0]) { return loadOrderDetailsRuntime(context); }
export function OrderDetailsHeaderView(props: Props) {
  const order = resolveOrderDetailsOrder(props);
  return order ? <OrderDetailsHeader order={order} downloads={props.downloads?.(puckTransparentSlotProps)} reorder={props.reorder?.(puckTransparentSlotProps)} cancel={props.cancel?.(puckTransparentSlotProps)} /> : null;
}
