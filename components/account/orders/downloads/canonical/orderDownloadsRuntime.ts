import { cache } from 'react';
import { fetchOrderDownloadsPageData, normalizeOrderDownloadsEmail, type OrderDownloadsPageData } from '@/enigma-components/orders/downloads-canonical/orderDownloadsRuntime';
import { getRouteParam, getSearchParam, type PuckFetcherContext } from '@/lib/puck-route-metadata';

export interface OrderDownloadsRuntime { data: OrderDownloadsPageData | null; orderId: string; email: string | null; }
export function resolveOrderDownloadsId(context?: PuckFetcherContext): string { return getRouteParam(context, 'id') || ''; }
const loadByRequest = cache(async (orderId: string, email: string | null): Promise<OrderDownloadsRuntime> => ({ orderId, email, data: orderId ? await fetchOrderDownloadsPageData(orderId, email) : null }));
export function loadOrderDownloadsRuntime(context?: PuckFetcherContext): Promise<OrderDownloadsRuntime> { const email = normalizeOrderDownloadsEmail(getSearchParam(context, 'email')); return loadByRequest(resolveOrderDownloadsId(context), email); }
