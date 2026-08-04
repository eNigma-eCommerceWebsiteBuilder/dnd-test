import { CartPageItemList } from './CartPageItemList';

export const puckComponentName = 'CartPageItemList';
export const puckLabel = 'Cart Page Item List';
export const puckCategory = 'Cart';
export const puckFields = {};
export const puckDefaults = {};
export const puckAst = { kind: 'runtime', sourceJsxNames: ['CartPageItemList'], sourceImportPaths: ['@/components/templates/cart/canonical/CartPageItemList'], role: 'cart-item-list', runtimeSignals: ['cart.items'] };
export function CartPageItemListView() { return <CartPageItemList />; }
