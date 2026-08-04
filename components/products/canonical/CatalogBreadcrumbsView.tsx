import { CatalogBreadcrumbs } from './CatalogBreadcrumbs';

interface CatalogBreadcrumbsViewProps {
  homeLabel?: string;
  homeHref?: string;
  currentLabel?: string;
}

export const puckComponentName = 'CatalogBreadcrumbs';
export const puckLabel = 'Catalog Breadcrumbs';
export const puckCategory = 'Products';
export const puckFields = {
  homeLabel: { type: 'text' as const, label: 'Home label' },
  homeHref: { type: 'text' as const, label: 'Home URL' },
  currentLabel: { type: 'text' as const, label: 'Current page label' },
};
export const puckDefaults = { homeLabel: 'Home', homeHref: '/', currentLabel: 'All Products' };
export const puckAst = {
  kind: 'static', sourceJsxNames: ['CatalogBreadcrumbs'], sourceImportPaths: ['@/components/products/canonical/CatalogBreadcrumbs'],
  role: 'catalog-breadcrumbs', slotTarget: 'breadcrumbs',
  requiredClasses: ['flex', 'items-center', 'gap-2', 'text-sm', 'text-text-muted', 'mb-4'],
};

export function CatalogBreadcrumbsView(props: CatalogBreadcrumbsViewProps) {
  return <CatalogBreadcrumbs {...props} />;
}
