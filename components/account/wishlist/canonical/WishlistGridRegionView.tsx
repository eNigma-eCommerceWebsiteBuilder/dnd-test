import { WishlistGridRegion as WishlistGridRegionRenderer } from '@/enigma-components/wishlist/canonical/WishlistPageSections';
import type { WishlistPageData } from '@/enigma-components/wishlist/canonical/wishlistPageRuntime';
import { resolveAccountWishlistData } from './viewData';

interface Props { data?: WishlistPageData | null; puck?: { isEditing?: boolean }; }

export const puckComponentName = 'WishlistGridRegion';
export const puckLabel = 'Wishlist Grid Region';
export const puckCategory = 'Account';
export const puckFields = {};
export const puckDefaults = {};
export const puckAst = {
  kind: 'runtime', sourceJsxNames: ['WishlistGridRegion', 'WishlistGrid', 'WishlistGridClient'],
  sourceImportPaths: ['@/components/wishlist/canonical/WishlistPageSections', '@/components/wishlist/WishlistGrid', '@/components/wishlist/WishlistGridClient'],
  role: 'wishlist-grid-region', slotTarget: 'grid', runtimeSignals: ['wishlist.items', 'filter', 'filteredItems.map'],
  conditional: 'filteredItems.length === 0 ? filterEmpty : itemGrid',
};
export const puckServerDataFetcher = { importPath: '@/components/account/wishlist/canonical/accountWishlistFetcher.server', exportName: 'puckDataFetcher' };

export function WishlistGridRegion(props: Props) {
  const data = resolveAccountWishlistData(props);
  return data ? <WishlistGridRegionRenderer wishlist={data.wishlist} /> : null;
}
