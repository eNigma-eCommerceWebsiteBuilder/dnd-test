import type { ReactNode } from 'react';

export function CategorySubcategoryCondition({ hasSiblings, content }: { hasSiblings: boolean; content?: ReactNode }) {
  return hasSiblings ? <>{content}</> : null;
}
