import { CuratedCollectionCondition } from './CuratedCollectionCondition';
import { loadCollectionDetailRuntime } from './collectionDetailRuntime';
import {
  puckTransparentSlotProps,
  type CollectionsSlot,
} from './types';
import type { PuckFetcherContext } from '@/lib/puck-route-metadata';

interface Props {
  visible?: boolean;
  previewMode?: 'visible' | 'hidden';
  content?: CollectionsSlot;
  puck?: { isEditing?: boolean };
}

export const puckComponentName = 'CuratedCollectionCondition';
export const puckLabel = 'Curated Collection Condition';
export const puckCategory = 'Collections';
export const puckFields = {
  previewMode: {
    type: 'select' as const,
    options: [
      { label: 'Visible', value: 'visible' },
      { label: 'Hidden', value: 'hidden' },
    ],
  },
  content: { type: 'slot' as const, allow: ['CollectionDetailCuratedDisplay'] },
};
export const puckDefaults = { previewMode: 'visible', content: [] };
export const puckAst = {
  kind: 'runtime',
  slots: ['content'],
  sourceJsxNames: ['CuratedCollectionCondition'],
  sourceImportPaths: ['@/components/collections/canonical/CuratedCollectionCondition'],
  role: 'curated-collection-condition',
  slotTarget: 'curated',
  conditional: 'Boolean(curatedCollection)',
  runtimeSignals: ['curatedCollection'],
  requiredClasses: ['max-w-[1440px]', 'px-6', 'py-16', 'lg:px-12'],
};

export async function puckDataFetcher(_props: Props, context?: PuckFetcherContext) {
  const runtime = await loadCollectionDetailRuntime(context);
  return { visible: Boolean(runtime.curatedCollection) };
}

export function CuratedCollectionConditionView({
  visible,
  previewMode = 'visible',
  content,
  puck,
}: Props) {
  const resolved = puck?.isEditing ? previewMode === 'visible' : visible ?? false;
  return (
    <CuratedCollectionCondition
      visible={resolved}
      content={content?.(puckTransparentSlotProps)}
    />
  );
}
