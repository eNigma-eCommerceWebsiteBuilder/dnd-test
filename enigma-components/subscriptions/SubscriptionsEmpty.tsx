import { CreateSubscriptionCTA } from '@/components/subscriptions/CreateSubscriptionCTA';

type SubscriptionsEmptyProps = {
  title?: string;
  description?: string;
};

export function SubscriptionsEmpty({
  title = 'No Subscriptions Yet',
  description = 'Start a subscription to see recurring deliveries and billing details here.',
}: SubscriptionsEmptyProps) {
  return (
    <div className="@container w-full rounded-card border border-border bg-bg-surface p-8 text-center">
      <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-bg-sunken">
        <span className="material-symbols-outlined text-2xl text-text-muted">autorenew</span>
      </div>
      <h2 className="text-lg font-heading font-bold text-text-base">{title}</h2>
      <p className="mt-2 text-sm text-text-muted">{description}</p>
      <div className="mt-6 flex justify-center">
        <CreateSubscriptionCTA />
      </div>
    </div>
  );
}
