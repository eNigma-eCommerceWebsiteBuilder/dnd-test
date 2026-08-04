import type { CuratedCollection } from '@/lib/api/types/collections';
import { FeaturedCuratedCollection } from './FeaturedCuratedCollection';
import { loadCollectionsRuntimeData } from './collectionsRuntime';

interface Props {
  collection?: CuratedCollection;
  puck?: { isEditing?: boolean };
}

const previewCollection = {
  id: 'curated-preview',
  name: 'Seasonal Essentials',
  description: 'A thoughtful edit of the season\'s standout pieces.',
  type: 'curated',
  mainProduct: {
    name: 'Featured look',
    images: ['https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=1200&q=80'],
  },
  relatedProducts: [],
  isActive: true,
  createdAt: '2024-01-01T00:00:00Z',
  updatedAt: '2024-01-01T00:00:00Z',
} as unknown as CuratedCollection;

export const puckComponentName = 'FeaturedCuratedCollection';
export const puckLabel = 'Featured Curated Collection';
export const puckCategory = 'Collections';
export const puckFields = {};
export const puckDefaults = { collection: previewCollection };
export const puckAst = {
  kind: 'runtime',
  sourceJsxNames: ['FeaturedCuratedCollection'],
  sourceImportPaths: ['@/components/collections/canonical/FeaturedCuratedCollection'],
  role: 'featured-curated-collection',
  slotTarget: 'content',
  runtimeSignals: ['collections.curated'],
  requiredClasses: ['lg:flex-row', 'aspect-[4/3]', 'lg:w-2/3', 'lg:w-1/3'],
};

export async function puckDataFetcher() {
  const runtime = await loadCollectionsRuntimeData();
  return { collection: runtime.featuredCurated };
}

export function FeaturedCuratedCollectionView({ collection, puck }: Props) {
  const resolvedCollection = collection ?? (puck?.isEditing ? previewCollection : undefined);
  if (!resolvedCollection) return null;
  return <FeaturedCuratedCollection collection={resolvedCollection} />;
}
