import { cn } from '@/lib/utils/cn';

interface ReturnDetailsSkeletonProps {
    className?: string;
}

export function ReturnDetailsSkeleton({ className }: ReturnDetailsSkeletonProps) {
    return (
        <section className={cn("@container flex w-full flex-col gap-6", className)}>
            <div className="space-y-3">
                <div className="h-8 w-52 rounded-card bg-bg-skeleton animate-skeleton" />
                <div className="h-4 w-40 rounded-card bg-bg-skeleton animate-skeleton" />
            </div>
            <div className="grid grid-cols-1 gap-6 @lg:grid-cols-12">
                <div className="space-y-4 @lg:col-span-7">
                    <div className="h-6 w-36 rounded-card bg-bg-skeleton animate-skeleton" />
                    <div className="h-40 rounded-card bg-bg-skeleton animate-skeleton" />
                    <div className="h-20 rounded-card bg-bg-skeleton animate-skeleton" />
                </div>
                <div className="space-y-4 @lg:col-span-5">
                    <div className="h-28 rounded-card bg-bg-skeleton animate-skeleton" />
                    <div className="h-28 rounded-card bg-bg-skeleton animate-skeleton" />
                    <div className="h-20 rounded-card bg-bg-skeleton animate-skeleton" />
                </div>
            </div>
        </section>
    );
}
