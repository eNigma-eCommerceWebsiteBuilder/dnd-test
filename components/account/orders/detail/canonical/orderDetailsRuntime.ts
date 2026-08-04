import { cache } from 'react';
import type { Order } from '@/lib/api/types';
import {
  fetchOrderDetails,
} from '@/enigma-components/orders/canonical/orderDetailsRuntime';
import {
  getRouteParam,
  type PuckFetcherContext,
} from '@/lib/puck-route-metadata';

export interface OrderDetailsRuntime {
  order: Order | null;
  orderId: string;
}

export function resolveOrderDetailsId(context?: PuckFetcherContext): string {
  return getRouteParam(context, 'id') || '';
}

const loadById = cache(async (orderId: string): Promise<OrderDetailsRuntime> => {
  if (!orderId) return { orderId, order: null };

  return { orderId, order: await fetchOrderDetails(orderId) };
});

// Every data-aware View uses the source-equivalent id loader, so sibling regions
// see one coherent order response for a published request.
export function loadOrderDetailsRuntime(
  context?: PuckFetcherContext,
): Promise<OrderDetailsRuntime> {
  return loadById(resolveOrderDetailsId(context));
}
