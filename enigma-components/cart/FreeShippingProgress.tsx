'use client';

import { formatPrice, calculateCartSubtotal } from '@/lib/utils';
import { cn } from '@/lib/utils/cn';
import type { CartItem } from '@/lib/hooks';

interface FreeShippingProgressProps {
    currentTotal?: number;
    items?: CartItem[];
    threshold?: number;
    className?: string;
}

// Default free shipping threshold
const DEFAULT_FREE_SHIPPING_THRESHOLD = 100;

/**
 * FreeShippingProgress Component (Client)
 * 
 * Shows progress bar toward free shipping threshold.
 * Uses calculateCartSubtotal from lib/utils.
 * Uses @container queries for responsive layout.
 * Uses theme variables from tailwind.config.ts
 */
export function FreeShippingProgress({
    currentTotal,
    items = [],
    threshold = DEFAULT_FREE_SHIPPING_THRESHOLD,
    className
}: FreeShippingProgressProps) {
    // Use lib utility for subtotal if items provided, otherwise use currentTotal
    const total = currentTotal ?? calculateCartSubtotal(items.map(item => ({
        productId: item.productId,
        price: item.price,
        quantity: item.quantity
    })));

    const progress = Math.min((total / threshold) * 100, 100);
    const remaining = Math.max(threshold - total, 0);
    const hasAchieved = remaining <= 0;

    return (
        <div className={cn(
            "@container bg-bg-surface p-4 @sm:p-6 rounded-card border border-border",
            className
        )}>
            <div className="flex justify-between items-center mb-2 @sm:mb-3">
                <div className="flex items-center gap-2">
                    <span className="material-symbols-outlined text-primary text-lg @sm:text-xl">
                        local_shipping
                    </span>
                    <p className="text-xs @sm:text-sm font-medium text-text-base">
                        Free Shipping Progress
                    </p>
                </div>
                <p className="text-xs @sm:text-sm font-bold text-primary">
                    {Math.round(progress)}%
                </p>
            </div>

            {/* Progress bar */}
            <div className="w-full bg-bg-sunken h-1.5 @sm:h-2 rounded-full overflow-hidden">
                <div
                    className="bg-primary h-full transition-all duration-500 ease-out"
                    style={{ width: `${progress}%` }}
                />
            </div>

            {/* Message */}
            <p className="mt-2 @sm:mt-3 text-[10px] @sm:text-xs text-text-muted">
                {hasAchieved ? (
                    <span className="text-success font-medium">
                        You&apos;ve unlocked free shipping!
                    </span>
                ) : (
                    <>
                        <span>You&apos;re </span>
                        <span className="font-bold text-text-base">
                            {formatPrice(remaining)}
                        </span>
                        <span> away from free shipping.</span>
                    </>
                )}
            </p>
        </div>
    );
}

export default FreeShippingProgress;
