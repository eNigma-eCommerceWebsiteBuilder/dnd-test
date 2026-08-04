import { SharedWishlistGrid } from '@/enigma-components/wishlist/shared/SharedWishlistGrid';
import { loadSharedWishlistRuntime } from './sharedWishlistRuntime';
import { sharedWishlistPreviewItems } from './preview';
import type { WishlistItem } from '@/lib/api/types/wishlist';
interface Props { items?: WishlistItem[]; puck?: { isEditing?: boolean }; }
export const puckComponentName = 'SharedWishlistGrid';
export const puckLabel = 'Shared Wishlist Grid';
export const puckCategory = 'Wishlist';
export const puckFields = {};
export const puckDefaults = {};
export const puckAst = { kind: 'runtime', sourceJsxNames: ['SharedWishlistGrid'], sourceImportPaths: ['@/components/wishlist/shared/SharedWishlistGrid'], role: 'shared-wishlist-grid', runtimeSignals: ['wishlist.items'] };
export async function puckDataFetcher(_props: Props, context?: Parameters<typeof loadSharedWishlistRuntime>[0]) { const runtime = await loadSharedWishlistRuntime(context); return { items: runtime.items }; }
export function SharedWishlistGridView({ items = [], puck }: Props) { return <SharedWishlistGrid items={puck?.isEditing && items.length === 0 ? sharedWishlistPreviewItems : items} />; }
