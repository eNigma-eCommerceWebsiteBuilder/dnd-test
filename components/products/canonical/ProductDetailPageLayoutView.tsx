import { ProductDetailPageLayout } from './ProductDetailPageLayout';
import { puckTransparentSlotProps, type CatalogSlot } from './types';

interface Props { promotion?: CatalogSlot; breadcrumbs?: CatalogSlot; media?: CatalogSlot; purchase?: CatalogSlot; mobileTabs?: CatalogSlot; reviews?: CatalogSlot; testimonials?: CatalogSlot; related?: CatalogSlot; }
export const puckComponentName = 'ProductDetailPageLayout';
export const puckLabel = 'Product Detail Page Layout';
export const puckCategory = 'Products';
export const puckFields = { promotion: { type: 'slot' as const, allow: ['PromotionBanner'] }, breadcrumbs: { type: 'slot' as const, allow: ['Breadcrumbs'] }, media: { type: 'slot' as const, allow: ['ProductDetailMediaColumn'] }, purchase: { type: 'slot' as const, allow: ['ProductDetailPurchaseColumn'] }, mobileTabs: { type: 'slot' as const, allow: ['ProductDetailMobileTabs'] }, reviews: { type: 'slot' as const, allow: ['ProductDetailSection'] }, testimonials: { type: 'slot' as const, allow: ['ProductDetailSection'] }, related: { type: 'slot' as const, allow: ['ProductDetailRelatedProductsSection'] } };
export const puckDefaults = { promotion: [], breadcrumbs: [], media: [], purchase: [], mobileTabs: [], reviews: [], testimonials: [], related: [] };
export const puckAst = { kind: 'runtime', slots: ['promotion', 'breadcrumbs', 'media', 'purchase', 'mobileTabs', 'reviews', 'testimonials', 'related'], sourceJsxNames: ['ProductDetailPageLayout'], sourceImportPaths: ['@/components/products/canonical/ProductDetailPageLayout'], role: 'product-detail-layout', requiredClasses: ['min-h-screen', 'max-w-7xl', 'grid-cols-1', 'lg:grid-cols-12'] };
export function ProductDetailPageLayoutView(props: Props) {
  return <ProductDetailPageLayout promotion={props.promotion?.(puckTransparentSlotProps)} breadcrumbs={props.breadcrumbs?.(puckTransparentSlotProps)} media={props.media?.(puckTransparentSlotProps)} purchase={props.purchase?.(puckTransparentSlotProps)} mobileTabs={props.mobileTabs?.(puckTransparentSlotProps)} reviews={props.reviews?.(puckTransparentSlotProps)} testimonials={props.testimonials?.(puckTransparentSlotProps)} related={props.related?.(puckTransparentSlotProps)} />;
}
