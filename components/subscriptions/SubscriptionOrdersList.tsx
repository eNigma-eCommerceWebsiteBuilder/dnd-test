'use client';

import { useEffect, useState } from 'react';
import type { SubscriptionOrdersResponse } from '@/lib/api/types/subscriptions';
import { formatDate, formatPrice } from '@/lib/utils/formatters';
import { useSubscription } from '@/lib/hooks';

const formatStatus = (status: string) => status.replace(/_/g, ' ').replace(/\b\w/g, (s) => s.toUpperCase());

type SubscriptionOrdersListProps = {
  subscriptionId: string;
  initialOrders: SubscriptionOrdersResponse['orders'];
  initialPagination: SubscriptionOrdersResponse['pagination'];
};

export function SubscriptionOrdersList({
  subscriptionId,
  initialOrders,
  initialPagination,
}: SubscriptionOrdersListProps) {
  const { subscription, loadSubscription, getOrders } = useSubscription();
  const [orders, setOrders] = useState(initialOrders);
  const [pagination, setPagination] = useState(initialPagination);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (!subscription) {
      void loadSubscription(subscriptionId);
    }
  }, [loadSubscription, subscription, subscriptionId]);

  const handleLoadMore = async () => {
    if (isLoading) return;
    if (pagination.page >= pagination.pages) return;

    setIsLoading(true);
    try {
      if (!subscription) {
        await loadSubscription(subscriptionId);
      }
      const nextPage = pagination.page + 1;
      const response = await getOrders(nextPage, pagination.limit);
      setOrders((prev) => [...prev, ...response.orders]);
      setPagination(response.pagination);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="@container w-full space-y-4">
      <div className="divide-y divide-border">
        {orders.length > 0 ? (
          orders.map((order) => (
            <div
              key={order._id}
              className="@container flex flex-wrap items-center justify-between gap-3 py-3"
            >
              <div>
                <p className="text-sm font-semibold text-text-base">Order {order.orderNumber}</p>
                <p className="text-xs text-text-muted">{formatDate(order.createdAt)}</p>
              </div>
              <div className="text-right">
                <p className="text-sm font-semibold text-text-base">{formatPrice(order.totalPrice)}</p>
                <p className="text-xs text-text-muted">
                  {formatStatus(order.status)} {order.isPaid ? '• Paid' : '• Unpaid'}
                </p>
              </div>
            </div>
          ))
        ) : (
          <p className="text-sm text-text-muted">No orders yet.</p>
        )}
      </div>

      {pagination.page < pagination.pages ? (
        <button
          type="button"
          onClick={handleLoadMore}
          disabled={isLoading}
          className="w-full rounded-button border border-border px-4 py-2 text-sm font-semibold text-text-base hover:bg-bg-hover transition-colors disabled:opacity-disabled"
        >
          {isLoading ? 'Loading...' : 'Load more'}
        </button>
      ) : null}
    </div>
  );
}
