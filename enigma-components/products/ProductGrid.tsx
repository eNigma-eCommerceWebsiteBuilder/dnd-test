'use client';

import { cn } from '@/lib/utils/cn';
import { ProductCard } from '@/components/ui/ProductCard';
import { ProductImpressionTracker } from '@/lib/analytics';
import type { Product } from '@/lib/api/types/products';

interface ProductGridProps {
    products: Product[];
    listName?: string;
    className?: string;
    hrefPrefix?: string;
}

/**
 * ProductGrid Component
 * 
 * Responsive product grid using container queries as per PAGE_AND_COMPONENTS_PLAN.md.
 * Adapts to container width (not viewport) for flexible layouts.
 * Includes analytics tracking via ProductImpressionTracker.
 */
export function ProductGrid({ products, listName = 'Product Listing', className, hrefPrefix }: ProductGridProps) {
    if (products.length === 0) {
        return null;
    }

    return (
        <ProductImpressionTracker listName={listName}>
            <div
                className={cn(
                    // Container query context
                    "@container",
                    // Responsive grid based on container width
                    "grid grid-cols-1 @sm:grid-cols-2 @lg:grid-cols-3 @2xl:grid-cols-4",
                    // Gap scales with container
                    "gap-6 @md:gap-8 @xl:gap-10",
                    className
                )}
            >
                {products.map((product, index) => {
                    const categoryName = typeof product.category === 'string'
                        ? product.category
                        : product.category?.name;

                    return (
                        <div
                            key={product._id}
                            className="w-full"
                            data-analytics-product-id={product._id}
                            data-analytics-product-name={product.name}
                            data-analytics-product-price={product.price}
                            data-analytics-product-category={categoryName}
                            data-analytics-position={index + 1}
                            data-analytics-list={listName}
                        >
                            <ProductCard
                                product={product}
                                showWishlist={true}
                                showQuickAdd={true}
                                hrefPrefix={hrefPrefix}
                            />
                        </div>
                    );
                })}
            </div>
        </ProductImpressionTracker>
    );
}

export default ProductGrid;
