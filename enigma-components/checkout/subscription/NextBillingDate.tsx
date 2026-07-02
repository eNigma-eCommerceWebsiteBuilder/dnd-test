import { cn } from '@/lib/utils/cn';
import { formatDate } from '@/lib/utils/formatters';

interface NextBillingDateProps {
    date: string | Date;
    className?: string;
}

export default function NextBillingDate({ date, className }: NextBillingDateProps) {
    return (
        <div className={cn('@container w-full flex items-center justify-between', className)}>
            <span className="text-sm text-text-muted">Next billing</span>
            <span className="text-sm font-semibold text-text-base">
                {formatDate(date, { dateStyle: 'medium' })}
            </span>
        </div>
    );
}
