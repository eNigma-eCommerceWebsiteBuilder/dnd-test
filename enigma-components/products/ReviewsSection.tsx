'use client';

import { useState } from 'react';
import { cn } from '@/lib/utils/cn';
import { ReviewCard } from './ReviewCard';
import { ReviewSummary } from './ReviewSummary';
import { WriteReviewButton } from './WriteReviewButton';
import type { Review, ReviewsResponse } from '@/lib/api/types';

interface ReviewsSectionProps {
    productId: string;
    initialReviews: Review[];
    averageRating: number;
    totalReviews: number;
    ratingDistribution: Record<string, number>;
    className?: string;
}

export function ReviewsSection({
    productId,
    initialReviews,
    averageRating,
    totalReviews,
    ratingDistribution,
    className
}: ReviewsSectionProps) {
    const [reviews, setReviews] = useState<Review[]>(initialReviews);
    const [page, setPage] = useState(1);
    const [isLoading, setIsLoading] = useState(false);
    const [hasMore, setHasMore] = useState(initialReviews.length < totalReviews);

    const loadMoreReviews = async () => {
        if (isLoading || !hasMore) return;

        setIsLoading(true);
        try {
            const nextPage = page + 1;
            const response = await fetch(
                `/api/products/${productId}/reviews?page=${nextPage}&pageSize=5`
            );

            if (response.ok) {
                const data: ReviewsResponse = await response.json();
                const nextReviews = [...reviews, ...data.items];
                setReviews(nextReviews);
                setPage(nextPage);
                setHasMore(nextReviews.length < data.totalItems);
            }
        } catch (error) {
            console.error('Failed to load more reviews:', error);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <section className={cn("@container", className)}>
            <h2 className="mb-10 text-2xl font-bold text-text-base">Customer Reviews</h2>

            <div className="grid grid-cols-1 gap-12 @md:grid-cols-12">
                <div className="space-y-6 @md:col-span-4">
                    <ReviewSummary
                        averageRating={averageRating}
                        totalReviews={totalReviews}
                        ratingDistribution={ratingDistribution}
                    />

                    <WriteReviewButton productId={productId} />
                </div>

                <div className="space-y-8 @md:col-span-8">
                    {reviews.length > 0 ? (
                        <>
                            {reviews.map((review) => (
                                <ReviewCard key={review._id} review={review} />
                            ))}

                            {hasMore ? (
                                <button
                                    type="button"
                                    onClick={loadMoreReviews}
                                    disabled={isLoading}
                                    className={cn(
                                        "w-full rounded-button border-2 border-primary py-4 font-semibold text-primary transition-colors",
                                        "hover:bg-primary/5",
                                        "disabled:cursor-not-allowed disabled:opacity-disabled"
                                    )}
                                >
                                    {isLoading ? (
                                        <span className="flex items-center justify-center gap-2">
                                            <span className="material-symbols-outlined animate-spin">
                                                progress_activity
                                            </span>
                                            Loading...
                                        </span>
                                    ) : (
                                        `Read All ${totalReviews} Reviews`
                                    )}
                                </button>
                            ) : null}
                        </>
                    ) : (
                        <div className="py-12 text-center">
                            <span className="material-symbols-outlined mb-4 text-4xl text-text-muted">
                                rate_review
                            </span>
                            <p className="text-text-muted">
                                No reviews yet. Be the first to review this product!
                            </p>
                        </div>
                    )}
                </div>
            </div>
        </section>
    );
}

export default ReviewsSection;
