import type { Product } from '@/lib/api/types/products';
import { ProductGrid } from '@/components/products/ProductGrid';
import { loadCategoryCatalogRuntime } from './categoryCatalogRuntime';
import type { PuckFetcherContext } from '@/lib/puck-route-metadata';

interface Props { products?: Product[]; }
const previewProducts: Product[] = [{ _id: 'category-preview-product', id: 'category-preview-product', name: 'Category Preview Product', slug: 'category-preview-product', price: 250, images: ['https://images.unsplash.com/photo-1551488831-00ddcb6c6bd3?w=600&q=80'], stock: 6, inStock: true, isActive: true, createdAt: '2024-01-01T00:00:00Z', updatedAt: '2024-01-01T00:00:00Z' }];
export const puckComponentName = 'CategoryProductGridBlock';
export const puckLabel = 'Category Product Grid';
export const puckCategory = 'Categories';
export const puckFields = {};
export const puckDefaults = { products: previewProducts };
export const puckAst = { kind: 'runtime', sourceJsxNames: ['ProductGrid'], sourceImportPaths: ['@/components/products/ProductGrid'], role: 'category-catalog-product-grid', slotTarget: 'grid', runtimeSignals: ['category.products'] };
export async function puckDataFetcher(_props: Props, context?: PuckFetcherContext) { const runtime = await loadCategoryCatalogRuntime(context); return runtime ? { products: runtime.products } : {}; }
export function CategoryProductGridBlockView({ products = previewProducts }: Props) { return <ProductGrid products={products} />; }
