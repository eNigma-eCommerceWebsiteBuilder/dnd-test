/**
 * SubcategoryNav Component
 * 
 * Server Component displaying horizontal navigation for subcategories.
 * Following PAGE_AND_COMPONENTS_PLAN.md theme patterns.
 */

import Link from 'next/link';
import type { Category } from '@/lib/api/types';

interface SubcategoryNavProps {
    categories: Category[];
    currentSlug?: string;
    parentSlug?: string;
}

export function SubcategoryNav({ categories, currentSlug, parentSlug }: SubcategoryNavProps) {
    if (!categories || categories.length === 0) {
        return null;
    }

    return (
        <nav className="@container mb-8 overflow-x-auto scrollbar-hide">
            <div className="flex items-center gap-3 min-w-max pb-2">
                {/* "All" option linking to parent */}
                {parentSlug && (
                    <Link
                        href={`/categories/${parentSlug}`}
                        className={`
                            px-4 py-2 rounded-full text-sm font-semibold transition-all
                            ${!currentSlug
                                ? 'bg-primary text-on-primary'
                                : 'bg-bg-surface text-text-muted hover:bg-bg-hover hover:text-text-base border border-border'
                            }
                        `}
                    >
                        All
                    </Link>
                )}

                {categories.map((category) => {
                    const isActive = category.slug === currentSlug;

                    return (
                        <Link
                            key={category._id}
                            href={`/categories/${category.slug}`}
                            className={`
                                px-4 py-2 rounded-full text-sm font-semibold transition-all whitespace-nowrap
                                ${isActive
                                    ? 'bg-primary text-on-primary'
                                    : 'bg-bg-surface text-text-muted hover:bg-bg-hover hover:text-text-base border border-border'
                                }
                            `}
                        >
                            {category.name}
                            {category.productCount !== undefined && (
                                <span className="ml-1.5 opacity-70">
                                    ({category.productCount})
                                </span>
                            )}
                        </Link>
                    );
                })}
            </div>
        </nav>
    );
}
