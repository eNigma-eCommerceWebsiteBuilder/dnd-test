import { CollectionTypeFilter } from '@/enigma-components/collections/CollectionTypeFilter';
import { loadCollectionsRuntimeData } from './collectionsRuntime';

interface Props {
  totalCount?: number;
  curatedCount?: number;
  inspirationCount?: number;
}

export const puckComponentName = 'CollectionTypeFilter';
export const puckLabel = 'Collection Type Filter';
export const puckCategory = 'Collections';
export const puckFields = {};
export const puckDefaults = { totalCount: 6, curatedCount: 3, inspirationCount: 3 };
export const puckAst = {
  kind: 'runtime',
  sourceJsxNames: ['CollectionTypeFilter'],
  sourceImportPaths: ['@/components/collections/CollectionTypeFilter'],
  role: 'collection-type-filter',
  slotTarget: 'content',
  runtimeSignals: ['collections', 'collections.curated', 'collections.inspiration'],
};

export async function puckDataFetcher() {
  const runtime = await loadCollectionsRuntimeData();
  return {
    totalCount: runtime.sortedCollections.length,
    curatedCount: runtime.curatedCount,
    inspirationCount: runtime.inspirationCount,
  };
}

export function CollectionTypeFilterView({
  totalCount = 6,
  curatedCount = 3,
  inspirationCount = 3,
}: Props) {
  return (
    <CollectionTypeFilter
      totalCount={totalCount}
      curatedCount={curatedCount}
      inspirationCount={inspirationCount}
    />
  );
}
