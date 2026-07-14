import { Breadcrumbs } from './Breadcrumbs';
import { fetchProduct } from '@/lib/api/services/products';
import { resolveProductDetailSlug } from './product-detail-route';
import type { PuckFetcherContext } from '@/lib/puck-route-metadata';

interface BreadcrumbItem {
  label: string;
  href?: string;
}

interface BreadcrumbsViewProps {
  productSlug?: string;
  items: BreadcrumbItem[];
  className?: string;
}

export const puckComponentName = 'Breadcrumbs';
export const puckLabel = 'Breadcrumbs';
export const puckCategory = 'Products';

export const puckFields = {
  productSlug: { type: 'text' as const, label: 'Product Slug (auto-build from product)' },
  items: {
    type: 'array' as const,
    label: 'Breadcrumb Items',
    arrayFields: {
      label: { type: 'text' as const, label: 'Label' },
      href: { type: 'text' as const, label: 'Link URL (optional)' },
    },
    defaultItemProps: {
      label: 'New Crumb',
      href: '',
    },
    getItemSummary: (item: BreadcrumbItem) => item.label,
  },
};

export const puckDefaults = {
  productSlug: 'premium-wool-coat',
  items: [
    { label: 'Home', href: '/' },
    { label: 'Products', href: '/products' },
    { label: 'Product Detail' },
  ],
};
export const puckAst = { kind: 'runtime', sourceJsxNames: ['Breadcrumbs'], sourceImportPaths: ['@/components/products/Breadcrumbs'], role: 'breadcrumbs', runtimeSignals: ['product.category'] };

export async function puckDataFetcher(props: { productSlug?: string }, context?: PuckFetcherContext) {
  const productSlug = resolveProductDetailSlug(props, context);
  if (!productSlug) return {};
  const product = await fetchProduct(productSlug);
  const categoryName = typeof product.category === 'object' && product.category ? product.category.name : 'Products';
  const categorySlug = typeof product.category === 'object' && product.category ? product.category.slug : 'products';
  return {
    items: [
      { label: 'Home', href: '/' },
      { label: categoryName, href: `/categories/${categorySlug}` },
      { label: product.name },
    ],
  };
}


export function BreadcrumbsView({ items, className }: BreadcrumbsViewProps) {
  return <Breadcrumbs items={items} className={className} />;
}
