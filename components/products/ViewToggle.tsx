'use client';

import { useRouter, useSearchParams, usePathname } from 'next/navigation';
import { useCallback } from 'react';
import { cn } from '@/lib/utils/cn';

type ViewMode = 'grid' | 'list';

interface ViewToggleProps {
    className?: string;
}

/**
 * ViewToggle Component
 * 
 * Toggle between grid and list view modes.
 * Syncs with URL search params for shareable view states.
 */
export function ViewToggle({ className }: ViewToggleProps) {
    const router = useRouter();
    const pathname = usePathname();
    const searchParams = useSearchParams();

    const currentView = (searchParams.get('view') as ViewMode) || 'grid';

    const handleViewChange = useCallback((view: ViewMode) => {
        const params = new URLSearchParams(searchParams.toString());

        if (view === 'grid') {
            params.delete('view');
        } else {
            params.set('view', view);
        }

        router.push(`${pathname}?${params.toString()}`, { scroll: false });
    }, [router, pathname, searchParams]);

    return (
        <div
            className={cn(
                "flex shrink-0 items-center bg-bg-surface rounded-input p-1",
                "border border-border",
                className
            )}
        >
            <button
                onClick={() => handleViewChange('grid')}
                className={cn(
                    "p-1.5 rounded-button-sm transition-colors",
                    currentView === 'grid'
                        ? "bg-bg-active text-text-base"
                        : "text-text-muted hover:bg-bg-hover"
                )}
                aria-label="Grid view"
                aria-pressed={currentView === 'grid'}
            >
                <span className="material-symbols-outlined text-sm">grid_view</span>
            </button>
            <button
                onClick={() => handleViewChange('list')}
                className={cn(
                    "p-1.5 rounded-button-sm transition-colors",
                    currentView === 'list'
                        ? "bg-bg-active text-text-base"
                        : "text-text-muted hover:bg-bg-hover"
                )}
                aria-label="List view"
                aria-pressed={currentView === 'list'}
            >
                <span className="material-symbols-outlined text-sm">view_list</span>
            </button>
        </div>
    );
}

export default ViewToggle;
