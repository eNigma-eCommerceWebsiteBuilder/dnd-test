import { SharedWishlistItemsState } from './SharedWishlistItemsState';
import { loadSharedWishlistRuntime } from './sharedWishlistRuntime';
import { puckTransparentSlotProps, type WishlistSlot } from './types';
interface Props { hasItems?: boolean; previewMode?: 'grid' | 'empty'; empty?: WishlistSlot; grid?: WishlistSlot; puck?: { isEditing?: boolean }; }
export const puckComponentName = 'SharedWishlistItemsState';
export const puckLabel = 'Shared Wishlist Items State';
export const puckCategory = 'Wishlist';
export const puckFields = { previewMode: { type: 'select' as const, options: [{ label: 'Items', value: 'grid' }, { label: 'Empty', value: 'empty' }] }, empty: { type: 'slot' as const, allow: ['SharedWishlistEmpty'] }, grid: { type: 'slot' as const, allow: ['SharedWishlistGrid'] } };
export const puckDefaults = { previewMode: 'grid', empty: [], grid: [] };
export const puckAst = { kind: 'runtime', slots: ['empty', 'grid'], sourceJsxNames: ['SharedWishlistItemsState'], sourceImportPaths: ['@/components/wishlist/canonical/SharedWishlistItemsState'], role: 'shared-wishlist-items-state', conditional: 'items.length > 0', runtimeSignals: ['wishlist.items'] };
export async function puckDataFetcher(_props: Props, context?: Parameters<typeof loadSharedWishlistRuntime>[0]) { const runtime = await loadSharedWishlistRuntime(context); return { hasItems: runtime.items.length > 0 }; }
export function SharedWishlistItemsStateView({ hasItems, previewMode = 'grid', empty, grid, puck }: Props) { const resolved = puck?.isEditing ? previewMode === 'grid' : hasItems ?? false; return <SharedWishlistItemsState hasItems={resolved} empty={empty?.(puckTransparentSlotProps)} grid={grid?.(puckTransparentSlotProps)} />; }
