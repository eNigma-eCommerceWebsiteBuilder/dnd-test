import { PriceDisplay } from './PriceDisplay';
import { fetchProduct } from '@/lib/api/services/products';
import { resolveProductDetailSlug } from './product-detail-route';
import type { PuckFetcherContext } from '@/lib/puck-route-metadata';

interface PriceDisplayViewProps {
  productSlug?: string;
  price: number;
  salePrice?: number | null;
  originalPrice?: number;
  isOnSale?: string;
  size?: 'default' | 'large';
  className?: string;
}

export const puckComponentName = 'PriceDisplay';
export const puckLabel = 'Price Display';
export const puckCategory = 'Products';

export const puckFields = {
  productSlug: { type: 'text' as const, label: 'Product Slug (auto-fill price)' },
  price: { type: 'number' as const, label: 'Price' },
  salePrice: { type: 'number' as const, label: 'Sale Price (optional)' },
  originalPrice: { type: 'number' as const, label: 'Original Price (optional)' },
  isOnSale: {
    type: 'select' as const,
    label: 'Is On Sale',
    options: [
      { label: 'No', value: 'false' },
      { label: 'Yes', value: 'true' },
    ],
  },
  size: {
    type: 'select' as const,
    label: 'Size',
    options: [
      { label: 'Default', value: 'default' },
      { label: 'Large', value: 'large' },
    ],
  },
};

export const puckDefaults = {
  productSlug: 'premium-wool-coat',
  price: 450,
  salePrice: null,
  originalPrice: undefined,
  isOnSale: 'false',
  size: 'large' as const,
};
export const puckAst = { kind: 'runtime', sourceJsxNames: ['PriceDisplay'], sourceImportPaths: ['@/components/products/PriceDisplay'], role: 'price-display', runtimeSignals: ['product.price'] };

export async function puckDataFetcher(props: { productSlug?: string }, context?: PuckFetcherContext) {
  const productSlug = resolveProductDetailSlug(props, context);
  if (!productSlug) return {};
  const product = await fetchProduct(productSlug);
  return {
    price: product.price,
    salePrice: product.salePrice ?? null,
    originalPrice: product.originalPrice ?? product.compareAtPrice,
    isOnSale: (product.isOnSale || product.onSale) ? 'true' : 'false',
  };
}


export function PriceDisplayView({
  price,
  salePrice,
  originalPrice,
  isOnSale,
  size = 'default',
  className,
}: PriceDisplayViewProps) {
  return <PriceDisplay price={price} salePrice={salePrice} originalPrice={originalPrice} isOnSale={isOnSale === 'true'} size={size} className={className} />;
}
