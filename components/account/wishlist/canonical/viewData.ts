import type { WishlistPageData } from '@/enigma-components/wishlist/canonical/wishlistPageRuntime';
import { accountWishlistPreview } from './preview';

export interface AccountWishlistRuntimeProps {
  data?: WishlistPageData | null;
  puck?: { isEditing?: boolean };
}

export function resolveAccountWishlistData({
  data = null,
  puck,
}: AccountWishlistRuntimeProps): WishlistPageData | null {
  return puck?.isEditing ? accountWishlistPreview : data;
}
