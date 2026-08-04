import { InspirationCollectionCondition } from './InspirationCollectionCondition';
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

export const puckComponentName = 'InspirationCollectionCondition';
export const puckLabel = 'Inspiration Collection Condition';
export const puckCategory = 'Collections';
export const puckFields = {
  previewMode: {
    type: 'select' as const,
    options: [
      { label: 'Visible', value: 'visible' },
      { label: 'Hidden', value: 'hidden' },
    ],
  },
  content: { type: 'slot' as const, allow: ['InspirationCollectionSection'] },
};
export const puckDefaults = { previewMode: 'visible', content: [] };
export const puckAst = {
  kind: 'runtime',
  slots: ['content'],
  sourceJsxNames: ['InspirationCollectionCondition'],
  sourceImportPaths: ['@/components/collections/canonical/InspirationCollectionCondition'],
  role: 'inspiration-collection-condition',
  slotTarget: 'inspiration',
  conditional: 'hasInspiration',
  runtimeSignals: ['collections.inspiration'],
  requiredClasses: ['max-w-[1440px]', 'px-6', 'pb-20', 'lg:px-12'],
};

export async function puckDataFetcher() {
  const runtime = await loadCollectionsRuntimeData();
  return { visible: runtime.hasInspiration };
}

export function InspirationCollectionConditionView({
  visible,
  previewMode = 'visible',
  content,
  puck,
}: Props) {
  const resolved = puck?.isEditing ? previewMode === 'visible' : visible ?? false;
  return (
    <InspirationCollectionCondition
      visible={resolved}
      content={content?.(puckTransparentSlotProps)}
    />
  );
}
