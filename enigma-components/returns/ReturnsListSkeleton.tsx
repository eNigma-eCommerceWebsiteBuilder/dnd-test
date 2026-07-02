import { cn } from '@/lib/utils/cn';

interface ReturnsListSkeletonProps {
    itemCount?: number;
    className?: string;
}

export function ReturnsListSkeleton({ itemCount = 3, className }: ReturnsListSkeletonProps) {
    return (
        <div className={cn('@container w-full flex flex-col gap-4', className)}>
            {Array.from({ length: itemCount }).map((_, index) => (
                <div
                    key={`return-skeleton-${index}`}
                    className="rounded-card bg-surface border border-border shadow-card p-4 @md:p-6 flex flex-col gap-4"
                >
                    <div className="flex flex-col @md:flex-row @md:items-center @md:justify-between gap-3">
                        <div className="flex flex-col gap-2">
                            <div className="h-5 w-32 bg-skeleton rounded animate-skeleton" />
                            <div className="h-6 w-40 bg-skeleton rounded animate-skeleton" />
                            <div className="h-4 w-28 bg-skeleton rounded animate-skeleton" />
                        </div>
                        <div className="flex flex-col gap-2 w-full @md:w-48">
                            <div className="h-4 w-full bg-skeleton rounded animate-skeleton" />
                            <div className="h-10 w-full bg-skeleton rounded-button animate-skeleton" />
                        </div>
                    </div>
                    <div className="grid grid-cols-1 @md:grid-cols-2 gap-3">
                        {[1, 2].map((item) => (
                            <div key={`item-${index}-${item}`} className="flex items-center gap-3 p-3 border border-border rounded-card">
                                <div className="w-12 h-12 bg-skeleton rounded-image animate-skeleton" />
                                <div className="flex flex-col gap-2 flex-1">
                                    <div className="h-4 w-32 bg-skeleton rounded animate-skeleton" />
                                    <div className="h-3 w-20 bg-skeleton rounded animate-skeleton" />
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            ))}
        </div>
    );
}
