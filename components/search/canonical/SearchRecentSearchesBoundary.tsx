import { Suspense } from 'react';
import type { ReactNode } from 'react';

export function SearchRecentSearchesBoundary({ content }: { content?: ReactNode }) {
  return <Suspense fallback={null}>{content}</Suspense>;
}
