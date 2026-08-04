import type { ReactNode } from 'react';
import type { SubscriptionContract } from '@/lib/api/types/subscriptions';
import { SubscriptionCard } from '@/enigma-components/subscriptions/SubscriptionCard';
import {
  SubscriptionCardSlot,
  SubscriptionListClient,
} from '@/enigma-components/subscriptions/SubscriptionListClient';
import { SubscriptionsEmpty } from '@/enigma-components/subscriptions/SubscriptionsEmpty';

export function AccountSubscriptionsPageLayout({ header, content }: { header?: ReactNode; content?: ReactNode }) {
  return (
    <main className="min-h-screen bg-bg-base text-text-base">
      <div className="max-w-[1440px] mx-auto px-6 lg:px-12 py-8">
        {header}
        {content}
      </div>
    </main>
  );
}

export function AccountSubscriptionsPageHeader() {
  return (
    <section className="py-8 border-b border-border">
      <h1 className="text-3xl font-heading font-bold text-heading">Subscriptions</h1>
      <p className="text-text-muted mt-2">Manage your active and past subscriptions.</p>
    </section>
  );
}

export function SubscriptionsListLayout({ content }: { content?: ReactNode }) {
  return (
    <div className="mt-8">
      <section className="@container w-full">{content}</section>
    </div>
  );
}

export function SubscriptionsListState({
  hasSubscriptions,
  subscriptions,
  empty,
}: {
  hasSubscriptions: boolean;
  subscriptions?: ReactNode;
  empty?: ReactNode;
}) {
  return hasSubscriptions ? subscriptions : empty;
}

export function SubscriptionsListClientRegion({
  subscriptions,
  content,
}: {
  subscriptions: SubscriptionContract[];
  content?: ReactNode;
}) {
  return <SubscriptionListClient subscriptions={subscriptions}>{content}</SubscriptionListClient>;
}

export function SubscriptionsCardsList({ subscriptions }: { subscriptions: SubscriptionContract[] }) {
  return (
    <>
      {subscriptions.map((subscription) => (
        <SubscriptionCardSlot key={subscription._id} status={subscription.status}>
          <SubscriptionCard subscription={subscription} />
        </SubscriptionCardSlot>
      ))}
    </>
  );
}

export function SubscriptionsEmptyRegion() {
  return <SubscriptionsEmpty />;
}
