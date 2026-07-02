'use client';

import { useTransition } from 'react';
import { cn } from '@/lib/utils/cn';
import { useToast } from '@/lib/hooks';
import { useWishlist } from '@/lib/hooks';

interface RemoveButtonProps {
  productId: string;
  variantId?: string;
  className?: string;
}

export function RemoveButton({ productId, variantId, className }: RemoveButtonProps) {
  const { success, error } = useToast();
  const { removeItem } = useWishlist(false);
  const [isPending, startTransition] = useTransition();

  const handleRemove = () => {
    startTransition(async () => {
      try {
        await removeItem(productId, variantId);
        success('Removed from wishlist');
      } catch {
        error('Failed to remove from wishlist');
      }
    });
  };

  return (
    <button
      type="button"
      onClick={handleRemove}
      disabled={isPending}
      className={cn(
        '@container inline-flex items-center justify-center w-10 h-10 rounded-full bg-bg-elevated border border-border shadow-card text-danger transition-colors hover:bg-bg-hover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-border-focus focus-visible:ring-offset-2 focus-visible:ring-offset-bg-surface disabled:opacity-50 disabled:cursor-not-allowed',
        className
      )}
      aria-label="Remove from wishlist"
    >
      <span className="material-symbols-outlined text-base">delete</span>
    </button>
  );
}
