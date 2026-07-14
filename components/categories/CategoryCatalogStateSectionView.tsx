import Link from 'next/link';
import { Suspense } from 'react';
import { fetchCategories, fetchCategoryProducts } from '@/lib/api/services/categories';
import type { Category, Product, ProductSortValue } from '@/lib/api/types';
import { EmptyCategoryView } from '@/components/categories/EmptyCategoryView';
import { ActiveFilters } from '@/components/products/ActiveFilters';
import { Pagination } from '@/components/products/Pagination';
import { ProductFilters } from '@/components/products/ProductFilters';
import { ProductGrid } from '@/components/products/ProductGrid';
import { ProductGridSkeleton } from '@/components/products/ProductGridSkeleton';
import { SortDropdown } from '@/components/products/SortDropdown';
import { ViewToggle } from '@/components/products/ViewToggle';
import {
  getBooleanSearchParam,
  getNumberSearchParam,
  getRouteParam,
  getSearchParam,
  type PuckFetcherContext,
} from '@/lib/puck-route-metadata';

interface CategoryCatalogStateSectionViewProps {
  categorySlug?: string;
  state?: 'content' | 'empty' | 'not-found' | 'error';
  category?: Category | null;
  siblingCategories?: Category[];
  products?: Product[];
  totalItems?: number;
  totalPages?: number;
  page?: number;
  errorMessage?: string;
}

export const puckComponentName = 'CategoryCatalogStateSection';
export const puckLabel = 'Category Catalog State Section';
export const puckCategory = 'Categories';

export const puckFields = {
  categorySlug: { type: 'text' as const, label: 'Category Slug' },
  state: {
    type: 'select' as const,
    label: 'Preview State',
    options: [
      { label: 'Content', value: 'content' },
      { label: 'Empty', value: 'empty' },
      { label: 'Not Found', value: 'not-found' },
      { label: 'Error', value: 'error' },
    ],
  },
};

export const puckDefaults = {
  categorySlug: '',
  state: 'content',
};

export const puckAst = {
  kind: 'runtime',
  topLevel: true,
  runtimeSignals: ['params.slug', 'searchParams', 'category', 'products'],
  matches: [
    { pageIncludes: ['app/categories/[slug]/page.tsx'], component: 'CategoryCatalogStateSection' },
  ],
};

export async function puckDataFetcher(
  props: CategoryCatalogStateSectionViewProps,
  context?: PuckFetcherContext,
) {
  const categorySlug = props.categorySlug
    || getRouteParam(context, 'slug')
    || getSearchParam(context, 'categorySlug')
    || getSearchParam(context, 'slug');
  if (!categorySlug) return { state: 'not-found', category: null, products: [] };

  try {
    const allCategories = await fetchCategories({ withStats: true });
    const category = allCategories.find((item) => item.slug === categorySlug);
    if (!category) return { state: 'not-found', category: null, products: [] };

    const page = getNumberSearchParam(context, 'page', 1);
    const pageSize = getNumberSearchParam(context, 'pageSize', 12);
    const productsData = await fetchCategoryProducts(category.slug, {
      q: getSearchParam(context, 'q') || getSearchParam(context, 'search'),
      minPrice: optionalNumber(getSearchParam(context, 'minPrice')),
      maxPrice: optionalNumber(getSearchParam(context, 'maxPrice')),
      inStock: getBooleanSearchParam(context, 'inStock'),
      onSale: getBooleanSearchParam(context, 'onSale'),
      sort: getSearchParam(context, 'sort') as ProductSortValue | undefined,
      page,
      pageSize,
    });

    return {
      category,
      siblingCategories: allCategories.filter(
        (item) => item.parentCategory === category.parentCategory && item._id !== category._id,
      ),
      page,
      products: productsData.items || [],
      state: productsData.items?.length ? 'content' : 'empty',
      totalItems: productsData.totalItems || 0,
      totalPages: productsData.totalPages || 0,
    };
  } catch (error) {
    return {
      state: 'error',
      errorMessage: error instanceof Error ? error.message : 'Unable to load category.',
    };
  }
}

export function CategoryCatalogStateSectionView({
  state = 'content',
  category,
  siblingCategories = [],
  products = [],
  totalItems = 0,
  totalPages = 0,
  page = 1,
  errorMessage = 'Unable to load category.',
}: CategoryCatalogStateSectionViewProps) {
  if (state === 'not-found' || !category) {
    return <CategoryMessage title="Category Not Found" message="We could not find the category you are looking for." />;
  }

  if (state === 'error') {
    return <CategoryMessage title="Category unavailable" message={errorMessage} />;
  }

  return (
    <main className="min-h-screen bg-bg-base text-text-base">
      <div className="mx-auto max-w-[1440px] px-6 py-8 lg:px-12">
        <nav className="mb-6 flex items-center gap-2 text-sm text-text-muted">
          <Link href="/" className="transition-colors hover:text-primary">Home</Link>
          <span className="material-symbols-outlined text-xs">chevron_right</span>
          <Link href="/categories" className="transition-colors hover:text-primary">All Categories</Link>
          <span className="material-symbols-outlined text-xs">chevron_right</span>
          <span className="font-medium text-text-base">{category.name}</span>
        </nav>

        <section className="mb-8 rounded-card border border-border bg-bg-surface p-8 shadow-card">
          <h1 className="text-4xl font-black tracking-tight text-text-base md:text-5xl">{category.name}</h1>
          {category.description ? <p className="mt-3 max-w-3xl text-text-muted">{category.description}</p> : null}
          <p className="mt-4 text-sm font-medium text-text-muted">{totalItems.toLocaleString()} items in this collection</p>
        </section>

        {siblingCategories.length ? (
          <div className="mb-8 flex flex-wrap gap-3">
            {siblingCategories.map((item) => (
              <Link key={item._id} href={`/categories/${item.slug}`} className="rounded-full border border-border px-4 py-2 text-sm font-semibold hover:bg-bg-hover">
                {item.name}
              </Link>
            ))}
          </div>
        ) : null}

        {state === 'empty' || products.length === 0 ? (
          <EmptyCategoryView />
        ) : (
          <>
            <Suspense fallback={null}>
              <ActiveFilters className="mb-8" />
            </Suspense>
            <div className="flex flex-col gap-8 lg:flex-row lg:gap-12">
              <aside className="w-full flex-shrink-0 lg:w-[280px]">
                <Suspense
                  fallback={
                    <div className="space-y-8">
                      <div className="h-32 animate-skeleton rounded-card bg-bg-skeleton" />
                      <div className="h-24 animate-skeleton rounded-card bg-bg-skeleton" />
                    </div>
                  }
                >
                  <ProductFilters categories={[category, ...siblingCategories]} />
                </Suspense>
              </aside>
              <section className="flex-1">
                <div className="mb-8 flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
                  <p className="font-medium text-text-muted">{totalItems.toLocaleString()} items in this collection</p>
                  <div className="flex items-center gap-4">
                    <ViewToggle />
                    <SortDropdown />
                  </div>
                </div>
                <Suspense fallback={<ProductGridSkeleton count={12} />}>
                  <ProductGrid products={products} />
                </Suspense>
                {totalPages > 1 ? (
                  <Pagination currentPage={page} totalPages={totalPages} className="mt-16 md:mt-20" />
                ) : null}
              </section>
            </div>
          </>
        )}
      </div>
    </main>
  );
}

function CategoryMessage({ title, message }: { title: string; message: string }) {
  return (
    <main className="min-h-screen bg-bg-base text-text-base">
      <section className="mx-auto max-w-[1440px] px-6 py-16 lg:px-12">
        <div className="rounded-card border border-border bg-bg-surface p-8">
          <h1 className="text-3xl font-heading font-bold text-heading">{title}</h1>
          <p className="mt-2 text-sm text-text-muted">{message}</p>
        </div>
      </section>
    </main>
  );
}

function optionalNumber(value: string | undefined): number | undefined {
  if (!value) return undefined;
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : undefined;
}
