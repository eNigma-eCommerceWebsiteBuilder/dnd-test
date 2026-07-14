import type { ReactNode } from 'react';
import { fetchRelatedProducts } from '@/lib/api/services/products';
import {
  getRouteParam,
  getSearchParam,
  type PuckFetcherContext,
} from '@/lib/puck-route-metadata';

interface ProductRelatedProductsSectionViewProps {
  productSlug?: string;
  state?: string;
  content?: (props?: Record<string, unknown>) => ReactNode;
}

export const puckComponentName = 'ProductRelatedProductsSection';
export const puckLabel = 'Product Related Products Section';
export const puckCategory = 'Products';

export const puckFields = {
  productSlug: { type: 'text' as const, label: 'Product Slug' },
  state: {
    type: 'select' as const,
    label: 'Preview State',
    options: [
      { label: 'Visible', value: 'visible' },
      { label: 'Hidden', value: 'hidden' },
    ],
  },
  content: { type: 'slot' as const },
};

export const puckDefaults = {
  productSlug: 'premium-wool-coat',
  state: 'visible',
};

export const puckAst = {
  kind: 'runtime',
  topLevel: true,
  slots: ['content'],
  runtimeSignals: ['product', 'relatedProducts'],
  matches: [
    { componentName: 'RelatedProducts', component: 'ProductRelatedProductsSection' },
  ],
};

export async function puckDataFetcher(
  props: { productSlug?: string },
  context?: PuckFetcherContext,
) {
  const productSlug = props.productSlug
    || getRouteParam(context, 'slug')
    || getSearchParam(context, 'productSlug')
    || getSearchParam(context, 'slug');

  if (!productSlug) return { state: 'hidden' };

  try {
    const products = await fetchRelatedProducts(productSlug, 4);
    return { productSlug, state: products.length > 0 ? 'visible' : 'hidden' };
  } catch {
    return { productSlug, state: 'hidden' };
  }
}

export function ProductRelatedProductsSectionView({ state = 'visible', content }: ProductRelatedProductsSectionViewProps) {
  if (state === 'hidden') return null;
  return <>{content?.()}</>;
}
