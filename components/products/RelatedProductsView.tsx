import type { Product } from '@/lib/api/types/products';
import { fetchRelatedProducts } from '@/lib/api/services/products';
import { RelatedProducts } from './RelatedProducts';
import { resolveProductDetailSlug } from './product-detail-route';
import type { PuckFetcherContext } from '@/lib/puck-route-metadata';

interface RelatedProductsViewProps {
  productSlug?: string;
  title: string;
  products: Product[];
  className?: string;
}

const previewProducts: Product[] = [{
  _id: 'related-preview', name: 'Silk Blend Shirt', slug: 'silk-blend-shirt', price: 180,
  images: ['https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?w=600&q=80'],
  stock: 10, inStock: true, isActive: true, createdAt: '2024-01-01T00:00:00Z', updatedAt: '2024-01-01T00:00:00Z',
}];

export const puckComponentName = 'RelatedProducts';
export const puckLabel = 'Related Products';
export const puckCategory = 'Products';
export const puckFields = {
  productSlug: { type: 'text' as const, label: 'Product Slug (auto-fill related)' },
  title: { type: 'text' as const, label: 'Section Title' },
};
export const puckDefaults = { productSlug: 'premium-wool-coat', title: 'Complete the Look', products: previewProducts };
export const puckAst = { kind: 'runtime', sourceJsxNames: ['RelatedProducts'], sourceImportPaths: ['@/components/products/RelatedProducts'], role: 'product-detail-related-products', runtimeSignals: ['relatedProducts'] };

export async function puckDataFetcher(
  props: { productSlug?: string },
  context?: PuckFetcherContext,
) {
  const productSlug = resolveProductDetailSlug(props, context);
  if (!productSlug) return {};
  return { products: await fetchRelatedProducts(productSlug, 4) };
}

export function RelatedProductsView({ title, products, className }: RelatedProductsViewProps) {
  return <RelatedProducts title={title} products={products} className={className} hrefPrefix="/page/product-detail" />;
}
