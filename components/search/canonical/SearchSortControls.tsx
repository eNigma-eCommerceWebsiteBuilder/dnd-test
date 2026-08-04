import type { ReactNode } from 'react';

export function SearchSortControls({ totalItems = 0, content }: { totalItems?: number; content?: ReactNode }) {
  return <div className="flex items-center justify-between mb-8 pb-4 border-b border-border"><span className="text-sm text-text-muted">{totalItems.toLocaleString()} items found</span><div className="flex items-center gap-4"><span className="text-sm font-medium text-text-muted">Sort by:</span>{content}</div></div>;
}
