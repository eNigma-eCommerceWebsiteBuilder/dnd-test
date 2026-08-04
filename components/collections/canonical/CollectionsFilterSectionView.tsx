import { CollectionsFilterSection } from './CollectionsFilterSection';
import {
  puckTransparentSlotProps,
  type CollectionsSlot,
} from './types';

interface Props {
  content?: CollectionsSlot;
}

export const puckComponentName = 'CollectionsFilterSection';
export const puckLabel = 'Collections Filter Section';
export const puckCategory = 'Collections';
export const puckFields = {
  content: { type: 'slot' as const, allow: ['CollectionTypeFilter'] },
};
export const puckDefaults = { content: [] };
export const puckAst = {
  kind: 'static',
  slots: ['content'],
  sourceJsxNames: ['CollectionsFilterSection'],
  sourceImportPaths: ['@/components/collections/canonical/CollectionsFilterSection'],
  role: 'collections-filter-section',
  slotTarget: 'filters',
  requiredClasses: ['max-w-[1440px]', 'px-6', 'py-10', 'lg:px-12'],
};

export function CollectionsFilterSectionView({ content }: Props) {
  return <CollectionsFilterSection content={content?.(puckTransparentSlotProps)} />;
}
