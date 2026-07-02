import { cn } from '@/lib/utils/cn';

interface CancellationPolicyProps {
    policyText: string;
    className?: string;
}

export default function CancellationPolicy({ policyText, className }: CancellationPolicyProps) {
    return (
        <div className={cn('@container w-full space-y-1 text-sm text-text-muted', className)}>
            <p className="font-semibold text-text-base">Cancellation policy</p>
            <p>{policyText}</p>
        </div>
    );
}
