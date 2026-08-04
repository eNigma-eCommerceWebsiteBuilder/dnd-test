'use client';

import { useEffect } from 'react';
import { useWishlistStore } from '@/lib/stores/wishlist-store';
import type { WishlistStoreState } from '@/lib/stores/wishlist/types';
import type { UseWishlistReturn } from './types';

const EMPTY_ITEMS: never[] = [];
const selectWishlist = (state: WishlistStoreState) => state.wishlist;
const selectItems = (state: WishlistStoreState) => state.wishlist?.items ?? EMPTY_ITEMS;
const selectTotalItems = (state: WishlistStoreState) => state.totalItems;
const selectLoading = (state: WishlistStoreState) => state.loading;
const selectError = (state: WishlistStoreState) => state.error;
const selectEnsureWishlistLoaded = (state: WishlistStoreState) => state.ensureWishlistLoaded;
const selectRefreshWishlist = (state: WishlistStoreState) => state.refreshWishlist;
const selectAddItem = (state: WishlistStoreState) => state.addItem;
const selectRemoveItem = (state: WishlistStoreState) => state.removeItem;
const selectClearWishlist = (state: WishlistStoreState) => state.clearWishlist;
const selectIsInWishlist = (state: WishlistStoreState) => state.isInWishlist;
const selectClearError = (state: WishlistStoreState) => state.clearError;

export function useWishlist(autoLoad: boolean = true): UseWishlistReturn {
  const wishlist = useWishlistStore(selectWishlist);
  const items = useWishlistStore(selectItems);
  const totalItems = useWishlistStore(selectTotalItems);
  const loading = useWishlistStore(selectLoading);
  const error = useWishlistStore(selectError);
  const ensureWishlistLoaded = useWishlistStore(selectEnsureWishlistLoaded);
  const loadWishlist = useWishlistStore(selectRefreshWishlist);
  const addItem = useWishlistStore(selectAddItem);
  const removeItem = useWishlistStore(selectRemoveItem);
  const clearWishlist = useWishlistStore(selectClearWishlist);
  const refreshWishlist = useWishlistStore(selectRefreshWishlist);
  const isInWishlist = useWishlistStore(selectIsInWishlist);
  const clearError = useWishlistStore(selectClearError);

  useEffect(() => {
    if (autoLoad) void ensureWishlistLoaded();
  }, [autoLoad, ensureWishlistLoaded]);

  return { wishlist, items, totalItems, loading, error, loadWishlist, addItem, removeItem, clearWishlist, refreshWishlist, getItemCount: () => totalItems, isInWishlist, clearError };
}
