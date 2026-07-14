/**
 * TrendingCategoryCard Component
 * 
 * Server Component for large trending category cards with hero-style layout.
 * Following PAGE_AND_COMPONENTS_PLAN.md theme and container query patterns.
 */

import Link from 'next/link';
import type { Category } from '@/lib/api/types';

interface TrendingCategoryCardProps {
    category: Category;
    badge?: string;
    hrefPrefix?: string;
}

export function TrendingCategoryCard({ category, badge, hrefPrefix = '/categories' }: TrendingCategoryCardProps) {
    const imageUrl = category.image || category.imageUrl || '/placeholder-category.jpg';
    const href = `${hrefPrefix}/${category.slug}`;

    // Determine badge text - use provided badge, category badge, or default
    const badgeText = badge || category.badge || 'Trending Now';

    return (
        <Link
            href={href}
            className="@container group relative aspect-[16/9] overflow-hidden rounded-card-lg bg-bg-skeleton shadow-card cursor-pointer block"
        >
            {/* Background Image with Hover Scale */}
            {/* Note: rgba gradient is a hardcoded exception per spec 2.1 - complex gradients allowed */}
            <div
                className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-105"
                style={{
                    backgroundImage: `linear-gradient(to top, rgba(0,0,0,0.7) 0%, transparent 60%), url('${imageUrl}')`,
                }}
                role="img"
                aria-label={category.name}
            />

            {/* Content Overlay */}
            <div className="absolute bottom-0 left-0 p-8 text-text-inverse w-full">
                {/* Badge */}
                <span className="bg-primary text-on-primary px-3 py-1 rounded-full text-xs font-bold uppercase tracking-widest mb-4 inline-block">
                    {badgeText}
                </span>

                {/* Title */}
                <h3 className="text-3xl font-bold mb-2">{category.name}</h3>

                {/* Description */}
                {category.description && (
                    <p className="text-text-inverse/80 max-w-md mb-6 line-clamp-2">
                        {category.description}
                    </p>
                )}

                {/* CTA Button */}
                <span className="bg-bg-surface text-text-base px-6 py-3 rounded-button font-bold inline-flex items-center gap-2 hover:bg-primary hover:text-on-primary transition-all">
                    Explore Collection
                    <span className="material-symbols-outlined">north_east</span>
                </span>
            </div>
        </Link>
    );
}
