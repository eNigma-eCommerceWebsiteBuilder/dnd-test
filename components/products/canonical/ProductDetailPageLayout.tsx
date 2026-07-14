import type { CatalogSlot } from './types';

interface Props {
  promotion?: CatalogSlot; breadcrumbs?: CatalogSlot; media?: CatalogSlot; purchase?: CatalogSlot;
  mobileTabs?: CatalogSlot; reviews?: CatalogSlot; testimonials?: CatalogSlot; related?: CatalogSlot;
}

export function ProductDetailPageLayout(props: Props) {
  return <main className="min-h-screen bg-bg-base text-text-base">{props.promotion?.({ style: { display: 'contents' } })}<div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">{props.breadcrumbs?.({ style: { display: 'contents' } })}<div className="grid grid-cols-1 gap-8 lg:grid-cols-12 lg:gap-12">{props.media?.({ style: { display: 'contents' } })}{props.purchase?.({ style: { display: 'contents' } })}</div>{props.mobileTabs?.({ style: { display: 'contents' } })}{props.reviews?.({ style: { display: 'contents' } })}{props.testimonials?.({ style: { display: 'contents' } })}{props.related?.({ style: { display: 'contents' } })}</div></main>;
}
