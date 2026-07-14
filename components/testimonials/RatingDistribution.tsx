import { cn } from '@/lib/utils/cn';
import type { Testimonial } from '@/lib/api/types/testimonials';
import { getTestimonialRatingPercentage } from '@/lib/utils/ecommerce';

interface RatingDistributionProps {
    testimonials: Testimonial[];
    className?: string;
}

/**
 * RatingDistribution Component (Server)
 * Star rating bar chart
 */
export function RatingDistribution({ testimonials, className }: RatingDistributionProps) {
    const safeTestimonials = testimonials || [];

    return (
        <div className={cn("@container w-full rounded-card border border-border bg-bg-surface p-6 shadow-card", className)}>
            <div className="space-y-3">
                {[5, 4, 3, 2, 1].map((star) => {
                    const percentage = getTestimonialRatingPercentage(safeTestimonials, star);

                    return (
                        <div key={star} className="flex items-center gap-4">
                            <span className="text-xs font-semibold text-text-base w-12">
                                {star} Star
                            </span>
                            <div className="flex-1 h-2 bg-bg-sunken rounded-full overflow-hidden">
                                <div
                                    className="h-full bg-primary rounded-full transition-all duration-500"
                                    style={{ width: `${percentage}%` }}
                                />
                            </div>
                            <span className="text-xs font-semibold text-text-base w-10 text-right">
                                {Math.round(percentage)}%
                            </span>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}

export default RatingDistribution;