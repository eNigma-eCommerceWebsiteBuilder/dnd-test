import type { CatalogSlot } from './types';
export function ProductDetailMobileTabs({ content }: { content?: CatalogSlot }) { return <div className="mt-12 border-t border-border pt-8 lg:hidden">{content?.({ style: { display: 'contents' } })}</div>; }
