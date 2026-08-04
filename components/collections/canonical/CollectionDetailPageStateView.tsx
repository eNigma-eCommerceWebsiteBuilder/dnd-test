import { CollectionDetailPageState } from './CollectionDetailPageState';
import { loadCollectionDetailRuntime } from './collectionDetailRuntime';
import {
  puckTransparentSlotProps,
  type CollectionsSlot,
} from './types';

interface Props {
  hasCollection?: boolean;
  previewMode?: 'content' | 'not-found';
  content?: CollectionsSlot;
  notFound?: CollectionsSlot;
  puck?: { isEditing?: boolean };
}

export const puckComponentName = 'CollectionDetailPageState';
export const puckLabel = 'Collection Detail Page State';
export const puckCategory = 'Collections';
export const puckFields = {
  previewMode: {
    type: 'select' as const,
    options: [
      { label: 'Collection', value: 'content' },
      { label: 'Not Found', value: 'not-found' },
    ],
  },
  content: { type: 'slot' as const, allow: ['CollectionDetailPageLayout'] },
  notFound: { type: 'slot' as const, allow: ['CollectionDetailNotFound'] },
};
export const puckDefaults = { previewMode: 'content', content: [], notFound: [] };
export const puckAst = {
  kind: 'runtime',
  topLevel: true,
  slots: ['content', 'notFound'],
  sourceJsxNames: ['CollectionDetailPageState'],
  sourceImportPaths: ['@/components/collections/canonical/CollectionDetailPageState'],
  role: 'collection-detail-page-state',
  conditional: 'Boolean(collection)',
  runtimeSignals: ['params.collectionSlug', 'collection'],
};

export async function puckDataFetcher(
  _props: Props,
  context?: Parameters<typeof loadCollectionDetailRuntime>[0],
) {
  const runtime = await loadCollectionDetailRuntime(context);
  return { hasCollection: Boolean(runtime.collection) };
}

export function CollectionDetailPageStateView({
  hasCollection,
  previewMode = 'content',
  content,
  notFound,
  puck,
}: Props) {
  const resolved = puck?.isEditing ? previewMode === 'content' : hasCollection ?? false;
  return (
    <CollectionDetailPageState
      hasCollection={resolved}
      content={content?.(puckTransparentSlotProps)}
      notFound={notFound?.(puckTransparentSlotProps)}
    />
  );
}
