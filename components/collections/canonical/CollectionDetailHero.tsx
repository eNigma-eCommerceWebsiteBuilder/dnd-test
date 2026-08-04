import type { Collection } from '@/lib/api/types/collections';
import { getCollectionDisplayName } from '@/lib/utils/collections';
import { CollectionHero } from '@/components/collections/CollectionHero';

export function CollectionDetailHero({ collection }: { collection: Collection }) {
  const displayTitle = getCollectionDisplayName(collection);
  const breadcrumbItems = [
    { label: 'Home', href: '/' },
    { label: 'Collections', href: '/collections' },
    { label: displayTitle },
  ];

  return (
    <CollectionHero
      title={displayTitle}
      subtitle={
        collection.type === 'inspiration'
          ? collection.description || collection.subtitle
          : collection.description
      }
      imageUrl={
        collection.type === 'curated'
          ? collection.mainProduct?.imageUrl || collection.mainProduct?.images?.[0]
          : collection.mainImage?.imageUrl
      }
      breadcrumbs={breadcrumbItems}
    />
  );
}
