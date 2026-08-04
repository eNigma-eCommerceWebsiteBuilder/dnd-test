import { SharedWishlistHeader } from '@/enigma-components/wishlist/shared/SharedWishlistHeader';
import { loadSharedWishlistRuntime } from './sharedWishlistRuntime';
import { puckTransparentSlotProps, type WishlistSlot } from './types';

interface Props { itemCount?: number; lastUpdated?: string | null; actions?: WishlistSlot; puck?: { isEditing?: boolean }; }
export const puckComponentName = 'SharedWishlistHeader';
export const puckLabel = 'Shared Wishlist Header';
export const puckCategory = 'Wishlist';
export const puckFields = { actions: { type: 'slot' as const, allow: ['SharedWishlistHeaderActionsCondition'] } };
export const puckDefaults = { itemCount: 2, lastUpdated: '2026-01-01T00:00:00.000Z', actions: [] };
export const puckAst = { kind: 'runtime', slots: ['actions'], sourceJsxNames: ['SharedWishlistHeader'], sourceImportPaths: ['@/components/wishlist/shared/SharedWishlistHeader'], role: 'shared-wishlist-header', runtimeSignals: ['wishlist.items', 'wishlist.lastUpdated'] };
export async function puckDataFetcher(_props: Props, context?: Parameters<typeof loadSharedWishlistRuntime>[0]) { const runtime = await loadSharedWishlistRuntime(context); return { itemCount: runtime.itemCount, lastUpdated: runtime.wishlist?.lastUpdated ?? null }; }
export function SharedWishlistHeaderView({ itemCount = 0, lastUpdated, actions }: Props) { return <SharedWishlistHeader title="Shared Wishlist" itemCount={itemCount} lastUpdated={lastUpdated} actions={actions?.(puckTransparentSlotProps)} />; }
