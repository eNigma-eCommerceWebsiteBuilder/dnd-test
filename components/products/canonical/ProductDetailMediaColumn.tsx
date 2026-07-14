import type { CatalogSlot } from './types';

export function ProductDetailMediaColumn({ gallery, desktopTabs }: { gallery?: CatalogSlot; desktopTabs?: CatalogSlot }) {
  return <div className="lg:col-span-7">{gallery?.({ style: { display: 'contents' } })}<div className="mt-16 hidden border-t border-border pt-8 lg:block">{desktopTabs?.({ style: { display: 'contents' } })}</div></div>;
}
