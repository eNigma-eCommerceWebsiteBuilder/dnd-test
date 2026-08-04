import type { CuratedCollection } from '@/lib/api/types/collections';
import { CollectionDetailCuratedDisplay } from './CollectionDetailCuratedDisplay';
import { loadCollectionDetailRuntime } from './collectionDetailRuntime';
import type { PuckFetcherContext } from '@/lib/puck-route-metadata';

interface Props {
  collection?: CuratedCollection | null;
  puck?: { isEditing?: boolean };
}

const previewCollection = {
  id: 'curated-preview',
  name: 'Seasonal Essentials',
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
    images: ['https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=900&q=80'],
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z',
  },
  relatedProducts: [],
  isActive: true,
  createdAt: '2024-01-01T00:00:00Z',
  updatedAt: '2024-01-01T00:00:00Z',
} as unknown as CuratedCollection;

export const puckComponentName = 'CollectionDetailCuratedDisplay';
export const puckLabel = 'Collection Detail Curated Display';
export const puckCategory = 'Collections';
export const puckFields = {};
export const puckDefaults = {};
export const puckAst = {
  kind: 'runtime',
  sourceJsxNames: ['CollectionDetailCuratedDisplay'],
  sourceImportPaths: ['@/components/collections/canonical/CollectionDetailCuratedDisplay'],
  role: 'collection-detail-curated-display',
  slotTarget: 'content',
  runtimeSignals: ['curatedCollection'],
};

export async function puckDataFetcher(_props: Props, context?: PuckFetcherContext) {
  const runtime = await loadCollectionDetailRuntime(context);
  return { collection: runtime.curatedCollection };
}

export function CollectionDetailCuratedDisplayView({ collection, puck }: Props) {
  const resolvedCollection = collection ?? (puck?.isEditing ? previewCollection : undefined);
  if (!resolvedCollection) return null;
  return <CollectionDetailCuratedDisplay collection={resolvedCollection} />;
}
