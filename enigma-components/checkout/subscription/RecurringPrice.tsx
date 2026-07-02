import { cn } from '@/lib/utils/cn';
import { formatPrice } from '@/lib/utils/formatters';

interface RecurringPriceProps {
    amount: number;
    intervalLabel?: string;
    currency?: string;
    className?: string;
}

export default function RecurringPrice({
    amount,
    intervalLabel,
    currency = 'USD',
    className,
}: RecurringPriceProps) {
    const intervalSuffix = intervalLabel ? `/${intervalLabel}` : '';

    return (
        <div className={cn('@container w-full flex items-center justify-between', className)}>
            <span className="text-sm text-text-muted">Recurring</span>
            <span className="text-sm font-semibold text-text-base">
                {formatPrice(amount, currency)}{intervalSuffix}
            </span>
        </div>
    );
}
