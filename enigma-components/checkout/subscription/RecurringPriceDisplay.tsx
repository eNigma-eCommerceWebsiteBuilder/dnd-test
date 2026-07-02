import { cn } from '@/lib/utils/cn';
import { formatPrice } from '@/lib/utils/formatters';

interface RecurringPriceDisplayProps {
    amount: number;
    intervalLabel?: string;
    currency?: string;
    className?: string;
}

export default function RecurringPriceDisplay({
    amount,
    intervalLabel,
    currency = 'USD',
    className,
}: RecurringPriceDisplayProps) {
    const price = formatPrice(amount, currency);
    const intervalSuffix = intervalLabel ? `/${intervalLabel}` : '';

    return (
        <span className={cn('@container w-full text-primary font-semibold', className)}>
            {price}{intervalSuffix}
        </span>
    );
}
