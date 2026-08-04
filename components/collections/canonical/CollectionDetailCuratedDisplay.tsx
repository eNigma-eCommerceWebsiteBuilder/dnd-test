import type { CuratedCollection } from '@/lib/api/types/collections';
import { CuratedProductDisplay } from '@/components/collections/CuratedProductDisplay';

export function CollectionDetailCuratedDisplay({
  collection,
}: {
  collection: CuratedCollection;
}) {
  return <CuratedProductDisplay collection={collection} />;
}
