import type { InspirationCollection } from '@/lib/api/types/collections';
import { InspirationCollectionSection } from './InspirationCollectionSection';
import { loadCollectionsRuntimeData } from './collectionsRuntime';

interface Props {
  collection?: InspirationCollection | null;
  puck?: { isEditing?: boolean };
}

const previewCollection = {
  id: 'inspiration-preview',
  name: 'The Journal',
  title: 'The Journal',
  subtitle: 'Explore the full story',
  type: 'inspiration',
  mainImage: {
    imageUrl: 'https://images.unsplash.com/photo-1483985988355-763728e1935b?w=1400&q=80',
    alt: 'Curated inspiration',
    ctaText: 'View Collection',
    ctaLink: '/collections/journal',
  },
  products: [],
  isActive: true,
  createdAt: '2024-01-01T00:00:00Z',
  updatedAt: '2024-01-01T00:00:00Z',
} as InspirationCollection;

export const puckComponentName = 'InspirationCollectionSection';
export const puckLabel = 'Inspiration Collection Section';
export const puckCategory = 'Collections';
export const puckFields = {};
export const puckDefaults = { collection: previewCollection };
export const puckAst = {
  kind: 'runtime',
  sourceJsxNames: ['InspirationCollectionSection'],
  sourceImportPaths: ['@/components/collections/canonical/InspirationCollectionSection'],
  role: 'inspiration-collection-section',
  slotTarget: 'content',
  runtimeSignals: ['collections.inspiration'],
  requiredClasses: ['aspect-[21/9]', 'sm:flex-row', 'sm:items-center', 'sm:justify-between'],
};

export async function puckDataFetcher() {
  const runtime = await loadCollectionsRuntimeData();
  return { collection: runtime.inspirationCollection };
}

export function InspirationCollectionSectionView({ collection, puck }: Props) {
  const resolvedCollection = collection ?? (puck?.isEditing ? previewCollection : undefined);
  if (!resolvedCollection) return null;
  return <InspirationCollectionSection collection={resolvedCollection} />;
}
