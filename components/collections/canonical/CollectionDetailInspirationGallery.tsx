import type { InspirationCollection } from '@/lib/api/types/collections';
import { InspirationGallery } from '@/components/collections/InspirationGallery';

export function CollectionDetailInspirationGallery({
  collection,
}: {
  collection: InspirationCollection;
}) {
  return <InspirationGallery collection={collection} />;
}
