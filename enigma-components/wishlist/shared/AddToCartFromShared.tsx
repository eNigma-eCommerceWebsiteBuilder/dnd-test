'use client';

import { useState, useTransition } from 'react';
import { useCart, useToast } from '@/lib/hooks';
import { cn } from '@/lib/utils/cn';

interface AddToCartFromSharedProps {
  productId: string;
  inStock?: boolean;
  label?: string;
  className?: string;
}

export function AddToCartFromShared({
  productId,
  inStock = true,
  label = 'Add to Cart',
  className,
}: AddToCartFromSharedProps) {
  const { addItem } = useCart(false);
  const { success, error: showError } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [isPending, startTransition] = useTransition();

  const isDisabled = isLoading || isPending || !inStock;

  const handleAddToCart = () => {
    if (isDisabled) return;

    setIsLoading(true);
    startTransition(async () => {
      try {
        await addItem(productId, 1);
        success('Added to cart');
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
        '@container inline-flex w-full items-center justify-center gap-2 rounded-button bg-cta-primary px-4 py-2 text-sm font-semibold text-on-primary transition-colors hover:bg-cta-primary-hover',
        'disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:bg-cta-primary',
        className
      )}
      aria-busy={isLoading || isPending}
    >
      {isLoading || isPending ? 'Adding...' : inStock ? label : 'Out of Stock'}
    </button>
  );
}
