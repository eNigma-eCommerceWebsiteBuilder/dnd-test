export function CollectionDetailNotFound() {
  return (
    <main className="min-h-screen w-full bg-bg-base text-text-base">
      <section className="border-b border-border py-12">
        <div className="mx-auto w-full max-w-[1440px] px-6 lg:px-12">
          <h1 className="text-3xl font-heading font-bold text-heading">
            Collection Not Found
          </h1>
          <p className="mt-2 text-sm text-text-muted">
            We couldn&apos;t find the collection you&apos;re looking for.
          </p>
        </div>
      </section>
    </main>
  );
}
