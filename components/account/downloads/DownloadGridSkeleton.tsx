interface DownloadGridSkeletonProps {
    count?: number;
}

export function DownloadGridSkeleton({ count = 6 }: DownloadGridSkeletonProps) {
    return (
        <div className="@container grid w-full grid-cols-1 gap-6 @md:grid-cols-2 @xl:grid-cols-3">
            {Array.from({ length: count }).map((_, index) => (
                <div key={`download-skeleton-${index}`} className="rounded-card border border-border bg-bg-surface p-5 shadow-card">
                    <div className="space-y-4">
                        <div className="h-36 w-full rounded-card bg-bg-skeleton animate-skeleton" />
                        <div className="space-y-2">
                            <div className="h-4 w-2/3 rounded-full bg-bg-skeleton animate-skeleton" />
                            <div className="h-3 w-1/2 rounded-full bg-bg-skeleton animate-skeleton" />
                        </div>
                        <div className="h-10 w-full rounded-card bg-bg-skeleton animate-skeleton" />
                        <div className="h-10 w-full rounded-card bg-bg-skeleton animate-skeleton" />
                    </div>
                </div>
            ))}
        </div>
    );
}
