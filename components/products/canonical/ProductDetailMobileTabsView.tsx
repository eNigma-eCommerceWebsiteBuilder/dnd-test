import { ProductDetailMobileTabs } from './ProductDetailMobileTabs';
import type { CatalogSlot } from './types';
interface Props { content?: CatalogSlot; }
export const puckComponentName = 'ProductDetailMobileTabs';
export const puckLabel = 'Product Detail Mobile Tabs';
export const puckCategory = 'Products';
export const puckFields = { content: { type: 'slot' as const, allow: ['ProductTabs'] } };
export const puckDefaults = { content: [] };
export const puckAst = { kind: 'runtime', slots: ['content'], sourceJsxNames: ['ProductTabs'], role: 'product-detail-mobile-tabs', slotTarget: 'mobileTabs', requiredClasses: ['mt-12', 'lg:hidden'] };
export function ProductDetailMobileTabsView(props: Props) { return <ProductDetailMobileTabs {...props} />; }
