import { fetchRelatedProducts } from '@/lib/api/services/products';
import { resolveProductDetailSlug } from '../product-detail-route';
import type { PuckFetcherContext } from '@/lib/puck-route-metadata';
import { ProductDetailRelatedProductsSection } from './ProductDetailRelatedProductsSection';
import { puckTransparentSlotProps, type CatalogSlot } from './types';
interface Props { productSlug?: string; visible?: boolean; previewMode?: 'visible' | 'hidden'; content?: CatalogSlot; puck?: { isEditing?: boolean }; }
export const puckComponentName = 'ProductDetailRelatedProductsSection';
export const puckLabel = 'Product Detail Related Products Condition';
export const puckCategory = 'Products';
export const puckFields = { productSlug: { type: 'text' as const, label: 'Product slug (auto-filled on published route)' }, previewMode: { type: 'select' as const, options: [{ label: 'Visible', value: 'visible' }, { label: 'Hidden', value: 'hidden' }] }, content: { type: 'slot' as const, allow: ['RelatedProducts'] } };
export const puckDefaults = { productSlug: 'premium-wool-coat', previewMode: 'visible', content: [] };
export const puckAst = { kind: 'runtime', slots: ['content'], sourceJsxNames: ['ProductDetailRelatedProductsSection'], sourceImportPaths: ['@/components/products/canonical/ProductDetailRelatedProductsSection'], role: 'product-detail-related-condition', slotTarget: 'related', conditional: 'relatedProducts.length > 0', runtimeSignals: ['relatedProducts'] };
export async function puckDataFetcher(props: Props, context?: PuckFetcherContext) { const slug = resolveProductDetailSlug(props, context); if (!slug) return {}; return { visible: (await fetchRelatedProducts(slug, 4)).length > 0 }; }
export function ProductDetailRelatedProductsSectionView(props: Props) {
  const visible = props.visible ?? (props.puck?.isEditing ? props.previewMode === 'visible' : false);
  return <ProductDetailRelatedProductsSection visible={visible} content={props.content?.(puckTransparentSlotProps)} />;
}
