import { cn } from '@/lib/utils/cn';

interface CheckoutSkeletonProps {
    className?: string;
}

export default function CheckoutSkeleton({ className }: CheckoutSkeletonProps) {
    return (
        <div className={cn('@container w-full space-y-8', className)}>
            <div className="space-y-3">
                <div className="h-8 w-48 rounded-card bg-bg-skeleton animate-skeleton" />
                <div className="h-4 w-72 rounded-card bg-bg-skeleton animate-skeleton" />
            </div>
            <div className="grid grid-cols-1 gap-8 @lg:grid-cols-12 @lg:gap-12">
                <div className="space-y-8 @lg:col-span-7">
                    <div className="space-y-4">
                        <div className="h-5 w-40 rounded-card bg-bg-skeleton animate-skeleton" />
                        <div className="space-y-3">
                            <div className="h-12 w-full rounded-input bg-bg-skeleton animate-skeleton" />
                            <div className="grid grid-cols-1 @sm:grid-cols-2 gap-4">
                                <div className="h-12 w-full rounded-input bg-bg-skeleton animate-skeleton" />
                                <div className="h-12 w-full rounded-input bg-bg-skeleton animate-skeleton" />
                            </div>
                        </div>
                    </div>
                    <div className="space-y-4">
                        <div className="h-5 w-44 rounded-card bg-bg-skeleton animate-skeleton" />
                        <div className="space-y-3">
                            <div className="h-12 w-full rounded-input bg-bg-skeleton animate-skeleton" />
                            <div className="h-12 w-full rounded-input bg-bg-skeleton animate-skeleton" />
                            <div className="grid grid-cols-1 @sm:grid-cols-3 gap-4">
                                <div className="h-12 w-full rounded-input bg-bg-skeleton animate-skeleton" />
                                <div className="h-12 w-full rounded-input bg-bg-skeleton animate-skeleton" />
                                <div className="h-12 w-full rounded-input bg-bg-skeleton animate-skeleton" />
                            </div>
                        </div>
                    </div>
                </div>
                <div className="space-y-6 @lg:col-span-5">
                    <div className="rounded-card border border-border bg-bg-surface p-6 space-y-4">
                        <div className="h-5 w-40 rounded-card bg-bg-skeleton animate-skeleton" />
                        <div className="h-20 w-full rounded-card bg-bg-skeleton animate-skeleton" />
                        <div className="h-4 w-1/2 rounded-card bg-bg-skeleton animate-skeleton" />
                    </div>
                    <div className="rounded-card border border-border bg-bg-surface p-6 space-y-3">
                        <div className="h-4 w-32 rounded-card bg-bg-skeleton animate-skeleton" />
                        <div className="h-4 w-full rounded-card bg-bg-skeleton animate-skeleton" />
                        <div className="h-4 w-3/4 rounded-card bg-bg-skeleton animate-skeleton" />
                    </div>
                    <div className="h-12 w-full rounded-button bg-bg-skeleton animate-skeleton" />
                </div>
            </div>
        </div>
    );
}
