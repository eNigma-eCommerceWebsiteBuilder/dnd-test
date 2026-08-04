import type { ReactNode } from 'react';

export function SearchPaginationCondition({ hasPagination, content }: { hasPagination: boolean; content?: ReactNode }) {
  return hasPagination ? <>{content}</> : null;
}
