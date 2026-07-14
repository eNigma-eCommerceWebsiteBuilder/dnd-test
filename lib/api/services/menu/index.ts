import { apiRequest } from '../../core/client';
import type { Menu, HeroProduct } from '../../types';

interface FetchHeroProductParams {
  productId?: string;
  q?: string;
}

export async function fetchMenu(): Promise<Menu> {
  return apiRequest<Menu>('/menu', {
    revalidate: 300,
    tags: ['menu', 'navigation'],
  });
}

export async function fetchHeroProduct(params: FetchHeroProductParams = {}): Promise<HeroProduct> {
  return apiRequest<HeroProduct>('/hero/product', {
    params: params as Record<string, string>,
    revalidate: 120,
    tags: ['hero', 'products'],
  });
}
