import { ProductsCatalogLayout } from './ProductsCatalogLayout';
import type { CatalogSlot } from './types';

interface ProductsCatalogLayoutViewProps {
  header?: CatalogSlot;
  activeFilters?: CatalogSlot;
  content?: CatalogSlot;
}

export const puckComponentName = 'ProductsCatalogLayout';
export const puckLabel = 'Products Catalog Layout';
export const puckCategory = 'Products';
export const puckFields = {
  header: { type: 'slot' as const, allow: ['CatalogHeaderLayout'] },
  activeFilters: { type: 'slot' as const, allow: ['CatalogActiveFiltersBoundary'] },
  content: { type: 'slot' as const, allow: ['CatalogContentLayout'] },
};
export const puckDefaults = { header: [], activeFilters: [], content: [] };
export const puckAst = {
  kind: 'static', topLevel: true, slots: ['header', 'activeFilters', 'content'],
  sourceJsxNames: ['main'], sourceImportPaths: ['app/products/page.tsx'],
  role: 'catalog-layout', requiredClasses: ['min-h-screen', 'bg-bg-base', 'text-text-base'],
};

export function ProductsCatalogLayoutView({ header, activeFilters, content }: ProductsCatalogLayoutViewProps) {
  return <ProductsCatalogLayout header={header?.()} activeFilters={activeFilters?.()} content={content?.()} />;
}
