import { SharedWishlistPageLayout } from './SharedWishlistPageLayout';
import { puckTransparentSlotProps, type WishlistSlot } from './types';

interface Props { schema?: WishlistSlot; header?: WishlistSlot; content?: WishlistSlot; }
export const puckComponentName = 'SharedWishlistPageLayout';
export const puckLabel = 'Shared Wishlist Page Layout';
export const puckCategory = 'Wishlist';
export const puckFields = { schema: { type: 'slot' as const, allow: ['SharedWishlistJsonLd'] }, header: { type: 'slot' as const, allow: ['SharedWishlistHeader'] }, content: { type: 'slot' as const, allow: ['SharedWishlistContentLayout'] } };
export const puckDefaults = { schema: [], header: [], content: [] };
export const puckAst = { kind: 'runtime', slots: ['schema', 'header', 'content'], sourceJsxNames: ['SharedWishlistPageLayout'], sourceImportPaths: ['@/components/wishlist/canonical/SharedWishlistPageLayout'], role: 'shared-wishlist-page-layout', requiredClasses: ['min-h-screen', 'max-w-[1440px]', 'px-6', 'py-12'] };
export function SharedWishlistPageLayoutView(props: Props) { return <SharedWishlistPageLayout schema={props.schema?.(puckTransparentSlotProps)} header={props.header?.(puckTransparentSlotProps)} content={props.content?.(puckTransparentSlotProps)} />; }
