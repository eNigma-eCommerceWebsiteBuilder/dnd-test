'use client';

import { useTransition } from 'react';
import { cn } from '@/lib/utils/cn';
import { useToast } from '@/lib/hooks';
import { useWishlistBulk } from '@/lib/hooks';

interface MoveAllToCartButtonProps {
  className?: string;
  disabled?: boolean;
}

export function MoveAllToCartButton({ className, disabled }: MoveAllToCartButtonProps) {
  const { success, error } = useToast();
  const { moveAllToCart, processing } = useWishlistBulk();
  const [isPending, startTransition] = useTransition();

  const handleMoveAll = () => {
    startTransition(async () => {
      try {
        const result = await moveAllToCart();
        success(result.message || 'Moved all items to cart');
      } catch {
        error('Failed to move all items to cart');
      }
    });
  };

  const isDisabled = Boolean(disabled) || processing || isPending;

  return (
    <button
      type="button"
      onClick={handleMoveAll}
      disabled={isDisabled}
      className={cn(
        '@container inline-flex items-center gap-2 bg-cta-secondary hover:bg-cta-secondary-hover text-on-secondary px-4 py-2 rounded-button text-sm font-semibold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-border-focus focus-visible:ring-offset-2 focus-visible:ring-offset-bg-surface disabled:opacity-50 disabled:cursor-not-allowed',
        className
      )}
    >
      <span className="material-symbols-outlined text-lg">all_inbox</span>
      Move All to Cart
    </button>
  );
}
