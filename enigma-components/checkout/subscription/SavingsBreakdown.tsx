import { cn } from '@/lib/utils/cn';
import { formatPercent, formatPrice } from '@/lib/utils/formatters';

interface SavingsBreakdownProps {
    perUnit: number;
    total: number;
    percent: number;
    annualSavings?: number;
    currency?: string;
    className?: string;
}

export default function SavingsBreakdown({
    perUnit,
    total,
    percent,
    annualSavings,
    currency = 'USD',
    className,
}: SavingsBreakdownProps) {
    return (
        <div className={cn('@container w-full space-y-2', className)}>
            <div className="flex items-center justify-between text-sm">
                <span className="text-text-muted">Savings per unit</span>
                <span className="font-semibold text-text-base">
                    {formatPrice(perUnit, currency)}
                </span>
            </div>
            <div className="flex items-center justify-between text-sm">
                <span className="text-text-muted">Total savings</span>
                <span className="font-semibold text-text-base">
                    {formatPrice(total, currency)} ({formatPercent(percent)})
                </span>
            </div>
            {typeof annualSavings === 'number' ? (
                <div className="flex items-center justify-between text-sm">
                    <span className="text-text-muted">Estimated annual savings</span>
                    <span className="font-semibold text-text-base">
                        {formatPrice(annualSavings, currency)}
                    </span>
                </div>
            ) : null}
        </div>
    );
}
