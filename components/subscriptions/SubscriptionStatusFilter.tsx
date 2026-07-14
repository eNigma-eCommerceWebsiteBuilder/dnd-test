'use client';

import type { SubscriptionStatus } from '@/lib/api/types/subscriptions';

const filterOptions: Array<{ label: string; value: SubscriptionStatus | null }> = [
  { label: 'All', value: null },
  { label: 'Active', value: 'active' },
  { label: 'Paused', value: 'paused' },
  { label: 'Cancelled', value: 'cancelled' },
  { label: 'Expired', value: 'expired' },
];

type SubscriptionStatusFilterProps = {
  value: SubscriptionStatus | null;
  onChange: (value: SubscriptionStatus | null) => void;
};

export function SubscriptionStatusFilter({
  value,
  onChange,
}: SubscriptionStatusFilterProps) {
  return (
    <div className="@container w-full">
      <div className="flex flex-wrap gap-2">
        {filterOptions.map((option) => {
          const isActive = option.value === value;
          return (
            <button
              key={option.label}
              type="button"
              onClick={() => onChange(option.value)}
              className={
                isActive
                  ? 'inline-flex items-center justify-center rounded-button border border-cta-primary bg-cta-primary px-3 py-1.5 text-sm font-semibold text-on-primary transition-colors'
                  : 'inline-flex items-center justify-center rounded-button border border-border bg-bg-surface px-3 py-1.5 text-sm font-semibold text-text-muted transition-colors hover:bg-bg-hover'
              }
            >
              {option.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}
