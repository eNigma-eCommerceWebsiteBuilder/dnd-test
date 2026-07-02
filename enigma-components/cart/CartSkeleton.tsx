import { cn } from '@/lib/utils/cn';

interface CartSkeletonProps {
    className?: string;
}

/**
 * CartSkeleton Component (Server)
 * 
 * Loading skeleton that mimics the cart page layout.
 * Uses @container queries for responsive layout.
 * Uses theme variables from tailwind.config.ts
 */
export function CartSkeleton({ className }: CartSkeletonProps) {
    return (
        <div className={cn("@container", className)}>
            <div className="max-w-7xl mx-auto px-4 @sm:px-6 py-8 @sm:py-12">
                {/* Header Skeleton */}
                <div className="mb-6 @sm:mb-8 @md:mb-10">
                    <div className="h-8 @sm:h-10 bg-bg-skeleton rounded-card w-48 @sm:w-64 animate-pulse" />
                </div>

                {/* Main Grid */}
                <div className="grid grid-cols-1 @lg:grid-cols-3 gap-6 @sm:gap-8 @md:gap-10">
                    {/* Cart Items Column */}
                    <div className="@lg:col-span-2 space-y-6 @sm:space-y-8">
                        {/* Free Shipping Progress Skeleton */}
                        <div className="bg-bg-surface rounded-card border border-border p-4 @sm:p-6">
                            <div className="flex items-center gap-2 @sm:gap-3 mb-3 @sm:mb-4">
                                <div className="w-5 @sm:w-6 h-5 @sm:h-6 bg-bg-skeleton rounded-badge animate-pulse" />
                                <div className="h-4 @sm:h-5 bg-bg-skeleton rounded-badge w-32 @sm:w-40 animate-pulse" />
                            </div>
                            <div className="h-2 bg-bg-skeleton rounded-full animate-pulse" />
                        </div>

                        {/* Cart Items Skeleton */}
                        {[1, 2, 3].map((i) => (
                            <CartItemSkeleton key={i} />
                        ))}

                        {/* Continue Shopping Skeleton */}
                        <div className="pt-4 @sm:pt-6">
                            <div className="h-5 @sm:h-6 bg-bg-skeleton rounded-badge w-36 @sm:w-44 animate-pulse" />
                        </div>
                    </div>

                    {/* Summary Column */}
                    <div className="@lg:col-span-1">
                        <CartSummarySkeleton />
                    </div>
                </div>
            </div>
        </div>
    );
}

function CartItemSkeleton() {
    return (
        <div className="@container">
            <div className="flex flex-col @sm:flex-row gap-4 @sm:gap-6 py-6 @sm:py-8 border-b border-divider">
                {/* Image Skeleton */}
                <div className="w-full @sm:w-28 @md:w-32 h-32 @sm:h-36 @md:h-40 bg-bg-skeleton rounded-image animate-pulse" />

                {/* Details Skeleton */}
                <div className="flex-1 space-y-3 @sm:space-y-4">
                    <div className="h-5 @sm:h-6 bg-bg-skeleton rounded-badge w-3/4 animate-pulse" />
                    <div className="h-3 @sm:h-4 bg-bg-skeleton rounded-badge w-1/2 animate-pulse" />
                    <div className="h-4 @sm:h-5 bg-bg-skeleton rounded-badge w-20 @sm:w-24 animate-pulse" />
                    <div className="flex justify-between items-center mt-4 @sm:mt-6">
                        <div className="h-8 @sm:h-10 bg-bg-skeleton rounded-button w-24 @sm:w-28 animate-pulse" />
                        <div className="h-8 @sm:h-10 bg-bg-skeleton rounded-button w-16 @sm:w-20 animate-pulse" />
                    </div>
                </div>
            </div>
        </div>
    );
}

function CartSummarySkeleton() {
    return (
        <div className="@container bg-bg-surface rounded-card border border-border p-6 @sm:p-8">
            {/* Title */}
            <div className="h-6 @sm:h-7 bg-bg-skeleton rounded-badge w-32 @sm:w-40 mb-6 @sm:mb-8 animate-pulse" />

            {/* Summary Lines */}
            <div className="space-y-4 @sm:space-y-5 mb-6 @sm:mb-8">
                {[1, 2, 3].map((i) => (
                    <div key={i} className="flex justify-between">
                        <div className="h-4 bg-bg-skeleton rounded-badge w-20 @sm:w-24 animate-pulse" />
                        <div className="h-4 bg-bg-skeleton rounded-badge w-16 @sm:w-20 animate-pulse" />
                    </div>
                ))}
                <div className="pt-4 border-t border-divider flex justify-between">
                    <div className="h-5 @sm:h-6 bg-bg-skeleton rounded-badge w-16 @sm:w-20 animate-pulse" />
                    <div className="h-5 @sm:h-6 bg-bg-skeleton rounded-badge w-24 @sm:w-28 animate-pulse" />
                </div>
            </div>

            {/* Promo Code Skeleton */}
            <div className="mb-6 @sm:mb-8">
                <div className="h-10 @sm:h-12 bg-bg-skeleton rounded-input animate-pulse" />
            </div>

            {/* Checkout Button Skeleton */}
            <div className="h-12 @sm:h-14 bg-bg-skeleton rounded-button animate-pulse" />
        </div>
    );
}

export default CartSkeleton;
