/**
 * CollectionCard Component
 *
 * Server Component displaying a collection preview.
 * Follows PAGE_AND_COMPONENTS_PLAN.md container query pattern.
 */

import Link from 'next/link';
import type { Collection } from '@/lib/api/types/collections';
import {
  getCollectionDisplayName,
  getCollectionProductCount,
  isCuratedCollection,
  isInspirationCollection,
} from '@/lib/utils/collections';

interface CollectionCardProps {
  collection: Collection;
  href?: string;
}

export function CollectionCard({ collection, href }: CollectionCardProps) {
  const name = getCollectionDisplayName(collection);
  const count = getCollectionProductCount(collection);

  const imageUrl = isInspirationCollection(collection)
    ? collection.mainImage?.imageUrl
    : isCuratedCollection(collection)
      ? collection.mainProduct?.imageUrl || collection.mainProduct?.images?.[0]
      : undefined;

  const cardContent = (
    <>
      <div className="relative aspect-[4/5] w-full overflow-hidden rounded-card bg-bg-skeleton">
        {imageUrl ? (
          <div
            className="absolute inset-0 bg-cover bg-center transition-transform duration-500 group-hover:scale-110"
            style={{ backgroundImage: `url('${imageUrl}')` }}
            role="img"
            aria-label={name}
          />
        ) : null}
        <div className="absolute inset-0 bg-primary/0 transition-colors duration-300 group-hover:bg-primary/10" />
      </div>
      <div className="mt-4 flex items-end justify-between gap-4">
        <div>
          <h3 className="text-lg font-semibold text-text-base transition-colors group-hover:text-primary">
            {name}
          </h3>
          <p className="mt-1 text-sm text-text-muted">
            {count.toLocaleString()} Items
          </p>
        </div>
        <span className="material-symbols-outlined text-text-lighter transition-colors group-hover:text-primary">
          arrow_right_alt
        </span>
      </div>
    </>
  );

  if (href) {
    return (
      <Link href={href} className="@container group block w-full">
        {cardContent}
      </Link>
    );
  }

  return <div className="@container group w-full">{cardContent}</div>;
}
