import { cache } from 'react';
import {
  fetchCollections,
  fetchCuratedCollections,
  fetchInspirationCollection,
} from '@/lib/api/services/collections';
import type { Collection, CuratedCollection, InspirationCollection } from '@/lib/api/types/collections';
import {
  isCuratedCollection,
  isInspirationCollection,
  sortCollections,
} from '@/lib/utils/collections';

export interface CollectionsRuntimeData {
  collections: Collection[];
  sortedCollections: Collection[];
  curatedCollections: CuratedCollection[];
  featuredCurated?: CuratedCollection;
  inspirationCollection: InspirationCollection | null;
  curatedCount: number;
  inspirationCount: number;
  hasCollections: boolean;
  hasCurated: boolean;
  hasInspiration: boolean;
  hasFeaturedCurated: boolean;
}

async function withFallback<T>(request: Promise<T>, fallback: T): Promise<T> {
  try {
    return await request;
  } catch {
    return fallback;
  }
}

async function withNull<T>(request: Promise<T>): Promise<T | null> {
  return withFallback(request, null);
}

const loadCollectionsRuntime = cache(async (): Promise<CollectionsRuntimeData> => {
  const [collections, curatedCollections, inspirationCollection] = await Promise.all([
    withFallback<Collection[]>(fetchCollections(), []),
    withFallback<CuratedCollection[]>(fetchCuratedCollections(), []),
    withNull<InspirationCollection>(fetchInspirationCollection()),
  ]);
  const sortedCollections = sortCollections(collections);
  const curatedFromAll = sortedCollections.filter(isCuratedCollection);
  const inspirationFromAll = sortedCollections.filter(isInspirationCollection);
  const featuredCurated = curatedCollections[0] ?? curatedFromAll[0];

  return {
    collections,
    sortedCollections,
    curatedCollections,
    featuredCurated,
    inspirationCollection,
    curatedCount: curatedFromAll.length,
    inspirationCount: inspirationFromAll.length,
    hasCollections: sortedCollections.length > 0,
    hasCurated: curatedCollections.length > 0,
    hasInspiration: Boolean(inspirationCollection),
    hasFeaturedCurated: curatedCollections.length > 0 && Boolean(featuredCurated),
  };
});

export function loadCollectionsRuntimeData(): Promise<CollectionsRuntimeData> {
  return loadCollectionsRuntime();
}
