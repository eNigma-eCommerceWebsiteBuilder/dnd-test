'use client';

import { useState, useTransition } from 'react';
import { AnalyticsEventType } from '@/lib/api/types/analytics';
import { useAnalytics } from '@/lib/analytics';
import { cn } from '@/lib/utils/cn';
import { useCart, useToast } from '@/lib/hooks';

interface AddToCartButtonProps {
  productId: string;
  quantity?: number;
  disabled?: boolean;
  inStock?: boolean;
  label?: string;
  className?: string;
}

export function AddToCartButton({
  productId,
  quantity = 1,
  disabled = false,
  inStock = true,
  label = 'Add to Cart',
  className,
}: AddToCartButtonProps) {
  const { addItem } = useCart(false);
  const { trackEvent } = useAnalytics();
  const { success, error: showError } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [isPending, startTransition] = useTransition();

  const isDisabled = disabled || !inStock || isLoading || isPending;

  const handleAddToCart = () => {
    if (isDisabled) return;

    setIsLoading(true);
    startTransition(async () => {
      try {
        await addItem(productId, quantity);
        success('Added to cart');
        void trackEvent(AnalyticsEventType.ADD_TO_CART, {
          productId,
          quantity,
        });
      } catch {
        showError('Failed to add to cart');
      } finally {
        setIsLoading(false);
      }
    });
  };

  return (
    <button
      type="button"
      onClick={handleAddToCart}
      disabled={isDisabled}
      className={cn(
        '@container inline-flex w-full items-center justify-center gap-2 rounded-button bg-cta-primary px-5 py-3 text-sm font-semibold text-on-primary transition-colors hover:bg-cta-primary-hover',
        'disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:bg-cta-primary',
        className
      )}
      aria-busy={isLoading || isPending}
    >
      {isLoading || isPending ? (
        <>
          <span className="material-symbols-outlined animate-spin text-base">
            progress_activity
          </span>
          Adding...
        </>
      ) : !inStock ? (
        'Out of Stock'
      ) : (
        <>
          <span className="material-symbols-outlined">shopping_cart</span>
          {label}
        </>
      )}
    </button>
  );
}

export default AddToCartButton;
