import { cn } from '@/lib/utils/cn';
import { CuratedCollection } from '@/lib/api/types';
import { CuratedCollectionContent } from '@/lib/content';
import { CuratedCollectionSectionView } from './CuratedCollectionSectionView';

interface CuratedCollectionSectionProps {
  className?: string;
  collection: CuratedCollection | null;
  content: CuratedCollectionContent;
}

export const CuratedCollectionSection = ({
  className,
  collection,
  content,
}: CuratedCollectionSectionProps) => {
  if (!collection) return null;

  return (
    <CuratedCollectionSectionView
      eyebrow={content.eyebrow}
      ctaText={content.ctaText}
      collectionName={collection.name}
      collectionDescription={collection.description || ''}
      collectionSlug={collection.slug || ''}
      mainProductName={collection.mainProduct?.name || ''}
      mainProductImage={collection.mainProduct?.images?.[0] || '/placeholder.jpg'}
      relatedProducts={(collection.relatedProducts || []).slice(0, 4).map((p) => ({
        name: p.name,
        slug: p.slug,
        price: p.price,
        image: p.imageUrl || p.images?.[0] || '/placeholder.jpg',
      }))}
      className={className}
    />
  );
};
