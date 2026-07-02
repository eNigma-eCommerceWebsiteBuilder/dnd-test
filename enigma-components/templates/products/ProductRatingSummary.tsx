import { formatRating } from '@/lib/utils/formatters';

interface ProductRatingSummaryProps {
  rating: number;
  reviewCount: number;
}

export function ProductRatingSummary({
  rating,
  reviewCount,
}: ProductRatingSummaryProps) {
  const ratingInfo = formatRating(rating);

  return (
    <div className="flex items-center gap-4">
      <div className="flex items-center gap-1 text-rating">
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
                    : "'FILL' 0",
            }}
          >
            {star <= ratingInfo.full
              ? 'star'
              : star === ratingInfo.full + 1 && ratingInfo.half
                ? 'star_half'
                : 'star'}
          </span>
        ))}
        <span className="ml-2 font-bold text-text-base">
          {ratingInfo.display}
        </span>
      </div>
      <span className="text-text-muted">|</span>
      <a href="#reviews" className="text-sm font-medium text-text-muted hover:underline">
        {reviewCount} Reviews
      </a>
    </div>
  );
}
