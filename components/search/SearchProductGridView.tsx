import type { Product } from '@/lib/api/types/products';
import { ProductGrid } from '@/components/products/ProductGrid';
import { loadSearchRuntime } from './canonical/searchRuntime';
import type { PuckFetcherContext } from '@/lib/puck-route-metadata';
interface Props { products?: Product[]; }
export const puckComponentName = 'SearchProductGrid'; export const puckLabel = 'Search Product Grid'; export const puckCategory = 'Search'; export const puckFields = {}; export const puckDefaults = { products: [] };
export const puckAst = { kind: 'runtime', sourceJsxNames: ['ProductGrid'], sourceImportPaths: ['@/components/products/ProductGrid'], role: 'search-product-grid', slotTarget: 'content', runtimeSignals: ['searchProducts.items'] };
export async function puckDataFetcher(_props: Props, context?: PuckFetcherContext) { const runtime = await loadSearchRuntime(context); return { products: runtime.products }; }
export function SearchProductGridView({ products = [] }: Props) { return <ProductGrid products={products} listName="Search Results" />; }
