import { SharedWishlistContentLayout } from './SharedWishlistContentLayout';
import { puckTransparentSlotProps, type WishlistSlot } from './types';
interface Props { savings?: WishlistSlot; items?: WishlistSlot; }
export const puckComponentName = 'SharedWishlistContentLayout';
export const puckLabel = 'Shared Wishlist Content Layout';
export const puckCategory = 'Wishlist';
export const puckFields = { savings: { type: 'slot' as const, allow: ['SharedWishlistSavingsCondition'] }, items: { type: 'slot' as const, allow: ['SharedWishlistItemsState'] } };
export const puckDefaults = { savings: [], items: [] };
export const puckAst = { kind: 'runtime', slots: ['savings', 'items'], sourceJsxNames: ['SharedWishlistContentLayout'], sourceImportPaths: ['@/components/wishlist/canonical/SharedWishlistContentLayout'], role: 'shared-wishlist-content-layout', requiredClasses: ['mt-10'] };
export function SharedWishlistContentLayoutView(props: Props) { return <SharedWishlistContentLayout savings={props.savings?.(puckTransparentSlotProps)} items={props.items?.(puckTransparentSlotProps)} />; }
