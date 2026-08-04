import { cache } from 'react';
import {
  fetchWishlistPageData,
  type WishlistPageData,
} from '@/enigma-components/wishlist/canonical/wishlistPageRuntime';

const load = cache(async (): Promise<WishlistPageData> => fetchWishlistPageData());

export function loadAccountWishlistRuntime(): Promise<WishlistPageData> {
  return load();
}
