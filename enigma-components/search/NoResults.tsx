import Link from 'next/link';
import { cn } from '@/lib/utils/cn';
import { ROUTES } from '@/lib/utils';

interface NoResultsProps {
    query: string;
    className?: string;
}

const SEARCH_SUGGESTIONS = [
    'Check your spelling',
    'Try more general terms',
    'Browse our categories'
] as const;

export function NoResults({ query, className }: NoResultsProps) {
    return (
        <div className={cn("@container w-full py-16 text-center @md:py-24", className)}>
            <div className="mb-6">
                <span className="material-symbols-outlined text-7xl text-text-light">
                    search_off
                </span>
            </div>

            <h2 className="mb-3 text-2xl font-bold text-text-base @md:text-3xl">
                No Results Found
            </h2>

            <p className="mx-auto mb-8 max-w-md text-text-muted">
                We couldn&apos;t find any products matching your search. Try different keywords or browse our categories.
            </p>

            {query ? (
                <p className="mb-8 text-sm text-text-muted">
                    You searched for: <span className="font-bold text-text-base">&quot;{query}&quot;</span>
                </p>
            ) : null}

            <div className="mb-10">
                <h3 className="mb-4 text-sm font-bold uppercase tracking-wider text-text-muted">
                    Suggestions
                </h3>
                <ul className="space-y-2 text-text-muted">
                    {SEARCH_SUGGESTIONS.map((suggestion) => (
                        <li key={suggestion} className="flex items-center justify-center gap-2">
                            <span className="material-symbols-outlined text-sm text-primary">
                                lightbulb
                            </span>
                            {suggestion}
                        </li>
                    ))}
                </ul>
            </div>

            <Link
                href={ROUTES.CATEGORIES}
                className="inline-flex items-center gap-2 rounded-button bg-cta-primary px-6 py-3 font-semibold text-on-primary transition-colors hover:bg-cta-primary-hover"
            >
                <span className="material-symbols-outlined">category</span>
                Browse Categories
            </Link>
        </div>
    );
}

export default NoResults;
