'use client';

import { useCallback, useState } from 'react';
import type { Wishlist } from '@/lib/api/types/wishlist';
import { generateWishlistShareLinkAction } from '@/lib/actions/wishlist/mutation-actions';
import { viewSharedWishlistAction } from '@/lib/actions/wishlist/query-actions';
import { getErrorMessage } from '@/lib/hooks/internal/errors';
import { formatWishlistShareUrl } from '@/lib/utils/wishlist';
import type { UseWishlistShareReturn } from './types';

export function useWishlistShare(): UseWishlistShareReturn {
  const [shareUrl, setShareUrl] = useState<string | null>(null);
  const [generating, setGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const generateShareLink = useCallback(async (): Promise<string> => {
    setGenerating(true); setError(null);
    try {
      const response = await generateWishlistShareLinkAction(null);
      if (!response.success || !response.data) throw new Error(response.error || 'Failed to generate share link');
      const formattedUrl = response.data.shareToken ? formatWishlistShareUrl(response.data.shareToken) : response.data.shareUrl;
      setShareUrl(formattedUrl);
      return formattedUrl;
    } catch (cause: unknown) {
      const message = getErrorMessage(cause, 'Failed to generate share link'); setError(message); throw new Error(message);
    } finally { setGenerating(false); }
  }, []);
  const viewSharedWishlist = useCallback(async (shareToken: string): Promise<Wishlist> => {
    setGenerating(true); setError(null);
    try {
      const response = await viewSharedWishlistAction(null, { shareToken });
      if (!response.success || !response.wishlist) throw new Error(response.error || 'Failed to view shared wishlist');
      return response.wishlist;
    } catch (cause: unknown) {
      const message = getErrorMessage(cause, 'Failed to view shared wishlist'); setError(message); throw new Error(message);
    } finally { setGenerating(false); }
  }, []);
  return { shareUrl, generating, error, generateShareLink, viewSharedWishlist, clearError: () => setError(null) };
}
