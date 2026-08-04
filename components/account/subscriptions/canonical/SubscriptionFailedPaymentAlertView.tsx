import type { SubscriptionDetailsPageData } from '@/enigma-components/subscriptions/canonical/subscriptionDetailsRuntime';
import { SubscriptionFailedPaymentAlert } from '@/enigma-components/subscriptions/canonical/SubscriptionDetailsPageSections';
import { loadSubscriptionDetailsRuntime } from './subscriptionDetailsRuntime';
import { resolveSubscriptionDetailsPageData } from './viewData';
interface Props { pageData?: SubscriptionDetailsPageData | null; puck?: { isEditing?: boolean }; }
export const puckComponentName = 'SubscriptionFailedPaymentAlert'; export const puckLabel = 'Subscription Failed Payment Alert'; export const puckCategory = 'Account'; export const puckFields = {}; export const puckDefaults = {};
export const puckAst = { kind: 'runtime', sourceJsxNames: ['SubscriptionFailedPaymentAlert', 'FailedPaymentAlert'], sourceImportPaths: ['@/components/subscriptions/canonical/SubscriptionDetailsPageSections'], role: 'subscription-details-failed-payment-alert', slotTarget: 'alert', conditional: 'attempts.some(attempt => attempt.status === failed)', runtimeSignals: ['params.id', 'billingHistory'] };
export async function puckDataFetcher(_props: Props, context?: Parameters<typeof loadSubscriptionDetailsRuntime>[0]) { return loadSubscriptionDetailsRuntime(context); }
export function SubscriptionFailedPaymentAlertView(props: Props) { const attempts = resolveSubscriptionDetailsPageData(props)?.billingHistory.billingHistory; return attempts ? <SubscriptionFailedPaymentAlert attempts={attempts} /> : null; }
