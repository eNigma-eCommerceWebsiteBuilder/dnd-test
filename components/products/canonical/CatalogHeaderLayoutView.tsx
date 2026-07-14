import { CatalogHeaderLayout } from './CatalogHeaderLayout';
import type { CatalogSlot } from './types';

interface CatalogHeaderLayoutViewProps {
  breadcrumbs?: CatalogSlot;
  titleSummary?: CatalogSlot;
  controls?: CatalogSlot;
}

export const puckComponentName = 'CatalogHeaderLayout';
export const puckLabel = 'Catalog Header Layout';
export const puckCategory = 'Products';
export const puckFields = {
  breadcrumbs: { type: 'slot' as const, allow: ['CatalogBreadcrumbs'] },
  titleSummary: { type: 'slot' as const, allow: ['CatalogTitleSummary'] },
  controls: { type: 'slot' as const, allow: ['CatalogControlsLayout'] },
};
export const puckDefaults = { breadcrumbs: [], titleSummary: [], controls: [] };
export const puckAst = {
  kind: 'static', slots: ['breadcrumbs', 'titleSummary', 'controls'],
  sourceJsxNames: ['div'], sourceImportPaths: ['app/products/page.tsx'],
  role: 'catalog-header-layout', requiredClasses: ['mb-10'],
};

export function CatalogHeaderLayoutView(props: CatalogHeaderLayoutViewProps) {
  return <CatalogHeaderLayout breadcrumbs={props.breadcrumbs?.()} titleSummary={props.titleSummary?.()} controls={props.controls?.()} />;
}
