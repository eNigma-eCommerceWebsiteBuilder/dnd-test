import { CartPageSummary } from './CartPageSummary';

export const puckComponentName = 'CartPageSummary';
export const puckLabel = 'Cart Page Summary';
export const puckCategory = 'Cart';
export const puckFields = {};
export const puckDefaults = {};
export const puckAst = { kind: 'runtime', sourceJsxNames: ['CartPageSummary'], sourceImportPaths: ['@/components/templates/cart/canonical/CartPageSummary'], role: 'cart-summary', runtimeSignals: ['cart.items', 'cart.total'] };
export function CartPageSummaryView() { return <CartPageSummary />; }
