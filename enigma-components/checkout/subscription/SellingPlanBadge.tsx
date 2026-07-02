import { cn } from '@/lib/utils/cn';

interface SellingPlanBadgeProps {
    label: string;
    className?: string;
}

export default function SellingPlanBadge({ label, className }: SellingPlanBadgeProps) {
    return (
        <span
            className={cn(
                '@container w-full inline-flex items-center gap-1.5 rounded-badge bg-primary/10 px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wider text-primary',
                className
            )}
        >
            <span className="material-symbols-outlined text-[14px]">sell</span>
            {label}
        </span>
    );
}
