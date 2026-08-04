import { InspirationDetailCondition } from './InspirationDetailCondition';
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

export const puckComponentName = 'InspirationDetailCondition';
export const puckLabel = 'Inspiration Detail Condition';
export const puckCategory = 'Collections';
export const puckFields = {
  previewMode: {
    type: 'select' as const,
    options: [
      { label: 'Visible', value: 'visible' },
      { label: 'Hidden', value: 'hidden' },
    ],
  },
  content: { type: 'slot' as const, allow: ['CollectionDetailInspirationGallery'] },
};
export const puckDefaults = { previewMode: 'visible', content: [] };
export const puckAst = {
  kind: 'runtime',
  slots: ['content'],
  sourceJsxNames: ['InspirationDetailCondition'],
  sourceImportPaths: ['@/components/collections/canonical/InspirationDetailCondition'],
  role: 'inspiration-detail-condition',
  slotTarget: 'inspiration',
  conditional: 'Boolean(inspirationDetail)',
  runtimeSignals: ['inspirationDetail'],
};

export async function puckDataFetcher(_props: Props, context?: PuckFetcherContext) {
  const runtime = await loadCollectionDetailRuntime(context);
  return { visible: Boolean(runtime.inspirationDetail) };
}

export function InspirationDetailConditionView({
  visible,
  previewMode = 'visible',
  content,
  puck,
}: Props) {
  const resolved = puck?.isEditing ? previewMode === 'visible' : visible ?? false;
  return (
    <InspirationDetailCondition
      visible={resolved}
      content={content?.(puckTransparentSlotProps)}
    />
  );
}
