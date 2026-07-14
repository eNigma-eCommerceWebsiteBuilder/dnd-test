import { EmptyCategory } from '@/enigma-components/categories/EmptyCategory';

interface EmptyCategoryViewProps {
  className?: string;
}

export const puckComponentName = 'EmptyCategory';
export const puckLabel = 'Empty Category State';
export const puckCategory = 'Categories';

export const puckFields = {};

export const puckDefaults = {};

export const puckAst = {
  kind: 'runtime', sourceJsxNames: ['EmptyCategory'], sourceImportPaths: ['@/components/categories/EmptyCategory'],
  role: 'category-empty-state', slotTarget: 'empty', runtimeSignals: ['category.products'],
};

export function EmptyCategoryView({ className }: EmptyCategoryViewProps) {
  return <div className={className}><EmptyCategory /></div>;
}
