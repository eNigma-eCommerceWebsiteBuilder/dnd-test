import type { Product } from '@/lib/api/types/products';
import { cn } from '@/lib/utils/cn';
import { formatPrice, formatRating } from '@/lib/utils/formatters';
import { AddToCartButton } from '@/components/collections/AddToCartButton';
import { WishlistButton } from '@/components/collections/WishlistButton';

interface MainProductCardProps {
  product: Product;
  collectionName?: string;
  description?: string;
  addToCartLabel?: string;
  className?: string;
}

/**
 * MainProductCard Component (Server)
 * Featured product card for curated collections.
 */
export function MainProductCard({
  product,
  collectionName,
  description,
  addToCartLabel = 'Add to Collection',
  className,
}: MainProductCardProps) {
  const price = formatPrice(product.salePrice ?? product.price);
  const rating = product.rating !== undefined ? formatRating(product.rating) : null;
  const reviewCount = product.reviewCount ?? 0;
  return (
    <div className={cn('@container group w-full overflow-hidden rounded-card border border-border bg-bg-surface shadow-card', className)}>
      <div className="relative aspect-[4/5] w-full bg-bg-skeleton">
        <div
          className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-105"
          style={{
            backgroundImage: product.imageUrl
              ? `url('${product.imageUrl}')`
              : product.images?.[0]
                ? `url('${product.images[0]}')`
                : undefined,
          }}
          role="img"
          aria-label={product.name}
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
                {product.name}
              </h2>
              {collectionName ? (
                <p className="mt-1 text-sm text-text-muted">{collectionName}</p>
              ) : null}
            </div>
            <p className="text-3xl font-light text-price">{price}</p>
          </div>
          {rating ? (
            <div className="mt-3 flex items-center gap-2 text-sm text-text-muted">
              <div className="flex items-center gap-1">
                {Array.from({ length: rating.full }).map((_, index) => (
                  <span key={`star-full-${index}`} className="material-symbols-outlined text-rating text-sm">
                    star
                  </span>
                ))}
                {rating.half ? (
                  <span className="material-symbols-outlined text-rating text-sm">star_half</span>
                ) : null}
                {Array.from({ length: rating.empty }).map((_, index) => (
                  <span key={`star-empty-${index}`} className="material-symbols-outlined text-rating-empty text-sm">
                    star
                  </span>
                ))}
              </div>
              <span>{rating.display}</span>
              {reviewCount > 0 ? <span>({reviewCount})</span> : null}
            </div>
          ) : null}
        </div>
        {description ? (
          <p className="text-base leading-relaxed text-text-muted">{description}</p>
        ) : null}
        <div className="flex flex-wrap items-center gap-4">
          <AddToCartButton
            productId={product._id}
            label={addToCartLabel}
            className="flex-1 py-4 text-base font-bold"
          />
          <WishlistButton productId={product._id} className="h-12 w-12" />
        </div>
      </div>
    </div>
  );
}

export default MainProductCard;