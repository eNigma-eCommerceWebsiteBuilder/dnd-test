'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useCart, useToast } from '@/lib/hooks';
import { cn } from '@/lib/utils/cn';
import { ROUTES } from '@/lib/utils';
import type { OrderItem } from '@/lib/api/types';

/**
 * ReorderButton Component (Client)
 * 
 * Adds all items from order to cart and redirects to cart.
 */
interface ReorderButtonProps {
    items: OrderItem[];
    className?: string;
}

export function ReorderButton({ items, className }: ReorderButtonProps) {
    const router = useRouter();
    const { addItem } = useCart(false);
    const { success, error } = useToast();
    const [isPending, setIsPending] = useState(false);

    const handleReorder = async () => {
        setIsPending(true);
        let successCount = 0;
        let failCount = 0;

        try {
            // Add items sequentially to avoid race conditions/overwhelming API
            for (const item of items) {
                try {
                    await addItem(item.productId, item.quantity, item.variantId);
                    successCount++;
                } catch {
                    failCount++;
                }
            }

            if (successCount > 0) {
                success(`Successfully added ${successCount} item${successCount !== 1 ? 's' : ''} to your cart.`, {
                    title: 'Items Added to Cart'
                });
                router.push(ROUTES.CART);
            } else if (failCount > 0) {
                error('Could not add items to cart. They may be out of stock.', {
                    title: 'Reorder Failed'
                });
            }
        } catch {
            error('Failed to process reorder request', {
                title: 'Error'
            });
        } finally {
            setIsPending(false);
        }
    };

    return (
        <button
            type="button"
            onClick={handleReorder}
            disabled={isPending}
            className={cn(
                "@container inline-flex items-center gap-2 rounded-button bg-cta-primary px-4 py-2 text-sm font-semibold text-on-primary shadow-button transition-all duration-normal hover:bg-cta-primary-hover hover:shadow-button-hover",
                isPending && "cursor-not-allowed opacity-disabled",
                className
            )}
        >
            {isPending ? (
                <>
                    <span className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                    Adding...
                </>
            ) : (
                <>
                    <span className="material-symbols-outlined text-lg">autorenew</span>
                    Buy Again
                </>
            )}
        </button>
    );
}
