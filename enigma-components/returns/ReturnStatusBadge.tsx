import { cn } from '@/lib/utils/cn';
import { formatReturnStatus } from '@/lib/utils/returns';
import type { ReturnStatus } from '@/lib/api/types/returns';

interface ReturnStatusBadgeProps {
    status: ReturnStatus;
    className?: string;
}

const statusStyles: Record<string, { badge: string; icon: string }> = {
    pending: { badge: 'bg-warning-subtle text-warning-dark', icon: 'schedule' },
    approved: { badge: 'bg-success-subtle text-success-dark', icon: 'check_circle' },
    rejected: { badge: 'bg-danger-subtle text-danger-dark', icon: 'cancel' },
    processing: { badge: 'bg-info-subtle text-info-dark', icon: 'sync' },
    completed: { badge: 'bg-success-subtle text-success-dark', icon: 'check' },
    cancelled: { badge: 'bg-sunken text-text-muted', icon: 'block' },
};

export function ReturnStatusBadge({ status, className }: ReturnStatusBadgeProps) {
    const display = formatReturnStatus(status);
    const style = statusStyles[status] || { badge: 'bg-sunken text-text-muted', icon: 'help' };

    return (
        <span
            className={cn(
                '@container w-full max-w-max inline-flex items-center gap-2 px-3 py-1 rounded-badge text-xs font-semibold',
                style.badge,
                className
            )}
        >
            <span className="material-symbols-outlined text-sm" aria-hidden="true">
                {style.icon}
            </span>
            <span className="text-xs font-semibold">{display.text}</span>
        </span>
    );
}
