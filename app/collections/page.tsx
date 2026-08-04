import { PublishedPage } from '@/app/page/[slug]/page';

export const dynamic = 'force-dynamic';

// Preserve production collection URLs for source components that navigate to /collections.
export default function PublishedCollections() {
  return <PublishedPage slug="collections" routeParams={{ slug: 'collections' }} searchParams={{}} />;
}
