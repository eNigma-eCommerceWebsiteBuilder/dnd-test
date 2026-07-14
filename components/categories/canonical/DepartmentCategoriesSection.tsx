import type { CatalogSlot } from '@/components/products/canonical/types';

export function DepartmentCategoriesSection({ grid }: { grid?: CatalogSlot }) {
  // Puck emits one slot wrapper. Make it transparent so CategoryGrid keeps the source JSX position.
  return <section className="mb-20"><div className="flex items-center gap-4 mb-8"><h2 className="text-2xl font-bold tracking-tight text-text-base">Browse by Department</h2><div className="h-[2px] flex-1 bg-divider" /></div>{grid?.({ style: { display: 'contents' } })}</section>;
}
