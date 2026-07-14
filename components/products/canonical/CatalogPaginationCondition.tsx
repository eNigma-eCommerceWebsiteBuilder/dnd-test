import type { ReactNode } from 'react';

interface CatalogPaginationConditionProps {
  hasPagination?: boolean;
  previewMode?: 'visible' | 'hidden';
  content?: ReactNode;
}

export function CatalogPaginationCondition({
  hasPagination,
  previewMode = 'visible',
  content,
}: CatalogPaginationConditionProps) {
  const showPagination = hasPagination === undefined ? previewMode === 'visible' : hasPagination;
  return showPagination ? <>{content}</> : null;
}
