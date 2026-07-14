'use client';

import {
  addToWishlistAction,
  removeFromWishlistAction,
} from '@/lib/actions/wishlist/mutation-actions';
import { getWishlistItemKey } from '@/lib/utils/wishlist';
import { createWishlistSnapshot, removeWishlistItem } from './helpers';
import type { WishlistCommandContext, WishlistStoreState } from './types';

type ItemMutationMethods = Pick<WishlistStoreState, 'addItem' | 'removeItem'>;

const ITEM_MUTATION_ERROR_MESSAGES = {
  add: 'Failed to add item to wishlist',
  remove: 'Failed to remove item',
} as const;

export function createWishlistItemMutationCommands(
  context: WishlistCommandContext,
): ItemMutationMethods {
  return {
    addItem: async (productId, variantId) => {
      const previousWishlist = context.getState().wishlist;
      const itemKey = getWishlistItemKey(productId, variantId);

      context.setState((state) => {
        const alreadyExists = state.wishlist?.items.some(
          (item) => getWishlistItemKey(item.productId, item.variantId) === itemKey,
        );

        if (alreadyExists) {
          return { isPending: true, error: null };
        }

        return {
          totalItems: state.totalItems + 1,
          isPending: true,
          error: null,
          loaded: true,
        };
      });

      const result = await addToWishlistAction(null, { productId, variantId });
      if (!result.success || !result.wishlist) {
        const message = result.error ?? ITEM_MUTATION_ERROR_MESSAGES.add;
        context.setState({
          ...createWishlistSnapshot(previousWishlist),
          isPending: false,
          error: message,
        });
        throw new Error(message);
      }

      context.setState({
        ...createWishlistSnapshot(result.wishlist),
        isPending: false,
        error: null,
      });
    },

    removeItem: async (productId, variantId) => {
      const previousWishlist = context.getState().wishlist;

      context.setState((state) => {
        const wishlist = removeWishlistItem(state.wishlist, productId, variantId);
        if (!wishlist) {
          return { isPending: true, error: null };
        }

        return {
          ...createWishlistSnapshot(wishlist),
          isPending: true,
          error: null,
        };
      });

      const result = await removeFromWishlistAction(null, { productId, variantId });
      if (!result.success || !result.wishlist) {
        const message = result.error ?? ITEM_MUTATION_ERROR_MESSAGES.remove;
        context.setState({
          ...createWishlistSnapshot(previousWishlist),
          isPending: false,
          error: message,
        });
        throw new Error(message);
      }

      context.setState({
        ...createWishlistSnapshot(result.wishlist),
        isPending: false,
        error: null,
      });
    },
  };
}
