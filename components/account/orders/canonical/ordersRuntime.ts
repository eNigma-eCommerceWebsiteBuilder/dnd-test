import { cache } from 'react';
import { redirect } from 'next/navigation';
import { getMyOrders } from '@/lib/api/services/orders';
import { hasErrorStatus } from '@/lib/api/core/errors';
import { buildPublishedPuckAuthPath } from '@/lib/puck-navigation';
import {
  OrderPaymentStatus,
  OrderStatus,
  type Order,
  type OrderStatusValue,
} from '@/lib/api/types';
import type { PuckFetcherContext } from '@/lib/puck-route-metadata';
import { getSearchParam } from '@/lib/puck-route-metadata';

const VALID_STATUSES = ['pending', 'processing', 'shipped', 'delivered', 'cancelled'] as const;
type AccountOrdersStatus = (typeof VALID_STATUSES)[number];

export interface AccountOrdersRuntime {
  orders: Order[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
  status?: AccountOrdersStatus;
}

export const accountOrdersPreview: AccountOrdersRuntime = {
  orders: [
    {
      _id: 'preview-order-1001',
      orderNumber: 'EN-1001',
      customerEmail: 'avery@example.com',
      customerName: 'Avery Morgan',
      items: [{
        _id: 'preview-order-item-1001',
        productId: 'preview-product-1001',
        product: {
          _id: 'preview-product-1001',
          name: 'Wool Scarf',
          images: ['https://images.unsplash.com/photo-1611312449408-fcece27cdbb7?w=600&q=80'],
        },
        quantity: 1,
        price: 89,
        subtotal: 89,
      }],
      subtotal: 89,
      tax: 0,
      shipping: 0,
      total: 89,
      status: OrderStatus.DELIVERED,
      paymentStatus: OrderPaymentStatus.PAID,
      shippingAddress: {
        street: '100 Market Street',
        city: 'Karachi',
        state: 'Sindh',
        zipCode: '75500',
        country: 'Pakistan',
      },
      createdAt: '2026-06-02T00:00:00.000Z',
      updatedAt: '2026-06-06T00:00:00.000Z',
      deliveredAt: '2026-06-06T00:00:00.000Z',
    },
    {
      _id: 'preview-order-1002',
      orderNumber: 'EN-1002',
      customerEmail: 'avery@example.com',
      customerName: 'Avery Morgan',
      items: [{
        _id: 'preview-order-item-1002',
        productId: 'preview-product-1002',
        product: {
          _id: 'preview-product-1002',
          name: 'Everyday Tote',
          images: ['https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=600&q=80'],
        },
        quantity: 1,
        price: 64,
        subtotal: 64,
      }],
      subtotal: 64,
      tax: 0,
      shipping: 0,
      total: 64,
      status: OrderStatus.PROCESSING,
      paymentStatus: OrderPaymentStatus.PAID,
      shippingAddress: {
        street: '100 Market Street',
        city: 'Karachi',
        state: 'Sindh',
        zipCode: '75500',
        country: 'Pakistan',
      },
      createdAt: '2026-07-10T00:00:00.000Z',
      updatedAt: '2026-07-10T00:00:00.000Z',
    },
  ],
  pagination: { page: 1, limit: 10, total: 2, totalPages: 1 },
};

export function resolveAccountOrdersQuery(context?: PuckFetcherContext): {
  page: number;
  status?: AccountOrdersStatus;
} {
  const statusFilter = getSearchParam(context, 'status') || undefined;
  const page = Number.parseInt(getSearchParam(context, 'page') || '1', 10);
  const status = VALID_STATUSES.includes(statusFilter as AccountOrdersStatus)
    ? statusFilter as AccountOrdersStatus
    : undefined;

  return { page, status };
}

export function resolveAccountOrdersPath(context?: PuckFetcherContext): string {
  return `/page/${context?.metadata?.pageSlug || 'account-orders'}`;
}

function resolveAccountOrdersReturnUrl(context?: PuckFetcherContext): string {
  const searchParams = context?.metadata?.searchParams ?? {};
  const query = new URLSearchParams();

  for (const key of ['status', 'page']) {
    const value = getSearchParam(context, key);
    if (value) query.set(key, value);
  }

  const serializedQuery = query.toString();
  return `${resolveAccountOrdersPath(context)}${serializedQuery ? `?${serializedQuery}` : ''}`;
}

const loadOrders = cache(async (
  page: number,
  status: AccountOrdersStatus | undefined,
  requestCookies: string | undefined,
): Promise<AccountOrdersRuntime> => {
  const ordersData = await getMyOrders(
    { page, limit: 10, status: status as OrderStatusValue | undefined },
    { cookies: requestCookies },
  );

  return {
    orders: ordersData?.data || [],
    pagination: ordersData?.pagination || { page: 1, limit: 10, total: 0, totalPages: 0 },
    status,
  };
});

// Each data-aware View calls this cached loader, matching the production route's query validation and service call.
export function loadAccountOrdersRuntime(context?: PuckFetcherContext): Promise<AccountOrdersRuntime> {
  const { page, status } = resolveAccountOrdersQuery(context);
  return loadOrders(page, status, context?.metadata?.requestCookies).catch((error: unknown) => {
    // TemplateFrontend's proxy redirects unauthenticated account requests before rendering.
    if (hasErrorStatus(error) && error.status === 401) {
      redirect(buildPublishedPuckAuthPath(resolveAccountOrdersReturnUrl(context)));
    }
    throw error;
  });
}
