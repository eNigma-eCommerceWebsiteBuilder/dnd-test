import { ActiveFilters } from './ActiveFilters';

export const puckComponentName = 'ActiveFiltersBlock';
export const puckLabel = 'Active Product Filters';
export const puckCategory = 'Products';

export const puckFields = {};
export const puckDefaults = {};

export const puckAst = {
  kind: 'runtime',
  sourceJsxNames: ['ActiveFilters'],
  sourceImportPaths: ['@/components/products/ActiveFilters'],
  role: 'catalog-active-filters',
  slotTarget: 'activeFilters',
  runtimeSignals: ['searchParams'],
  matches: [
    { pageIncludes: ['app/products/page.tsx'], componentName: 'ActiveFilters' },
  ],
};

export function ActiveFiltersBlockView() {
  return <ActiveFilters className="mb-8" />;
}
