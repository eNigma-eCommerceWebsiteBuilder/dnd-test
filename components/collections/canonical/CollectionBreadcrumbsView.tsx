import { Breadcrumbs } from '@/enigma-components/collections/Breadcrumbs';

export const puckComponentName = 'CollectionBreadcrumbs';
export const puckLabel = 'Collection Breadcrumbs';
export const puckCategory = 'Collections';
export const puckFields = {};
export const puckDefaults = {};
export const puckAst = {
  kind: 'static', sourceJsxNames: ['Breadcrumbs'], sourceImportPaths: ['@/components/collections/Breadcrumbs'],
  role: 'collection-breadcrumbs', slotTarget: 'breadcrumbs', requiredClasses: ['mb-4'],
};
export function CollectionBreadcrumbsView() {
  return <Breadcrumbs items={[{ label: 'Home', href: '/' }, { label: 'Collections' }]} className="mb-4" />;
}
