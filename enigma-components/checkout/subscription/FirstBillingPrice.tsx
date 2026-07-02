import { cn } from '@/lib/utils/cn';
import { formatPrice } from '@/lib/utils/formatters';

interface FirstBillingPriceProps {
    amount: number;
    currency?: string;
    className?: string;
}

export default function FirstBillingPrice({
    amount,
    currency = 'USD',
    className,
}: FirstBillingPriceProps) {
    return (
        <div className={cn('@container w-full flex items-center justify-between', className)}>
            <span className="text-sm text-text-muted">First billing</span>
            <span className="text-sm font-semibold text-text-base">
                {formatPrice(amount, currency)}
            </span>
        </div>
    );
}
