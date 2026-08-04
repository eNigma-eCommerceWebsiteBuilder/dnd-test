import type { WishlistPageData } from '@/enigma-components/wishlist/canonical/wishlistPageRuntime';
import { sharedWishlistPreviewItems } from '@/components/wishlist/canonical/preview';

// Editor-only fixture. Published pages always load the source request contract.
export const accountWishlistPreview: WishlistPageData = {
  wishlist: {
    _id: 'puck-account-wishlist-preview',
    items: sharedWishlistPreviewItems,
    totalItems: sharedWishlistPreviewItems.length,
    lastUpdated: '2026-07-28T00:00:00.000Z',
  },
  wishlistCount: sharedWishlistPreviewItems.length,
};
