import type { Product } from '@/lib/api/types/products';
import { ProductGrid } from './ProductGrid';
import { loadCatalogRuntime } from './canonical/catalogRuntime';
import type { PuckFetcherContext } from '@/lib/puck-route-metadata';

interface ProductGridViewProps {
  products?: Product[];
  listName?: string;
  className?: string;
}

const previewProducts: Product[] = [
  { _id: 'preview-wool-overcoat', id: 'preview-wool-overcoat', name: 'Wool Overcoat', slug: 'wool-overcoat', price: 1290, images: ['https://images.unsplash.com/photo-1551488831-00ddcb6c6bd3?w=600&q=80'], stock: 12, inStock: true, isActive: true, createdAt: '2024-01-01T00:00:00Z', updatedAt: '2024-01-01T00:00:00Z' },
  { _id: 'preview-cashmere-sweater', id: 'preview-cashmere-sweater', name: 'Cashmere Sweater', slug: 'cashmere-sweater', price: 320, images: ['https://images.unsplash.com/photo-1576566588028-4147f3842f27?w=600&q=80'], stock: 8, inStock: true, isActive: true, createdAt: '2024-01-01T00:00:00Z', updatedAt: '2024-01-01T00:00:00Z' },
  { _id: 'preview-silk-blend-shirt', id: 'preview-silk-blend-shirt', name: 'Silk Blend Shirt', slug: 'silk-blend-shirt', price: 180, images: ['https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?w=600&q=80'], stock: 15, inStock: true, isActive: true, createdAt: '2024-01-01T00:00:00Z', updatedAt: '2024-01-01T00:00:00Z' },
  { _id: 'preview-leather-tote', id: 'preview-leather-tote', name: 'Leather Tote Bag', slug: 'leather-tote-bag', price: 550, images: ['https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=600&q=80'], stock: 5, inStock: true, isActive: true, createdAt: '2024-01-01T00:00:00Z', updatedAt: '2024-01-01T00:00:00Z' },
];

export const puckComponentName = 'ProductGrid';
export const puckLabel = 'Product Grid';
export const puckCategory = 'Products';
export const puckFields = {
  listName: { type: 'text' as const, label: 'Analytics List Name' },
};
export const puckDefaults = { products: previewProducts, listName: 'Product Listing' };
export const puckAst = {
  kind: 'runtime', sourceJsxNames: ['ProductGrid'], sourceImportPaths: ['@/components/products/ProductGrid'],
  role: 'catalog-product-grid', slotTarget: 'grid', runtimeSignals: ['products.items', 'searchParams'],
  matches: [{ pageIncludes: ['app/products/page.tsx'], componentName: 'ProductGrid' }],
};

export async function puckDataFetcher(_props: ProductGridViewProps, context?: PuckFetcherContext) {
  const runtime = await loadCatalogRuntime(context);
  return { products: runtime.productsData.items };
}

// The Puck View is deliberately only an adapter around the real grid component.
export function ProductGridView({ products = previewProducts, listName = 'Product Listing', className }: ProductGridViewProps) {
  return <ProductGrid products={products} listName={listName} className={className} />;
}
