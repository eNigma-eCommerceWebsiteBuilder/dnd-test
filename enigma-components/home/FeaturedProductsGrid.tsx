'use client';

import { ProductCard } from '@/components/ui/ProductCard';
import { ProductImpressionTracker } from '@/lib/analytics';
import type { FeaturedProductsContent } from '@/lib/content';
import { cn } from '@/lib/utils/cn';
import type { Product } from '@/lib/api/types/products';

interface FeaturedProductsGridProps {
  className?: string;
  content: FeaturedProductsContent;
  products: Product[];
}

export const FeaturedProductsGrid = ({
  className,
  content,
  products,
}: FeaturedProductsGridProps) => {
  if (!Array.isArray(products) || products.length === 0) {
    return null;
  }

  const analyticsListName = content.header;

  return (
    <ProductImpressionTracker listName={analyticsListName}>
      <section className={cn('@container bg-bg-base', className)}>
        <div className="mb-12">
          <span className="mb-2 block text-xs font-bold uppercase tracking-widest text-primary">
            {content.subheader}
          </span>
          <h2 className="text-3xl font-extrabold text-text-base @lg:text-4xl">
            {content.header}
          </h2>
        </div>
        <div className="grid grid-cols-1 gap-8 @sm:grid-cols-2 @lg:grid-cols-4">
          {products.map((product, index) => {
            const categoryName =
              typeof product.category === 'string'
                ? product.category
                : product.category?.name;

            return (
              <div
                key={product._id ?? index}
                className="w-full"
                data-analytics-product-id={product._id}
                data-analytics-product-name={product.name}
                data-analytics-product-price={product.price}
                data-analytics-product-category={categoryName}
                data-analytics-position={index + 1}
                data-analytics-list={analyticsListName}
              >
                <ProductCard
                  product={product}
                  showQuickAdd
                  showWishlist
                />
              </div>
            );
          })}
        </div>
      </section>
    </ProductImpressionTracker>
  );
};
