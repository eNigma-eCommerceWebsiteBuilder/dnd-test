import type { Collection } from '@/lib/api/types/collections';
import { CollectionGrid } from '@/enigma-components/collections/CollectionGrid';
import { loadCollectionsRuntimeData } from './canonical/collectionsRuntime';

interface CollectionGridViewProps { collections?: Collection[]; }

const previewCollections = [
  { id: 'collection-preview', name: 'Seasonal Essentials', slug: 'seasonal-essentials', type: 'curated', mainProduct: { name: 'Featured look', images: ['https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=900&q=80'] }, relatedProducts: [], isActive: true, createdAt: '2024-01-01T00:00:00Z', updatedAt: '2024-01-01T00:00:00Z' },
] as unknown as Collection[];

export const puckComponentName = 'CollectionGrid';
export const puckLabel = 'Collection Grid';
export const puckCategory = 'Collections';

export const puckFields = {};

export const puckDefaults = { collections: previewCollections };
export const puckAst = { kind: 'runtime', sourceJsxNames: ['CollectionGrid'], sourceImportPaths: ['@/components/collections/CollectionGrid'], role: 'collection-grid', slotTarget: 'results', runtimeSignals: ['collections'] };

export async function puckDataFetcher() {
  const runtime = await loadCollectionsRuntimeData();
  return { collections: runtime.sortedCollections };
}

// Deliberately delegates to the real grid and cards rather than recreating their markup in Puck.
export function CollectionGridView({ collections = previewCollections }: CollectionGridViewProps) {
  return (
    <CollectionGrid
      collections={collections}
      getHref={(collection) =>
        collection.slug ? `/collections/${collection.slug}` : undefined
      }
    />
  );
}
