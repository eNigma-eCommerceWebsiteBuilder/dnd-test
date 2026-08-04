import { getServerCookies } from '@/lib/api/core/server';
import { getWishlist, getWishlistCount } from '@/lib/api/services/wishlist';
import type { Wishlist } from '@/lib/api/types/wishlist';

export interface WishlistPageData {
  wishlist: Wishlist;
  wishlistCount: number;
}

// Preserve the route's authenticated request fan-out and failure behavior.
export async function fetchWishlistPageData(): Promise<WishlistPageData> {
  const cookies = await getServerCookies();

  try {
    const [wishlistResponse, wishlistCountResponse] = await Promise.all([
      getWishlist({ cookies }),
      getWishlistCount({ cookies }),
    ]);

    return {
      wishlist: wishlistResponse,
      wishlistCount: wishlistCountResponse.data.count,
    };
  } catch (error) {
    console.error('Error fetching wishlist:', error);
    throw error;
  }
}
