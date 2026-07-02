/**
 * EmptyCategory Component
 * 
 * Server Component showing empty state when a category has no products.
 * Following PAGE_AND_COMPONENTS_PLAN.md theme patterns.
 */

import Link from 'next/link';

export function EmptyCategory() {
    return (
        <div className="@container flex flex-col items-center justify-center py-16 @md:py-24 text-center">
            {/* Icon */}
            <div className="size-20 rounded-full bg-bg-surface flex items-center justify-center mb-6">
                <span className="material-symbols-outlined text-4xl text-text-muted">
                    inventory_2
                </span>
            </div>

            {/* Title */}
            <h2 className="text-2xl font-bold text-text-base mb-3">
                No Products Found
            </h2>

            {/* Description */}
            <p className="text-text-muted max-w-md mb-8 leading-relaxed">
                This category is currently empty. Check back soon for new arrivals.
            </p>

            {/* CTA */}
            <Link
                href="/categories"
                className="inline-flex items-center gap-2 bg-primary text-on-primary px-6 py-3 rounded-button font-bold hover:bg-primary-dark transition-colors"
            >
                <span className="material-symbols-outlined text-xl">arrow_back</span>
                Browse All Categories
            </Link>
        </div>
    );
}
