import { notFound } from 'next/navigation';
import { getPageBySlug } from '@/lib/page-data';
import { fetchCategories } from '@/lib/api/services/categories';
import { fetchProduct } from '@/lib/api/services/products';
import { PublishedPage } from '../page';

type Props = {
  params: Promise<{ slug: string; entitySlug: string }>;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

export const dynamic = 'force-dynamic';

export async function generateMetadata({ params }: Props) {
  const { slug, entitySlug } = await params;
  const page = await getPageBySlug(slug);
  return { title: page ? `${entitySlug} - ${slug}` : 'Page Not Found' };
}

export default async function DynamicPublishedPage({ params, searchParams }: Props) {
  const { slug, entitySlug } = await params;
  if (!(await getPageBySlug(slug))) notFound();

  if (slug === 'category-detail') {
    const categories = await fetchCategories({ withStats: true });
    if (!categories.some((category) => category.slug === entitySlug)) notFound();
    return <PublishedPage slug={slug} routeParams={{ slug, categorySlug: entitySlug }} searchParams={await searchParams} />;
  }

  if (slug === 'product-detail') {
    try {
      await fetchProduct(entitySlug);
    } catch {
      notFound();
    }
    return <PublishedPage slug={slug} routeParams={{ slug, productSlug: entitySlug }} searchParams={await searchParams} />;
  }

  notFound();
}
