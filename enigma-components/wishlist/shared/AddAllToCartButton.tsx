'use client';

import { useMemo, useState, useTransition } from 'react';
import type { WishlistItem } from '@/lib/api/types/wishlist';
import { useCart, useToast } from '@/lib/hooks';
import { cn } from '@/lib/utils/cn';

interface AddAllToCartButtonProps {
  items: WishlistItem[];
  className?: string;
}

export function AddAllToCartButton({ items, className }: AddAllToCartButtonProps) {
  const { addItem } = useCart(false);
  const { success, error: showError } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [isPending, startTransition] = useTransition();

  const validItems = useMemo(
    () => items.filter((item) => Boolean(item.productId)),
    [items]
  );

  const isDisabled = isLoading || isPending || validItems.length === 0;

  const handleAddAll = () => {
    if (isDisabled) return;

    setIsLoading(true);
    startTransition(async () => {
      try {
        const results = await Promise.allSettled(
          validItems.map((item) => addItem(item.productId, 1, item.variantId))
        );

        const failedCount = results.filter((result) => result.status === 'rejected').length;

        if (failedCount > 0) {
          showError(failedCount === validItems.length ? 'Failed to add items to cart' : 'Some items could not be added.');
          return;
        }

        success('All items added to cart');
      } catch {
        showError('Failed to add items to cart');
      } finally {
        setIsLoading(false);
      }
    });
  };

  return (
    <button
      type="button"
      onClick={handleAddAll}
      disabled={isDisabled}
      className={cn(
        '@container inline-flex w-full items-center justify-center gap-2 rounded-button bg-cta-primary px-6 py-3 text-sm font-semibold text-on-primary transition-colors hover:bg-cta-primary-hover',
        'disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:bg-cta-primary',
        className
      )}
      aria-busy={isLoading || isPending}
    >
      {isLoading || isPending ? 'Adding items...' : 'Add All to Cart'}
    </button>
  );
}
