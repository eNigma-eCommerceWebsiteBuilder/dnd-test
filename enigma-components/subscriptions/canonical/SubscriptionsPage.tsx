import { SubscriptionList } from '@/enigma-components/subscriptions/SubscriptionList';
import type { SubscriptionsPageData } from './subscriptionsPageRuntime';
import {
  AccountSubscriptionsPageHeader,
  AccountSubscriptionsPageLayout,
} from './SubscriptionsPageSections';

export function SubscriptionsPage({ data }: { data: SubscriptionsPageData }) {
  return (
    <AccountSubscriptionsPageLayout
      header={<AccountSubscriptionsPageHeader />}
      content={<SubscriptionList data={data} />}
    />
  );
}
