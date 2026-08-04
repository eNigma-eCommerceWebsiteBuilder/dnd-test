'use client';

import { useCallback, useState } from 'react';
import { bulkAddToWishlistAction, bulkRemoveFromWishlistAction } from '@/lib/actions/wishlist/stub-actions';
import type { WishlistBulkResult } from '@/lib/actions/types';
import { getErrorMessage } from '@/lib/hooks/internal/errors';
import { useWishlistStore } from '@/lib/stores/wishlist-store';
import type { BulkOperationResult, UseWishlistBulkReturn } from './types';

export function useWishlistBulk(): UseWishlistBulkReturn {
  const [processing, setProcessing] = useState(false);
  const [results, setResults] = useState<BulkOperationResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const refreshWishlist = useWishlistStore((state) => state.refreshWishlist);
  const moveAllToCartStore = useWishlistStore((state) => state.moveAllToCart);

  const addBulk = useCallback(async (items: Array<{ productId: string; variantId?: string }>): Promise<WishlistBulkResult> => {
    setProcessing(true); setError(null); setResults(null);
    try {
      const response = await bulkAddToWishlistAction(null, { items });
      if (!response.success) throw new Error(response.error || 'Failed to add items');
      await refreshWishlist();
      setResults({ added: response.added, failed: response.failed, errors: response.errors, message: response.message });
      return response;
    } catch (cause: unknown) {
      const message = getErrorMessage(cause, 'Failed to add items'); setError(message); throw new Error(message);
    } finally { setProcessing(false); }
  }, [refreshWishlist]);

  const removeBulk = useCallback(async (items: Array<{ productId: string; variantId?: string }>): Promise<WishlistBulkResult> => {
    setProcessing(true); setError(null);
    try {
      const response = await bulkRemoveFromWishlistAction(null, { items });
      if (!response.success) throw new Error(response.error || 'Failed to remove items');
      await refreshWishlist();
      setResults({ added: response.added, failed: response.failed, errors: response.errors, message: response.message });
      return response;
    } catch (cause: unknown) {
      const message = getErrorMessage(cause, 'Failed to remove items'); setError(message); throw new Error(message);
    } finally { setProcessing(false); }
  }, [refreshWishlist]);

  const moveAllToCart = useCallback(async (): Promise<WishlistBulkResult> => {
    setProcessing(true); setError(null); setResults(null);
    try {
      await moveAllToCartStore();
      const response: WishlistBulkResult = { success: true, message: 'Moved all items to cart' };
      setResults({ message: response.message });
      return response;
    } catch (cause: unknown) {
      const message = getErrorMessage(cause, 'Failed to move items to cart'); setError(message); throw new Error(message);
    } finally { setProcessing(false); }
  }, [moveAllToCartStore]);

  return { processing, results, error, addBulk, removeBulk, moveAllToCart, clearResults: () => setResults(null) };
}
