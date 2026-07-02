import { cn } from '@/lib/utils/cn';
import { formatRating } from '@/lib/utils/formatters';
import type { Testimonial } from '@/lib/api/types/testimonials';

interface TestimonialStatsProps {
    testimonials: Testimonial[];
    className?: string;
}

/**
 * TestimonialStats Component (Server)
 * Average rating and total count
 */
export function TestimonialStats({ testimonials, className }: TestimonialStatsProps) {
    const totalCount = testimonials?.length || 0;
    const averageRating = totalCount > 0
        ? testimonials.reduce((sum, t) => sum + t.rating, 0) / totalCount
        : 0;
    const ratingInfo = formatRating(averageRating);

    return (
        <div className={cn("@container w-full rounded-card border border-border bg-bg-surface p-6 shadow-card", className)}>
            <div className="flex items-center gap-6">
                <div className="text-5xl font-black text-text-base">
                    {ratingInfo.display}
                </div>
                <div className="flex flex-col gap-2">
                    <div className="flex items-center text-rating">
                        {[1, 2, 3, 4, 5].map((star) => (
                            <span
                                key={star}
                                className="material-symbols-outlined text-lg"
                                style={{
                                    fontVariationSettings:
                                        star <= ratingInfo.full
                                            ? "'FILL' 1"
                                            : star === ratingInfo.full + 1 && ratingInfo.half
                                                ? "'FILL' 0.5"
                                                : "'FILL' 0"
                                }}
                            >
                                {star <= ratingInfo.full
                                    ? 'star'
                                    : star === ratingInfo.full + 1 && ratingInfo.half
                                        ? 'star_half'
                                        : 'star'}
                            </span>
                        ))}
                    </div>
                    <div className="text-sm text-text-muted">
                        Based on {totalCount.toLocaleString()} reviews
                    </div>
                </div>
            </div>
        </div>
    );
}

export default TestimonialStats;