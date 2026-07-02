import { cn } from '@/lib/utils/cn';
import { formatPrice } from '@/lib/utils/formatters';

interface FirstChargeNoticeProps {
    amount?: number;
    currency?: string;
    className?: string;
}

export default function FirstChargeNotice({
    amount,
    currency = 'USD',
    className,
}: FirstChargeNoticeProps) {
    return (
        <p className={cn('@container w-full text-sm text-text-muted', className)}>
            You will be charged today{typeof amount === 'number' ? ` ${formatPrice(amount, currency)}` : ''}.
        </p>
    );
}
