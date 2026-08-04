import { ContinueShoppingButton } from '@/enigma-components/checkout/success/ContinueShoppingButton';
export const puckComponentName = 'CheckoutSuccessContinueShopping'; export const puckLabel = 'Checkout Success Continue Shopping'; export const puckCategory = 'Checkout'; export const puckFields = {}; export const puckDefaults = {};
export const puckAst = { kind: 'static', sourceJsxNames: ['ContinueShoppingButton'], sourceImportPaths: ['@/components/checkout/success/ContinueShoppingButton'], role: 'checkout-success-continue-shopping' };
export function CheckoutSuccessContinueShoppingView() { return <ContinueShoppingButton />; }
