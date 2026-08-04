import type { CuratedCollection } from '@/lib/api/types/collections';
import {
  getCollectionDisplayName,
  getCollectionProductCount,
} from '@/lib/utils/collections';

export function FeaturedCuratedCollection({
  collection,
}: {
  collection: CuratedCollection;
}) {
  const imageUrl = collection.mainProduct?.imageUrl || collection.mainProduct?.images?.[0];

  return (
    <div className="overflow-hidden rounded-card border border-border bg-bg-surface shadow-card">
      <div className="flex w-full flex-col lg:flex-row">
        <div className="w-full lg:w-2/3">
          <div className="relative aspect-[4/3] w-full bg-bg-skeleton">
            <div
              className="absolute inset-0 bg-cover bg-center"
              style={{
                backgroundImage: imageUrl ? `url('${imageUrl}')` : undefined,
              }}
              role="img"
              aria-label={collection.name}
            />
          </div>
        </div>
        <div className="flex w-full flex-col justify-center gap-6 p-8 lg:w-1/3">
          <div>
            <span className="inline-flex rounded-tag bg-bg-sunken px-3 py-1 text-xs font-semibold uppercase tracking-wide text-primary">
              Curated
            </span>
            <h2 className="mt-4 text-3xl font-semibold text-heading">
              {getCollectionDisplayName(collection)}
            </h2>
          </div>
          {collection.description ? (
            <p className="text-sm text-text-muted">
              {collection.description}
            </p>
          ) : null}
          <div>
            <button
              type="button"
              className="inline-flex items-center justify-center rounded-button bg-cta-primary px-5 py-3 text-sm font-semibold text-on-primary transition-colors hover:bg-cta-primary-hover"
            >
              Shop the Look
            </button>
            <p className="mt-3 text-sm text-text-muted">
              {getCollectionProductCount(collection)} items available
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
