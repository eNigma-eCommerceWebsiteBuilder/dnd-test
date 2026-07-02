export function SharedWishlistEmpty() {
  return (
    <section className="@container w-full">
      <div className="rounded-card border border-border bg-bg-surface p-8 text-center">
        <h2 className="text-xl font-heading font-bold text-heading">
          No items yet
        </h2>
        <p className="mt-2 text-text-muted">
          This shared wishlist is currently empty.
        </p>
      </div>
    </section>
  );
}
