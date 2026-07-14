import { getRouteParam, type PuckFetcherContext } from '@/lib/puck-route-metadata';

export function resolveProductDetailSlug(
  props: { productSlug?: string },
  context?: PuckFetcherContext,
): string | undefined {
  return props.productSlug || getRouteParam(context, 'productSlug');
}
