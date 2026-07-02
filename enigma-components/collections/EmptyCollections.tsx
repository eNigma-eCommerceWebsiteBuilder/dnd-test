/**
 * EmptyCollections Component
 *
 * Server Component for empty state messaging.
 */

export function EmptyCollections() {
  return (
    <section className="@container flex w-full flex-col items-center justify-center rounded-card border border-border bg-bg-surface px-6 py-12 text-center">
      <div className="flex size-16 items-center justify-center rounded-full bg-bg-sunken text-primary">
        <span className="material-symbols-outlined text-3xl">inventory_2</span>
      </div>
      <h2 className="mt-6 text-2xl font-semibold text-text-base">
        No collections found
      </h2>
      <p className="mt-3 max-w-md text-sm text-text-muted">
        Try adjusting your filters to find available collections.
      </p>
      <button
        type="button"
        className="mt-6 inline-flex items-center justify-center rounded-button bg-cta-primary px-5 py-2 text-sm font-semibold text-on-primary transition-colors hover:bg-cta-primary-hover"
      >
        Clear filters
      </button>
    </section>
  );
}
