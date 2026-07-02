import { cn } from '@/lib/utils/cn';

interface RenewalNoticeProps {
    intervalLabel: string;
    className?: string;
}

export default function RenewalNotice({ intervalLabel, className }: RenewalNoticeProps) {
    return (
        <p className={cn('@container w-full text-sm text-text-muted', className)}>
            Renews automatically {intervalLabel}.
        </p>
    );
}
