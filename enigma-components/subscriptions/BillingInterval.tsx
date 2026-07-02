import type { BillingPolicy } from '@/lib/api/types/subscriptions';
import { formatBillingInterval } from '@/lib/utils/subscriptions';

type BillingIntervalProps = {
  billingPolicy: BillingPolicy;
};

export function BillingInterval({ billingPolicy }: BillingIntervalProps) {
  const label = formatBillingInterval(billingPolicy.interval, billingPolicy.intervalCount);

  return (
    <div className="@container">
      <p className="text-sm font-medium text-text-muted">Billing interval</p>
      <p className="text-base font-semibold text-text-base">{label}</p>
    </div>
  );
}
