import { WishlistEmptyRegion as WishlistEmptyRegionRenderer } from '@/enigma-components/wishlist/canonical/WishlistPageSections';

export const puckComponentName = 'WishlistEmptyRegion';
export const puckLabel = 'Wishlist Empty State';
export const puckCategory = 'Account';
export const puckFields = {};
export const puckDefaults = {};
export const puckAst = {
  kind: 'static', sourceJsxNames: ['WishlistEmptyRegion', 'WishlistEmpty'],
  sourceImportPaths: ['@/components/wishlist/canonical/WishlistPageSections', '@/components/wishlist/WishlistEmpty'],
  role: 'wishlist-empty-region', slotTarget: 'empty',
};

export function WishlistEmptyRegion() {
  return <WishlistEmptyRegionRenderer />;
}
