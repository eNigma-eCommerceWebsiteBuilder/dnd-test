import type { Order } from '@/lib/api/types';
import { OrderDetailsDownloadAction } from '@/enigma-components/orders/canonical/OrderDetailsPageSections';
import { loadOrderDetailsRuntime } from './orderDetailsRuntime';
import { resolveOrderDetailsOrder } from './viewData';

interface Props { order?: Order | null; puck?: { isEditing?: boolean }; }

export const puckComponentName = 'OrderDetailsDownloadAction';
export const puckLabel = 'Order Downloads Action';
export const puckCategory = 'Account';
export const puckFields = {};
export const puckDefaults = {};
export const puckAst = {
  kind: 'runtime', sourceJsxNames: ['OrderDetailsDownloadAction'],
  sourceImportPaths: ['@/components/orders/canonical/OrderDetailsPageSections'],
  role: 'order-details-download-action', slotTarget: 'downloads', runtimeSignals: ['params.id', 'order._id'],
};
export async function puckDataFetcher(_props: Props, context?: Parameters<typeof loadOrderDetailsRuntime>[0]) { return loadOrderDetailsRuntime(context); }
export function OrderDetailsDownloadActionView(props: Props) {
  const order = resolveOrderDetailsOrder(props);
  return order ? <OrderDetailsDownloadAction order={order} /> : null;
}
