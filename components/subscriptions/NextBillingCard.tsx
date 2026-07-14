import type { SubscriptionContract } from '@/lib/api/types/subscriptions';
import { calculateNextBillingDate } from '@/lib/utils/subscriptions';
import { formatDate, formatPrice } from '@/lib/utils/formatters';

type NextBillingCardProps = {
  subscription: SubscriptionContract;
};

export function NextBillingCard({ subscription }: NextBillingCardProps) {
  const nextBillingDate = calculateNextBillingDate(subscription);
  const totalPrice = formatPrice(subscription.totalPrice || 0);

  return (
    <div className="@container rounded-card border border-border bg-bg-surface p-4">
      <p className="text-sm font-medium text-text-muted">Next billing</p>
      <p className="text-base font-semibold text-text-base mt-1">
        {formatDate(nextBillingDate)}
      </p>
      <p className="text-sm text-text-muted mt-2">Amount</p>
      <p className="text-lg font-bold text-text-base">{totalPrice}</p>
    </div>
  );
}
