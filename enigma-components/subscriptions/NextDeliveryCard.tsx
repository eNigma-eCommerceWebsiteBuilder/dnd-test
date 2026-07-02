'use client';

import type { SubscriptionContract } from '@/lib/api/types/subscriptions';
import { calculateNextBillingDate } from '@/lib/utils/subscriptions';
import { formatDate } from '@/lib/utils/formatters';

type NextDeliveryCardProps = {
  subscription: SubscriptionContract;
};

export function NextDeliveryCard({ subscription }: NextDeliveryCardProps) {
  const nextDate = subscription.nextDeliveryDate
    ? new Date(subscription.nextDeliveryDate)
    : calculateNextBillingDate(subscription);
  const now = new Date();
  const diffMs = nextDate.getTime() - now.getTime();
  const daysUntil = Math.max(0, Math.ceil(diffMs / (1000 * 60 * 60 * 24)));
  const dayLabel = String(nextDate.getDate()).padStart(2, '0');
  const monthLabel = nextDate.toLocaleDateString('en-US', {
    month: 'short',
    year: 'numeric',
  });

  return (
    <div className="@container w-full rounded-card border border-border bg-bg-surface p-5 shadow-card">
      <div className="flex flex-col @md:flex-row gap-4">
        <div className="w-full @md:w-1/3 rounded-card bg-bg-sunken border border-border p-4 text-center">
          <p className="text-2xl font-bold text-primary">{dayLabel}</p>
          <p className="text-xs font-semibold uppercase tracking-widest text-text-muted">
            {monthLabel}
          </p>
        </div>
        <div className="flex-1 space-y-2">
          <p className="text-xs uppercase tracking-wide text-text-muted">Next delivery</p>
          <p className="text-lg font-semibold text-text-base">{formatDate(nextDate)}</p>
          <p className="text-sm text-primary">Ships in {daysUntil} days</p>
          <p className="text-xs text-text-muted">
            You can update this delivery before the cutoff.
          </p>
        </div>
      </div>
    </div>
  );
}
