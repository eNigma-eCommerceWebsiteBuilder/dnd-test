import { notFound } from 'next/navigation';
import { fetchCategories } from '@/lib/api/services/categories';
import { PublishedPage } from '@/app/page/[slug]/page';

type Props = {
  params: Promise<{ slug: string }>;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

export const dynamic = 'force-dynamic';

// Keep the production category URL while rendering the published Puck detail seed.
export default async function PublishedCategoryDetail({ params, searchParams }: Props) {
  const { slug: categorySlug } = await params;

  try {
    const categories = await fetchCategories({ withStats: true });
    if (!Array.isArray(categories) || !categories.some((category) => category.slug === categorySlug)) {
      notFound();
    }
  } catch {
    notFound();
  }

  return (
    <PublishedPage
      slug="category-detail"
      routeParams={{ slug: 'category-detail', categorySlug }}
      searchParams={await searchParams}
    />
  );
}
