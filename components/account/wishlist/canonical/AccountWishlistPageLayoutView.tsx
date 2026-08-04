import { AccountWishlistPageLayout as AccountWishlistPageLayoutRenderer } from '@/enigma-components/wishlist/canonical/WishlistPageSections';
import { puckTransparentSlotProps, type AccountWishlistSlot } from './types';

interface Props { header?: AccountWishlistSlot; content?: AccountWishlistSlot; recommendations?: AccountWishlistSlot; }

export const puckComponentName = 'AccountWishlistPageLayout';
export const puckLabel = 'Account Wishlist Page Layout';
export const puckCategory = 'Account';
export const puckFields = {
  header: { type: 'slot' as const, allow: ['WishlistPageHeaderLayout'] },
  content: { type: 'slot' as const, allow: ['WishlistItemsState'] },
  recommendations: { type: 'slot' as const, allow: ['WishlistRecommendationsFooter'] },
};
export const puckDefaults = { header: [], content: [], recommendations: [] };
export const puckAst = {
  kind: 'static', topLevel: true, slots: ['header', 'content', 'recommendations'],
  sourceJsxNames: ['AccountWishlistPageLayout'],
  sourceImportPaths: ['@/components/wishlist/canonical/WishlistPageSections'],
  role: 'account-wishlist-page-layout', requiredClasses: ['min-h-screen', 'max-w-[1440px]', 'md:py-12'],
};

export function AccountWishlistPageLayout({ header, content, recommendations }: Props) {
  return <AccountWishlistPageLayoutRenderer header={header?.(puckTransparentSlotProps)} content={content?.(puckTransparentSlotProps)} recommendations={recommendations?.(puckTransparentSlotProps)} />;
}
