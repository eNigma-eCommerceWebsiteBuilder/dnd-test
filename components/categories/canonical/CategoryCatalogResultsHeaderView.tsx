import { CategoryCatalogResultsHeader } from './CategoryCatalogResultsHeader';
import { loadCategoryCatalogRuntime } from './categoryCatalogRuntime';
import type { CatalogSlot } from '@/components/products/canonical/types';
import type { PuckFetcherContext } from '@/lib/puck-route-metadata';

interface Props { totalItems?: number; controls?: CatalogSlot; }
export const puckComponentName = 'CategoryCatalogResultsHeader';
export const puckLabel = 'Category Results Controls';
export const puckCategory = 'Categories';
export const puckFields = { controls: { type: 'slot' as const, allow: ['ViewToggleBlock', 'SortDropdownBlock'] } };
export const puckDefaults = { totalItems: 42, controls: [] };
export const puckAst = { kind: 'runtime', slots: ['controls'], sourceJsxNames: ['ViewToggle', 'SortDropdown'], sourceImportPaths: ['@/components/products/ViewToggle', '@/components/products/SortDropdown'], role: 'category-catalog-results-header', slotTarget: 'results', runtimeSignals: ['category.totalItems'], requiredClasses: ['flex', 'sm:flex-row', 'items-start', 'justify-between', 'gap-4', 'mb-8'] };
export async function puckDataFetcher(_props: Props, context?: PuckFetcherContext) { const runtime = await loadCategoryCatalogRuntime(context); return runtime ? { totalItems: runtime.totalItems } : {}; }
export function CategoryCatalogResultsHeaderView(props: Props) { return <CategoryCatalogResultsHeader totalItems={props.totalItems} controls={props.controls?.()} />; }
