'use client';

import { cn } from '@/lib/utils/cn';
import type { ReturnStatus } from '@/lib/api/types/returns';
import { CancelReturnButton } from '@/components/returns/CancelReturnButton';

interface ReturnActionsPanelProps {
    returnId: string;
    status: ReturnStatus;
    className?: string;
}

export function ReturnActionsPanel({ returnId, status, className }: ReturnActionsPanelProps) {
    return (
        <section className={cn('@container w-full flex justify-between items-center gap-4 border-t border-divider pt-6', className)}>
            <CancelReturnButton returnId={returnId} status={status} confirm />
        </section>
    );
}
