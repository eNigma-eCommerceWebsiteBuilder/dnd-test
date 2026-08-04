import type { ReactNode } from 'react';

export function CategoryCatalogPaginationCondition({ hasPagination, content }: { hasPagination: boolean; content?: ReactNode }) {
  return hasPagination ? <>{content}</> : null;
}
