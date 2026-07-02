import { ProductGridSkeleton } from '@/components/products/ProductGridSkeleton';

export function SearchSkeleton() {
  return (
    <main className="min-h-screen w-full bg-bg-base text-text-base animate-fade-in @container">
      <div className="mx-auto max-w-[1440px] px-6 py-8 @lg:px-12">
        <div className="mb-6 flex items-center gap-2">
          <div className="h-4 w-12 rounded bg-bg-skeleton animate-skeleton" />
          <div className="h-4 w-4 rounded bg-bg-skeleton animate-skeleton" />
          <div className="h-4 w-24 rounded bg-bg-skeleton animate-skeleton" />
        </div>

        <div className="mb-6">
          <div className="mb-3 h-10 w-80 rounded bg-bg-skeleton animate-skeleton" />
          <div className="h-5 w-32 rounded bg-bg-skeleton animate-skeleton" />
        </div>

        <div className="mb-6">
          <div className="flex gap-3">
            {[1, 2, 3].map((item) => (
              <div
                key={item}
                className="h-9 w-28 rounded-full bg-bg-skeleton animate-skeleton"
              />
            ))}
          </div>
        </div>

        <div className="mt-10 flex flex-col gap-8 @lg:flex-row @lg:gap-12">
          <aside className="w-full flex-shrink-0 @lg:w-[280px]">
            <div className="space-y-6">
              <div className="flex justify-between">
                <div className="h-6 w-16 rounded bg-bg-skeleton animate-skeleton" />
                <div className="h-5 w-14 rounded bg-bg-skeleton animate-skeleton" />
              </div>
              <div className="h-40 rounded-card bg-bg-skeleton animate-skeleton" />
              <div className="h-32 rounded-card bg-bg-skeleton animate-skeleton" />
              <div className="h-24 rounded-card bg-bg-skeleton animate-skeleton" />
            </div>
          </aside>

          <div className="flex-1">
            <div className="mb-8 flex items-center justify-between border-b border-border pb-4">
              <div className="h-5 w-24 rounded bg-bg-skeleton animate-skeleton" />
              <div className="h-8 w-32 rounded-button bg-bg-skeleton animate-skeleton" />
            </div>

            <ProductGridSkeleton count={12} />
          </div>
        </div>
      </div>
    </main>
  );
}

export default SearchSkeleton;
