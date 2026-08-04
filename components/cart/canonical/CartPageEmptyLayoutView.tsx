import { CartPageEmptyLayout } from './CartPageEmptyLayout';
import { puckTransparentSlotProps, type CartSlot } from './types';

interface Props { content?: CartSlot; }
export const puckComponentName = 'CartPageEmptyLayout';
export const puckLabel = 'Cart Empty Layout';
export const puckCategory = 'Cart';
export const puckFields = { content: { type: 'slot' as const, allow: ['CartPageEmpty'] } };
export const puckDefaults = { content: [] };
export const puckAst = { kind: 'runtime', slots: ['content'], sourceJsxNames: ['CartPageEmptyLayout'], sourceImportPaths: ['@/components/templates/cart/canonical/CartPageEmptyLayout'], role: 'cart-page-empty-layout', requiredClasses: ['min-h-screen', 'max-w-[1440px]', 'px-6'] };
export function CartPageEmptyLayoutView({ content }: Props) { return <CartPageEmptyLayout content={content?.(puckTransparentSlotProps)} />; }
