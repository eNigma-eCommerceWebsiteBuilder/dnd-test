import { cn } from '@/lib/utils/cn';

interface PromotionBarSkeletonProps {
    className?: string;
}

export const PromotionBarSkeleton = ({ className }: PromotionBarSkeletonProps) => {
    return (
        <div className={cn("@container w-full bg-bg-surface border-b border-border", className)}>
            <div className="w-full px-4 py-3 flex flex-col @md:flex-row @md:items-center @md:justify-between gap-2 @md:gap-4">
                <div className="flex flex-col gap-2">
                    <div className="h-4 w-40 rounded-full bg-bg-skeleton animate-skeleton" />
                    <div className="h-3 w-56 rounded-full bg-bg-skeleton animate-skeleton" />
                </div>
                <div className="h-8 w-24 rounded-button bg-bg-skeleton animate-skeleton" />
            </div>
        </div>
    );
};
