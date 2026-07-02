'use client';

import { useTransition } from 'react';
import { cn } from '@/lib/utils/cn';
import { useToast } from '@/lib/hooks';
import { useWishlistItem } from '@/lib/hooks';

interface MoveToCartButtonProps {
  productId: string;
  variantId?: string;
  quantity?: number;
  productName?: string;
  price?: number;
  className?: string;
  disabled?: boolean;
}

export function MoveToCartButton({
  productId,
  variantId,
  quantity = 1,
  className,
  disabled,
}: MoveToCartButtonProps) {
  const { success, error } = useToast();
  const { moveToCart, loading } = useWishlistItem();
  const [isPending, startTransition] = useTransition();

  const handleMove = () => {
    startTransition(async () => {
      try {
        await moveToCart(productId, variantId, quantity);
        success('Moved to cart');
      } catch {
        error('Failed to move to cart');
      }
    });
  };

  const isDisabled = Boolean(disabled) || isPending || loading;

  return (
    <button
      type="button"
      onClick={handleMove}
      disabled={isDisabled}
      aria-disabled={isDisabled}
      className={cn(
        '@container w-full bg-cta-primary hover:bg-cta-primary-hover text-on-primary font-semibold py-3 rounded-button transition-colors inline-flex items-center justify-center gap-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-border-focus focus-visible:ring-offset-2 focus-visible:ring-offset-bg-surface disabled:opacity-50 disabled:cursor-not-allowed',
        className
      )}
    >
      <span className="material-symbols-outlined text-lg">shopping_cart</span>
      Move to Cart
    </button>
  );
}
