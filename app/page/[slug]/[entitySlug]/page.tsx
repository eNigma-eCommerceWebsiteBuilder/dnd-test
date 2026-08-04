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
  const page = await getPageBySlug(slug === 'products' ? 'product-detail' : slug);
  return { title: page ? `${entitySlug} - ${slug}` : 'Page Not Found' };
}

export default async function DynamicPublishedPage({ params, searchParams }: Props) {
  const { slug, entitySlug } = await params;
  const publishedSlug = slug === 'products' ? 'product-detail' : slug;
  if (!(await getPageBySlug(publishedSlug))) notFound();

  if (slug === 'category-detail') {
    const categories = await fetchCategories({ withStats: true });
    if (!categories.some((category) => category.slug === entitySlug)) notFound();
    return <PublishedPage slug={slug} routeParams={{ slug, categorySlug: entitySlug }} searchParams={await searchParams} />;
  }

  if (slug === 'products' || slug === 'product-detail') {
    try {
      await fetchProduct(entitySlug);
    } catch {
      notFound();
    }
    return <PublishedPage slug="product-detail" routeParams={{ slug: 'product-detail', productSlug: entitySlug }} searchParams={await searchParams} />;
  }

  if (slug === 'collection-detail') {
    // The source route renders its own Collection Not Found state, so preserve the entity identity even when it is invalid.
    return <PublishedPage slug={slug} routeParams={{ slug, collectionSlug: entitySlug }} searchParams={await searchParams} />;
  }

  if (slug === 'shared-wishlist') {
    return <PublishedPage slug={slug} routeParams={{ slug, token: entitySlug }} searchParams={await searchParams} />;
  }

  if (slug === 'downloads') {
    return <PublishedPage slug={slug} routeParams={{ slug, key: entitySlug }} searchParams={await searchParams} />;
  }

  notFound();
}
