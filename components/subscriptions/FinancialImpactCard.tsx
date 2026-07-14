'use client';

import type { SubscriptionDraft } from '@/lib/api/types/subscriptions';
import { formatPrice } from '@/lib/utils/formatters';

type FinancialImpactCardProps = {
  impact: NonNullable<SubscriptionDraft['financialImpact']>;
};

export function FinancialImpactCard({ impact }: FinancialImpactCardProps) {
  const changeLabel = impact.change >= 0 ? 'Increase' : 'Decrease';

  return (
    <div className="@container rounded-card border border-border bg-bg-elevated p-4">
      <h4 className="text-sm font-semibold text-text-base">Financial impact</h4>
      <div className="mt-3 grid grid-cols-1 @md:grid-cols-3 gap-3 text-sm">
        <div>
          <p className="text-text-muted">Current total</p>
          <p className="font-semibold text-text-base">{formatPrice(impact.oldTotal)}</p>
        </div>
        <div>
          <p className="text-text-muted">New total</p>
          <p className="font-semibold text-text-base">{formatPrice(impact.newTotal)}</p>
        </div>
        <div>
          <p className="text-text-muted">{changeLabel}</p>
          <p className="font-semibold text-text-base">{formatPrice(Math.abs(impact.change))}</p>
        </div>
      </div>
    </div>
  );
}
