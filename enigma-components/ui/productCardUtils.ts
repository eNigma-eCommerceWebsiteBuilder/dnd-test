import type { Product } from '@/lib/api/types';
import type { FormattedPrice } from '@/lib/utils';

export interface ProductCardBadge {
  text: string;
  type: 'default' | 'sale' | 'accent';
}

export function getProductCardBadge(
  product: Product,
  priceInfo: FormattedPrice,
): ProductCardBadge | null {
  if (product.newArrival) return { text: 'New Arrival', type: 'default' };
  if (priceInfo.isOnSale) return { text: priceInfo.discount || 'Sale', type: 'sale' };
  if (product.isFeatured) return { text: 'Featured', type: 'accent' };
  return null;
}

export function getProductCardImages(product: Product): {
  primaryImage: string;
  hoverImage?: string;
} {
  return {
    primaryImage: product.imageUrl || product.images?.[0] || '/product-placeholder.jpg',
    hoverImage: product.hoverImageUrl || product.images?.[1],
  };
}

export function getProductCardSubtitle(product: Product): string | undefined {
  const parts: string[] = [];

  if (product.category) {
    const categoryName = typeof product.category === 'string'
      ? product.category
      : product.category.name;

    if (categoryName) {
      parts.push(categoryName);
    }
  }

  if (product.colors?.[0]) {
    parts.push(product.colors[0].name);
  }

  return parts.join(' / ') || product.description?.slice(0, 50);
}
