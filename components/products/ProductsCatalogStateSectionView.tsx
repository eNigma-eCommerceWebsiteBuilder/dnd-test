import Link from 'next/link';
import type { ReactNode } from 'react';
import { Suspense } from 'react';
import type { Category, Product } from '@/lib/api/types';
import { ActiveFilters } from '@/components/products/ActiveFilters';
import { EmptyState } from '@/components/products/EmptyState';
import { MobileFilterDrawer } from '@/components/products/MobileFilterDrawer';
import { Pagination } from '@/components/products/Pagination';
import { ProductFilters } from '@/components/products/ProductFilters';
import { ProductGrid } from '@/components/products/ProductGrid';
import { ProductGridSkeleton } from '@/components/products/ProductGridSkeleton';
import { SortDropdown } from '@/components/products/SortDropdown';
import { ViewToggle } from '@/components/products/ViewToggle';
import { getNumberSearchParam, type PuckFetcherContext } from '@/lib/puck-route-metadata';
import { fetchCatalogCategories, fetchCatalogProducts } from './catalogPuckUtils';

type CatalogSlot = (props?: Record<string, unknown>) => ReactNode;

interface ProductsCatalogStateSectionViewProps {
  state?: 'content' | 'empty' | 'error';
  products?: Product[];
  categories?: Category[];
  totalItems?: number;
  totalPages?: number;
  page?: number;
  pageSize?: number;
  title?: string;
  subtitle?: string;
  errorMessage?: string;
  breadcrumbs?: CatalogSlot;
  heading?: CatalogSlot;
  controls?: CatalogSlot;
  activeFilters?: CatalogSlot;
  filters?: CatalogSlot;
  results?: CatalogSlot;
  empty?: CatalogSlot;
  error?: CatalogSlot;
}

export const puckComponentName = 'ProductsCatalogStateSection';
export const puckLabel = 'Products Catalog State Section';
export const puckCategory = 'Products';

export const puckFields = {
  state: {
    type: 'select' as const,
    label: 'Preview State',
    options: [
      { label: 'Content', value: 'content' },
      { label: 'Empty', value: 'empty' },
      { label: 'Error', value: 'error' },
    ],
  },
  title: { type: 'text' as const, label: 'Title' },
  subtitle: { type: 'textarea' as const, label: 'Subtitle' },
  breadcrumbs: { type: 'slot' as const },
  heading: { type: 'slot' as const },
  controls: { type: 'slot' as const },
  activeFilters: { type: 'slot' as const },
  filters: { type: 'slot' as const },
  results: { type: 'slot' as const },
  empty: { type: 'slot' as const },
  error: { type: 'slot' as const },
};

export const puckDefaults = {
  state: 'content',
  title: 'All Products',
  subtitle: 'Browse our complete collection of premium products.',
};

export const puckAst = {
  kind: 'runtime',
  topLevel: true,
  slots: ['breadcrumbs', 'heading', 'controls', 'activeFilters', 'filters', 'results', 'empty', 'error'],
  runtimeSignals: ['searchParams', 'products', 'categories', 'pagination'],
  matches: [
    { pageIncludes: ['app/products/page.tsx'], component: 'ProductsCatalogStateSection' },
  ],
};

export async function puckDataFetcher(
  props: ProductsCatalogStateSectionViewProps,
  context?: PuckFetcherContext,
) {
  try {
    const page = getNumberSearchParam(context, 'page', 1);
    const pageSize = getNumberSearchParam(context, 'pageSize', 12);
    const [categories, productsData] = await Promise.all([
      fetchCatalogCategories(),
      fetchCatalogProducts(context, { pageSize }),
    ]);

    return {
      categories,
      page,
      pageSize,
      products: productsData.items || [],
      state: productsData.items?.length ? 'content' : 'empty',
      totalItems: productsData.totalItems || 0,
      totalPages: productsData.totalPages || 0,
    };
  } catch (error) {
    return {
      state: 'error',
      errorMessage: error instanceof Error ? error.message : 'Unable to load products.',
      products: props.products || [],
      categories: props.categories || [],
    };
  }
}

export function ProductsCatalogStateSectionView({
  state = 'content',
  products = [],
  categories = [],
  totalItems = 0,
  totalPages = 0,
  page = 1,
  pageSize = 12,
  title = 'All Products',
  subtitle = 'Browse our complete collection of premium products.',
  errorMessage = 'Unable to load products.',
  breadcrumbs,
  heading,
  controls,
  activeFilters,
  filters,
  results,
  empty,
  error,
}: ProductsCatalogStateSectionViewProps) {
  const hasGranularSlots = Boolean(
    breadcrumbs || heading || controls || activeFilters || filters || results || empty || error,
  );

  if (hasGranularSlots) {
    return (
      <main className="min-h-screen bg-bg-base text-text-base">
        <div className="mx-auto max-w-[1440px] px-6 py-8 lg:px-12">
          <div className="mb-10">
            {breadcrumbs ? <div className="mb-4">{breadcrumbs()}</div> : null}

            <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
              <div>
                {heading ? heading() : (
                  <>
                    <h1 className="mb-2 text-4xl font-black tracking-tight text-text-base md:text-5xl">{title}</h1>
                    <p className="text-text-muted">{state === 'content' ? `${totalItems.toLocaleString()} items found in collection` : subtitle}</p>
                  </>
                )}
              </div>
              {controls ? <div className="flex items-center gap-3 md:gap-4">{controls()}</div> : null}
            </div>
          </div>

          {state === 'error' ? (
            error ? error() : (
              <div className="rounded-card border border-danger bg-danger-subtle p-6 text-danger">{errorMessage}</div>
            )
          ) : (
            <>
              {activeFilters ? activeFilters() : null}
              <div className="flex flex-col gap-8 lg:flex-row lg:gap-12">
                {filters ? (
                  <aside className="hidden w-[280px] flex-shrink-0 lg:block">{filters()}</aside>
                ) : null}
                <section className="flex-1">
                  {state === 'empty' || products.length === 0
                    ? (empty ? empty() : <EmptyState />)
                    : (results ? results() : null)}
                </section>
              </div>
            </>
          )}
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-bg-base text-text-base">
      <div className="mx-auto max-w-[1440px] px-6 py-8 lg:px-12">
        <nav className="mb-4 flex items-center gap-2 text-sm text-text-muted">
          <Link href="/" className="transition-colors hover:text-primary">Home</Link>
          <span className="material-symbols-outlined text-xs">chevron_right</span>
          <span className="font-medium text-text-base">{title}</span>
        </nav>

        <div className="mb-10 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <h1 className="mb-2 text-4xl font-black tracking-tight text-text-base md:text-5xl">{title}</h1>
            <p className="text-text-muted">{state === 'content' ? `${totalItems.toLocaleString()} items found in collection` : subtitle}</p>
          </div>
          <div className="flex items-center gap-3 md:gap-4">
            <MobileFilterDrawer categories={categories} />
            <ViewToggle />
            <SortDropdown />
          </div>
        </div>

        {state === 'error' ? (
          <div className="rounded-card border border-danger bg-danger-subtle p-6 text-danger">{errorMessage}</div>
        ) : (
          <>
          <Suspense fallback={null}>
            <ActiveFilters className="mb-8" />
          </Suspense>
          <div className="flex flex-col gap-8 lg:flex-row lg:gap-12">
            <aside className="hidden w-[280px] flex-shrink-0 lg:block">
              <Suspense
                fallback={
                  <div className="space-y-8">
                    <div className="h-40 animate-pulse rounded-card bg-bg-skeleton" />
                    <div className="h-32 animate-pulse rounded-card bg-bg-skeleton" />
                    <div className="h-24 animate-pulse rounded-card bg-bg-skeleton" />
                  </div>
                }
              >
                <ProductFilters categories={categories} />
              </Suspense>
            </aside>
            <section className="flex-1">
              {state === 'empty' || products.length === 0 ? (
                <EmptyState />
              ) : (
                <>
                  <Suspense fallback={<ProductGridSkeleton count={pageSize} />}>
                    <ProductGrid products={products} />
                  </Suspense>
                  {totalPages > 1 ? (
                    <Pagination currentPage={page} totalPages={totalPages} className="mt-16 md:mt-20" />
                  ) : null}
                </>
              )}
            </section>
          </div>
          </>
        )}
      </div>
    </main>
  );
}
