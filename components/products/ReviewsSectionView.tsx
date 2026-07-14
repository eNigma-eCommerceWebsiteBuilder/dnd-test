import type { Review } from '@/lib/api/types/reviews';
import { fetchProduct, fetchProductReviews } from '@/lib/api/services/products';
import { ReviewsSection } from './ReviewsSection';
import { resolveProductDetailSlug } from './product-detail-route';
import type { PuckFetcherContext } from '@/lib/puck-route-metadata';

interface ReviewsSectionViewProps {
  productSlug?: string;
  productId: string;
  initialReviews: Review[];
  averageRating: number;
  totalReviews: number;
  ratingDistribution: Record<string, number>;
  className?: string;
}

export const puckComponentName = 'ReviewsSection';
export const puckLabel = 'Reviews Section';
export const puckCategory = 'Products';
export const puckFields = { productSlug: { type: 'text' as const, label: 'Product Slug (auto-fill reviews)' } };
export const puckDefaults = { productSlug: 'premium-wool-coat', productId: 'product-detail-preview', initialReviews: [], averageRating: 4.5, totalReviews: 0, ratingDistribution: {} };
export const puckAst = { kind: 'runtime', sourceJsxNames: ['ReviewsSection'], sourceImportPaths: ['@/components/products/ReviewsSection'], role: 'product-detail-reviews', runtimeSignals: ['product', 'reviews'] };

export async function puckDataFetcher(
  props: { productSlug?: string },
  context?: PuckFetcherContext,
) {
  const productSlug = resolveProductDetailSlug(props, context);
  if (!productSlug) return {};
  const [product, reviews] = await Promise.all([
    fetchProduct(productSlug),
    fetchProductReviews(productSlug, { page: 1, pageSize: 5 }),
  ]);
  return {
    productId: product._id,
    initialReviews: reviews.items,
    averageRating: reviews.averageRating || product.rating || 0,
    totalReviews: reviews.totalItems || product.reviewCount || 0,
    ratingDistribution: reviews.ratingDistribution || {},
  };
}

export function ReviewsSectionView(props: ReviewsSectionViewProps) {
  return <ReviewsSection productId={props.productId} initialReviews={props.initialReviews} averageRating={props.averageRating} totalReviews={props.totalReviews} ratingDistribution={props.ratingDistribution} className={props.className} />;
}
