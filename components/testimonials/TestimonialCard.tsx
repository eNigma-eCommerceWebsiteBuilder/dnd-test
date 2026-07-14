import { cn } from '@/lib/utils/cn';
import { formatRating, formatRelativeTime } from '@/lib/utils/formatters';
import type { Testimonial } from '@/lib/api/types/testimonials';

interface TestimonialCardProps {
    testimonial: Testimonial;
    className?: string;
}

/**
 * TestimonialCard Component (Server)
 * Quote, author, rating, platform, and timestamp
 */
export function TestimonialCard({ testimonial, className }: TestimonialCardProps) {
    const ratingInfo = formatRating(testimonial.rating);
    const timeAgo = testimonial.createdAt ? formatRelativeTime(testimonial.createdAt) : '';
    const quoteText = testimonial.quote || testimonial.text || '';
    const authorName = testimonial.author || testimonial.customerName || 'Customer';
    const authorRole = testimonial.role || testimonial.customerRole || '';
    const platform = testimonial.platform || '';

    return (
        <article
            className={cn(
                "@container w-full rounded-card border border-border bg-bg-surface p-6 shadow-card",
                className
            )}
        >
            <div className="flex items-start justify-between gap-4">
                <div className="flex items-center gap-3">
                    <div
                        className="size-12 rounded-full bg-bg-sunken border border-border overflow-hidden"
                        role="img"
                        aria-label={authorName}
                        style={testimonial.avatar || testimonial.avatarUrl
                            ? { backgroundImage: `url(${testimonial.avatar || testimonial.avatarUrl})`, backgroundSize: 'cover', backgroundPosition: 'center' }
                            : undefined}
                    />
                    <div>
                        <div className="text-sm font-semibold text-text-base">
                            {authorName}
                        </div>
                        {authorRole && (
                            <div className="text-xs text-text-muted">
                                {authorRole}
                            </div>
                        )}
                    </div>
                </div>
                {platform && (
                    <span className="text-[10px] font-bold uppercase tracking-widest text-text-muted">
                        {platform}
                    </span>
                )}
            </div>

            <div className="mt-4 text-text-base text-sm leading-relaxed">
                “{quoteText}”
            </div>

            <div className="mt-5 flex items-center justify-between">
                <div className="flex items-center text-rating">
                    {[1, 2, 3, 4, 5].map((star) => (
                        <span
                            key={star}
                            className="material-symbols-outlined text-base"
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
                {timeAgo && (
                    <span className="text-xs text-text-muted">
                        {timeAgo}
                    </span>
                )}
            </div>
        </article>
    );
}

export default TestimonialCard;