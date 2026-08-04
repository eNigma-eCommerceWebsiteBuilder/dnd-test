import { cache } from 'react';
import { getOrder, getOrderDigitalAssets } from '@/lib/api/services/orders';
import type { DigitalAssetsResponse, Order } from '@/lib/api/types';
import { getSearchParam, type PuckFetcherContext } from '@/lib/puck-route-metadata';

export interface CheckoutSuccessRuntime {
  order: Order | null;
  digitalAssets: DigitalAssetsResponse | null;
}

const hasDigitalItems = (order: Order | null) => Boolean(
  order?.items.some((item) => item.isDigital || item.productType === 'digital'),
);

const loadByIdentity = cache(async (
  orderId: string,
  email: string | null,
): Promise<CheckoutSuccessRuntime> => {
  const order = await getOrder(orderId);
  let digitalAssets: DigitalAssetsResponse | null = null;

  if (order && hasDigitalItems(order)) {
    digitalAssets = await getOrderDigitalAssets(orderId, email);
  }

  return { order, digitalAssets };
});

export function loadCheckoutSuccessRuntime(
  context?: PuckFetcherContext,
): Promise<CheckoutSuccessRuntime> {
  const orderId = getSearchParam(context, 'orderId');
  const email = getSearchParam(context, 'email') || null;
  return orderId
    ? loadByIdentity(orderId, email)
    : Promise.resolve({ order: null, digitalAssets: null });
}
