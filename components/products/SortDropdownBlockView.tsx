import { SortDropdown } from './SortDropdown';

export const puckComponentName = 'SortDropdownBlock';
export const puckLabel = 'Catalog Sort Dropdown';
export const puckCategory = 'Products';

export const puckFields = {};
export const puckDefaults = {};

export const puckAst = {
  kind: 'runtime',
  sourceJsxNames: ['SortDropdown'],
  sourceImportPaths: ['@/components/products/SortDropdown'],
  role: 'catalog-sort',
  slotTarget: 'controls',
  runtimeSignals: ['searchParams.sort'],
  matches: [
    { pageIncludes: ['app/products/page.tsx'], componentName: 'SortDropdown' },
  ],
};

export function SortDropdownBlockView() {
  return <SortDropdown />;
}
