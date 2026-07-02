import { ReactNode } from 'react';

interface SharedWishlistHeaderProps {
  title: string;
  itemCount: number;
  lastUpdated?: string | null;
  actions?: ReactNode;
}

export function SharedWishlistHeader({
  title,
  itemCount,
  lastUpdated,
  actions,
}: SharedWishlistHeaderProps) {
  const updatedLabel = lastUpdated
    ? new Date(lastUpdated).toLocaleDateString()
    : null;

  return (
    <section className="@container w-full border-b border-border pb-10">
      <div className="flex flex-col @md:flex-row @md:items-end @md:justify-between gap-6">
        <div className="w-full">
          <div className="flex flex-wrap items-center gap-2 text-sm text-text-muted">
            <span className="rounded-badge bg-primary/10 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-primary">
              Public List
            </span>
            <span>{itemCount} items</span>
            {updatedLabel ? <span>• Updated {updatedLabel}</span> : null}
          </div>
          <h1 className="mt-4 text-3xl font-heading font-bold text-heading @md:text-4xl">
            {title}
          </h1>
        </div>

        {actions ? (
          <div className="w-full @md:w-auto">
            {actions}
          </div>
        ) : null}
      </div>
    </section>
  );
}
