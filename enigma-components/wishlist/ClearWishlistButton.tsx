'use client';

import { useTransition } from 'react';
import { cn } from '@/lib/utils/cn';
import { useToast } from '@/lib/hooks';
import { useWishlist } from '@/lib/hooks';

interface ClearWishlistButtonProps {
  className?: string;
  disabled?: boolean;
}

export function ClearWishlistButton({ className, disabled }: ClearWishlistButtonProps) {
  const { success, error } = useToast();
  const { clearWishlist } = useWishlist(false);
  const [isPending, startTransition] = useTransition();

  const handleClear = () => {
    startTransition(async () => {
      try {
        await clearWishlist();
        success('Wishlist cleared');
      } catch {
        error('Failed to clear wishlist');
      }
    });
  };

  const isDisabled = Boolean(disabled) || isPending;

  return (
    <button
      type="button"
      onClick={handleClear}
      disabled={isDisabled}
      className={cn(
        '@container inline-flex items-center gap-2 text-text-muted hover:text-danger px-4 py-2 text-sm font-semibold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-border-focus focus-visible:ring-offset-2 focus-visible:ring-offset-bg-surface disabled:opacity-50 disabled:cursor-not-allowed',
        className
      )}
    >
      <span className="material-symbols-outlined text-lg">delete</span>
      Clear Wishlist
    </button>
  );
}
