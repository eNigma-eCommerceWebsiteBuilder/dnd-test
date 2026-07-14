import { apiRequest } from '../../core/client';
import type { Testimonial, TestimonialType } from '../../types';

interface FetchTestimonialsParams {
  limit?: number;
  minRating?: number;
  platform?: string;
  type?: TestimonialType;
  featured?: boolean;
  page?: number;
}

interface PaginatedTestimonialsResponse {
  success?: boolean;
  count?: number;
  total?: number;
  totalPages?: number;
  currentPage?: number;
  items: Testimonial[];
}

export async function fetchTestimonials(params: FetchTestimonialsParams = {}): Promise<Testimonial[]> {
  const response = await apiRequest<Testimonial[] | PaginatedTestimonialsResponse>('/testimonials', {
    params: params as Record<string, string | number>,
    revalidate: 300,
    tags: ['testimonials'],
  });
  return Array.isArray(response) ? response : response.items;
}

export async function fetchFeaturedTestimonials(): Promise<Testimonial[]> {
  return apiRequest<Testimonial[]>('/testimonials/featured', {
    revalidate: 300,
    tags: ['testimonials', 'featured'],
  });
}
