export function DownloadPageSkeleton() {
  return (
    <main className="@container min-h-screen w-full bg-bg-base text-text-base">
      <header className="sticky top-0 z-sticky border-b border-border bg-bg-surface/70 backdrop-blur-nav">
        <div className="mx-auto flex w-full max-w-[1200px] items-center justify-between px-4 py-4 @sm:px-6 @lg:px-12">
          <div className="h-8 w-32 rounded-card bg-bg-skeleton animate-skeleton" />
          <div className="hidden h-6 w-60 rounded-card bg-bg-skeleton animate-skeleton @md:block" />
          <div className="h-10 w-20 rounded-card bg-bg-skeleton animate-skeleton" />
        </div>
      </header>

      <div className="mx-auto flex w-full max-w-[960px] flex-col gap-8 px-4 py-8 @sm:px-6 @lg:px-10">
        <div className="h-20 rounded-card bg-bg-skeleton animate-skeleton" />
        <section className="rounded-card border border-border bg-bg-surface p-6 shadow-card">
          <div className="h-6 w-48 rounded-card bg-bg-skeleton animate-skeleton" />
          <div className="mt-4 grid gap-4 @md:grid-cols-2">
            <div className="h-40 rounded-card bg-bg-skeleton animate-skeleton" />
            <div className="h-40 rounded-card bg-bg-skeleton animate-skeleton" />
          </div>
        </section>
        <section className="rounded-card border border-border bg-bg-surface p-6 shadow-card">
          <div className="h-6 w-40 rounded-card bg-bg-skeleton animate-skeleton" />
          <div className="mt-4 grid gap-4 @md:grid-cols-3">
            <div className="h-24 rounded-card bg-bg-skeleton animate-skeleton" />
            <div className="h-24 rounded-card bg-bg-skeleton animate-skeleton" />
            <div className="h-24 rounded-card bg-bg-skeleton animate-skeleton" />
          </div>
        </section>
        <section className="rounded-card border border-border bg-bg-surface p-6 shadow-card">
          <div className="h-20 rounded-card bg-bg-skeleton animate-skeleton" />
        </section>
      </div>
    </main>
  );
}
