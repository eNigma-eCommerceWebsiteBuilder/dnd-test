import { cn } from '@/lib/utils/cn';
import { formatRating, formatRelativeTime } from '@/lib/utils/formatters';
import type { Review } from '@/lib/api/types';

interface ReviewCardProps {
    review: Review;
    className?: string;
}

/**
 * ReviewCard Component (Server)
 * 
 * Individual review display following LUXE design:
 * - Rating stars, author, verified badge
 * - Review title and text
 * - Relative date display
 */
export function ReviewCard({ review, className }: ReviewCardProps) {
    const ratingInfo = formatRating(review.rating);
    const dateDisplay = formatRelativeTime(review.createdAt);

    return (
        <article
            className={cn(
                "@container pb-8 border-b border-border last:border-b-0 last:pb-0",
                className
            )}
        >
            <div className="flex justify-between mb-4">
                {/* Left: Title and Rating */}
                <div>
                    {review.title && (
                        <h4 className="font-bold text-text-base mb-1">
                            {review.title}
                        </h4>
                    )}
                    {/* Star Rating */}
                    <div className="flex text-rating text-sm">
                        {[1, 2, 3, 4, 5].map((star) => (
                            <span
                                key={star}
                                className="material-symbols-outlined scale-75"
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
                </div>

                {/* Right: Author and Verified */}
                <div className="text-right">
                    <span className="text-sm font-bold text-text-base">
                        {review.author}
                    </span>
                    {review.isVerifiedPurchase && (
                        <div className="flex items-center justify-end gap-1 text-[10px] text-primary font-bold">
                            <span className="material-symbols-outlined text-[12px]">
                                verified
                            </span>
                            VERIFIED PURCHASE
                        </div>
                    )}
                    <div className="text-xs text-text-muted mt-1">
                        {dateDisplay}
                    </div>
                </div>
            </div>

            {/* Review Text */}
            <p className="text-text-muted text-sm leading-relaxed">
                {review.text}
            </p>

            {/* Review Images */}
            {review.images && review.images.length > 0 && (
                <div className="flex gap-2 mt-4 overflow-x-auto">
                    {review.images.map((image) => (
                        <div
                            key={image.id}
                            className="size-16 shrink-0 rounded-image border border-border bg-center bg-cover"
                            style={{ backgroundImage: `url(${image.src})` }}
                            role="img"
                            aria-label={image.alt || 'Review image'}
                        />
                    ))}
                </div>
            )}

            {/* Helpful counts */}
            {(review.helpful > 0 || review.notHelpful > 0) && (
                <div className="flex items-center gap-4 mt-4 text-xs text-text-muted">
                    <span className="flex items-center gap-1">
                        <span className="material-symbols-outlined text-sm">thumb_up</span>
                        {review.helpful} found helpful
                    </span>
                </div>
            )}
        </article>
    );
}

export default ReviewCard;
