import type { InspirationCollection } from '@/lib/api/types/collections';
import { CollectionDetailInspirationGallery } from './CollectionDetailInspirationGallery';
import { loadCollectionDetailRuntime } from './collectionDetailRuntime';
import type { PuckFetcherContext } from '@/lib/puck-route-metadata';

interface Props {
  collection?: InspirationCollection | null;
  puck?: { isEditing?: boolean };
}

const previewCollection = {
  id: 'inspiration-preview',
  name: 'Inspiration',
  title: 'Inspiration Lookbook',
  subtitle: 'Curated visuals to inspire your next look.',
  type: 'inspiration',
  mainImage: {
    imageUrl: 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=1400&q=80',
    alt: 'Inspiration lookbook',
    ctaText: 'View Collection',
    ctaLink: '/collections/inspiration',
  },
  products: [],
  isActive: true,
  createdAt: '2024-01-01T00:00:00Z',
  updatedAt: '2024-01-01T00:00:00Z',
} as InspirationCollection;

export const puckComponentName = 'CollectionDetailInspirationGallery';
export const puckLabel = 'Collection Detail Inspiration Gallery';
export const puckCategory = 'Collections';
export const puckFields = {};
export const puckDefaults = {};
export const puckAst = {
  kind: 'runtime',
  sourceJsxNames: ['CollectionDetailInspirationGallery'],
  sourceImportPaths: ['@/components/collections/canonical/CollectionDetailInspirationGallery'],
  role: 'collection-detail-inspiration-gallery',
  slotTarget: 'content',
  runtimeSignals: ['inspirationDetail'],
};

export async function puckDataFetcher(_props: Props, context?: PuckFetcherContext) {
  const runtime = await loadCollectionDetailRuntime(context);
  return { collection: runtime.inspirationDetail };
}

export function CollectionDetailInspirationGalleryView({ collection, puck }: Props) {
  const resolvedCollection = collection ?? (puck?.isEditing ? previewCollection : undefined);
  if (!resolvedCollection) return null;
  return <CollectionDetailInspirationGallery collection={resolvedCollection} />;
}
