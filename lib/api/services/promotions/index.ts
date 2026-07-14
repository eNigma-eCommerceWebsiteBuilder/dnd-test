import { apiRequest, ApiError } from '../../core/client';
import type { Promotion } from '../../types/promotions';

export async function fetchCurrentPromotion(): Promise<Promotion | null> {
  try {
    return await apiRequest<Promotion>('/promotions/current', {
      revalidate: 60,
      tags: ['promotions', 'current'],
    });
  } catch (error: unknown) {
    if (error instanceof ApiError && error.status === 404) {
      return null;
    }
    throw error;
  }
}

export async function fetchPromotion(id: string): Promise<Promotion> {
  return apiRequest<Promotion>(`/promotions/${id}`, {
    revalidate: 60,
    tags: ['promotions', `promotion-${id}`],
  });
}
