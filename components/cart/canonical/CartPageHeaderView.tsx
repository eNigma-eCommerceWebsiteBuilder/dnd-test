import { CartPageHeader } from './CartPageHeader';
export const puckComponentName = 'CartPageHeader';
export const puckLabel = 'Cart Page Header';
export const puckCategory = 'Cart';
export const puckFields = {};
export const puckDefaults = {};
export const puckAst = { kind: 'runtime', sourceJsxNames: ['CartPageHeader'], sourceImportPaths: ['@/components/templates/cart/canonical/CartPageHeader'], role: 'cart-page-header', runtimeSignals: ['cart.totalItems'], requiredClasses: ['mb-6', 'text-2xl', 'lg:text-4xl'] };
export function CartPageHeaderView() { return <CartPageHeader />; }
