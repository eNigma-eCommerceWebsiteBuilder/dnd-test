'use client';

import { useRouter } from 'next/navigation';
import { useCallback, useEffect, useSyncExternalStore } from 'react';
import { cn } from '@/lib/utils/cn';
import { SEARCH } from '@/lib/utils/constants';

const RECENT_SEARCHES_KEY = 'enigma-recent-searches';
const RECENT_SEARCHES_EVENT = 'enigma:recent-searches-updated';
const EMPTY_RECENT_SEARCHES: string[] = [];
let cachedStoredValue: string | null | undefined;
let cachedRecentSearches: string[] = EMPTY_RECENT_SEARCHES;

interface RecentSearchesProps {
    currentQuery: string;
    className?: string;
}

function readRecentSearches(): string[] {
    if (typeof window === 'undefined') {
        return EMPTY_RECENT_SEARCHES;
    }

    try {
        const stored = window.localStorage.getItem(RECENT_SEARCHES_KEY);
        if (stored === cachedStoredValue) {
            return cachedRecentSearches;
        }

        cachedStoredValue = stored;
        if (!stored) {
            cachedRecentSearches = EMPTY_RECENT_SEARCHES;
            return cachedRecentSearches;
        }

        const parsed = JSON.parse(stored);
        cachedRecentSearches = Array.isArray(parsed) ? parsed : EMPTY_RECENT_SEARCHES;
        return cachedRecentSearches;
    } catch (error) {
        console.warn('Failed to read recent searches:', error);
        cachedRecentSearches = EMPTY_RECENT_SEARCHES;
        return cachedRecentSearches;
    }
}

function emitRecentSearchesChange(): void {
    window.dispatchEvent(new Event(RECENT_SEARCHES_EVENT));
}

function subscribeToRecentSearches(onStoreChange: () => void): () => void {
    const handleStoreChange = () => {
        onStoreChange();
    };

    window.addEventListener('storage', handleStoreChange);
    window.addEventListener(RECENT_SEARCHES_EVENT, handleStoreChange);

    return () => {
        window.removeEventListener('storage', handleStoreChange);
        window.removeEventListener(RECENT_SEARCHES_EVENT, handleStoreChange);
    };
}

function getServerRecentSearches(): string[] {
    return EMPTY_RECENT_SEARCHES;
}

export function RecentSearches({ currentQuery, className }: RecentSearchesProps) {
    const router = useRouter();
    const recentSearches = useSyncExternalStore(
        subscribeToRecentSearches,
        readRecentSearches,
        getServerRecentSearches,
    );

    useEffect(() => {
        if (!currentQuery || currentQuery.trim().length < 2) {
            return;
        }

        try {
            let searches = readRecentSearches();

            searches = searches.filter((search) => search.toLowerCase() !== currentQuery.toLowerCase());
            searches.unshift(currentQuery);
            searches = searches.slice(0, SEARCH.RECENT_SEARCHES_LIMIT);

            window.localStorage.setItem(RECENT_SEARCHES_KEY, JSON.stringify(searches));
            emitRecentSearchesChange();
        } catch (error) {
            console.warn('Failed to save recent search:', error);
        }
    }, [currentQuery]);

    const handleSearchClick = useCallback((term: string) => {
        router.push(`/search?q=${encodeURIComponent(term)}`);
    }, [router]);

    const handleClearAll = useCallback(() => {
        try {
            window.localStorage.removeItem(RECENT_SEARCHES_KEY);
            emitRecentSearchesChange();
        } catch (error) {
            console.warn('Failed to clear recent searches:', error);
        }
    }, []);

    if (recentSearches.length === 0) {
        return null;
    }

    return (
        <div className={cn("@container w-full mb-6", className)}>
            <div className="flex items-center justify-between mb-3">
                <span className="text-sm font-medium text-text-muted">
                    Recent Searches
                </span>
                <button
                    onClick={handleClearAll}
                    className="text-sm text-primary hover:underline"
                >
                    Clear All
                </button>
            </div>
            <div className="flex gap-3 overflow-x-auto pb-2 no-scrollbar">
                {recentSearches.map((term, index) => (
                    <button
                        key={`${term}-${index}`}
                        onClick={() => handleSearchClick(term)}
                        className={cn(
                            "flex h-9 shrink-0 items-center gap-x-2 rounded-full",
                            "bg-bg-surface border border-border",
                            "pl-3 pr-4 shadow-sm",
                            "hover:border-primary cursor-pointer transition-colors",
                            term.toLowerCase() === currentQuery.toLowerCase() && "border-primary bg-primary/5"
                        )}
                    >
                        <span className="material-symbols-outlined text-sm text-text-muted">
                            history
                        </span>
                        <p className="text-sm font-medium text-text-base">{term}</p>
                    </button>
                ))}
            </div>
        </div>
    );
}

export default RecentSearches;
