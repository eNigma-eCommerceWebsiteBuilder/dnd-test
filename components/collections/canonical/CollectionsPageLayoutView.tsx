import { CollectionsPageLayout } from './CollectionsPageLayout';
import {
  puckTransparentSlotProps,
  type CollectionsSlot,
} from './types';

interface Props {
  header?: CollectionsSlot;
  filters?: CollectionsSlot;
  featured?: CollectionsSlot;
  collections?: CollectionsSlot;
  inspiration?: CollectionsSlot;
}

export const puckComponentName = 'CollectionsPageLayout';
export const puckLabel = 'Collections Page Layout';
export const puckCategory = 'Collections';
export const puckFields = {
  header: { type: 'slot' as const, allow: ['CollectionsPageHeader'] },
  filters: { type: 'slot' as const, allow: ['CollectionsFilterSection'] },
  featured: { type: 'slot' as const, allow: ['FeaturedCuratedCollectionCondition'] },
  collections: { type: 'slot' as const, allow: ['CollectionsResultsState'] },
  inspiration: { type: 'slot' as const, allow: ['InspirationCollectionCondition'] },
};
export const puckDefaults = { header: [], filters: [], featured: [], collections: [], inspiration: [] };
export const puckAst = {
  kind: 'runtime',
  slots: ['header', 'filters', 'featured', 'collections', 'inspiration'],
  sourceJsxNames: ['CollectionsPageLayout'],
  sourceImportPaths: ['@/components/collections/canonical/CollectionsPageLayout'],
  role: 'collections-page-layout',
  requiredClasses: ['min-h-screen', 'w-full', 'bg-bg-base', 'text-text-base'],
};

export function CollectionsPageLayoutView(props: Props) {
  return (
    <CollectionsPageLayout
      header={props.header?.(puckTransparentSlotProps)}
      filters={props.filters?.(puckTransparentSlotProps)}
      featured={props.featured?.(puckTransparentSlotProps)}
      collections={props.collections?.(puckTransparentSlotProps)}
      inspiration={props.inspiration?.(puckTransparentSlotProps)}
    />
  );
}
