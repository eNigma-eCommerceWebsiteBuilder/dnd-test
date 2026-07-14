import type { ReactNode } from 'react';

export function CategoryCatalogPaginationCondition({ hasPagination, previewMode = 'visible', content }: { hasPagination?: boolean; previewMode?: 'visible' | 'hidden'; content?: ReactNode }) {
  const visible = hasPagination === undefined ? previewMode === 'visible' : hasPagination;
  return visible ? <>{content}</> : null;
}
