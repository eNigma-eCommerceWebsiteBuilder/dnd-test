import { StockIndicator } from './StockIndicator';
import { fetchProduct } from '@/lib/api/services/products';
import { resolveProductDetailSlug } from './product-detail-route';
import type { PuckFetcherContext } from '@/lib/puck-route-metadata';

interface StockIndicatorViewProps {
  productSlug?: string;
  stock: number;
  inStock: string;
  stockThreshold?: number;
  className?: string;
}

export const puckComponentName = 'StockIndicator';
export const puckLabel = 'Stock Indicator';
export const puckCategory = 'Products';

export const puckFields = {
  productSlug: { type: 'text' as const, label: 'Product Slug (auto-fill stock)' },
  stock: { type: 'number' as const, label: 'Stock Count' },
  inStock: {
    type: 'select' as const,
    label: 'In Stock',
    options: [
      { label: 'No', value: 'false' },
      { label: 'Yes', value: 'true' },
    ],
  },
  stockThreshold: { type: 'number' as const, label: 'Low Stock Threshold' },
};

export const puckDefaults = {
  productSlug: 'premium-wool-coat',
  stock: 10,
  inStock: 'true',
  stockThreshold: 5,
};
export const puckAst = { kind: 'runtime', sourceJsxNames: ['StockIndicator'], sourceImportPaths: ['@/components/products/StockIndicator'], role: 'stock-indicator', runtimeSignals: ['product.stock'] };

export async function puckDataFetcher(props: { productSlug?: string }, context?: PuckFetcherContext) {
  const productSlug = resolveProductDetailSlug(props, context);
  if (!productSlug) return {};
  const product = await fetchProduct(productSlug);
  return {
    stock: product.stock,
    inStock: product.inStock ? 'true' : 'false',
  };
}


export function StockIndicatorView({
  stock,
  inStock,
  stockThreshold = 5,
  className,
}: StockIndicatorViewProps) {
  return <StockIndicator stock={stock} inStock={inStock === 'true'} stockThreshold={stockThreshold} className={className} />;
}
