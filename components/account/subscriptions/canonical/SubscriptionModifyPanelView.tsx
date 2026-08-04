import type { SubscriptionDetailsPageData } from '@/enigma-components/subscriptions/canonical/subscriptionDetailsRuntime';
import { SubscriptionModifyPanel } from '@/enigma-components/subscriptions/canonical/SubscriptionDetailsPageSections';
import { loadSubscriptionDetailsRuntime } from './subscriptionDetailsRuntime';
import { resolveSubscriptionDetailsPageData } from './viewData';

interface Props { pageData?: SubscriptionDetailsPageData | null; puck?: { isEditing?: boolean }; }

export const puckComponentName = 'SubscriptionModifyPanel';
export const puckLabel = 'Subscription Modify Panel';
export const puckCategory = 'Account';
export const puckFields = {};
export const puckDefaults = {};
export const puckAst = {
  kind: 'runtime', sourceJsxNames: ['SubscriptionModifyPanel', 'ModifySubscriptionButton'],
  sourceImportPaths: ['@/components/subscriptions/canonical/SubscriptionDetailsPageSections'],
  role: 'subscription-details-modify-panel', slotTarget: 'primary', runtimeSignals: ['params.id', 'subscription'],
};
export async function puckDataFetcher(_props: Props, context?: Parameters<typeof loadSubscriptionDetailsRuntime>[0]) { return loadSubscriptionDetailsRuntime(context); }
export function SubscriptionModifyPanelView(props: Props) {
  const subscription = resolveSubscriptionDetailsPageData(props)?.details.subscription;
  return subscription ? <SubscriptionModifyPanel subscription={subscription} /> : null;
}
