import type { SubscriptionDetailsPageData } from '@/enigma-components/subscriptions/canonical/subscriptionDetailsRuntime';
import { SubscriptionDetailHeaderRegion } from '@/enigma-components/subscriptions/canonical/SubscriptionDetailsPageSections';
import { loadSubscriptionDetailsRuntime } from './subscriptionDetailsRuntime';
import { resolveSubscriptionDetailsPageData } from './viewData';

interface Props { pageData?: SubscriptionDetailsPageData | null; puck?: { isEditing?: boolean }; }

export const puckComponentName = 'SubscriptionDetailHeaderRegion';
export const puckLabel = 'Subscription Details Header';
export const puckCategory = 'Account';
export const puckFields = {};
export const puckDefaults = {};
export const puckAst = {
  kind: 'runtime', sourceJsxNames: ['SubscriptionDetailHeaderRegion', 'SubscriptionDetailsHeader'],
  sourceImportPaths: ['@/components/subscriptions/canonical/SubscriptionDetailsPageSections'],
  role: 'subscription-details-header', slotTarget: 'header', runtimeSignals: ['params.id', 'subscription'],
};
export async function puckDataFetcher(_props: Props, context?: Parameters<typeof loadSubscriptionDetailsRuntime>[0]) { return loadSubscriptionDetailsRuntime(context); }
export function SubscriptionDetailHeaderRegionView(props: Props) {
  const subscription = resolveSubscriptionDetailsPageData(props)?.details.subscription;
  return subscription ? <SubscriptionDetailHeaderRegion subscription={subscription} /> : null;
}
