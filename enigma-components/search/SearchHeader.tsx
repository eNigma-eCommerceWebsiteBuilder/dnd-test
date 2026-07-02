import { cn } from '@/lib/utils/cn';

interface SearchHeaderProps {
    query: string;
    totalItems: number;
    className?: string;
}

export function SearchHeader({ query, totalItems, className }: SearchHeaderProps) {
    return (
        <div className={cn("@container mb-6 w-full", className)}>
            <div className="mb-4 flex flex-wrap items-baseline gap-4">
                <h1 className="text-3xl font-black tracking-tight text-text-base @md:text-4xl">
                    {query ? `Search Results for "${query}"` : 'Search Results'}
                </h1>
                {query && totalItems > 0 ? (
                    <p className="text-lg font-medium text-text-muted">
                        {totalItems.toLocaleString()} items found
                    </p>
                ) : null}
            </div>
        </div>
    );
}

export default SearchHeader;
