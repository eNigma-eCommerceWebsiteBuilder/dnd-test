import type { SubscriptionDetailsPageData } from '@/enigma-components/subscriptions/canonical/subscriptionDetailsRuntime';
import { SubscriptionOrdersPanel } from '@/enigma-components/subscriptions/canonical/SubscriptionDetailsPageSections';
import { loadSubscriptionDetailsRuntime } from './subscriptionDetailsRuntime';
import { resolveSubscriptionDetailsPageData } from './viewData';

interface Props { pageData?: SubscriptionDetailsPageData | null; puck?: { isEditing?: boolean }; }

export const puckComponentName = 'SubscriptionOrdersPanel';
export const puckLabel = 'Subscription Orders Panel';
export const puckCategory = 'Account';
export const puckFields = {};
export const puckDefaults = {};
export const puckAst = {
  kind: 'runtime', sourceJsxNames: ['SubscriptionOrdersPanel', 'SubscriptionOrdersList'],
  sourceImportPaths: ['@/components/subscriptions/canonical/SubscriptionDetailsPageSections'],
  role: 'subscription-details-orders-panel', slotTarget: 'primary', runtimeSignals: ['params.id', 'subscriptionOrders'],
};
export async function puckDataFetcher(_props: Props, context?: Parameters<typeof loadSubscriptionDetailsRuntime>[0]) { return loadSubscriptionDetailsRuntime(context); }
export function SubscriptionOrdersPanelView(props: Props) {
  const pageData = resolveSubscriptionDetailsPageData(props);
  const subscription = pageData?.details.subscription;
  return subscription && pageData ? <SubscriptionOrdersPanel subscription={subscription} orders={pageData.orders} /> : null;
}
