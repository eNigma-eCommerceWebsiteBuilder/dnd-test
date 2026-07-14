/**
 * CategoryCard Component
 * 
 * Server Component displaying a category with image, name, and item count.
 * Following PAGE_AND_COMPONENTS_PLAN.md container query pattern.
 */

import Link from 'next/link';
import type { Category } from '@/lib/api/types';

interface CategoryCardProps {
    category: Category;
    hrefPrefix?: string;
}

export function CategoryCard({ category, hrefPrefix = '/categories' }: CategoryCardProps) {
    const imageUrl = category.image || category.imageUrl || '/placeholder-category.jpg';
    const itemCount = category.productCount ?? category.itemCount ?? 0;
    const href = `${hrefPrefix}/${category.slug}`;

    return (
        <Link
            href={href}
            className="@container group cursor-pointer block"
        >
            {/* Image Container */}
            <div className="aspect-[4/5] rounded-card overflow-hidden mb-4 bg-bg-skeleton relative">
                <div
                    className="absolute inset-0 bg-cover bg-center transition-transform duration-500 group-hover:scale-110"
                    style={{ backgroundImage: `url('${imageUrl}')` }}
                    role="img"
                    aria-label={category.name}
                />
                {/* Hover Overlay */}
                <div className="absolute inset-0 bg-primary/0 group-hover:bg-primary/10 transition-colors duration-300" />
            </div>

            {/* Text Content */}
            <div className="flex justify-between items-start">
                <div>
                    <h3 className="text-xl font-bold text-text-base group-hover:text-primary transition-colors">
                        {category.name}
                    </h3>
                    <p className="text-sm text-text-muted mt-1">
                        {itemCount.toLocaleString()} Items Available
                    </p>
                </div>
                <span className="material-symbols-outlined text-text-lighter group-hover:text-primary transition-colors">
                    arrow_right_alt
                </span>
            </div>
        </Link>
    );
}
