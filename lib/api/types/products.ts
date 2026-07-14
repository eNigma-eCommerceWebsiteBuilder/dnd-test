import type { Category } from './categories';

export enum ProductSort {
  PRICE_ASC = 'price-asc',
  PRICE_DESC = 'price-desc',
  RATING = 'rating',
  NEW = 'new',
  TRENDING = 'trending',
}

export enum ProductReviewSort {
  RECENT = 'recent',
  RATING_ASC = 'rating-asc',
  RATING_DESC = 'rating-desc',
}

export type ProductSortValue = `${ProductSort}`;
export type ProductReviewSortValue = `${ProductReviewSort}`;

export interface ProductColor {
  name: string;
  hex: string;
}

export interface ProductSpec {
  name: string;
  value: string;
}

export interface ProductMedia {
  url: string;
  mediaType: 'image' | 'video';
  alt?: string;
}

export interface ProductVariant {
  _id: string;
  name?: string;
  sku?: string;
  price?: number;
  compareAtPrice?: number;
  stock?: number;
  isActive?: boolean;
  attributes?: Record<string, string>;
  color?: ProductColor;
  size?: string;
}

export interface Product {
  _id: string;
  id?: string;
  name: string;
  slug: string;
  description?: string;
  fullDescription?: string;

  price: number;
  originalPrice?: number;
  salePrice?: number | null;
  compareAtPrice?: number;
  isOnSale?: boolean;
  onSale?: boolean;

  images: string[];
  imageUrl?: string;
  hoverImageUrl?: string;
  additionalMedia?: ProductMedia[];

  category?: Category | string;
  categoryId?: string;
  tags?: string[];
  sku?: string;

  stock: number;
  stockThreshold?: number;
  inStock: boolean;
  isActive: boolean;

  isFeatured?: boolean;
  freeShipping?: boolean;
  newArrival?: boolean;

  rating?: number;
  reviewCount?: number;

  hasVariants?: boolean;
  variants?: ProductVariant[];
  colors?: ProductColor[];
  sizes?: string[];
  specs?: ProductSpec[];

  productType?: 'physical' | 'digital';

  campaign?: {
    name: string;
    endDate: string;
  };

  priceHidden?: boolean;
  priceMessage?: string;

  createdAt: string;
  updatedAt: string;
}

export interface PaginatedProducts {
  items: Product[];
  page: number;
  pageSize: number;
  totalItems: number;
  totalPages: number;
}
