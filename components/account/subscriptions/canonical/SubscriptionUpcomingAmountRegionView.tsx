import type { SubscriptionDetailsPageData } from '@/enigma-components/subscriptions/canonical/subscriptionDetailsRuntime';
import { SubscriptionUpcomingAmountRegion } from '@/enigma-components/subscriptions/canonical/SubscriptionDetailsPageSections';
import { loadSubscriptionDetailsRuntime } from './subscriptionDetailsRuntime';
import { resolveSubscriptionDetailsPageData } from './viewData';

interface Props { pageData?: SubscriptionDetailsPageData | null; puck?: { isEditing?: boolean }; }

export const puckComponentName = 'SubscriptionUpcomingAmountRegion';
export const puckLabel = 'Subscription Upcoming Amount';
export const puckCategory = 'Account';
export const puckFields = {};
export const puckDefaults = {};
export const puckAst = {
  kind: 'runtime', sourceJsxNames: ['SubscriptionUpcomingAmountRegion', 'UpcomingAmountCard'],
  sourceImportPaths: ['@/components/subscriptions/canonical/SubscriptionDetailsPageSections'],
  role: 'subscription-details-upcoming-amount', slotTarget: 'sidebar', runtimeSignals: ['params.id', 'upcomingBilling'],
};
export async function puckDataFetcher(_props: Props, context?: Parameters<typeof loadSubscriptionDetailsRuntime>[0]) { return loadSubscriptionDetailsRuntime(context); }
export function SubscriptionUpcomingAmountRegionView(props: Props) {
  const upcomingBilling = resolveSubscriptionDetailsPageData(props)?.details.upcomingBilling;
  return upcomingBilling ? <SubscriptionUpcomingAmountRegion upcomingBilling={upcomingBilling} /> : null;
}
