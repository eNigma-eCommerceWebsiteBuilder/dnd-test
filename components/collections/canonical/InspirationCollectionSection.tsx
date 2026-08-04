import type { InspirationCollection } from '@/lib/api/types/collections';
import {
  getCollectionDisplayName,
  getCollectionProductCount,
} from '@/lib/utils/collections';

export function InspirationCollectionSection({
  collection,
}: {
  collection: InspirationCollection;
}) {
  const inspirationName = getCollectionDisplayName(collection);
  const inspirationCount = getCollectionProductCount(collection);

  return (
    <>
      <div className="mb-6">
        <h2 className="text-3xl font-semibold text-heading">
          {inspirationName}
        </h2>
        <p className="mt-2 text-sm text-text-muted">
          {inspirationCount} items curated for inspiration
        </p>
      </div>
      <div className="overflow-hidden rounded-card border border-border bg-bg-surface shadow-card">
        <div className="relative aspect-[21/9] w-full bg-bg-skeleton">
          <div
            className="absolute inset-0 bg-cover bg-center"
            style={{
              backgroundImage: collection.mainImage?.imageUrl
                ? `url('${collection.mainImage.imageUrl}')`
                : undefined,
            }}
            role="img"
            aria-label={collection.mainImage?.alt || inspirationName}
          />
        </div>
        <div className="flex flex-col gap-3 border-t border-border p-6 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-sm text-text-muted">
              {collection.subtitle || 'Explore the full story'}
            </p>
          </div>
          <button
            type="button"
            className="inline-flex items-center justify-center rounded-button bg-cta-secondary px-4 py-2 text-sm font-semibold text-on-secondary transition-colors hover:bg-cta-secondary-hover"
          >
            {collection.mainImage?.ctaText || 'View Collection'}
          </button>
        </div>
      </div>
    </>
  );
}
