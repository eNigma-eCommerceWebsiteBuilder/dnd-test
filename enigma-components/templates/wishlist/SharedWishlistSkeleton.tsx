export function SharedWishlistSkeleton() {
  return (
    <main className="@container min-h-screen w-full bg-bg-base text-text-base">
      <div className="mx-auto w-full max-w-[1440px] px-6 py-12 @lg:px-12">
        <section className="@container w-full border-b border-border pb-10">
          <div className="flex flex-col gap-6 @md:flex-row @md:items-end @md:justify-between">
            <div className="w-full">
              <div className="flex flex-wrap items-center gap-2">
                <div className="h-6 w-24 rounded-badge bg-bg-skeleton animate-pulse" />
                <div className="h-4 w-20 rounded-input bg-bg-skeleton animate-pulse" />
                <div className="h-4 w-28 rounded-input bg-bg-skeleton animate-pulse" />
              </div>
              <div className="mt-4 h-10 w-72 rounded-input bg-bg-skeleton animate-pulse" />
            </div>
            <div className="h-12 w-40 rounded-button bg-bg-skeleton animate-pulse" />
          </div>
        </section>

        <section className="@container mt-10 w-full">
          <div className="grid grid-cols-1 gap-6 @md:grid-cols-2 @lg:grid-cols-4">
            {[0, 1, 2, 3, 4, 5, 6, 7].map((index) => (
              <div
                key={index}
                className="overflow-hidden rounded-card border border-border bg-bg-surface"
              >
                <div className="aspect-square w-full bg-bg-skeleton animate-pulse" />
                <div className="space-y-3 p-4">
                  <div className="h-4 w-24 rounded-input bg-bg-skeleton animate-pulse" />
                  <div className="h-5 w-3/4 rounded-input bg-bg-skeleton animate-pulse" />
                  <div className="h-4 w-1/2 rounded-input bg-bg-skeleton animate-pulse" />
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>
    </main>
  );
}
