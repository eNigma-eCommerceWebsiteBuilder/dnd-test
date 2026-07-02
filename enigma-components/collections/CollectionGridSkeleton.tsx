/**
 * CollectionGridSkeleton Component
 *
 * Server Component rendering a skeleton grid layout.
 */

interface CollectionGridSkeletonProps {
  items?: number;
}

export function CollectionGridSkeleton({ items = 6 }: CollectionGridSkeletonProps) {
  return (
    <div className="@container grid grid-cols-1 gap-8 @md:grid-cols-2 @lg:grid-cols-3">
      {Array.from({ length: items }).map((_, index) => (
        <div
          key={`collection-skeleton-${index}`}
          className="w-full animate-skeleton"
        >
          <div className="aspect-[4/5] w-full rounded-card bg-bg-skeleton" />
          <div className="mt-4 h-4 w-2/3 rounded-input bg-bg-skeleton" />
          <div className="mt-2 h-3 w-1/3 rounded-input bg-bg-skeleton" />
        </div>
      ))}
    </div>
  );
}
