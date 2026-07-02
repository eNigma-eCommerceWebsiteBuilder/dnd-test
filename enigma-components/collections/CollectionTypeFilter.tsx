'use client';

import { useState, useTransition } from 'react';
import { cn } from '@/lib/utils/cn';
import { revalidateCollectionsAction } from '@/lib/actions/content-tracking-actions';

type CollectionFilterType = 'all' | 'curated' | 'inspiration';

interface CollectionTypeFilterProps {
  totalCount: number;
  curatedCount: number;
  inspirationCount: number;
  initialFilter?: CollectionFilterType;
  className?: string;
  onFilterChange?: (filter: CollectionFilterType) => void;
  revalidateOnChange?: boolean;
}

export function CollectionTypeFilter({
  totalCount,
  curatedCount,
  inspirationCount,
  initialFilter = 'all',
  className,
  onFilterChange,
  revalidateOnChange = false,
}: CollectionTypeFilterProps) {
  const [activeFilter, setActiveFilter] = useState<CollectionFilterType>(initialFilter);
  const [, startTransition] = useTransition();

  const handleFilterChange = (filter: CollectionFilterType) => {
    setActiveFilter(filter);
    onFilterChange?.(filter);

    if (revalidateOnChange) {
      startTransition(() => {
        void revalidateCollectionsAction();
      });
    }
  };

  return (
    <div
      className={cn(
        '@container flex w-full flex-col gap-4 @md:flex-row @md:items-center @md:justify-between',
        className
      )}
    >
      <div className="flex w-full flex-wrap items-center gap-2 rounded-card bg-bg-sunken p-2">
        <button
          type="button"
          onClick={() => handleFilterChange('all')}
          className={cn(
            'rounded-button px-4 py-2 text-sm font-semibold transition-colors',
            activeFilter === 'all'
              ? 'bg-cta-primary text-on-primary'
              : 'text-text-muted hover:text-primary'
          )}
        >
          All
        </button>
        <button
          type="button"
          onClick={() => handleFilterChange('curated')}
          className={cn(
            'rounded-button px-4 py-2 text-sm font-semibold transition-colors',
            activeFilter === 'curated'
              ? 'bg-cta-primary text-on-primary'
              : 'text-text-muted hover:text-primary'
          )}
        >
          Curated
        </button>
        <button
          type="button"
          onClick={() => handleFilterChange('inspiration')}
          className={cn(
            'rounded-button px-4 py-2 text-sm font-semibold transition-colors',
            activeFilter === 'inspiration'
              ? 'bg-cta-primary text-on-primary'
              : 'text-text-muted hover:text-primary'
          )}
        >
          Inspiration
        </button>
      </div>

      <div className="flex flex-wrap items-center gap-3 text-sm text-text-muted">
        <span>
          {activeFilter === 'all' && `${totalCount} Collections`}
          {activeFilter === 'curated' && `${curatedCount} Curated`}
          {activeFilter === 'inspiration' && `${inspirationCount} Inspiration`}
        </span>
      </div>
    </div>
  );
}
