import { ProductDetailSection } from './ProductDetailSection';
import { puckTransparentSlotProps, type CatalogSlot } from './types';
interface Props { kind: 'reviews' | 'testimonials'; content?: CatalogSlot; }
export const puckComponentName = 'ProductDetailSection';
export const puckLabel = 'Product Detail Content Section';
export const puckCategory = 'Products';
export const puckFields = { kind: { type: 'select' as const, options: [{ label: 'Reviews', value: 'reviews' }, { label: 'Testimonials', value: 'testimonials' }] }, content: { type: 'slot' as const, allow: ['ReviewsSection', 'TestimonialsSection'] } };
export const puckDefaults = { kind: 'reviews', content: [] };
export const puckAst = { kind: 'runtime', slots: ['content'], sourceJsxNames: ['ProductDetailSection'], sourceImportPaths: ['@/components/products/canonical/ProductDetailSection'], role: 'product-detail-section', requiredClasses: ['mt-24', 'border-t', 'pt-16'] };
export function ProductDetailSectionView(props: Props) { return <ProductDetailSection kind={props.kind} content={props.content?.(puckTransparentSlotProps)} />; }
