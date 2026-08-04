import type { Collection } from '@/lib/api/types/collections';
import { CollectionDetailHero } from './CollectionDetailHero';
import { loadCollectionDetailRuntime } from './collectionDetailRuntime';
import type { PuckFetcherContext } from '@/lib/puck-route-metadata';

interface Props {
  collection?: Collection | null;
  puck?: { isEditing?: boolean };
}

const previewCollection = {
  id: 'collection-preview',
  name: 'Seasonal Essentials',
  slug: 'seasonal-essentials',
  description: 'A focused edit of timeless pieces.',
  type: 'curated',
  mainProduct: {
    _id: 'featured-product',
    id: 'featured-product',
    name: 'Featured Look',
    slug: 'featured-look',
    price: 320,
    stock: 10,
    inStock: true,
    isActive: true,
    images: ['https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=1400&q=80'],
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z',
  },
  relatedProducts: [],
  isActive: true,
  createdAt: '2024-01-01T00:00:00Z',
  updatedAt: '2024-01-01T00:00:00Z',
} as unknown as Collection;

export const puckComponentName = 'CollectionDetailHero';
export const puckLabel = 'Collection Detail Hero';
export const puckCategory = 'Collections';
export const puckFields = {};
export const puckDefaults = {};
export const puckAst = {
  kind: 'runtime',
  sourceJsxNames: ['CollectionDetailHero'],
  sourceImportPaths: ['@/components/collections/canonical/CollectionDetailHero'],
  role: 'collection-detail-hero',
  slotTarget: 'hero',
  runtimeSignals: ['params.collectionSlug', 'collection'],
};

export async function puckDataFetcher(_props: Props, context?: PuckFetcherContext) {
  const runtime = await loadCollectionDetailRuntime(context);
  return { collection: runtime.collection };
}

export function CollectionDetailHeroView({ collection, puck }: Props) {
  const resolvedCollection = collection ?? (puck?.isEditing ? previewCollection : undefined);
  if (!resolvedCollection) return null;
  return <CollectionDetailHero collection={resolvedCollection} />;
}
