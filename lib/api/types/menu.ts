import type { Product } from './products';

export type HeroProduct = Product & {
  badge?: string;
  salePrice?: number;
};
