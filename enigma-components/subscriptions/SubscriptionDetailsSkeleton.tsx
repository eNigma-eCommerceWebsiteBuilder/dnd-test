export function SubscriptionDetailsSkeleton() {
  return (
    <div className="@container w-full space-y-6">
      <div className="grid grid-cols-1 @lg:grid-cols-12 gap-6">
        <div className="@lg:col-span-8 space-y-6">
          <div className="rounded-card border border-border bg-bg-surface p-6">
            <div className="flex flex-col @md:flex-row @md:items-center gap-4">
              <div className="h-16 w-40 rounded-card bg-bg-skeleton animate-skeleton" />
              <div className="flex-1 space-y-3">
                <div className="h-5 w-48 rounded-card bg-bg-skeleton animate-skeleton" />
                <div className="h-4 w-36 rounded-card bg-bg-skeleton animate-skeleton" />
                <div className="h-4 w-64 rounded-card bg-bg-skeleton animate-skeleton" />
              </div>
            </div>
            <div className="mt-6 flex flex-wrap gap-3">
              <div className="h-10 w-32 rounded-button bg-bg-skeleton animate-skeleton" />
              <div className="h-10 w-40 rounded-button bg-bg-skeleton animate-skeleton" />
            </div>
          </div>

          <div className="rounded-card border border-border bg-bg-surface">
            <div className="flex items-center justify-between border-b border-border px-6 py-4">
              <div className="h-5 w-40 rounded-card bg-bg-skeleton animate-skeleton" />
              <div className="h-5 w-24 rounded-card bg-bg-skeleton animate-skeleton" />
            </div>
            <div className="p-6 space-y-5">
              {[1, 2].map((item) => (
                <div key={`subscription-item-skeleton-${item}`} className="flex items-center gap-4">
                  <div className="h-20 w-20 rounded-image bg-bg-skeleton animate-skeleton" />
                  <div className="flex-1 space-y-3">
                    <div className="h-4 w-40 rounded-card bg-bg-skeleton animate-skeleton" />
                    <div className="h-4 w-28 rounded-card bg-bg-skeleton animate-skeleton" />
                  </div>
                  <div className="h-4 w-16 rounded-card bg-bg-skeleton animate-skeleton" />
                </div>
              ))}
            </div>
            <div className="border-t border-border px-6 py-4">
              <div className="h-4 w-32 rounded-card bg-bg-skeleton animate-skeleton" />
            </div>
          </div>
        </div>

        <div className="@lg:col-span-4 space-y-6">
          <div className="rounded-card border border-border bg-bg-surface p-6 space-y-4">
            <div className="h-4 w-32 rounded-card bg-bg-skeleton animate-skeleton" />
            <div className="h-10 w-40 rounded-card bg-bg-skeleton animate-skeleton" />
            <div className="h-4 w-52 rounded-card bg-bg-skeleton animate-skeleton" />
          </div>

          <div className="rounded-card border border-border bg-bg-surface p-6 space-y-4">
            <div className="h-4 w-40 rounded-card bg-bg-skeleton animate-skeleton" />
            <div className="h-10 w-full rounded-card bg-bg-skeleton animate-skeleton" />
            <div className="h-4 w-24 rounded-card bg-bg-skeleton animate-skeleton" />
          </div>

          <div className="rounded-card border border-border bg-bg-surface p-6 space-y-4">
            <div className="h-4 w-32 rounded-card bg-bg-skeleton animate-skeleton" />
            {[1, 2, 3].map((item) => (
              <div key={`billing-attempt-skeleton-${item}`} className="flex items-center justify-between">
                <div className="space-y-2">
                  <div className="h-4 w-28 rounded-card bg-bg-skeleton animate-skeleton" />
                  <div className="h-3 w-20 rounded-card bg-bg-skeleton animate-skeleton" />
                </div>
                <div className="h-4 w-16 rounded-card bg-bg-skeleton animate-skeleton" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
