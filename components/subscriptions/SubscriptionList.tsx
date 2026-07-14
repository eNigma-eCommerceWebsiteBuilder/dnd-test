import type { SubscriptionsListResponse } from '@/lib/api/types/subscriptions';
import { SubscriptionCard } from '@/components/subscriptions/SubscriptionCard';
import { SubscriptionsEmpty } from '@/components/subscriptions/SubscriptionsEmpty';
import {
  SubscriptionCardSlot,
  SubscriptionListClient,
} from '@/components/subscriptions/SubscriptionListClient';

type SubscriptionListProps = {
  data: SubscriptionsListResponse;
};

export function SubscriptionList({ data }: SubscriptionListProps) {
  if (data.subscriptions.length === 0) {
    return (
      <section className="@container w-full">
        <SubscriptionsEmpty />
      </section>
    );
  }

  return (
    <section className="@container w-full">
      <SubscriptionListClient subscriptions={data.subscriptions}>
        {data.subscriptions.map((subscription) => (
          <SubscriptionCardSlot key={subscription._id} status={subscription.status}>
            <SubscriptionCard subscription={subscription} />
          </SubscriptionCardSlot>
        ))}
      </SubscriptionListClient>
    </section>
  );
}
