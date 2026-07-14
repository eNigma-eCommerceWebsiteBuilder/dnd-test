import type { Testimonial } from '@/lib/api/types/testimonials';

export type RatingDistribution = Record<1 | 2 | 3 | 4 | 5, number>;

export function getRatingPercentage(
  distribution: RatingDistribution,
  rating: 1 | 2 | 3 | 4 | 5,
): number {
  const total = Object.values(distribution).reduce((sum, count) => sum + count, 0);
  if (total === 0) return 0;
  return Math.round((distribution[rating] / total) * 100);
}

export function groupTestimonialsByRating(
  testimonials: Testimonial[],
): Record<number, Testimonial[]> {
  return testimonials.reduce(
    (acc, t) => {
      if (!acc[t.rating]) acc[t.rating] = [];
      acc[t.rating].push(t);
      return acc;
    },
    {} as Record<number, Testimonial[]>,
  );
}

export function getTestimonialRatingPercentage(
  testimonials: Testimonial[],
  rating: number,
): number {
  if (testimonials.length === 0) return 0;
  const count = testimonials.filter((t) => t.rating === rating).length;
  return Math.round((count / testimonials.length) * 100);
}

export function getTestimonialsByPlatform(
  testimonials: Testimonial[],
  _platform: string,
): Testimonial[] {
  void _platform;
  return testimonials;
}
