import { EmptyState } from './EmptyState';

interface EmptyStateViewProps {
  title?: string;
  description?: string;
  className?: string;
}

export const puckComponentName = 'EmptyState';
export const puckLabel = 'Empty Product State';
export const puckCategory = 'Products';

export const puckFields = {
  title: { type: 'text' as const, label: 'Title' },
  description: { type: 'textarea' as const, label: 'Description' },
};

export const puckDefaults = {
  title: 'No Products Found',
  description: 'Try adjusting your filters or browse our other collections.',
};

export const puckAst = {
  kind: 'runtime',
  sourceJsxNames: ['EmptyState'],
  sourceImportPaths: ['@/components/products/EmptyState'],
  role: 'catalog-empty-state',
  slotTarget: 'empty',
  runtimeSignals: ['products.items'],
  matches: [
    { pageIncludes: ['app/products/page.tsx'], componentName: 'EmptyState' },
  ],
};


export function EmptyStateView({ title, description, className }: EmptyStateViewProps) {
  return <EmptyState title={title} description={description} className={className} />;
}
