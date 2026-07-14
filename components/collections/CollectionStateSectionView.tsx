import type { ReactNode } from 'react';
import { fetchCollections } from '@/lib/api/services/collections';

interface CollectionStateSectionViewProps {
  state?: string;
  content?: (props?: Record<string, unknown>) => ReactNode;
  empty?: (props?: Record<string, unknown>) => ReactNode;
}

export const puckComponentName = 'CollectionStateSection';
export const puckLabel = 'Collection State Section';
export const puckCategory = 'Collections';

export const puckFields = {
  state: {
    type: 'select' as const,
    label: 'Preview State',
    options: [
      { label: 'Content', value: 'content' },
      { label: 'Empty', value: 'empty' },
    ],
  },
  content: { type: 'slot' as const },
  empty: { type: 'slot' as const },
};

export const puckDefaults = {
  state: 'content',
};

export const puckAst = {
  kind: 'runtime',
  topLevel: true,
  slots: ['content', 'empty'],
  runtimeSignals: ['collections'],
  matches: [
    { pageIncludes: ['app/collections'], component: 'CollectionStateSection' },
  ],
};

export async function puckDataFetcher() {
  const collections = await fetchCollections();
  return { state: collections.length > 0 ? 'content' : 'empty' };
}

export function CollectionStateSectionView({ state = 'content', content, empty }: CollectionStateSectionViewProps) {
  return <>{state === 'empty' ? empty?.() : content?.()}</>;
}
