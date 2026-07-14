import { ViewToggle } from './ViewToggle';

export const puckComponentName = 'ViewToggleBlock';
export const puckLabel = 'Catalog View Toggle';
export const puckCategory = 'Products';

export const puckFields = {};
export const puckDefaults = {};

export const puckAst = {
  kind: 'runtime',
  sourceJsxNames: ['ViewToggle'],
  sourceImportPaths: ['@/components/products/ViewToggle'],
  role: 'catalog-view-toggle',
  slotTarget: 'controls',
  runtimeSignals: ['searchParams.view'],
  matches: [
    { pageIncludes: ['app/products/page.tsx'], componentName: 'ViewToggle' },
  ],
};

export function ViewToggleBlockView() {
  return <ViewToggle />;
}
