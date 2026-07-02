'use client';

import { useMemo, useState } from 'react';
import type { KeyboardEvent } from 'react';
import { cn } from '@/lib/utils/cn';
import { formatRating } from '@/lib/utils/formatters';
import type { Testimonial } from '@/lib/api/types/testimonials';

interface TestimonialsCarouselProps {
    testimonials: Testimonial[];
    className?: string;
}

/**
 * TestimonialsCarousel Component (Client)
 * Simple carousel UI for testimonials
 */
export function TestimonialsCarousel({ testimonials, className }: TestimonialsCarouselProps) {
    const items = testimonials || [];
    const [activeIndex, setActiveIndex] = useState(0);

    const total = items.length;

    const clampedIndex = useMemo(() => {
        if (total === 0) return 0;
        return Math.min(Math.max(activeIndex, 0), total - 1);
    }, [activeIndex, total]);

    if (total === 0) return null;

    const goPrev = () => {
        setActiveIndex((prev) => {
            return (prev - 1 + total) % total;
        });
    };

    const goNext = () => {
        setActiveIndex((prev) => {
            return (prev + 1) % total;
        });
    };

    const handleKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
        if (event.key === 'ArrowLeft') {
            event.preventDefault();
            goPrev();
        }
        if (event.key === 'ArrowRight') {
            event.preventDefault();
            goNext();
        }
    };

    return (
        <section className={cn("@container w-full", className)}>
            <div
                className="relative w-full overflow-hidden rounded-card border border-border bg-bg-surface shadow-card focus-visible:outline-none focus-visible:shadow-focus-ring"
                role="region"
                aria-label="Testimonials carousel"
                tabIndex={0}
                onKeyDown={handleKeyDown}
            >
                <div
                    className="flex transition-transform duration-500"
                    style={{ transform: `translateX(-${clampedIndex * 100}%)` }}
                >
                    {items.map((testimonial) => {
                        const ratingInfo = formatRating(testimonial.rating);
                        const quoteText = testimonial.quote || testimonial.text || '';
                        const authorName = testimonial.author || testimonial.customerName || 'Customer';
                        const authorRole = testimonial.role || testimonial.customerRole || '';
                        const platform = testimonial.platform || '';

                        return (
                            <div key={testimonial.id || testimonial._id} className="w-full shrink-0 p-8 @lg:p-12">
                                <div className="max-w-3xl mx-auto text-center">
                                    <div className="flex justify-center text-primary mb-6">
                                        <span className="material-symbols-outlined text-5xl">format_quote</span>
                                    </div>
                                    <p className="text-xl @lg:text-2xl font-medium italic leading-relaxed text-text-base">
                                        “{quoteText}”
                                    </p>

                                    <div className="flex flex-col items-center gap-2 mt-8">
                                        <div
                                            className="size-14 rounded-full bg-bg-sunken border border-border"
                                            role="img"
                                            aria-label={authorName}
                                            style={testimonial.avatar || testimonial.avatarUrl
                                                ? { backgroundImage: `url(${testimonial.avatar || testimonial.avatarUrl})`, backgroundSize: 'cover', backgroundPosition: 'center' }
                                                : undefined}
                                        />
                                        <div className="text-sm font-semibold text-text-base">
                                            {authorName}
                                        </div>
                                        {authorRole && (
                                            <div className="text-xs text-text-muted">
                                                {authorRole}
                                            </div>
                                        )}
                                        {platform && (
                                            <div className="text-[10px] uppercase tracking-widest text-text-muted">
                                                {platform}
                                            </div>
                                        )}
                                    </div>

                                    <div className="flex justify-center text-rating mt-6">
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
                                </div>
                            </div>
                        );
                    })}
                </div>

                <div className="absolute inset-y-0 left-0 flex items-center pl-3">
                    <button
                        type="button"
                        className="size-10 rounded-full border border-border bg-bg-elevated text-text-base shadow-card hover:bg-bg-hover transition-colors focus-visible:outline-none focus-visible:shadow-focus-ring"
                        onClick={goPrev}
                        aria-label="Previous testimonial"
                    >
                        <span className="material-symbols-outlined text-[18px]">chevron_left</span>
                    </button>
                </div>
                <div className="absolute inset-y-0 right-0 flex items-center pr-3">
                    <button
                        type="button"
                        className="size-10 rounded-full border border-border bg-bg-elevated text-text-base shadow-card hover:bg-bg-hover transition-colors focus-visible:outline-none focus-visible:shadow-focus-ring"
                        onClick={goNext}
                        aria-label="Next testimonial"
                    >
                        <span className="material-symbols-outlined text-[18px]">chevron_right</span>
                    </button>
                </div>
            </div>

            <div className="flex justify-center gap-2 mt-4">
                {items.map((_, index) => (
                    <button
                        key={index}
                        type="button"
                        className={cn(
                            "size-2 rounded-full",
                            index === clampedIndex ? 'bg-primary' : 'bg-border'
                        )}
                        onClick={() => {
                            setActiveIndex(index);
                        }}
                        aria-label={`Go to testimonial ${index + 1}`}
                        aria-current={index === clampedIndex}
                    />
                ))}
            </div>
        </section>
    );
}

export default TestimonialsCarousel;
