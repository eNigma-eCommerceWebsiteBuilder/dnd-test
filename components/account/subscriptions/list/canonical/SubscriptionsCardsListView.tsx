import { SubscriptionsCardsList as SubscriptionsCardsListRenderer } from '@/enigma-components/subscriptions/canonical/SubscriptionsPageSections';
import { loadAccountSubscriptionsRuntime } from './accountSubscriptionsRuntime';
import { resolveAccountSubscriptionsData } from './viewData';

interface Props { data?: Awaited<ReturnType<typeof loadAccountSubscriptionsRuntime>> | null; puck?: { isEditing?: boolean }; }

export const puckComponentName = 'SubscriptionsCardsList';
export const puckLabel = 'Subscriptions Cards List';
export const puckCategory = 'Account';
export const puckFields = {};
export const puckDefaults = {};
export const puckAst = {
  kind: 'runtime', sourceJsxNames: ['SubscriptionsCardsList', 'SubscriptionCardSlot', 'SubscriptionCard'],
  sourceImportPaths: ['@/components/subscriptions/canonical/SubscriptionsPageSections', '@/components/subscriptions/SubscriptionListClient', '@/components/subscriptions/SubscriptionCard'],
  role: 'subscriptions-cards-list', slotTarget: 'content', runtimeSignals: ['subscriptions.map', 'subscription.status'],
};
export async function puckDataFetcher() { return loadAccountSubscriptionsRuntime(); }

export function SubscriptionsCardsList(props: Props) {
  const data = resolveAccountSubscriptionsData(props);
  return data ? <SubscriptionsCardsListRenderer subscriptions={data.subscriptions} /> : null;
}
