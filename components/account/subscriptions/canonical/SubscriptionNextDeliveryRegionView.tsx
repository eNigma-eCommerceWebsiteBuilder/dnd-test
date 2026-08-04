import type { SubscriptionDetailsPageData } from '@/enigma-components/subscriptions/canonical/subscriptionDetailsRuntime';
import { SubscriptionNextDeliveryRegion } from '@/enigma-components/subscriptions/canonical/SubscriptionDetailsPageSections';
import { loadSubscriptionDetailsRuntime } from './subscriptionDetailsRuntime';
import { resolveSubscriptionDetailsPageData } from './viewData';

interface Props { pageData?: SubscriptionDetailsPageData | null; puck?: { isEditing?: boolean }; }

export const puckComponentName = 'SubscriptionNextDeliveryRegion';
export const puckLabel = 'Subscription Next Delivery';
export const puckCategory = 'Account';
export const puckFields = {};
export const puckDefaults = {};
export const puckAst = {
  kind: 'runtime', sourceJsxNames: ['SubscriptionNextDeliveryRegion', 'NextDeliveryCard'],
  sourceImportPaths: ['@/components/subscriptions/canonical/SubscriptionDetailsPageSections'],
  role: 'subscription-details-next-delivery', slotTarget: 'sidebar', runtimeSignals: ['params.id', 'subscription.nextDeliveryDate'],
};
export async function puckDataFetcher(_props: Props, context?: Parameters<typeof loadSubscriptionDetailsRuntime>[0]) { return loadSubscriptionDetailsRuntime(context); }
export function SubscriptionNextDeliveryRegionView(props: Props) {
  const subscription = resolveSubscriptionDetailsPageData(props)?.details.subscription;
  return subscription ? <SubscriptionNextDeliveryRegion subscription={subscription} /> : null;
}
