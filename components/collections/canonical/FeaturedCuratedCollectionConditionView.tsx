import { FeaturedCuratedCollectionCondition } from './FeaturedCuratedCollectionCondition';
import { loadCollectionsRuntimeData } from './collectionsRuntime';
import {
  puckTransparentSlotProps,
  type CollectionsSlot,
} from './types';

interface Props {
  visible?: boolean;
  previewMode?: 'visible' | 'hidden';
  content?: CollectionsSlot;
  puck?: { isEditing?: boolean };
}

export const puckComponentName = 'FeaturedCuratedCollectionCondition';
export const puckLabel = 'Featured Curated Collection Condition';
export const puckCategory = 'Collections';
export const puckFields = {
  previewMode: {
    type: 'select' as const,
    options: [
      { label: 'Visible', value: 'visible' },
      { label: 'Hidden', value: 'hidden' },
    ],
  },
  content: { type: 'slot' as const, allow: ['FeaturedCuratedCollection'] },
};
export const puckDefaults = { previewMode: 'visible', content: [] };
export const puckAst = {
  kind: 'runtime',
  slots: ['content'],
  sourceJsxNames: ['FeaturedCuratedCollectionCondition'],
  sourceImportPaths: ['@/components/collections/canonical/FeaturedCuratedCollectionCondition'],
  role: 'featured-curated-collection-condition',
  slotTarget: 'featured',
  conditional: 'hasFeaturedCurated',
  runtimeSignals: ['collections.curated'],
  requiredClasses: ['max-w-[1440px]', 'px-6', 'pb-16', 'lg:px-12'],
};

export async function puckDataFetcher() {
  const runtime = await loadCollectionsRuntimeData();
  return { visible: runtime.hasFeaturedCurated };
}

export function FeaturedCuratedCollectionConditionView({
  visible,
  previewMode = 'visible',
  content,
  puck,
}: Props) {
  const resolved = puck?.isEditing ? previewMode === 'visible' : visible ?? false;
  return (
    <FeaturedCuratedCollectionCondition
      visible={resolved}
      content={content?.(puckTransparentSlotProps)}
    />
  );
}
