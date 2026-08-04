export function SharedWishlistInvalidState() {
  return (
    <main className="min-h-screen w-full bg-bg-base text-text-base">
      <section className="mx-auto w-full max-w-[1440px] px-6 py-16 lg:px-12">
        <div className="rounded-card border border-border bg-bg-surface p-8 text-center">
          <h1 className="text-2xl font-heading font-bold text-heading">
            Shared wishlist not found
          </h1>
          <p className="mt-3 text-text-muted">
            The share link is invalid or no longer available.
          </p>
        </div>
      </section>
    </main>
  );
}
