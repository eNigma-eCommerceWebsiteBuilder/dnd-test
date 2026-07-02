import { cn } from '@/lib/utils/cn';
import type { Testimonial } from '@/lib/api/types/testimonials';
import { groupTestimonialsByRating } from '@/lib/utils/ecommerce';
import { TestimonialStats } from '@/components/testimonials/TestimonialStats';
import { RatingDistribution } from '@/components/testimonials/RatingDistribution';
import { TestimonialGrid } from '@/components/testimonials/TestimonialGrid';

interface TestimonialsSectionProps {
    testimonials: Testimonial[];
    title?: string;
    subtitle?: string;
    className?: string;
}

/**
 * TestimonialsSection Component (Server)
 * Section wrapper with title + stats + grid
 */
export function TestimonialsSection({ testimonials, title, subtitle, className }: TestimonialsSectionProps) {
    if (!testimonials || testimonials.length === 0) return null;

    const groupedByRating = groupTestimonialsByRating(testimonials);
    const fiveStarCount = groupedByRating[5]?.length || 0;
    const fourStarCount = groupedByRating[4]?.length || 0;

    return (
        <section className={cn("@container w-full", className)}>
            {(title || subtitle) && (
                <div className="mb-8">
                    {title && (
                        <h2 className="text-3xl @lg:text-4xl font-heading font-bold text-text-base">
                            {title}
                        </h2>
                    )}
                    {subtitle && (
                        <p className="text-text-muted mt-2 max-w-2xl">
                            {subtitle}
                        </p>
                    )}
                </div>
            )}

            <div className="grid grid-cols-1 @lg:grid-cols-[1.2fr_1fr] gap-6 mb-10">
                <TestimonialStats testimonials={testimonials} />
                <RatingDistribution testimonials={testimonials} />
            </div>

            <div className="flex flex-wrap items-center gap-4 text-xs text-text-muted mb-6">
                <span className="inline-flex items-center gap-2 rounded-badge border border-border bg-bg-sunken px-3 py-1">
                    <span className="material-symbols-outlined text-[14px]">star</span>
                    5-star reviews: {fiveStarCount}
                </span>
                <span className="inline-flex items-center gap-2 rounded-badge border border-border bg-bg-sunken px-3 py-1">
                    <span className="material-symbols-outlined text-[14px]">star</span>
                    4-star reviews: {fourStarCount}
                </span>
            </div>

            <TestimonialGrid testimonials={testimonials} />
        </section>
    );
}

export default TestimonialsSection;