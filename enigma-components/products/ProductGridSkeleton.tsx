'use client';

import { cn } from '@/lib/utils/cn';

interface ProductGridSkeletonProps {
    count?: number;
    className?: string;
}

/**
 * ProductGridSkeleton Component
 * 
 * Loading skeleton for product grid, matches ProductGrid layout.
 * Uses theme-aware skeleton colors from tailwind.config.ts.
 */
export function ProductGridSkeleton({ count = 6, className }: ProductGridSkeletonProps) {
    return (
        <div
            className={cn(
                "@container",
                "grid grid-cols-1 @sm:grid-cols-2 @lg:grid-cols-3 @2xl:grid-cols-4",
                "gap-6 @md:gap-8 @xl:gap-10",
                className
            )}
        >
            {Array.from({ length: count }).map((_, i) => (
                <div key={i} className="animate-pulse">
                    {/* Image Skeleton */}
                    <div className="aspect-[3/4] rounded-card bg-bg-skeleton mb-4 @md:mb-6" />

                    {/* Title Skeleton */}
                    <div className="h-5 bg-bg-skeleton rounded w-3/4 mb-2" />

                    {/* Subtitle Skeleton */}
                    <div className="h-4 bg-bg-skeleton rounded w-1/2 mb-2" />

                    {/* Rating Skeleton */}
                    <div className="flex items-center gap-2 mb-2">
                        <div className="h-4 w-4 bg-bg-skeleton rounded-full" />
                        <div className="h-3 bg-bg-skeleton rounded w-12" />
                    </div>

                    {/* Price Skeleton */}
                    <div className="h-6 bg-bg-skeleton rounded w-20 mt-2" />
                </div>
            ))}
        </div>
    );
}

export default ProductGridSkeleton;
