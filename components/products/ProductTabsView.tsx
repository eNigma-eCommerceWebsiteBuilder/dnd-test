import type { Product } from '@/lib/api/types/products';
import type { ReviewsResponse } from '@/lib/api/types/reviews';
import { fetchProduct, fetchProductReviews } from '@/lib/api/services/products';
import { ProductTabs } from './ProductTabs';
import { buildProductTabs } from './canonical/ProductDetailContent';
import { resolveProductDetailSlug } from './product-detail-route';
import type { PuckFetcherContext } from '@/lib/puck-route-metadata';

interface ProductTabsViewProps {
  productSlug?: string;
  defaultTab?: string;
  product?: Product;
  reviewsData?: ReviewsResponse;
  className?: string;
}

const previewProduct: Product = {
  _id: 'product-detail-preview',
  name: 'Premium Wool Coat',
  slug: 'premium-wool-coat',
  price: 450,
  description: 'Crafted from premium materials for enduring comfort and style.',
  images: ['https://images.unsplash.com/photo-1539533018447-63fcce2678e3?w=800&q=80'],
  stock: 10,
  inStock: true,
  isActive: true,
  createdAt: '2024-01-01T00:00:00Z',
  updatedAt: '2024-01-01T00:00:00Z',
};

const emptyReviews: ReviewsResponse = {
  items: [],
  averageRating: 0,
  totalReviews: 0,
  ratingDistribution: {},
  page: 1,
  pageSize: 5,
  totalItems: 0,
  totalPages: 0,
};

export const puckComponentName = 'ProductTabs';
export const puckLabel = 'Product Tabs';
export const puckCategory = 'Products';

export const puckFields = {
  productSlug: { type: 'text' as const, label: 'Product slug (auto-fill content)' },
  defaultTab: { type: 'text' as const, label: 'Default tab ID' },
};

export const puckDefaults = {
  productSlug: 'premium-wool-coat',
  defaultTab: 'description',
  product: previewProduct,
  reviewsData: emptyReviews,
};
export const puckAst = {
  kind: 'runtime',
  sourceJsxNames: ['ProductTabs'],
  sourceImportPaths: ['@/components/products/ProductTabs'],
  role: 'product-tabs',
  runtimeSignals: ['product', 'reviews'],
};

export async function puckDataFetcher(
  props: { productSlug?: string },
  context?: PuckFetcherContext,
) {
  const productSlug = resolveProductDetailSlug(props, context);
  if (!productSlug) return {};

  const [product, reviewsData] = await Promise.all([
    fetchProduct(productSlug),
    fetchProductReviews(productSlug, { page: 1, pageSize: 5 }).catch(() => emptyReviews),
  ]);
  return { product, reviewsData };
}

// Delegates the exact source tab content, including rich description and specs nodes.
export function ProductTabsView({
  defaultTab = 'description',
  product = previewProduct,
  reviewsData = emptyReviews,
  className,
}: ProductTabsViewProps) {
  return <ProductTabs defaultTab={defaultTab} tabs={buildProductTabs(product, reviewsData)} className={className} />;
}
