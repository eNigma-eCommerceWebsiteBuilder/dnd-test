import { WishlistSavingsRegion as WishlistSavingsRegionRenderer } from '@/enigma-components/wishlist/canonical/WishlistPageSections';
import type { WishlistPageData } from '@/enigma-components/wishlist/canonical/wishlistPageRuntime';
import { resolveAccountWishlistData } from './viewData';

interface Props { data?: WishlistPageData | null; puck?: { isEditing?: boolean }; }

export const puckComponentName = 'WishlistSavingsRegion';
export const puckLabel = 'Wishlist Savings Region';
export const puckCategory = 'Account';
export const puckFields = {};
export const puckDefaults = {};
export const puckAst = {
  kind: 'runtime', sourceJsxNames: ['WishlistSavingsRegion', 'WishlistSavingsCard'],
  sourceImportPaths: ['@/components/wishlist/canonical/WishlistPageSections', '@/components/wishlist/WishlistSavingsCard'],
  role: 'wishlist-savings-region', slotTarget: 'savings', runtimeSignals: ['wishlist.items'],
};
export const puckServerDataFetcher = { importPath: '@/components/account/wishlist/canonical/accountWishlistFetcher.server', exportName: 'puckDataFetcher' };

export function WishlistSavingsRegion(props: Props) {
  const data = resolveAccountWishlistData(props);
  return data ? <WishlistSavingsRegionRenderer wishlist={data.wishlist} /> : null;
}
