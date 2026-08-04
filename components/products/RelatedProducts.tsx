import { cn } from '@/lib/utils/cn';
import { ProductCard } from '@/components/ui/ProductCard';
import type { Product } from '@/lib/api/types';

interface RelatedProductsProps {
    products: Product[];
    title?: string;
    className?: string;
}

/**
 * RelatedProducts Component (Server)
 * 
 * Related products grid/carousel following LUXE design.
 * Uses existing ProductCard component.
 */
export function RelatedProducts({
    products,
    title = 'Complete the Look',
    className
}: RelatedProductsProps) {
    if (!products || products.length === 0) {
        return null;
    }

    return (
        <section className={cn("@container", className)}>
            {/* Header with Navigation */}
            <div className="flex items-center justify-between mb-10">
                <h2 className="text-2xl @md:text-3xl font-extrabold tracking-tight text-text-base">
                    {title}
                </h2>

                {/* Navigation Arrows (visual only in SSR, can be enhanced client-side) */}
                <div className="flex gap-2">
                    <button
                        className="size-10 rounded-full border border-border flex items-center justify-center hover:bg-bg-hover transition-colors"
                        aria-label="Previous products"
                    >
                        <span className="material-symbols-outlined">chevron_left</span>
                    </button>
                    <button
                        className="size-10 rounded-full border border-border flex items-center justify-center hover:bg-bg-hover transition-colors"
                        aria-label="Next products"
                    >
                        <span className="material-symbols-outlined">chevron_right</span>
                    </button>
                </div>
            </div>

            {/* Products Grid */}
            <div className="grid grid-cols-2 @lg:grid-cols-4 gap-6">
                {products.slice(0, 4).map((product) => (
                    <ProductCard
                        key={product._id}
                        product={product}
                        showWishlist={true}
                        showQuickAdd={true}
                    />
                ))}
            </div>
        </section>
    );
}

export default RelatedProducts;
