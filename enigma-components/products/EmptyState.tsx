import { cn } from '@/lib/utils/cn';

interface EmptyStateProps {
    title?: string;
    description?: string;
    onClearFilters?: () => void;
    className?: string;
}

/**
 * EmptyState Component
 * 
 * Displayed when no products match the current filters.
 * Server component - hardcoded functional UI text.
 */
export function EmptyState({
    title,
    description,
    onClearFilters,
    className
}: EmptyStateProps) {
    return (
        <div
            className={cn(
                "@container flex flex-col items-center justify-center",
                "py-16 px-6 text-center",
                className
            )}
        >
            {/* Icon */}
            <div className="w-20 h-20 rounded-full bg-bg-sunken flex items-center justify-center mb-6">
                <span className="material-symbols-outlined text-4xl text-text-muted">
                    inventory_2
                </span>
            </div>

            {/* Title */}
            <h3 className="text-xl font-bold text-text-base mb-2">
                {title || 'No Products Found'}
            </h3>

            {/* Description */}
            <p className="text-text-muted max-w-md mb-6">
                {description || 'Try adjusting your filters or browse our other collections.'}
            </p>

            {/* Clear Filters Button (if handler provided - only works in client context) */}
            {onClearFilters && (
                <button
                    onClick={onClearFilters}
                    className={cn(
                        "px-6 py-3 rounded-button",
                        "bg-primary text-on-primary",
                        "font-semibold text-sm",
                        "hover:bg-primary-dark transition-colors"
                    )}
                >
                    Clear All
                </button>
            )}
        </div>
    );
}

export default EmptyState;
