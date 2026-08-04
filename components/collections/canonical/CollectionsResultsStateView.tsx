import { CollectionsResultsState } from './CollectionsResultsState';
import { loadCollectionsRuntimeData } from './collectionsRuntime';
import {
  puckTransparentSlotProps,
  type CollectionsSlot,
} from './types';

interface Props {
  hasCollections?: boolean;
  previewMode?: 'results' | 'empty';
  results?: CollectionsSlot;
  empty?: CollectionsSlot;
  puck?: { isEditing?: boolean };
}

export const puckComponentName = 'CollectionsResultsState';
export const puckLabel = 'Collections Results State';
export const puckCategory = 'Collections';
export const puckFields = {
  previewMode: {
    type: 'select' as const,
    options: [
      { label: 'Collections', value: 'results' },
      { label: 'Empty', value: 'empty' },
    ],
  },
  results: { type: 'slot' as const, allow: ['CollectionGrid'] },
  empty: { type: 'slot' as const, allow: ['EmptyCollections'] },
};
export const puckDefaults = { previewMode: 'results', results: [], empty: [] };
export const puckAst = {
  kind: 'runtime',
  slots: ['results', 'empty'],
  sourceJsxNames: ['CollectionsResultsState'],
  sourceImportPaths: ['@/components/collections/canonical/CollectionsResultsState'],
  role: 'collections-results-state',
  slotTarget: 'collections',
  conditional: 'hasCollections',
  runtimeSignals: ['collections'],
  requiredClasses: ['max-w-[1440px]', 'px-6', 'pb-16', 'lg:px-12'],
};

export async function puckDataFetcher() {
  const runtime = await loadCollectionsRuntimeData();
  return { hasCollections: runtime.hasCollections };
}

export function CollectionsResultsStateView({
  hasCollections,
  previewMode = 'results',
  results,
  empty,
  puck,
}: Props) {
  const resolved = puck?.isEditing ? previewMode === 'results' : hasCollections ?? false;

  return (
    <CollectionsResultsState
      hasCollections={resolved}
      results={results?.(puckTransparentSlotProps)}
      empty={empty?.(puckTransparentSlotProps)}
    />
  );
}
