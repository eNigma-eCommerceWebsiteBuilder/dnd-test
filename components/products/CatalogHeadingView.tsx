import { fetchCatalogProducts } from './catalogPuckUtils';
import type { PuckFetcherContext } from '@/lib/puck-route-metadata';

interface CatalogHeadingViewProps {
  title?: string;
  subtitle?: string;
  totalItems?: number;
  showCount?: boolean | string;
}

export const puckComponentName = 'CatalogHeading';
export const puckLabel = 'Catalog Heading';
export const puckCategory = 'Products';

export const puckFields = {
  title: { type: 'text' as const, label: 'Title' },
  subtitle: { type: 'textarea' as const, label: 'Fallback subtitle' },
  totalItems: { type: 'number' as const, label: 'Editor preview item count' },
  showCount: {
    type: 'select' as const,
    label: 'Show live item count',
    options: [
      { label: 'Yes', value: 'true' },
      { label: 'No', value: 'false' },
    ],
  },
};

export const puckDefaults = {
  title: 'All Products',
  subtitle: 'Browse our complete collection of premium products.',
  totalItems: 128,
  showCount: 'true',
};

export const puckAst = {
  kind: 'runtime',
  sourceJsxNames: ['h1'],
  sourceImportPaths: ['app/products/page.tsx'],
  role: 'catalog-heading',
  slotTarget: 'heading',
  runtimeSignals: ['products.totalItems', 'searchParams'],
  matches: [
    { pageIncludes: ['app/products/page.tsx'], tag: 'h1', textIncludes: ['All Products'] },
  ],
};

export async function puckDataFetcher(
  props: CatalogHeadingViewProps,
  context?: PuckFetcherContext,
) {
  if (String(props.showCount ?? 'true') !== 'true') return {};

  const result = await fetchCatalogProducts(context);
  return { totalItems: result.totalItems || 0 };
}

export function CatalogHeadingView({
  title = 'All Products',
  subtitle = 'Browse our complete collection of premium products.',
  totalItems = 0,
  showCount = 'true',
}: CatalogHeadingViewProps) {
  const shouldShowCount = String(showCount) === 'true';

  return (
    <>
      <h1 className="mb-2 text-4xl font-black tracking-tight text-text-base md:text-5xl">
        {title}
      </h1>
      <p className="text-text-muted">
        {shouldShowCount ? `${Number(totalItems || 0).toLocaleString()} items found in collection` : subtitle}
      </p>
    </>
  );
}
