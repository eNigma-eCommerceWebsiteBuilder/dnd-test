'use client';

import type { FeaturedProductsContent } from '@/lib/content';
import type { Product } from '@/lib/api/types/products';
import { FeaturedProductsGridView } from './FeaturedProductsGridView';

interface FeaturedProductsGridProps {
  className?: string;
  content: FeaturedProductsContent;
  products: Product[];
}

export const FeaturedProductsGrid = ({
  className,
  content,
  products,
}: FeaturedProductsGridProps) => {
  if (!products || products.length === 0) {
    return null;
  }

  return (
    <FeaturedProductsGridView
      header={content.header}
      subheader={content.subheader}
      products={products.slice(0, 8).map((p) => ({
        name: p.name,
        slug: p.slug,
        price: p.price,
        image: p.images?.[0] || '/placeholder.jpg',
      }))}
      className={className}
    />
  );
};
