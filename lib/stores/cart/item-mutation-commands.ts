'use client';

import {
  addToCartAction,
  removeFromCartAction,
  updateCartItemAction,
} from '@/lib/actions/cart/mutation-actions';
import { createCartSnapshot, matchesCartItem, recalculateCart } from './helpers';
import type { CartCommandContext, CartStoreState } from './types';

type ItemMutationMethods = Pick<CartStoreState, 'addItem' | 'removeItem' | 'updateItem'>;

const ITEM_MUTATION_ERROR_MESSAGES = {
  add: 'Failed to add item to cart',
  remove: 'Failed to remove item',
  update: 'Failed to update item',
} as const;

export function createCartItemMutationCommands(
  context: CartCommandContext,
): ItemMutationMethods {
  return {
    addItem: async (productId, quantity = 1, variantId) => {
      const previousCart = context.getState().cart;
      const previousCount = context.getState().totalItems;

      context.setState((state) => {
        if (!state.cart) {
          return {
            isPending: true,
            error: null,
            totalItems: state.totalItems + quantity,
            countLoaded: true,
          };
        }

        const existingItem = state.cart.items.find((item) =>
          matchesCartItem(item, productId, variantId),
        );

        if (!existingItem) {
          return {
            isPending: true,
            error: null,
            totalItems: state.totalItems + quantity,
            countLoaded: true,
          };
        }

        const items = state.cart.items.map((item) =>
          matchesCartItem(item, productId, variantId)
            ? { ...item, quantity: item.quantity + quantity }
            : item,
        );

        return {
          ...createCartSnapshot(recalculateCart(state.cart, items)),
          isPending: true,
          error: null,
        };
      });

      const result = await addToCartAction(null, { productId, quantity, variantId });
      if (!result.success || !result.cart) {
        const message = result.error ?? ITEM_MUTATION_ERROR_MESSAGES.add;
        context.setState({
          ...createCartSnapshot(previousCart),
          totalItems: previousCount,
          isPending: false,
          error: message,
        });
        throw new Error(message);
      }

      context.setState({ ...createCartSnapshot(result.cart), isPending: false, error: null });
      context.openMiniCart();
    },

    updateItem: async (productId, quantity) => {
      const previousCart = context.getState().cart;
      if (!previousCart) {
        return;
      }

      const items = previousCart.items.map((item) =>
        item.productId === productId ? { ...item, quantity } : item,
      );

      context.setState({
        ...createCartSnapshot(recalculateCart(previousCart, items)),
        isPending: true,
        error: null,
      });

      const result = await updateCartItemAction(null, { productId, quantity });
      if (!result.success || !result.cart) {
        const message = result.error ?? ITEM_MUTATION_ERROR_MESSAGES.update;
        context.setState({
          ...createCartSnapshot(previousCart),
          isPending: false,
          error: message,
        });
        throw new Error(message);
      }

      context.setState({ ...createCartSnapshot(result.cart), isPending: false, error: null });
    },

    removeItem: async (productId) => {
      const previousCart = context.getState().cart;
      if (!previousCart) {
        return;
      }

      const items = previousCart.items.filter((item) => item.productId !== productId);

      context.setState({
        ...createCartSnapshot(recalculateCart(previousCart, items)),
        isPending: true,
        error: null,
      });

      const result = await removeFromCartAction(null, { productId });
      if (!result.success || !result.cart) {
        const message = result.error ?? ITEM_MUTATION_ERROR_MESSAGES.remove;
        context.setState({
          ...createCartSnapshot(previousCart),
          isPending: false,
          error: message,
        });
        throw new Error(message);
      }

      context.setState({ ...createCartSnapshot(result.cart), isPending: false, error: null });
    },
  };
}
