'use client';

import { getWishlistAction } from '@/lib/actions/wishlist/query-actions';
import { createWishlistSnapshot } from './helpers';
import type { WishlistCommandContext, WishlistStoreState } from './types';

const WISHLIST_QUERY_ERROR_MESSAGES = {
  refresh: 'Failed to load wishlist',
} as const;

type WishlistQueryMethods = Pick<
  WishlistStoreState,
  'ensureWishlistLoaded' | 'refreshWishlist'
>;

export function createWishlistQueryCommands(
  context: WishlistCommandContext,
): WishlistQueryMethods {
  return {
    refreshWishlist: async () => {
      context.setState({ loading: true, error: null });

      const result = await getWishlistAction(null);
      if (!result.success) {
        context.setState({
          loading: false,
          loaded: true,
          error: result.error ?? WISHLIST_QUERY_ERROR_MESSAGES.refresh,
        });
        return;
      }

      context.setState({
        ...createWishlistSnapshot(result.data ?? null),
        loading: false,
        error: null,
      });
    },

    ensureWishlistLoaded: async () => {
      const { loaded, loading, refreshWishlist } = context.getState();
      if (!loaded && !loading) {
        await refreshWishlist();
      }
    },
  };
}
