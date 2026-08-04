import { SuccessHeader } from '@/enigma-components/checkout/success/SuccessHeader'; import { siteContent } from '@/lib/content';
export const puckComponentName = 'CheckoutSuccessHeader'; export const puckLabel = 'Checkout Success Header'; export const puckCategory = 'Checkout'; export const puckFields = { title: { type: 'text' as const, label: 'Title' } }; export const puckDefaults = { title: siteContent.checkout.success.title };
export const puckAst = { kind: 'static', sourceJsxNames: ['SuccessHeader'], sourceImportPaths: ['@/components/checkout/success/SuccessHeader'], role: 'checkout-success-header' };
export function CheckoutSuccessHeaderView({ title = siteContent.checkout.success.title }: { title?: string }) { return <SuccessHeader title={title} />; }
