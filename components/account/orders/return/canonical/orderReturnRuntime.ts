import { cache } from 'react';
import type { OrderReturnPageData } from '@/enigma-components/returns/order-return-canonical/orderReturnRuntime';
import { fetchOrderReturnPageData } from '@/enigma-components/returns/order-return-canonical/orderReturnRuntime';
import { getRouteParam, type PuckFetcherContext } from '@/lib/puck-route-metadata';
export interface OrderReturnRuntime { pageData: OrderReturnPageData | null; orderId: string; }
export function resolveOrderReturnId(context?: PuckFetcherContext): string { return getRouteParam(context, 'id') || ''; }
const loadById = cache(async (orderId: string): Promise<OrderReturnRuntime> => orderId ? { orderId, pageData: await fetchOrderReturnPageData(orderId) } : { orderId, pageData: null });
export function loadOrderReturnRuntime(context?: PuckFetcherContext): Promise<OrderReturnRuntime> { return loadById(resolveOrderReturnId(context)); }
