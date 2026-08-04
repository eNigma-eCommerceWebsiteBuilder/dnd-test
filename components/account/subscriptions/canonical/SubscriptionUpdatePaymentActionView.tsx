import type { SubscriptionDetailsPageData } from '@/enigma-components/subscriptions/canonical/subscriptionDetailsRuntime';
import { SubscriptionUpdatePaymentAction } from '@/enigma-components/subscriptions/canonical/SubscriptionDetailsPageSections';
import { loadSubscriptionDetailsRuntime } from './subscriptionDetailsRuntime';
import { resolveSubscriptionDetailsPageData } from './viewData';
interface Props { pageData?: SubscriptionDetailsPageData | null; puck?: { isEditing?: boolean }; }
export const puckComponentName = 'SubscriptionUpdatePaymentAction'; export const puckLabel = 'Update Subscription Payment'; export const puckCategory = 'Account'; export const puckFields = {}; export const puckDefaults = {};
export const puckAst = { kind: 'runtime', sourceJsxNames: ['SubscriptionUpdatePaymentAction', 'UpdatePaymentButton'], sourceImportPaths: ['@/components/subscriptions/canonical/SubscriptionDetailsPageSections'], role: 'subscription-details-update-payment', slotTarget: 'updatePayment', runtimeSignals: ['params.id'] };
export async function puckDataFetcher(_props: Props, context?: Parameters<typeof loadSubscriptionDetailsRuntime>[0]) { return loadSubscriptionDetailsRuntime(context); }
export function SubscriptionUpdatePaymentActionView(props: Props) { const subscription = resolveSubscriptionDetailsPageData(props)?.details.subscription; return subscription ? <SubscriptionUpdatePaymentAction subscriptionId={subscription._id} /> : null; }
