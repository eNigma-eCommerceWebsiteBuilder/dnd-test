import { cn } from '@/lib/utils/cn';
import { searchProducts } from '@/lib/api/services/products';

interface SearchHeaderViewProps {
  query: string;
  totalItems: number;
  className?: string;
}

export const puckComponentName = 'SearchHeader';
export const puckLabel = 'Search Header';
export const puckCategory = 'Search';

export const puckFields = {
  query: { type: 'text' as const, label: 'Search Query' },
  totalItems: { type: 'number' as const, label: 'Total Items' },
};

export const puckDefaults = {
  query: 'wool coat',
  totalItems: 24,
};

export async function puckDataFetcher(props: { query?: string }) {
  if (!props.query) return {};
  const result = await searchProducts(props.query, { pageSize: 1 });
  return {
    query: result.searchQuery || props.query,
    totalItems: result.totalItems || 0,
  };
}

export function SearchHeaderView({ query, totalItems, className }: SearchHeaderViewProps) {
  return (
    <div className={cn('@container mb-6 w-full', className)}>
      <div className="mb-4 flex flex-wrap items-baseline gap-4">
        <h1 className="text-3xl font-black tracking-tight text-text-base @md:text-4xl">
          {query ? `Search Results for "${query}"` : 'Search Results'}
        </h1>
        {query && Number(totalItems) > 0 ? (
          <p className="text-lg font-medium text-text-muted">
            {Number(totalItems).toLocaleString()} items found
          </p>
        ) : null}
      </div>
    </div>
  );
}
