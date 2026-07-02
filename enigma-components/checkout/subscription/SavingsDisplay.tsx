import { cn } from '@/lib/utils/cn';
import { formatPrice } from '@/lib/utils/formatters';

interface SavingsDisplayProps {
    amount: number;
    intervalLabel?: string;
    currency?: string;
    className?: string;
}

export default function SavingsDisplay({
    amount,
    intervalLabel,
    currency = 'USD',
    className,
}: SavingsDisplayProps) {
    const price = formatPrice(amount, currency);
    const intervalSuffix = intervalLabel ? `/${intervalLabel}` : '';

    return (
        <div
            className={cn(
                '@container w-full flex items-center justify-between rounded-card border border-primary/10 bg-primary/5 px-3 py-2 text-sm text-primary',
                className
            )}
        >
            <span className="font-medium">Savings</span>
            <span className="font-semibold">{price}{intervalSuffix}</span>
        </div>
    );
}
