import type { CatalogSlot } from './types';

interface Props { productName?: string; hasRating?: boolean; stock?: CatalogSlot; rating?: CatalogSlot; price?: CatalogSlot; purchase?: CatalogSlot; trust?: CatalogSlot; }
export function ProductDetailPurchaseColumn({ productName = 'Product', hasRating, stock, rating, price, purchase, trust }: Props) {
  return <div className="lg:col-span-5"><div className="space-y-6 lg:sticky lg:top-28"><div className="flex items-start justify-between gap-4"><h1 className="text-3xl font-extrabold text-text-base md:text-4xl">{productName}</h1>{stock?.({ style: { display: 'contents' } })}</div>{hasRating ? rating?.({ style: { display: 'contents' } }) : null}{price?.({ style: { display: 'contents' } })}<hr className="border-border" />{purchase?.({ style: { display: 'contents' } })}{trust?.({ style: { display: 'contents' } })}</div></div>;
}
