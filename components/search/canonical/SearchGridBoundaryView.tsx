import { SearchGridBoundary } from './SearchGridBoundary';
import { loadSearchRuntime } from './searchRuntime';
import { puckTransparentSlotProps, type SearchSlot } from './types';
import type { PuckFetcherContext } from '@/lib/puck-route-metadata';

interface Props { pageSize?: number; content?: SearchSlot; }
export const puckComponentName = 'SearchGridBoundary';
export const puckLabel = 'Search Grid Boundary';
export const puckCategory = 'Search';
export const puckFields = { content: { type: 'slot' as const, allow: ['SearchProductGrid'] } };
export const puckDefaults = { pageSize: 12, content: [] };
export const puckAst = { kind: 'runtime', slots: ['content'], sourceJsxNames: ['SearchGridBoundary', 'ProductGrid'], sourceImportPaths: ['@/components/search/canonical/SearchGridBoundary', '@/components/products/ProductGrid'], role: 'search-grid-boundary', slotTarget: 'grid', suspenseFallback: 'ProductGridSkeleton(count=pageSize)', runtimeSignals: ['search.pageSize'] };
export async function puckDataFetcher(_props: Props, context?: PuckFetcherContext) { const runtime = await loadSearchRuntime(context); return { pageSize: runtime.pageSize }; }
export function SearchGridBoundaryView({ pageSize, content }: Props) { return <SearchGridBoundary pageSize={pageSize} content={content?.(puckTransparentSlotProps)} />; }
