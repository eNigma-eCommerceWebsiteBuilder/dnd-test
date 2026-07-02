import { cn } from '@/lib/utils/cn';

interface PromotionBannerSkeletonProps {
    className?: string;
}

export const PromotionBannerSkeleton = ({ className }: PromotionBannerSkeletonProps) => {
    return (
        <div className={cn("@container w-full bg-bg-surface border-b border-border", className)}>
            <div className="w-full px-4 py-3 flex flex-col @md:flex-row @md:items-center @md:justify-between gap-4">
                <div className="flex flex-col gap-2">
                    <div className="h-4 w-52 rounded-full bg-bg-skeleton animate-skeleton" />
                    <div className="h-3 w-64 rounded-full bg-bg-skeleton animate-skeleton" />
                </div>
                <div className="flex flex-col @md:flex-row @md:items-center gap-3 @md:gap-4">
                    <div className="h-10 w-44 rounded-badge bg-bg-skeleton animate-skeleton" />
                    <div className="h-8 w-24 rounded-button bg-bg-skeleton animate-skeleton" />
                </div>
            </div>
            <div className="h-1 w-full bg-bg-skeleton animate-skeleton" />
        </div>
    );
};
