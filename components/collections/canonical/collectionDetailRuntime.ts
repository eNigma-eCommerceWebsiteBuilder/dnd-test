import { cache } from 'react';
import {
  fetchCollections,
  fetchCuratedCollections,
  fetchInspirationCollection,
} from '@/lib/api/services/collections';
import type { Collection, CuratedCollection, InspirationCollection } from '@/lib/api/types/collections';
import { isCuratedCollection, isInspirationCollection } from '@/lib/utils/collections';
import { getRouteParam, getSearchParam, type PuckFetcherContext } from '@/lib/puck-route-metadata';

export interface CollectionDetailRuntimeData {
  slug?: string;
  collection: Collection | null;
  curatedCollection: CuratedCollection | null;
  inspirationDetail: InspirationCollection | null;
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

function matchesCollectionSlug(collection: Collection | null, slug: string): boolean {
  return Boolean(collection && (collection.slug === slug || collection._id === slug || collection.id === slug));
}

const loadBySlug = cache(async (slug: string): Promise<CollectionDetailRuntimeData> => {
  const [collections, curatedCollections, inspirationCollection] = await Promise.all([
    withFallback<Collection[]>(fetchCollections(), []),
    withFallback<CuratedCollection[]>(fetchCuratedCollections(), []),
    withNull<InspirationCollection>(fetchInspirationCollection()),
  ]);
  const collection = collections.find((entry) => matchesCollectionSlug(entry, slug)) ?? null;
  if (!collection) return { slug, collection: null, curatedCollection: null, inspirationDetail: null };

  const curatedFromAll = collections.filter(isCuratedCollection);
  const inspirationFromAll = collections.filter(isInspirationCollection);
  const curatedCollection = isCuratedCollection(collection)
    ? collection
    : curatedCollections.find((entry) => matchesCollectionSlug(entry, slug))
      || curatedFromAll.find((entry) => matchesCollectionSlug(entry, slug))
      || null;
  const inspirationFromFetch = inspirationCollection && matchesCollectionSlug(inspirationCollection, slug)
    ? inspirationCollection
    : null;
  const inspirationDetail = isInspirationCollection(collection)
    ? collection
    : inspirationFromFetch || inspirationFromAll.find((entry) => matchesCollectionSlug(entry, slug)) || null;

  return { slug, collection, curatedCollection, inspirationDetail };
});

export function getCollectionDetailSlug(context?: PuckFetcherContext): string | undefined {
  return getRouteParam(context, 'collectionSlug') || getSearchParam(context, 'collectionSlug');
}

export async function loadCollectionDetailRuntime(context?: PuckFetcherContext): Promise<CollectionDetailRuntimeData> {
  const slug = getCollectionDetailSlug(context);
  return slug ? loadBySlug(slug) : { collection: null, curatedCollection: null, inspirationDetail: null };
}
