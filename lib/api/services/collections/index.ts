import { apiRequest } from '../../core/client';
import type { Collection, CuratedCollection, InspirationCollection } from '../../types';

export async function fetchCollections(): Promise<Collection[]> {
  const response = await apiRequest<{ items: Collection[]; totalItems: number }>('/collections', {
    revalidate: 120,
    tags: ['collections'],
  });
  return response.items ?? [];
}

export async function fetchCuratedCollections(): Promise<CuratedCollection[]> {
  const response = await apiRequest<{ items: CuratedCollection[]; totalItems: number }>('/collections/curated', {
    revalidate: 120,
    tags: ['collections', 'curated'],
  });
  return response.items ?? [];
}

export async function fetchInspirationCollection(): Promise<InspirationCollection> {
  return apiRequest<InspirationCollection>('/collections/inspiration', {
    revalidate: 120,
    tags: ['collections', 'inspiration'],
  });
}
