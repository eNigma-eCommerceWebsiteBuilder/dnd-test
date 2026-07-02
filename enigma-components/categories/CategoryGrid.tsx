/**
 * CategoryGrid Component
 * 
 * Server Component displaying a responsive grid of categories.
 * Following PAGE_AND_COMPONENTS_PLAN.md container query pattern.
 */

import type { Category } from '@/lib/api/types';
import { CategoryCard } from './CategoryCard';

interface CategoryGridProps {
    categories: Category[];
    showConciergeCard?: boolean;
}

export function CategoryGrid({ categories, showConciergeCard = true }: CategoryGridProps) {
    return (
        <div className="@container grid grid-cols-2 @lg:grid-cols-4 gap-8">
            {categories.map((category) => (
                <CategoryCard key={category._id} category={category} />
            ))}

            {/* Concierge Card - optional CTA card */}
            {showConciergeCard && (
                <div className="group cursor-pointer">
                    <div className="aspect-[4/5] rounded-card overflow-hidden mb-4 bg-bg-surface relative flex items-center justify-center border-2 border-dashed border-primary/30 group-hover:bg-primary/5 transition-all">
                        <div className="text-center p-6">
                            <span className="material-symbols-outlined text-4xl text-primary mb-2">
                                auto_awesome
                            </span>
                            <p className="font-bold text-text-base">Concierge Sourcing</p>
                            <p className="text-xs text-text-muted mt-2">
                                Can&apos;t find what you&apos;re looking for? Let our experts help.
                            </p>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
