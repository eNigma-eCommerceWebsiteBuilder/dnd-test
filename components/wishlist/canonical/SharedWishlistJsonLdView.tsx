import { SharedWishlistJsonLd } from './SharedWishlistJsonLd';
import { loadSharedWishlistRuntime } from './sharedWishlistRuntime';
import { sharedWishlistPreviewItems } from './preview';
import type { WishlistItem } from '@/lib/api/types/wishlist';
interface Props { items?: WishlistItem[]; puck?: { isEditing?: boolean }; }
export const puckComponentName = 'SharedWishlistJsonLd';
export const puckLabel = 'Shared Wishlist Structured Data';
export const puckCategory = 'Wishlist';
export const puckFields = {};
export const puckDefaults = {};
export const puckAst = { kind: 'runtime', sourceJsxNames: ['SharedWishlistJsonLd'], sourceImportPaths: ['@/components/wishlist/canonical/SharedWishlistJsonLd'], role: 'shared-wishlist-json-ld', runtimeSignals: ['wishlist.items'] };
export async function puckDataFetcher(_props: Props, context?: Parameters<typeof loadSharedWishlistRuntime>[0]) { const runtime = await loadSharedWishlistRuntime(context); return { items: runtime.items }; }
export function SharedWishlistJsonLdView({ items = [], puck }: Props) { return <SharedWishlistJsonLd items={puck?.isEditing && items.length === 0 ? sharedWishlistPreviewItems : items} />; }
