'use client';

import { getCartAction, getCartCountAction } from '@/lib/actions/cart/query-actions';
import { createCartSnapshot } from './helpers';
import type { CartCommandContext, CartStoreState } from './types';

const CART_QUERY_ERROR_MESSAGES = {
  refresh: 'Failed to load cart',
  refreshCount: 'Failed to load cart count',
} as const;

type CartQueryMethods = Pick<
  CartStoreState,
  'ensureCartLoaded' | 'ensureCountLoaded' | 'refreshCart' | 'refreshCount'
>;

export function createCartQueryCommands(
  context: CartCommandContext,
): CartQueryMethods {
  return {
    refreshCart: async () => {
      context.setState({ loading: true, error: null });

      const result = await getCartAction();
      if (!result.success) {
        context.setState({
          loading: false,
          error: result.error ?? CART_QUERY_ERROR_MESSAGES.refresh,
          cartLoaded: true,
        });
        return;
      }

      context.setState({
        ...createCartSnapshot(result.data ?? null),
        loading: false,
        error: null,
      });
    },

    refreshCount: async () => {
      const state = context.getState();
      if (state.cartLoaded) {
        context.setState({
          totalItems: state.cart?.totalItems ?? 0,
          countLoaded: true,
          countLoading: false,
        });
        return;
      }

      context.setState({ countLoading: true });

      const result = await getCartCountAction();
      if (!result.success || !result.data) {
        context.setState({
          countLoading: false,
          countLoaded: true,
          error: result.error ?? CART_QUERY_ERROR_MESSAGES.refreshCount,
        });
        return;
      }

      context.setState({
        totalItems: result.data.count,
        countLoading: false,
        countLoaded: true,
        error: null,
      });
    },

    ensureCartLoaded: async () => {
      const { cartLoaded, loading, refreshCart } = context.getState();
      if (!cartLoaded && !loading) {
        await refreshCart();
      }
    },

    ensureCountLoaded: async () => {
      const { countLoaded, countLoading, refreshCount } = context.getState();
      if (!countLoaded && !countLoading) {
        await refreshCount();
      }
    },
  };
}
