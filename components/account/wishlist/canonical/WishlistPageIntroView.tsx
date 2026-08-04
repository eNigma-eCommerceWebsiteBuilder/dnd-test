import { WishlistPageIntro as WishlistPageIntroRenderer } from '@/enigma-components/wishlist/canonical/WishlistPageSections';
import type { WishlistPageData } from '@/enigma-components/wishlist/canonical/wishlistPageRuntime';
import { resolveAccountWishlistData } from './viewData';

interface Props { data?: WishlistPageData | null; puck?: { isEditing?: boolean }; }

export const puckComponentName = 'WishlistPageIntro';
export const puckLabel = 'Wishlist Page Intro';
export const puckCategory = 'Account';
export const puckFields = {};
export const puckDefaults = {};
export const puckAst = {
  kind: 'runtime', sourceJsxNames: ['WishlistPageIntro'],
  sourceImportPaths: ['@/components/wishlist/canonical/WishlistPageSections'],
  role: 'wishlist-page-intro', slotTarget: 'intro', runtimeSignals: ['wishlistCount'],
  requiredClasses: ['lg:w-1/2', 'text-3xl', 'md:text-4xl'],
};
export const puckServerDataFetcher = { importPath: '@/components/account/wishlist/canonical/accountWishlistFetcher.server', exportName: 'puckDataFetcher' };

export function WishlistPageIntro(props: Props) {
  const data = resolveAccountWishlistData(props);
  return data ? <WishlistPageIntroRenderer wishlistCount={data.wishlistCount} /> : null;
}
