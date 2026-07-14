import type { SubscriptionOrdersResponse } from '@/lib/api/types/subscriptions';
import { formatDate, formatPrice } from '@/lib/utils/formatters';

type SubscriptionOrderCardProps = {
  order: SubscriptionOrdersResponse['orders'][number];
};

export function SubscriptionOrderCard({ order }: SubscriptionOrderCardProps) {
  return (
    <div className="@container flex flex-wrap items-center justify-between gap-3 rounded-card border border-border bg-bg-surface p-4">
      <div>
        <p className="text-sm font-semibold text-text-base">Order {order.orderNumber}</p>
        <p className="text-xs text-text-muted">{formatDate(order.createdAt)}</p>
      </div>
      <div className="text-right">
        <p className="text-sm font-semibold text-text-base">{formatPrice(order.totalPrice)}</p>
        <p className="text-xs text-text-muted">
          {order.status} {order.isPaid ? '• Paid' : '• Unpaid'}
        </p>
      </div>
    </div>
  );
}
