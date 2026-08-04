import { CartPageLayout } from './CartPageLayout';
import { puckTransparentSlotProps, type CartSlot } from './types';

interface Props { header?: CartSlot; progress?: CartSlot; items?: CartSlot; continueShopping?: CartSlot; summary?: CartSlot; }
export const puckComponentName = 'CartPageLayout';
export const puckLabel = 'Cart Page Layout';
export const puckCategory = 'Cart';
export const puckFields = {
  header: { type: 'slot' as const, allow: ['CartPageHeader'] },
  progress: { type: 'slot' as const, allow: ['CartPageFreeShippingProgress'] },
  items: { type: 'slot' as const, allow: ['CartPageItemList'] },
  continueShopping: { type: 'slot' as const, allow: ['CartPageContinueShopping'] },
  summary: { type: 'slot' as const, allow: ['CartPageSummary'] },
};
export const puckDefaults = { header: [], progress: [], items: [], continueShopping: [], summary: [] };
export const puckAst = { kind: 'runtime', slots: ['header', 'progress', 'items', 'continueShopping', 'summary'], sourceJsxNames: ['CartPageLayout'], sourceImportPaths: ['@/components/templates/cart/canonical/CartPageLayout'], role: 'cart-page-layout', requiredClasses: ['min-h-screen', 'max-w-[1440px]', 'lg:flex-row', 'lg:w-[400px]'] };
export function CartPageLayoutView(props: Props) { return <CartPageLayout header={props.header?.(puckTransparentSlotProps)} progress={props.progress?.(puckTransparentSlotProps)} items={props.items?.(puckTransparentSlotProps)} continueShopping={props.continueShopping?.(puckTransparentSlotProps)} summary={props.summary?.(puckTransparentSlotProps)} />; }
