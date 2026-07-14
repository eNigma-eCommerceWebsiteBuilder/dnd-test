'use server';

import {
  getMyOrders as apiGetMyOrders,
  getOrder as apiGetOrder,
  getOrderDigitalAssets as apiGetOrderDigitalAssets,
  type DigitalAssetsResponse,
  type Order,
  type PaginatedOrders,
} from '@/lib/api';
import type { ActionResult } from '@/lib/actions/types';
import { createErrorResult, createSuccessResult } from '@/lib/actions/internal/errors';
import { getActionRequestContext } from '@/lib/actions/internal/request';

export async function getOrderAction(orderId: string): Promise<ActionResult<Order>> {
  try {
    const order = await apiGetOrder(orderId, await getActionRequestContext());
    return createSuccessResult(order);
  } catch (error: unknown) {
    return createErrorResult(error instanceof Error ? error.message : 'Failed to load order.');
  }
}

export async function getMyOrdersAction(params?: {
  page?: number;
  limit?: number;
  status?: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
}): Promise<ActionResult<PaginatedOrders>> {
  try {
    const orders = await apiGetMyOrders(params, await getActionRequestContext());
    return createSuccessResult(orders);
  } catch (error: unknown) {
    return createErrorResult(error instanceof Error ? error.message : 'Failed to load orders.');
  }
}

export async function getOrderDigitalAssetsAction(
  orderId: string,
  email?: string | null,
): Promise<ActionResult<DigitalAssetsResponse>> {
  try {
    const digitalAssets = await apiGetOrderDigitalAssets(
      orderId,
      email ?? null,
      await getActionRequestContext(),
    );

    return createSuccessResult(digitalAssets);
  } catch (error: unknown) {
    return createErrorResult(error instanceof Error ? error.message : 'Failed to load digital assets.');
  }
}
