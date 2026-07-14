import type { Product } from '@/lib/api/types';
import { fetchProduct } from '@/lib/api/services/products';
import { ProductDetailsClient } from '@/enigma-components/templates/products/ProductDetailsClient';
import { resolveProductDetailSlug } from '@/components/products/product-detail-route';
import type { PuckFetcherContext } from '@/lib/puck-route-metadata';

interface ProductDetailsClientViewProps {
  productSlug?: string;
  product?: Product;
}

const previewProduct: Product = {
  _id: 'product-detail-preview',
  name: 'Premium Wool Coat',
  slug: 'premium-wool-coat',
  price: 450,
  images: ['https://images.unsplash.com/photo-1539533018447-63fcce2678e3?w=800&q=80'],
  stock: 10,
  inStock: true,
  isActive: true,
  colors: [{ name: 'Camel', hex: '#c19a6b' }],
  sizes: ['S', 'M', 'L'],
  createdAt: '2024-01-01T00:00:00Z',
  updatedAt: '2024-01-01T00:00:00Z',
};

export const puckComponentName = 'ProductDetailsClient';
export const puckLabel = 'Product Details (Add to Cart)';
export const puckCategory = 'Products';
export const puckFields = {
  productSlug: { type: 'text' as const, label: 'Product Slug (auto-fill product)' },
};
export const puckDefaults = { productSlug: 'premium-wool-coat', product: previewProduct };
export const puckAst = {
  kind: 'runtime',
  sourceJsxNames: ['ProductDetailsClient'],
  sourceImportPaths: ['@/components/templates/products/ProductDetailsClient'],
  role: 'product-detail-purchase-controls',
  runtimeSignals: ['product'],
};

export async function puckDataFetcher(
  props: { productSlug?: string },
  context?: PuckFetcherContext,
) {
  const productSlug = resolveProductDetailSlug(props, context);
  if (!productSlug) return {};
  return { product: await fetchProduct(productSlug) };
}

// Delegates the stateful purchase flow to the production component.
export function ProductDetailsClientView({ product = previewProduct }: ProductDetailsClientViewProps) {
  return <ProductDetailsClient product={product} />;
}
