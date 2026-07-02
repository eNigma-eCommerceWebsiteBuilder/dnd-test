import { cn } from '@/lib/utils';
import { isCardExpired } from '@/lib/utils/ecommerce';
import type { ExpiringWarningProps } from './types';

export function ExpiringWarning({ expMonth, expYear, className }: ExpiringWarningProps) {
    const now = new Date();
    const currentYear = now.getFullYear();
    const currentMonth = now.getMonth() + 1;

    const year = expYear < 2000 ? 2000 + expYear : expYear;
    const monthDiff = (year - currentYear) * 12 + (expMonth - currentMonth);
    const isExpiringSoon = monthDiff <= 3 && monthDiff >= 0;
    const isExpired = isCardExpired(expMonth, expYear);

    if (!isExpiringSoon && !isExpired) return null;

    return (
        <span
            className={cn(
                "@container px-2 py-0.5 rounded-badge text-[10px] font-bold uppercase tracking-widest",
                isExpired
                    ? "bg-danger-subtle text-danger"
                    : "bg-warning-subtle text-warning",
                className
            )}
        >
            {isExpired ? 'Expired' : 'Expiring Soon'}
        </span>
    );
}
