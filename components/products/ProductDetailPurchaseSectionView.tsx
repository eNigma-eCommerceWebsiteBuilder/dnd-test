import type { ReactNode } from 'react';
import { fetchProduct } from '@/lib/api/services/products';
import {
  getRouteParam,
  getSearchParam,
  type PuckFetcherContext,
} from '@/lib/puck-route-metadata';

interface ProductDetailPurchaseSectionViewProps {
  productSlug?: string;
  state?: string;
  content?: (props?: Record<string, unknown>) => ReactNode;
}

export const puckComponentName = 'ProductDetailPurchaseSection';
export const puckLabel = 'Product Detail Purchase Section';
export const puckCategory = 'Products';

export const puckFields = {
  productSlug: { type: 'text' as const, label: 'Product Slug' },
  state: {
    type: 'select' as const,
    label: 'Preview State',
    options: [
      { label: 'Available', value: 'available' },
      { label: 'Unavailable', value: 'unavailable' },
    ],
  },
  content: { type: 'slot' as const },
};

export const puckDefaults = {
  productSlug: 'premium-wool-coat',
  state: 'available',
};

export const puckAst = {
  kind: 'runtime',
  topLevel: true,
  slots: ['content'],
  runtimeSignals: ['product'],
  matches: [
    { pageIncludes: ['app/products/[slug]/page.tsx'], component: 'ProductDetailPurchaseSection' },
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

  if (!productSlug) return { state: 'unavailable' };

  try {
    await fetchProduct(productSlug);
    return { productSlug, state: 'available' };
  } catch {
    return { productSlug, state: 'unavailable' };
  }
}

export function ProductDetailPurchaseSectionView({ state = 'available', content }: ProductDetailPurchaseSectionViewProps) {
  if (state === 'unavailable') return null;
  return <>{content?.()}</>;
}
