import { SpecsTable } from '@/components/products/SpecsTable';
import type { Product } from '@/lib/api/types/products';
import type { ReviewsResponse } from '@/lib/api/types/reviews';

export function buildProductBreadcrumbs(product: Product) {
    const categoryName = typeof product.category === 'string'
        ? product.category
        : product.category?.name || 'Shop';
    const categorySlug = typeof product.category === 'string'
        ? product.category
        : product.category?.slug || '';

    return [
        { label: 'Home', href: '/' },
        { label: categoryName, href: `/products?category=${categorySlug}` },
        { label: product.name },
    ];
}

export function buildProductTabs(
    product: Product,
    reviewsData: ReviewsResponse,
) {
    const descriptionContent = (
        <div className="prose max-w-none leading-relaxed text-text-muted">
            {product.fullDescription ? (
                <div dangerouslySetInnerHTML={{ __html: product.fullDescription }} />
            ) : (
                <p>{product.description}</p>
            )}
        </div>
    );

    const specsContent = product.specs?.length ? (
        <SpecsTable specs={product.specs} />
    ) : (
        <p className="text-text-muted">No specifications available.</p>
    );

    return [
        { id: 'description', label: 'Description', content: descriptionContent },
        { id: 'specifications', label: 'Specifications', content: specsContent },
        {
            id: 'reviews',
            label: `Reviews (${reviewsData.totalItems || product.reviewCount || 0})`,
            content: <p className="text-sm text-text-muted">See customer reviews section below.</p>,
        },
    ];
}
