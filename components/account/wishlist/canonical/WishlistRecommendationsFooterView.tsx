import { WishlistRecommendationsFooter as WishlistRecommendationsFooterRenderer } from '@/enigma-components/wishlist/canonical/WishlistPageSections';

export const puckComponentName = 'WishlistRecommendationsFooter';
export const puckLabel = 'Wishlist Recommendations Footer';
export const puckCategory = 'Account';
export const puckFields = {};
export const puckDefaults = {};
export const puckAst = {
  kind: 'static', sourceJsxNames: ['WishlistRecommendationsFooter'],
  sourceImportPaths: ['@/components/wishlist/canonical/WishlistPageSections'],
  role: 'wishlist-recommendations-footer', slotTarget: 'recommendations',
  requiredClasses: ['mt-12', 'border-t', 'text-center'],
};

export function WishlistRecommendationsFooter() {
  return <WishlistRecommendationsFooterRenderer />;
}
