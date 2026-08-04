import type { Order } from '@/lib/api/types';
import { orderDetailsPreview } from './preview';

export interface OrderDetailsRuntimeProps {
  order?: Order | null;
  puck?: { isEditing?: boolean };
}

export function resolveOrderDetailsOrder({
  order = null,
  puck,
}: OrderDetailsRuntimeProps): Order | null {
  return puck?.isEditing ? orderDetailsPreview : order;
}
