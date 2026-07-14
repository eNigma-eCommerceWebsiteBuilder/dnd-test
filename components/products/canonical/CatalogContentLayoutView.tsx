import { CatalogContentLayout } from './CatalogContentLayout';
import type { CatalogSlot } from './types';

interface CatalogContentLayoutViewProps { sidebar?: CatalogSlot; results?: CatalogSlot; }

export const puckComponentName = 'CatalogContentLayout';
export const puckLabel = 'Catalog Content Layout';
export const puckCategory = 'Products';
export const puckFields = {
  sidebar: { type: 'slot' as const, allow: ['CatalogFilterSidebar'] },
  results: { type: 'slot' as const, allow: ['CatalogResultsState'] },
};
export const puckDefaults = { sidebar: [], results: [] };
export const puckAst = {
  kind: 'static', slots: ['sidebar', 'results'], sourceJsxNames: ['div'], sourceImportPaths: ['app/products/page.tsx'],
  role: 'catalog-content-layout', slotTarget: 'content', requiredClasses: ['flex', 'flex-col', 'lg:flex-row', 'gap-8', 'lg:gap-12'],
};
export function CatalogContentLayoutView({ sidebar, results }: CatalogContentLayoutViewProps) {
  return <CatalogContentLayout sidebar={sidebar?.()} results={results?.()} />;
}
