import { cache } from 'react';
import { viewSharedWishlist } from '@/lib/api/services/wishlist';
import type { Wishlist } from '@/lib/api/types/wishlist';
import { calculateWishlistSavings } from '@/lib/utils/wishlist';
import { getRouteParam, type PuckFetcherContext } from '@/lib/puck-route-metadata';

export interface SharedWishlistRuntime {
  wishlist: Wishlist | null;
  items: Wishlist['items'];
  itemCount: number;
  savings: ReturnType<typeof calculateWishlistSavings>;
}

const loadByToken = cache(async (token: string): Promise<SharedWishlistRuntime> => {
  let wishlist: Wishlist | null = null;

  try {
    wishlist = await viewSharedWishlist(token);
  } catch {
    wishlist = null;
  }

  const items = wishlist?.items ?? [];
  return {
    wishlist,
    items,
    itemCount: wishlist?.totalItems ?? items.length,
    savings: calculateWishlistSavings(wishlist),
  };
});

export function loadSharedWishlistRuntime(context?: PuckFetcherContext, token?: string) {
  const resolvedToken = token || getRouteParam(context, 'token');
  if (!resolvedToken) return Promise.resolve<SharedWishlistRuntime>({
    wishlist: null,
    items: [],
    itemCount: 0,
    savings: calculateWishlistSavings(null),
  });
  return loadByToken(resolvedToken);
}
