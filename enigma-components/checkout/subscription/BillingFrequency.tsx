import { cn } from '@/lib/utils/cn';

interface BillingFrequencyProps {
    intervalLabel: string;
    className?: string;
}

export default function BillingFrequency({ intervalLabel, className }: BillingFrequencyProps) {
    return (
        <div className={cn('@container w-full flex items-center justify-between', className)}>
            <span className="text-sm text-text-muted">Billing frequency</span>
            <span className="text-sm font-semibold text-text-base">{intervalLabel}</span>
        </div>
    );
}
