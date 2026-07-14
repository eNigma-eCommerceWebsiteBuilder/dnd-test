import { ProductTabs } from './ProductTabs';
import { fetchProduct } from '@/lib/api/services/products';
import { resolveProductDetailSlug } from './product-detail-route';
import type { PuckFetcherContext } from '@/lib/puck-route-metadata';

interface TabItem {
  id: string;
  label: string;
  content: string;
}

interface ProductTabsViewProps {
  productSlug?: string;
  defaultTab?: string;
  tabs: TabItem[];
  className?: string;
}

export const puckComponentName = 'ProductTabs';
export const puckLabel = 'Product Tabs';
export const puckCategory = 'Products';

export const puckFields = {
  productSlug: { type: 'text' as const, label: 'Product Slug (auto-fill from product)' },
  defaultTab: { type: 'text' as const, label: 'Default Tab ID' },
  tabs: {
    type: 'array' as const,
    label: 'Tabs',
    arrayFields: {
      id: { type: 'text' as const, label: 'Tab ID' },
      label: { type: 'text' as const, label: 'Tab Label' },
      content: { type: 'textarea' as const, label: 'Tab Content' },
    },
    defaultItemProps: {
      id: 'new-tab',
      label: 'New Tab',
      content: 'Tab content here.',
    },
    getItemSummary: (item: TabItem) => item.label,
  },
};

export const puckDefaults = {
  productSlug: 'premium-wool-coat',
  defaultTab: 'description',
  tabs: [
    {
      id: 'description',
      label: 'Description',
      content: 'Crafted from premium materials, this piece combines timeless design with modern functionality. Perfect for the discerning individual who values both style and substance.',
    },
    {
      id: 'specs',
      label: 'Specifications',
      content: 'Material: 100% Premium Wool\nFit: Tailored\nCare: Dry clean only\nOrigin: Made in Italy',
    },
    {
      id: 'shipping',
      label: 'Shipping & Returns',
      content: 'Free global shipping on orders over $100. 30-day hassle-free returns. Items must be in original condition with tags attached.',
    },
  ],
};
export const puckAst = { kind: 'runtime', sourceJsxNames: ['ProductTabs'], sourceImportPaths: ['@/components/products/ProductTabs'], role: 'product-tabs', runtimeSignals: ['product', 'reviews'] };

export async function puckDataFetcher(props: { productSlug?: string }, context?: PuckFetcherContext) {
  const productSlug = resolveProductDetailSlug(props, context);
  if (!productSlug) return {};
  const product = await fetchProduct(productSlug);
  const tabs: TabItem[] = [
    { id: 'description', label: 'Description', content: product.fullDescription || product.description || '' },
  ];
  if (product.specs && product.specs.length > 0) {
    tabs.push({
      id: 'specs',
      label: 'Specifications',
      content: product.specs.map((s) => `${s.name}: ${s.value}`).join('\n'),
    });
  }
  tabs.push({
    id: 'shipping',
    label: 'Shipping & Returns',
    content: 'Free global shipping on orders over $100. 30-day hassle-free returns.',
  });
  return { tabs };
}


export function ProductTabsView({ defaultTab, tabs, className }: ProductTabsViewProps) {
  return (
    <ProductTabs
      defaultTab={defaultTab}
      tabs={tabs}
      className={className}
    />
  );
}
