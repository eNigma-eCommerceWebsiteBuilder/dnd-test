import { AddAllToCartButton } from '@/enigma-components/wishlist/shared/AddAllToCartButton';
import { loadSharedWishlistRuntime } from './sharedWishlistRuntime';
import { sharedWishlistPreviewItems } from './preview';
import type { WishlistItem } from '@/lib/api/types/wishlist';

interface Props { items?: WishlistItem[]; puck?: { isEditing?: boolean }; }
export const puckComponentName = 'SharedWishlistAddAll';
export const puckLabel = 'Shared Wishlist Add All';
export const puckCategory = 'Wishlist';
export const puckFields = {};
export const puckDefaults = {};
export const puckAst = { kind: 'runtime', sourceJsxNames: ['AddAllToCartButton'], sourceImportPaths: ['@/components/wishlist/shared/AddAllToCartButton'], role: 'shared-wishlist-add-all', runtimeSignals: ['wishlist.items'] };
export async function puckDataFetcher(_props: Props, context?: Parameters<typeof loadSharedWishlistRuntime>[0]) { const runtime = await loadSharedWishlistRuntime(context); return { items: runtime.items }; }
export function SharedWishlistAddAllView({ items = [], puck }: Props) { return <AddAllToCartButton items={puck?.isEditing && items.length === 0 ? sharedWishlistPreviewItems : items} />; }
