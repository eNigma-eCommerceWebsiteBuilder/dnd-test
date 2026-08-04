import { PublishedPage } from '@/app/page/[slug]/page';

export const dynamic = 'force-dynamic';

// Preserve production category URLs for source components that navigate to /categories.
export default function PublishedCategories() {
  return <PublishedPage slug="categories" routeParams={{ slug: 'categories' }} searchParams={{}} />;
}
