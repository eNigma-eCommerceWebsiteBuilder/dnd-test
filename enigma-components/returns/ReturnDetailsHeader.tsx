import { cn } from '@/lib/utils/cn';
import { formatDate } from '@/lib/utils/formatters';
import type { ReturnRequest } from '@/lib/api/types/returns';
import { ReturnStatusBadge } from '@/enigma-components/returns/ReturnStatusBadge';

interface ReturnDetailsHeaderProps {
    returnRequest: ReturnRequest;
    className?: string;
}

export function ReturnDetailsHeader({ returnRequest, className }: ReturnDetailsHeaderProps) {
    const requestedDate = formatDate(returnRequest.requestedAt, { dateStyle: 'long' });

    return (
        <section className={cn("@container flex w-full flex-col gap-2", className)}>
            <div className="flex flex-wrap items-center gap-3">
                <h1 className="text-2xl font-heading font-bold text-text-base @md:text-3xl">
                    Return #{returnRequest.requestNumber}
                </h1>
                <ReturnStatusBadge status={returnRequest.status} />
            </div>
            <p className="text-sm text-text-muted">Requested {requestedDate}</p>
        </section>
    );
}
