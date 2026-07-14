'use client';

import { clearWishlistAction } from '@/lib/actions/wishlist/mutation-actions';
import {
  moveAllWishlistToCartAction,
  moveWishlistToCartAction,
  toggleWishlistNotificationAction,
} from '@/lib/actions/wishlist/stub-actions';
import {
  createWishlistSnapshot,
  removeWishlistItem,
  toggleWishlistNotificationState,
} from './helpers';
import type { WishlistCommandContext, WishlistStoreState } from './types';

type SupportMutationMethods = Pick<
  WishlistStoreState,
  'clearWishlist' | 'moveAllToCart' | 'moveToCart' | 'toggleNotification'
>;

const SUPPORT_MUTATION_ERROR_MESSAGES = {
  clear: 'Failed to clear wishlist',
  moveAllToCart: 'Failed to move items to cart',
  moveToCart: 'Failed to move item to cart',
  toggleNotification: 'Failed to update notifications',
} as const;

export function createWishlistSupportMutationCommands(
  context: WishlistCommandContext,
): SupportMutationMethods {
  return {
    clearWishlist: async () => {
      const previousWishlist = context.getState().wishlist;

      context.setState({
        ...createWishlistSnapshot(
          previousWishlist ? { ...previousWishlist, items: [], totalItems: 0 } : null,
        ),
        isPending: true,
        error: null,
      });

      const result = await clearWishlistAction(null);
      if (!result.success) {
        const message = result.error ?? SUPPORT_MUTATION_ERROR_MESSAGES.clear;
        context.setState({
          ...createWishlistSnapshot(previousWishlist),
          isPending: false,
          error: message,
        });
        throw new Error(message);
      }

      context.setState({
        ...createWishlistSnapshot(result.wishlist ?? null),
        isPending: false,
        error: null,
      });
    },

    moveToCart: async (productId, variantId, quantity = 1) => {
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

      const result = await moveWishlistToCartAction(null, { productId, variantId, quantity });
      if (!result.success) {
        const message = result.error ?? SUPPORT_MUTATION_ERROR_MESSAGES.moveToCart;
        context.setState({
          ...createWishlistSnapshot(previousWishlist),
          isPending: false,
          error: message,
        });
        throw new Error(message);
      }

      context.setState({
        ...createWishlistSnapshot(result.wishlist ?? previousWishlist ?? null),
        isPending: false,
        error: null,
      });

      if (result.cart) {
        context.hydrateCart(result.cart);
      } else {
        await context.refreshCart();
      }

      context.openMiniCart();
    },

    moveAllToCart: async () => {
      context.setState({ isPending: true, error: null });

      const result = await moveAllWishlistToCartAction(null);
      if (!result.success) {
        const message = result.error ?? SUPPORT_MUTATION_ERROR_MESSAGES.moveAllToCart;
        context.setState({ isPending: false, error: message });
        throw new Error(message);
      }

      await Promise.all([context.getState().refreshWishlist(), context.refreshCart()]);
      context.setState({ isPending: false, error: null });
      context.openMiniCart();
    },

    toggleNotification: async (productId, type, variantId) => {
      const previousWishlist = context.getState().wishlist;

      context.setState((state) => {
        const wishlist = toggleWishlistNotificationState(
          state.wishlist,
          productId,
          type,
          variantId,
        );

        if (!wishlist) {
          return { isPending: true, error: null };
        }

        return {
          ...createWishlistSnapshot(wishlist),
          isPending: true,
          error: null,
        };
      });

      const result = await toggleWishlistNotificationAction(null, {
        productId,
        type,
        variantId,
      });
      if (!result.success) {
        const message = result.error ?? SUPPORT_MUTATION_ERROR_MESSAGES.toggleNotification;
        context.setState({
          ...createWishlistSnapshot(previousWishlist),
          isPending: false,
          error: message,
        });
        throw new Error(message);
      }

      context.setState({ isPending: false, error: null });
    },
  };
}
