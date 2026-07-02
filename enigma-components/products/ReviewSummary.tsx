import { cn } from '@/lib/utils/cn';
import { formatRating } from '@/lib/utils/formatters';
import { getRatingPercentage, RatingDistribution } from '@/lib/utils/ecommerce';

interface ReviewSummaryProps {
    averageRating: number;
    totalReviews: number;
    ratingDistribution: Record<string, number>;
    className?: string;
}

export function ReviewSummary({
    averageRating,
    totalReviews,
    ratingDistribution,
    className
}: ReviewSummaryProps) {
    const ratingInfo = formatRating(averageRating);

    // Convert string keys to number keys for RatingDistribution type
    const distribution: RatingDistribution = {
        1: ratingDistribution['1'] || 0,
        2: ratingDistribution['2'] || 0,
        3: ratingDistribution['3'] || 0,
        4: ratingDistribution['4'] || 0,
        5: ratingDistribution['5'] || 0,
    };

    return (
        <div className={cn("@container space-y-6", className)}>
            {/* Overall Rating Card */}
            <div className="bg-bg-surface p-8 rounded-2xl border border-border text-center">
                <div className="text-6xl font-black text-text-base mb-2">
                    {ratingInfo.display}
                </div>
                {/* Star Display */}
                <div className="flex justify-center text-rating mb-2">
                    {[1, 2, 3, 4, 5].map((star) => (
                        <span
                            key={star}
                            className="material-symbols-outlined"
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
                <div className="text-sm font-medium text-text-muted">
                    Based on {totalReviews.toLocaleString()} verified reviews
                </div>
            </div>

            {/* Rating Distribution Bars */}
            <div className="space-y-3 px-4">
                {[5, 4, 3, 2, 1].map((star) => {
                    const percentage = getRatingPercentage(distribution, star as 1 | 2 | 3 | 4 | 5);

                    return (
                        <div key={star} className="flex items-center gap-4">
                            <span className="text-sm font-bold w-12 text-text-base">
                                {star} Star
                            </span>
                            <div className="flex-1 h-2 bg-bg-sunken rounded-full overflow-hidden">
                                <div
                                    className="h-full bg-primary rounded-full transition-all duration-500"
                                    style={{ width: `${percentage}%` }}
                                />
                            </div>
                            <span className="text-sm font-bold w-10 text-right text-text-base">
                                {percentage}%
                            </span>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}

export default ReviewSummary;
