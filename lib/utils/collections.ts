import type { Collection, CuratedCollection, InspirationCollection } from '@/lib/api/types/collections';

export function isCuratedCollection(
  collection: Collection | null,
): collection is CuratedCollection {
  return collection?.type === 'curated';
}

export function isInspirationCollection(
  collection: Collection | null,
): collection is InspirationCollection {
  return collection?.type === 'inspiration';
}

export function getCollectionDisplayName(collection: Collection | null): string {
  if (!collection) return '';
  return isInspirationCollection(collection)
    ? collection.title || collection.name || 'Inspiration'
    : collection.name || 'Collection';
}

export function getCollectionProductCount(collection: Collection | null): number {
  if (!collection) return 0;
  return isCuratedCollection(collection)
    ? 1 + (collection.relatedProducts?.length || 0)
    : collection.products?.length || 0;
}

export function sortCollections<T extends Collection>(collections: T[]): T[] {
  return [...collections].sort((a, b) => {
    const aOrder = 'sortOrder' in a && typeof a.sortOrder === 'number' ? a.sortOrder : 0;
    const bOrder = 'sortOrder' in b && typeof b.sortOrder === 'number' ? b.sortOrder : 0;
    return aOrder - bOrder;
  });
}
