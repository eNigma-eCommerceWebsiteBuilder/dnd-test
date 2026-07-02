import type { SubscriptionDetailsResponse } from '@/lib/api/types/subscriptions';
import { formatDate, formatPrice } from '@/lib/utils/formatters';

type UpcomingAmountCardProps = {
  upcomingBilling: SubscriptionDetailsResponse['upcomingBilling'];
};

export function UpcomingAmountCard({ upcomingBilling }: UpcomingAmountCardProps) {
  return (
    <div className="@container w-full rounded-card border border-border bg-bg-surface p-5 shadow-card">
      <p className="text-xs uppercase tracking-wide text-text-muted">Upcoming Amount</p>
      <div className="mt-3 flex items-baseline justify-between gap-3">
        <p className="text-2xl font-bold text-text-base">
          {formatPrice(upcomingBilling.amount)}
        </p>
        <span className="rounded-badge bg-bg-sunken px-2 py-0.5 text-xs font-semibold text-text-muted">
          USD
        </span>
      </div>
      <p className="mt-2 text-sm text-text-muted">
        Next billing on {formatDate(upcomingBilling.nextDate)}
      </p>
    </div>
  );
}
