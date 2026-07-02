import { cn } from '@/lib/utils/cn';

interface WishlistSkeletonProps {
  className?: string;
}

export function WishlistSkeleton({ className }: WishlistSkeletonProps) {
  return (
    <div className={cn('@container min-h-screen bg-bg-base text-text-base', className)}>
      <div className="mx-auto w-full max-w-[1440px] px-4 py-8 @sm:px-6 @md:py-12 @lg:px-12">
        <div className="mb-3 h-8 w-48 rounded-card bg-bg-skeleton animate-skeleton" />
        <div className="mb-8 h-4 w-64 rounded-card bg-bg-skeleton animate-skeleton" />

        <div className="mb-8 h-28 w-full rounded-card bg-bg-skeleton animate-skeleton" />
        <div className="mb-8 h-16 w-full rounded-card bg-bg-skeleton animate-skeleton" />

        <div className="grid grid-cols-1 gap-6 @sm:grid-cols-2 @lg:grid-cols-4">
          {Array.from({ length: 4 }).map((_, index) => (
            <div
              key={`wishlist-skeleton-${index}`}
              className="h-72 rounded-card bg-bg-skeleton animate-skeleton"
            />
          ))}
        </div>
      </div>
    </div>
  );
}
