import { cn } from '@/lib/utils/cn';
import { formatPrice } from '@/lib/utils/formatters';

interface OriginalPriceDisplayProps {
    amount: number;
    currency?: string;
    className?: string;
}

export default function OriginalPriceDisplay({
    amount,
    currency = 'USD',
    className,
}: OriginalPriceDisplayProps) {
    const price = formatPrice(amount, currency);

    return (
        <span className={cn('@container w-full text-text-muted line-through', className)}>
            {price}
        </span>
    );
}
