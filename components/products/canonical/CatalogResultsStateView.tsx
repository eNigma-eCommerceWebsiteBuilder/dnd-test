import { CatalogResultsState } from './CatalogResultsState';
import { loadCatalogRuntime } from './catalogRuntime';
import { puckTransparentSlotProps, type CatalogSlot } from './types';
import type { PuckFetcherContext } from '@/lib/puck-route-metadata';

interface CatalogResultsStateViewProps {
  hasProducts?: boolean;
  previewMode?: 'results' | 'empty';
  results?: CatalogSlot;
  empty?: CatalogSlot;
  puck?: { isEditing?: boolean };
}

export const puckComponentName = 'CatalogResultsState';
export const puckLabel = 'Catalog Results State';
export const puckCategory = 'Products';
export const puckFields = {
  previewMode: {
    type: 'select' as const, label: 'Editor preview state',
    options: [{ label: 'Results', value: 'results' }, { label: 'Empty', value: 'empty' }],
  },
  results: { type: 'slot' as const, allow: ['CatalogGridBoundary', 'CatalogPaginationCondition'] },
  empty: { type: 'slot' as const, allow: ['EmptyState'] },
};
export const puckDefaults = { previewMode: 'results', results: [], empty: [] };
export const puckAst = {
  kind: 'runtime', slots: ['results', 'empty'], sourceJsxNames: ['CatalogResultsState'],
  sourceImportPaths: ['@/components/products/canonical/CatalogResultsState'],
  role: 'catalog-results-state', slotTarget: 'results', conditional: 'products.length > 0',
  runtimeSignals: ['products.items'], requiredClasses: ['flex-1'],
};
export async function puckDataFetcher(_props: CatalogResultsStateViewProps, context?: PuckFetcherContext) {
  const runtime = await loadCatalogRuntime(context);
  return { hasProducts: runtime.productsData.items.length > 0 };
}
export function CatalogResultsStateView(props: CatalogResultsStateViewProps) {
  const hasProducts = props.hasProducts ?? (props.puck?.isEditing ? props.previewMode === 'results' : false);
  return <CatalogResultsState hasProducts={hasProducts} results={props.results?.(puckTransparentSlotProps)} empty={props.empty?.(puckTransparentSlotProps)} />;
}
