import type { Product } from '@/lib/api/types/products';
import { cn } from '@/lib/utils/cn';
import { formatPrice, formatRating } from '@/lib/utils/formatters';

interface RelatedProductsGridProps {
  title?: string;
  products: Product[];
  count?: number;
  className?: string;
}

/**
 * RelatedProductsGrid Component (Server)
 * Related products list for curated collections.
 */
export function RelatedProductsGrid({ title = 'Complete the Look', products, count, className }: RelatedProductsGridProps) {
  const hasProducts = products.length > 0;

  return (
    <div className={cn('@container w-full rounded-card border border-border bg-bg-surface p-6 shadow-card', className)}>
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-border pb-4">
        <h3 className="text-lg font-semibold text-heading">{title}</h3>
        {count !== undefined ? (
          <span className="text-sm text-text-muted">{count} items</span>
        ) : null}
      </div>
      {hasProducts ? (
        <div className="mt-6 flex flex-col gap-4">
          {products.map((product) => {
            const price = formatPrice(product.salePrice ?? product.price);
            const rating = product.rating !== undefined ? formatRating(product.rating) : null;

            return (
              <div
                key={product._id}
                className="group flex items-center gap-4 rounded-card border border-border bg-bg-elevated p-4 transition-colors hover:bg-bg-hover"
              >
                <div className="w-1/3 overflow-hidden rounded-image bg-bg-skeleton">
                  <div
                    className="aspect-square w-full bg-cover bg-center transition-transform duration-500 group-hover:scale-105"
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
                <div className="flex-1">
                  <p className="text-sm font-semibold text-heading">{product.name}</p>
                  <p className="mt-2 text-sm font-semibold text-price">{price}</p>
                  {rating ? (
                    <div className="mt-2 flex items-center gap-1 text-xs text-text-muted">
                      <span className="material-symbols-outlined text-rating text-sm">star</span>
                      <span>{rating.display}</span>
                    </div>
                  ) : null}
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="mt-6 rounded-card border border-border bg-bg-sunken p-6 text-center">
          <p className="text-sm text-text-muted">No related products available.</p>
        </div>
      )}
    </div>
  );
}

export default RelatedProductsGrid;