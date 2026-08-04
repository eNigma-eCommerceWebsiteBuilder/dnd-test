import type { SubscriptionDetailsPageData } from '@/enigma-components/subscriptions/canonical/subscriptionDetailsRuntime';
import { SubscriptionDetailsBreadcrumbs } from '@/enigma-components/subscriptions/canonical/SubscriptionDetailsPageSections';
import { loadSubscriptionDetailsRuntime } from './subscriptionDetailsRuntime';
import { resolveSubscriptionDetailsPageData } from './viewData';

interface Props { pageData?: SubscriptionDetailsPageData | null; puck?: { isEditing?: boolean }; }

export const puckComponentName = 'SubscriptionDetailsBreadcrumbs';
export const puckLabel = 'Subscription Details Breadcrumbs';
export const puckCategory = 'Account';
export const puckFields = {};
export const puckDefaults = {};
export const puckAst = {
  kind: 'runtime', sourceJsxNames: ['SubscriptionDetailsBreadcrumbs'],
  sourceImportPaths: ['@/components/subscriptions/canonical/SubscriptionDetailsPageSections'],
  role: 'subscription-details-breadcrumbs', slotTarget: 'breadcrumbs', runtimeSignals: ['params.id', 'subscription.contractNumber'],
};
export async function puckDataFetcher(_props: Props, context?: Parameters<typeof loadSubscriptionDetailsRuntime>[0]) { return loadSubscriptionDetailsRuntime(context); }
export function SubscriptionDetailsBreadcrumbsView(props: Props) {
  const subscription = resolveSubscriptionDetailsPageData(props)?.details.subscription;
  return subscription ? <SubscriptionDetailsBreadcrumbs subscription={subscription} /> : null;
}
