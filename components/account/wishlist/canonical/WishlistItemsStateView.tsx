import { WishlistItemsState as WishlistItemsStateRenderer } from '@/enigma-components/wishlist/canonical/WishlistPageSections';
import type { WishlistPageData } from '@/enigma-components/wishlist/canonical/wishlistPageRuntime';
import { puckTransparentSlotProps, type AccountWishlistSlot } from './types';
import { resolveAccountWishlistData } from './viewData';

interface Props {
  previewState?: 'items' | 'empty';
  empty?: AccountWishlistSlot;
  grid?: AccountWishlistSlot;
  data?: WishlistPageData | null;
  puck?: { isEditing?: boolean };
}

export const puckComponentName = 'WishlistItemsState';
export const puckLabel = 'Wishlist Items State';
export const puckCategory = 'Account';
export const puckFields = {
  previewState: { type: 'select' as const, label: 'Preview State', options: [{ label: 'Wishlist items', value: 'items' }, { label: 'Empty wishlist', value: 'empty' }] },
  empty: { type: 'slot' as const, allow: ['WishlistEmptyRegion'] },
  grid: { type: 'slot' as const, allow: ['WishlistGridRegion'] },
};
export const puckDefaults = { previewState: 'items', empty: [], grid: [] };
export const puckAst = {
  kind: 'runtime', slots: ['empty', 'grid'], sourceJsxNames: ['WishlistItemsState'],
  sourceImportPaths: ['@/components/wishlist/canonical/WishlistPageSections'],
  role: 'wishlist-items-state', slotTarget: 'content',
  conditional: 'data.wishlist.items.length === 0 ? empty : grid', runtimeSignals: ['wishlist.items.length'],
};
export const puckServerDataFetcher = { importPath: '@/components/account/wishlist/canonical/accountWishlistFetcher.server', exportName: 'puckDataFetcher' };

export function WishlistItemsState(props: Props) {
  const value = resolveAccountWishlistData(props);
  if (!value) return null;
  const data = props.puck?.isEditing && props.previewState === 'empty'
    ? { ...value, wishlist: { ...value.wishlist, items: [], totalItems: 0 }, wishlistCount: 0 }
    : value;
  return <WishlistItemsStateRenderer hasItems={data.wishlist.items.length > 0} empty={props.empty?.(puckTransparentSlotProps)} grid={props.grid?.(puckTransparentSlotProps)} />;
}
