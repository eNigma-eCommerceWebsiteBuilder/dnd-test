import { CatalogTitleSummary } from './CatalogTitleSummary';
import { loadCatalogRuntime } from './catalogRuntime';
import type { PuckFetcherContext } from '@/lib/puck-route-metadata';

interface CatalogTitleSummaryViewProps { title?: string; totalItems?: number; }

export const puckComponentName = 'CatalogTitleSummary';
export const puckLabel = 'Catalog Title and Count';
export const puckCategory = 'Products';
export const puckFields = {
  title: { type: 'text' as const, label: 'Title' },
  totalItems: { type: 'number' as const, label: 'Editor preview item count' },
};
export const puckDefaults = { title: 'All Products', totalItems: 128 };
export const puckAst = {
  kind: 'runtime', sourceJsxNames: ['CatalogTitleSummary'], sourceImportPaths: ['@/components/products/canonical/CatalogTitleSummary'],
  role: 'catalog-title-summary', slotTarget: 'titleSummary', runtimeSignals: ['products.totalItems', 'searchParams'],
  requiredClasses: ['text-4xl', 'md:text-5xl', 'font-black', 'tracking-tight'],
};
export async function puckDataFetcher(_props: CatalogTitleSummaryViewProps, context?: PuckFetcherContext) {
  const runtime = await loadCatalogRuntime(context);
  return { totalItems: runtime.productsData.totalItems || 0 };
}
export function CatalogTitleSummaryView(props: CatalogTitleSummaryViewProps) { return <CatalogTitleSummary {...props} />; }
