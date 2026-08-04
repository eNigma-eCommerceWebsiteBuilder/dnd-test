import { WishlistPageHeaderLayout as WishlistPageHeaderLayoutRenderer } from '@/enigma-components/wishlist/canonical/WishlistPageSections';
import { puckTransparentSlotProps, type AccountWishlistSlot } from './types';

interface Props { intro?: AccountWishlistSlot; savings?: AccountWishlistSlot; }

export const puckComponentName = 'WishlistPageHeaderLayout';
export const puckLabel = 'Wishlist Page Header Layout';
export const puckCategory = 'Account';
export const puckFields = {
  intro: { type: 'slot' as const, allow: ['WishlistPageIntro'] },
  savings: { type: 'slot' as const, allow: ['WishlistSavingsRegion'] },
};
export const puckDefaults = { intro: [], savings: [] };
export const puckAst = {
  kind: 'static', slots: ['intro', 'savings'], sourceJsxNames: ['WishlistPageHeaderLayout'],
  sourceImportPaths: ['@/components/wishlist/canonical/WishlistPageSections'],
  role: 'wishlist-page-header-layout', slotTarget: 'header',
  requiredClasses: ['lg:flex-row', 'lg:items-end', 'gap-6', 'mb-8'],
};

export function WishlistPageHeaderLayout({ intro, savings }: Props) {
  return <WishlistPageHeaderLayoutRenderer intro={intro?.(puckTransparentSlotProps)} savings={savings?.(puckTransparentSlotProps)} />;
}
