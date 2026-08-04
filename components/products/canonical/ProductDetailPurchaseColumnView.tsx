import { fetchProduct } from '@/lib/api/services/products';
import { resolveProductDetailSlug } from '../product-detail-route';
import type { PuckFetcherContext } from '@/lib/puck-route-metadata';
import { ProductDetailPurchaseColumn } from './ProductDetailPurchaseColumn';
import { puckTransparentSlotProps, type CatalogSlot } from './types';
interface Props { productSlug?: string; productName?: string; hasRating?: boolean; stock?: CatalogSlot; rating?: CatalogSlot; price?: CatalogSlot; purchase?: CatalogSlot; trust?: CatalogSlot; }
export const puckComponentName = 'ProductDetailPurchaseColumn';
export const puckLabel = 'Product Detail Purchase Column';
export const puckCategory = 'Products';
export const puckFields = { productSlug: { type: 'text' as const, label: 'Product slug (auto-filled on published route)' }, stock: { type: 'slot' as const, allow: ['StockIndicator'] }, rating: { type: 'slot' as const, allow: ['ProductRatingSummary'] }, price: { type: 'slot' as const, allow: ['PriceDisplay'] }, purchase: { type: 'slot' as const, allow: ['ProductDetailsClient'] }, trust: { type: 'slot' as const, allow: ['ProductDetailTrustBadges'] } };
export const puckDefaults = { productSlug: 'premium-wool-coat', productName: 'Premium Wool Coat', hasRating: true, stock: [], rating: [], price: [], purchase: [], trust: [] };
export const puckAst = { kind: 'runtime', slots: ['stock', 'rating', 'price', 'purchase', 'trust'], sourceJsxNames: ['ProductDetailPurchaseColumn'], sourceImportPaths: ['@/components/products/canonical/ProductDetailPurchaseColumn'], role: 'product-detail-purchase-column', slotTarget: 'purchase', conditional: 'product.rating !== undefined && product.rating > 0', suspenseFallback: 'h-48 rounded-lg bg-bg-skeleton animate-pulse', runtimeSignals: ['product'] };
export async function puckDataFetcher(props: Props, context?: PuckFetcherContext) { const slug = resolveProductDetailSlug(props, context); if (!slug) return {}; const product = await fetchProduct(slug); return { productName: product.name, hasRating: product.rating !== undefined && product.rating > 0 }; }
export function ProductDetailPurchaseColumnView(props: Props) { return <ProductDetailPurchaseColumn productName={props.productName} hasRating={props.hasRating} stock={props.stock?.(puckTransparentSlotProps)} rating={props.rating?.(puckTransparentSlotProps)} price={props.price?.(puckTransparentSlotProps)} purchase={props.purchase?.(puckTransparentSlotProps)} trust={props.trust?.(puckTransparentSlotProps)} />; }
