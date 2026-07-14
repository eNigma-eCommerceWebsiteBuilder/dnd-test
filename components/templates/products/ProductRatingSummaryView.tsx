import { fetchProduct } from '@/lib/api/services/products';
import { ProductRatingSummary } from '@/enigma-components/templates/products/ProductRatingSummary';
import { resolveProductDetailSlug } from '@/components/products/product-detail-route';
import type { PuckFetcherContext } from '@/lib/puck-route-metadata';

interface ProductRatingSummaryViewProps {
  productSlug?: string;
  rating: number;
  reviewCount: number;
}

export const puckComponentName = 'ProductRatingSummary';
export const puckLabel = 'Product Rating Summary';
export const puckCategory = 'Products';
export const puckFields = {
  productSlug: { type: 'text' as const, label: 'Product Slug (auto-fill rating)' },
  rating: { type: 'number' as const, label: 'Rating (0-5)' },
  reviewCount: { type: 'number' as const, label: 'Review Count' },
};
export const puckDefaults = { productSlug: 'premium-wool-coat', rating: 4.5, reviewCount: 128 };
export const puckAst = {
  kind: 'runtime',
  sourceJsxNames: ['ProductRatingSummary'],
  sourceImportPaths: ['@/components/templates/products/ProductRatingSummary'],
  role: 'product-detail-rating',
  runtimeSignals: ['product.rating', 'product.reviewCount'],
};

export async function puckDataFetcher(
  props: { productSlug?: string },
  context?: PuckFetcherContext,
) {
  const productSlug = resolveProductDetailSlug(props, context);
  if (!productSlug) return {};
  const product = await fetchProduct(productSlug);
  return { rating: product.rating ?? 0, reviewCount: product.reviewCount ?? 0 };
}

export function ProductRatingSummaryView({ rating, reviewCount }: ProductRatingSummaryViewProps) {
  return <ProductRatingSummary rating={rating} reviewCount={reviewCount} />;
}
