import { cn } from '@/lib/utils/cn';
import { fetchCuratedCollections } from '@/lib/api/services/collections';

interface RelatedProductItem {
  name: string;
  image: string;
  price: string;
  rating: string;
}

interface CuratedProductDisplayViewProps {
  collectionSlug?: string;
  mainProductName: string;
  mainProductImage: string;
  mainProductPrice: string;
  mainProductRating: string;
  mainProductReviewCount: number;
  collectionName: string;
  description: string;
  relatedTitle: string;
  relatedProducts: RelatedProductItem[];
  relatedCount: number;
  addToCartLabel: string;
  className?: string;
}

export const puckComponentName = 'CuratedProductDisplay';
export const puckLabel = 'Curated Product Display';
export const puckCategory = 'Collections';

export const puckFields = {
  collectionSlug: { type: 'text' as const, label: 'Collection Slug (auto-fill from collection)' },
  mainProductName: { type: 'text' as const, label: 'Main Product Name' },
  mainProductImage: { type: 'text' as const, label: 'Main Product Image URL' },
  mainProductPrice: { type: 'text' as const, label: 'Main Product Price' },
  mainProductRating: { type: 'text' as const, label: 'Main Product Rating' },
  mainProductReviewCount: { type: 'number' as const, label: 'Review Count' },
  collectionName: { type: 'text' as const, label: 'Collection Name' },
  description: { type: 'textarea' as const, label: 'Description' },
  relatedTitle: { type: 'text' as const, label: 'Related Products Title' },
  relatedProducts: {
    type: 'array' as const,
    label: 'Related Products',
    arrayFields: {
      name: { type: 'text' as const, label: 'Name' },
      image: { type: 'text' as const, label: 'Image URL' },
      price: { type: 'text' as const, label: 'Price' },
      rating: { type: 'text' as const, label: 'Rating' },
    },
    defaultItemProps: {
      name: 'New Product',
      image: '',
      price: '$0',
      rating: '0',
    },
    getItemSummary: (item: RelatedProductItem) => item.name,
    max: 12,
  },
  relatedCount: { type: 'number' as const, label: 'Related Items Count' },
  addToCartLabel: { type: 'text' as const, label: 'Add to Cart Label' },
};

export const puckDefaults = {
  collectionSlug: 'winter-essentials',
  mainProductName: 'Signature Wool Overcoat',
  mainProductImage: 'https://images.unsplash.com/photo-1551488831-00ddcb6c6bd3?w=800&q=80',
  mainProductPrice: '$1,290',
  mainProductRating: '4.8',
  mainProductReviewCount: 124,
  collectionName: 'Winter Essentials',
  description: 'Crafted from premium Italian wool, this overcoat combines timeless tailoring with modern functionality. A centerpiece of our Winter Essentials collection.',
  relatedTitle: 'Complete the Look',
  relatedProducts: [
    { name: 'Cashmere Scarf', image: 'https://images.unsplash.com/photo-1611923134139-cb5f6c7c5e3e?w=400&q=80', price: '$220', rating: '4.6' },
    { name: 'Leather Gloves', image: 'https://images.unsplash.com/photo-1549298916-b41d501d3779?w=400&q=80', price: '$180', rating: '4.7' },
    { name: 'Wool Beanie', image: 'https://images.unsplash.com/photo-1576871337622-98d48d1cf531?w=400&q=80', price: '$95', rating: '4.5' },
  ],
  relatedCount: 4,
  addToCartLabel: 'Add to Collection',
};

export async function puckDataFetcher(props: { collectionSlug?: string }) {
  const collections = await fetchCuratedCollections();
  const collection = props.collectionSlug
    ? collections.find((c) => c.slug === props.collectionSlug)
    : collections[0];
  if (!collection) return {};
  const main = collection.mainProduct;
  const related = collection.relatedProducts || [];
  return {
    mainProductName: main.name,
    mainProductImage: main.images?.[0] || '',
    mainProductPrice: main.salePrice ? "$" + main.salePrice : "$" + main.price,
    mainProductRating: main.rating?.toString() || '0',
    mainProductReviewCount: main.reviewCount || 0,
    collectionName: collection.name,
    description: collection.description || '',
    relatedProducts: related.map((p) => ({
      name: p.name,
      image: p.images?.[0] || '',
      price: p.salePrice ? "$" + p.salePrice : "$" + p.price,
      rating: p.rating?.toString() || '0',
    })),
    relatedCount: related.length,
  };
}

export function CuratedProductDisplayView({
  mainProductName,
  mainProductImage,
  mainProductPrice,
  mainProductRating,
  mainProductReviewCount,
  collectionName,
  description,
  relatedTitle = 'Complete the Look',
  relatedProducts,
  relatedCount,
  addToCartLabel = 'Add to Collection',
  className,
}: CuratedProductDisplayViewProps) {
  const ratingNum = parseFloat(mainProductRating) || 0;
  const fullStars = Math.floor(ratingNum);
  const hasHalf = ratingNum % 1 >= 0.25 && ratingNum % 1 < 0.75;
  const emptyStars = Math.max(0, 5 - fullStars - (hasHalf ? 1 : 0));

  return (
    <div className={cn('@container w-full', className)}>
      <div className="grid w-full grid-cols-1 gap-12 @lg:grid-cols-[2fr_1fr] @lg:gap-16">
        {/* Main Product Card */}
        <div className="@container group w-full overflow-hidden rounded-card border border-border bg-bg-surface shadow-card">
          <div className="relative aspect-[4/5] w-full bg-bg-skeleton">
            <div
              className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-105"
              style={{
                backgroundImage: mainProductImage
                  ? `url('${mainProductImage}')`
                  : undefined,
              }}
              role="img"
              aria-label={mainProductName}
            />
          </div>
          <div className="flex flex-col gap-4 p-8 @lg:p-10">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wide text-primary">
                Featured Piece
              </p>
              <div className="mt-2 flex flex-wrap items-start justify-between gap-4">
                <div>
                  <h2 className="text-3xl font-extrabold tracking-tight text-heading">
                    {mainProductName}
                  </h2>
                  {collectionName ? (
                    <p className="mt-1 text-sm text-text-muted">{collectionName}</p>
                  ) : null}
                </div>
                <p className="text-3xl font-light text-price">{mainProductPrice}</p>
              </div>
              {ratingNum > 0 ? (
                <div className="mt-3 flex items-center gap-2 text-sm text-text-muted">
                  <div className="flex items-center gap-1">
                    {Array.from({ length: fullStars }).map((_, index) => (
                      <span key={`star-full-${index}`} className="material-symbols-outlined text-rating text-sm">
                        star
                      </span>
                    ))}
                    {hasHalf ? (
                      <span className="material-symbols-outlined text-rating text-sm">star_half</span>
                    ) : null}
                    {Array.from({ length: emptyStars }).map((_, index) => (
                      <span key={`star-empty-${index}`} className="material-symbols-outlined text-rating-empty text-sm">
                        star
                      </span>
                    ))}
                  </div>
                  <span>{mainProductRating}</span>
                  {mainProductReviewCount > 0 ? <span>({mainProductReviewCount})</span> : null}
                </div>
              ) : null}
            </div>
            {description ? (
              <p className="text-base leading-relaxed text-text-muted">{description}</p>
            ) : null}
            <div className="flex flex-wrap items-center gap-4">
              <button
                type="button"
                className="flex-1 rounded-button bg-cta-primary px-6 py-4 text-base font-bold text-on-primary transition-colors hover:bg-cta-primary-hover"
              >
                {addToCartLabel}
              </button>
              <button
                type="button"
                className="flex h-12 w-12 items-center justify-center rounded-button border border-border bg-bg-surface text-text-muted transition-colors hover:border-primary hover:text-primary"
                aria-label="Add to wishlist"
              >
                <span className="material-symbols-outlined">favorite_border</span>
              </button>
            </div>
          </div>
        </div>

        {/* Related Products Grid */}
        <div className="@container w-full rounded-card border border-border bg-bg-surface p-6 shadow-card">
          <div className="flex flex-wrap items-center justify-between gap-2 border-b border-border pb-4">
            <h3 className="text-lg font-semibold text-heading">{relatedTitle}</h3>
            {relatedCount !== undefined ? (
              <span className="text-sm text-text-muted">{relatedCount} items</span>
            ) : null}
          </div>
          {relatedProducts.length > 0 ? (
            <div className="mt-6 flex flex-col gap-4">
              {relatedProducts.map((product, index) => (
                <div
                  key={index}
                  className="group flex items-center gap-4 rounded-card border border-border bg-bg-elevated p-4 transition-colors hover:bg-bg-hover"
                >
                  <div className="w-1/3 overflow-hidden rounded-image bg-bg-skeleton">
                    <div
                      className="aspect-square w-full bg-cover bg-center transition-transform duration-500 group-hover:scale-105"
                      style={{
                        backgroundImage: product.image
                          ? `url('${product.image}')`
                          : undefined,
                      }}
                      role="img"
                      aria-label={product.name}
                    />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-semibold text-heading">{product.name}</p>
                    <p className="mt-2 text-sm font-semibold text-price">{product.price}</p>
                    {parseFloat(product.rating) > 0 ? (
                      <div className="mt-2 flex items-center gap-1 text-xs text-text-muted">
                        <span className="material-symbols-outlined text-rating text-sm">star</span>
                        <span>{product.rating}</span>
                      </div>
                    ) : null}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="mt-6 rounded-card border border-border bg-bg-sunken p-6 text-center">
              <p className="text-sm text-text-muted">No related products available.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
