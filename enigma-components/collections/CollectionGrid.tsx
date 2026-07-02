/**
 * CollectionGrid Component
 *
 * Server Component displaying a responsive grid of collections.
 */

import type { Collection } from '@/lib/api/types/collections';
import { CollectionCard } from './CollectionCard';

interface CollectionGridProps {
  collections: Collection[];
  getHref?: (collection: Collection) => string | undefined;
}

export function CollectionGrid({ collections, getHref }: CollectionGridProps) {
  return (
    <div className="@container grid grid-cols-1 gap-8 @md:grid-cols-2 @lg:grid-cols-3">
      {collections.map((collection) => (
        <CollectionCard
          key={collection.id ?? collection._id ?? collection.slug ?? collection.name}
          collection={collection}
          href={getHref ? getHref(collection) : undefined}
        />
      ))}
    </div>
  );
}
