import { notFound } from 'next/navigation';
import { fetchProduct } from '@/lib/api/services/products';
import { PublishedPage } from '@/app/page/[slug]/page';

type Props = {
  params: Promise<{ slug: string }>;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

export const dynamic = 'force-dynamic';

// Preserve the production product URL while rendering the published Puck detail seed.
export default async function PublishedProductDetail({ params, searchParams }: Props) {
  const { slug: productSlug } = await params;

  try {
    await fetchProduct(productSlug);
  } catch {
    notFound();
  }

  return (
    <PublishedPage
      slug="product-detail"
      routeParams={{ slug: 'product-detail', productSlug }}
      searchParams={await searchParams}
    />
  );
}
