'use client';

import { useTransition } from 'react';
import { cn } from '@/lib/utils/cn';
import { useToast, useWishlist } from '@/lib/hooks';
import { useWishlistStore } from '@/lib/stores/wishlist-store';

interface WishlistButtonProps {
    productId: string;
    variantId?: string;
    initialWishlisted?: boolean;
    className?: string;
}

export function WishlistButton({
    productId,
    variantId,
    initialWishlisted = false,
    className
}: WishlistButtonProps) {
    const { addItem, removeItem, isInWishlist } = useWishlist();
    const loaded = useWishlistStore((state) => state.loaded);
    const [isPending, startTransition] = useTransition();
    const { success, error: showError } = useToast();
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
                "@container rounded-button border border-border p-4",
                "hover:bg-bg-hover transition-colors",
                "disabled:opacity-disabled",
                className
            )}
            aria-label={isWishlisted ? 'Remove from wishlist' : 'Add to wishlist'}
            aria-pressed={isWishlisted}
        >
            <span
                className={cn(
                    "material-symbols-outlined text-xl transition-colors",
                    isWishlisted ? "text-danger" : "text-text-muted"
                )}
                style={{ fontVariationSettings: isWishlisted ? "'FILL' 1" : "'FILL' 0" }}
            >
                favorite
            </span>
        </button>
    );
}

export default WishlistButton;
