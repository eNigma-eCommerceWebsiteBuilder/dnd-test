import type { CuratedCollection } from '@/lib/api/types/collections';
import { cn } from '@/lib/utils/cn';
import type { CuratedCollection as CuratedCollectionUtil, CuratedProduct as CuratedProductUtil } from '@/lib/utils/ecommerce';
import { getAllCollectionProducts } from '@/lib/utils/ecommerce';
import { MainProductCard } from '@/components/collections/MainProductCard';
import { RelatedProductsGrid } from '@/components/collections/RelatedProductsGrid';

interface CuratedProductDisplayProps {
  collection: CuratedCollection;
  className?: string;
}

/**
 * CuratedProductDisplay Component (Server)
 * Main product card with related products list.
 */
export function CuratedProductDisplay({ collection, className }: CuratedProductDisplayProps) {
  const curatedForUtils: CuratedCollectionUtil = {
    mainProduct: collection.mainProduct as unknown as CuratedProductUtil,
    relatedProducts: collection.relatedProducts as unknown as CuratedProductUtil[],
  };
  const productCount = getAllCollectionProducts([curatedForUtils]).length;
  const relatedProducts = (collection.relatedProducts || []).filter(
    (product) => product._id !== collection.mainProduct?._id
  );

  return (
    <div className={cn('@container w-full', className)}>
      <div className="grid w-full grid-cols-1 gap-12 @lg:grid-cols-[2fr_1fr] @lg:gap-16">
        <MainProductCard
          product={collection.mainProduct}
          collectionName={collection.name}
          description={collection.description}
        />
        <RelatedProductsGrid
          products={relatedProducts}
          title="Complete the Look"
          count={productCount}
        />
      </div>
    </div>
  );
}

export default CuratedProductDisplay;