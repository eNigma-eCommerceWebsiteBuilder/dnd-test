import type { SubscriptionsListResponse } from '@/lib/api/types/subscriptions';
import {
  SubscriptionsCardsList,
  SubscriptionsEmptyRegion,
  SubscriptionsListClientRegion,
  SubscriptionsListLayout,
  SubscriptionsListState,
} from '@/enigma-components/subscriptions/canonical/SubscriptionsPageSections';

type SubscriptionListProps = {
  data: SubscriptionsListResponse;
};

export function SubscriptionList({ data }: SubscriptionListProps) {
  return (
    <SubscriptionsListLayout
      content={
        <SubscriptionsListState
          hasSubscriptions={data.subscriptions.length > 0}
          subscriptions={
            <SubscriptionsListClientRegion
              subscriptions={data.subscriptions}
              content={<SubscriptionsCardsList subscriptions={data.subscriptions} />}
            />
          }
          empty={<SubscriptionsEmptyRegion />}
        />
      }
    />
  );
}
