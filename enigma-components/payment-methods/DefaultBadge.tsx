import { cn } from '@/lib/utils';
import type { DefaultBadgeProps } from './types';

export function DefaultBadge({ className }: DefaultBadgeProps) {
    return (
        <span
            className={cn(
                "@container px-2 py-0.5 rounded-badge text-[10px] font-bold uppercase tracking-widest",
                "bg-primary/10 text-primary",
                className
            )}
        >
            Default
        </span>
    );
}
