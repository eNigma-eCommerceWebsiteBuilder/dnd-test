'use client';

import { useTransition } from 'react';
import { cn } from '@/lib/utils/cn';
import { useToast, useWishlist } from '@/lib/hooks';
import { useWishlistStore } from '@/lib/stores/wishlist-store';

interface WishlistButtonProps {
  productId: string;
  variantId?: string;
  className?: string;
  initialWishlisted?: boolean;
}

export function WishlistButton({
  productId,
  variantId,
  className,
  initialWishlisted = false,
}: WishlistButtonProps) {
  const { addItem, removeItem, isInWishlist } = useWishlist();
  const loaded = useWishlistStore((state) => state.loaded);
  const { success, error: showError } = useToast();
  const [isPending, startTransition] = useTransition();
  const isWishlisted = loaded ? isInWishlist(productId, variantId) : initialWishlisted;

  const handleToggle = () => {
    startTransition(async () => {
      try {
        if (isWishlisted) {
          await removeItem(productId, variantId);
          success('Removed from wishlist');
        } else {
          await addItem(productId, variantId);
          success('Added to wishlist');
        }
      } catch {
        showError('Failed to update wishlist');
      }
    });
  };

  return (
    <button
      type="button"
      onClick={handleToggle}
      disabled={isPending}
      className={cn(
        '@container inline-flex items-center justify-center rounded-button border border-border bg-bg-surface p-3 transition-colors hover:bg-bg-hover',
        'disabled:cursor-not-allowed disabled:opacity-50',
        className
      )}
      aria-label={isWishlisted ? 'Remove from wishlist' : 'Add to wishlist'}
      aria-pressed={isWishlisted}
    >
      <span
        className={cn(
          'material-symbols-outlined text-base transition-colors',
          isWishlisted ? 'text-danger' : 'text-text-muted'
        )}
        style={{ fontVariationSettings: isWishlisted ? "'FILL' 1" : "'FILL' 0" }}
      >
        favorite
      </span>
    </button>
  );
}

export default WishlistButton;
