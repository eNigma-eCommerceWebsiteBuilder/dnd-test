import type { SubscriptionDetailsPageData } from '@/enigma-components/subscriptions/canonical/subscriptionDetailsRuntime';
import { SubscriptionBillingHistoryPanel } from '@/enigma-components/subscriptions/canonical/SubscriptionDetailsPageSections';
import { loadSubscriptionDetailsRuntime } from './subscriptionDetailsRuntime';
import { puckTransparentSlotProps, type SubscriptionDetailSlot } from './types';
import { resolveSubscriptionDetailsPageData } from './viewData';

interface Props { alert?: SubscriptionDetailSlot; history?: SubscriptionDetailSlot; pageData?: SubscriptionDetailsPageData | null; puck?: { isEditing?: boolean }; }
export const puckComponentName = 'SubscriptionBillingHistoryPanel';
export const puckLabel = 'Subscription Billing History';
export const puckCategory = 'Account';
export const puckFields = { alert: { type: 'slot' as const, allow: ['SubscriptionFailedPaymentAlert'] }, history: { type: 'slot' as const, allow: ['SubscriptionBillingHistory'] } };
export const puckDefaults = { alert: [], history: [] };
export const puckAst = {
  kind: 'runtime', slots: ['alert', 'history'], sourceJsxNames: ['SubscriptionBillingHistoryPanel', 'FailedPaymentAlert', 'BillingHistoryList'],
  sourceImportPaths: ['@/components/subscriptions/canonical/SubscriptionDetailsPageSections'],
  role: 'subscription-details-billing-history-panel', slotTarget: 'sidebar', runtimeSignals: ['params.id', 'billingHistory'],
};
export async function puckDataFetcher(_props: Props, context?: Parameters<typeof loadSubscriptionDetailsRuntime>[0]) { return loadSubscriptionDetailsRuntime(context); }
export function SubscriptionBillingHistoryPanelView(props: Props) {
  const billingHistory = resolveSubscriptionDetailsPageData(props)?.billingHistory.billingHistory;
  return billingHistory ? <SubscriptionBillingHistoryPanel billingHistory={billingHistory} alert={props.alert?.(puckTransparentSlotProps)} history={props.history?.(puckTransparentSlotProps)} /> : null;
}
