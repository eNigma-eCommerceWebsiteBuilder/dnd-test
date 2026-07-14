export function SubscriptionsListSkeleton() {
  return (
    <div className="@container w-full space-y-6">
      <div className="flex flex-wrap gap-2">
        {Array.from({ length: 5 }).map((_, index) => (
          <div
            key={`subscription-filter-skeleton-${index}`}
            className="h-9 w-20 rounded-button bg-bg-skeleton animate-skeleton"
          />
        ))}
      </div>
      <div className="space-y-6">
        {Array.from({ length: 3 }).map((_, index) => (
          <div
            key={`subscription-card-skeleton-${index}`}
            className="rounded-card border border-border bg-bg-surface p-6 shadow-card"
          >
            <div className="flex flex-col gap-6 @md:flex-row @md:items-start @md:justify-between">
              <div className="space-y-3">
                <div className="h-4 w-36 rounded-card bg-bg-skeleton animate-skeleton" />
                <div className="h-4 w-24 rounded-card bg-bg-skeleton animate-skeleton" />
                <div className="h-5 w-40 rounded-card bg-bg-skeleton animate-skeleton" />
              </div>
              <div className="w-full @md:w-60 rounded-card border border-border bg-bg-surface p-4">
                <div className="h-4 w-24 rounded-card bg-bg-skeleton animate-skeleton" />
                <div className="mt-2 h-5 w-32 rounded-card bg-bg-skeleton animate-skeleton" />
                <div className="mt-4 h-4 w-16 rounded-card bg-bg-skeleton animate-skeleton" />
                <div className="mt-2 h-5 w-20 rounded-card bg-bg-skeleton animate-skeleton" />
              </div>
            </div>
            <div className="mt-6 border-t border-border pt-6 space-y-3">
              <div className="h-4 w-16 rounded-card bg-bg-skeleton animate-skeleton" />
              <div className="flex items-center justify-between gap-2">
                <div className="h-4 w-48 rounded-card bg-bg-skeleton animate-skeleton" />
                <div className="h-4 w-16 rounded-card bg-bg-skeleton animate-skeleton" />
              </div>
              <div className="flex items-center justify-between gap-2">
                <div className="h-4 w-40 rounded-card bg-bg-skeleton animate-skeleton" />
                <div className="h-4 w-16 rounded-card bg-bg-skeleton animate-skeleton" />
              </div>
            </div>
            <div className="mt-6 flex flex-wrap items-center justify-between gap-3">
              <div className="h-9 w-28 rounded-button bg-bg-skeleton animate-skeleton" />
              <div className="flex flex-wrap items-center gap-2">
                <div className="h-9 w-24 rounded-button bg-bg-skeleton animate-skeleton" />
                <div className="h-9 w-24 rounded-button bg-bg-skeleton animate-skeleton" />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
