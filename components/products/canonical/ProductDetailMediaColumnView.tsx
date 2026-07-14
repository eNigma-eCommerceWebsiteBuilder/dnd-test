import { ProductDetailMediaColumn } from './ProductDetailMediaColumn';
import type { CatalogSlot } from './types';
interface Props { gallery?: CatalogSlot; desktopTabs?: CatalogSlot; }
export const puckComponentName = 'ProductDetailMediaColumn';
export const puckLabel = 'Product Detail Media Column';
export const puckCategory = 'Products';
export const puckFields = { gallery: { type: 'slot' as const, allow: ['ProductGallery'] }, desktopTabs: { type: 'slot' as const, allow: ['ProductTabs'] } };
export const puckDefaults = { gallery: [], desktopTabs: [] };
export const puckAst = { kind: 'runtime', slots: ['gallery', 'desktopTabs'], sourceJsxNames: ['ProductGallery', 'ProductTabs'], role: 'product-detail-media-column', slotTarget: 'media', requiredClasses: ['lg:col-span-7', 'mt-16', 'hidden', 'lg:block'] };
export function ProductDetailMediaColumnView(props: Props) { return <ProductDetailMediaColumn {...props} />; }
