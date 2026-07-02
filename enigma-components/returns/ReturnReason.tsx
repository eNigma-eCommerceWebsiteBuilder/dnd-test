import type { ReturnReason as ReturnReasonType } from '@/lib/api/types/returns';
import { validateReturnReason } from '@/lib/utils/returns';

interface ReturnReasonProps {
    reason: ReturnReasonType;
    details?: string;
    category?: string;
}

function formatReasonLabel(reason: string): string {
    return reason
        .replace(/_/g, ' ')
        .replace(/^\w/, (char) => char.toUpperCase());
}

export function ReturnReason({ reason, details, category }: ReturnReasonProps) {
    const isValid = validateReturnReason(reason, category);
    const displayReason = isValid ? formatReasonLabel(reason) : 'Unknown reason';

    return (
        <section className="@container w-full rounded-card border border-border bg-surface p-4 shadow-card flex flex-col gap-2">
            <h3 className="text-sm font-semibold text-text-base">Return Reason</h3>
            <p className="text-sm text-text-muted">{displayReason}</p>
            {details ? <p className="text-xs text-text-muted">{details}</p> : null}
        </section>
    );
}
