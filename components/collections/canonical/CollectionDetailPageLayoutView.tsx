import { CollectionDetailPageLayout } from './CollectionDetailPageLayout';
import {
  puckTransparentSlotProps,
  type CollectionsSlot,
} from './types';

interface Props {
  hero?: CollectionsSlot;
  curated?: CollectionsSlot;
  inspiration?: CollectionsSlot;
}

export const puckComponentName = 'CollectionDetailPageLayout';
export const puckLabel = 'Collection Detail Page Layout';
export const puckCategory = 'Collections';
export const puckFields = {
  hero: { type: 'slot' as const, allow: ['CollectionDetailHero'] },
  curated: { type: 'slot' as const, allow: ['CuratedCollectionCondition'] },
  inspiration: { type: 'slot' as const, allow: ['InspirationDetailCondition'] },
};
export const puckDefaults = { hero: [], curated: [], inspiration: [] };
export const puckAst = {
  kind: 'runtime',
  slots: ['hero', 'curated', 'inspiration'],
  sourceJsxNames: ['CollectionDetailPageLayout'],
  sourceImportPaths: ['@/components/collections/canonical/CollectionDetailPageLayout'],
  role: 'collection-detail-page-layout',
  requiredClasses: ['min-h-screen', 'w-full', 'bg-bg-base', 'text-text-base'],
};

export function CollectionDetailPageLayoutView({ hero, curated, inspiration }: Props) {
  return (
    <CollectionDetailPageLayout
      hero={hero?.(puckTransparentSlotProps)}
      curated={curated?.(puckTransparentSlotProps)}
      inspiration={inspiration?.(puckTransparentSlotProps)}
    />
  );
}
