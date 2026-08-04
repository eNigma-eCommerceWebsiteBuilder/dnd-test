import type { SubscriptionDetailsPageData } from '@/enigma-components/subscriptions/canonical/subscriptionDetailsRuntime';
import { SubscriptionBillingHistory } from '@/enigma-components/subscriptions/canonical/SubscriptionDetailsPageSections';
import { loadSubscriptionDetailsRuntime } from './subscriptionDetailsRuntime';
import { resolveSubscriptionDetailsPageData } from './viewData';
interface Props { pageData?: SubscriptionDetailsPageData | null; puck?: { isEditing?: boolean }; }
export const puckComponentName = 'SubscriptionBillingHistory'; export const puckLabel = 'Subscription Billing History List'; export const puckCategory = 'Account'; export const puckFields = {}; export const puckDefaults = {};
export const puckAst = { kind: 'runtime', sourceJsxNames: ['SubscriptionBillingHistory', 'BillingHistoryList'], sourceImportPaths: ['@/components/subscriptions/canonical/SubscriptionDetailsPageSections'], role: 'subscription-details-billing-history', slotTarget: 'history', runtimeSignals: ['params.id', 'billingHistory'] };
export async function puckDataFetcher(_props: Props, context?: Parameters<typeof loadSubscriptionDetailsRuntime>[0]) { return loadSubscriptionDetailsRuntime(context); }
export function SubscriptionBillingHistoryView(props: Props) { const pageData = resolveSubscriptionDetailsPageData(props); const subscription = pageData?.details.subscription; const attempts = pageData?.billingHistory.billingHistory; return subscription && attempts ? <SubscriptionBillingHistory subscriptionId={subscription._id} attempts={attempts} /> : null; }
