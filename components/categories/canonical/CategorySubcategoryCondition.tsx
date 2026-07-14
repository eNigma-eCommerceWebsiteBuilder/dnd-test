import type { ReactNode } from 'react';

export function CategorySubcategoryCondition({ hasSiblings, previewMode = 'visible', content }: { hasSiblings?: boolean; previewMode?: 'visible' | 'hidden'; content?: ReactNode }) {
  const visible = hasSiblings === undefined ? previewMode === 'visible' : hasSiblings;
  return visible ? <>{content}</> : null;
}
