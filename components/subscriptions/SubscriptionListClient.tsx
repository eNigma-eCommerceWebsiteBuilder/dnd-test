'use client';

import { createContext, useContext, useMemo } from 'react';
import type { SubscriptionContract, SubscriptionStatus } from '@/lib/api/types/subscriptions';
import { useSubscriptions } from '@/lib/hooks';
import { SubscriptionStatusFilter } from '@/components/subscriptions/SubscriptionStatusFilter';

type SubscriptionListClientProps = {
  subscriptions: SubscriptionContract[];
  children: React.ReactNode;
};

type SubscriptionFilterContextValue = {
  filter: SubscriptionStatus | null;
  setFilter: (value: SubscriptionStatus | null) => void;
};

const SubscriptionFilterContext = createContext<SubscriptionFilterContextValue | null>(null);

export function SubscriptionListClient({
  subscriptions,
  children,
}: SubscriptionListClientProps) {
  const { filter, filterByStatus } = useSubscriptions({
    initialSubscriptions: subscriptions,
    disableFetch: true,
  });

  const contextValue = useMemo(
    () => ({ filter, setFilter: filterByStatus }),
    [filter, filterByStatus]
  );

  return (
    <div className="@container w-full space-y-6">
      <SubscriptionFilterContext.Provider value={contextValue}>
        <SubscriptionStatusFilter value={filter} onChange={filterByStatus} />
        <div className="space-y-6">{children}</div>
      </SubscriptionFilterContext.Provider>
    </div>
  );
}

export function SubscriptionCardSlot({
  status,
  children,
}: {
  status: SubscriptionStatus;
  children: React.ReactNode;
}) {
  const context = useContext(SubscriptionFilterContext);

  if (context?.filter && context.filter !== status) {
    return null;
  }

  return <div className="@container w-full">{children}</div>;
}
