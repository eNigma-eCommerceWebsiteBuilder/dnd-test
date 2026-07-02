import { cn } from '@/lib/utils/cn';
import { formatPrice } from '@/lib/utils/formatters';

interface RefundAmountProps {
    amount: number;
    label?: string;
    className?: string;
}

export function RefundAmount({ amount, label = 'Refund amount', className }: RefundAmountProps) {
    return (
        <div className={cn('@container w-full flex items-center justify-between gap-3', className)}>
            <span className="text-sm text-text-muted">{label}</span>
            <span className="text-sm font-semibold text-text-base">{formatPrice(amount)}</span>
        </div>
    );
}
