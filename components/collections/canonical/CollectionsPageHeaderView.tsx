import { CollectionsPageHeader } from './CollectionsPageHeader';
import {
  puckTransparentSlotProps,
  type CollectionsSlot,
} from './types';

interface Props {
  breadcrumbs?: CollectionsSlot;
}

export const puckComponentName = 'CollectionsPageHeader';
export const puckLabel = 'Collections Page Header';
export const puckCategory = 'Collections';
export const puckFields = {
  breadcrumbs: { type: 'slot' as const, allow: ['CollectionBreadcrumbs'] },
};
export const puckDefaults = { breadcrumbs: [] };
export const puckAst = {
  kind: 'static',
  slots: ['breadcrumbs'],
  sourceJsxNames: ['CollectionsPageHeader'],
  sourceImportPaths: ['@/components/collections/canonical/CollectionsPageHeader'],
  role: 'collections-page-header',
  slotTarget: 'header',
  requiredClasses: ['border-b', 'border-border', 'py-10', 'max-w-[1440px]', 'px-6', 'lg:px-12', 'text-4xl'],
};

export function CollectionsPageHeaderView({ breadcrumbs }: Props) {
  return <CollectionsPageHeader breadcrumbs={breadcrumbs?.(puckTransparentSlotProps)} />;
}
