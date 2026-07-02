'use client';

import { useTransition } from 'react';
import { uploadReturnLabelAction } from '@/lib/actions/returns-actions';
import { useToast } from '@/lib/hooks';
import { cn } from '@/lib/utils/cn';

interface ReturnLabelDownloadProps {
    returnId: string;
    className?: string;
}

export function ReturnLabelDownload({ returnId, className }: ReturnLabelDownloadProps) {
    const [isPending, startTransition] = useTransition();
    const { success, error } = useToast();

    const getLabelUrl = (data: unknown): string | null => {
        if (!data || typeof data !== 'object') return null;
        const maybeUrl = (data as Record<string, unknown>).labelUrl;
        return typeof maybeUrl === 'string' ? maybeUrl : null;
    };

    const handleDownload = () => {
        startTransition(async () => {
            try {
                const result = await uploadReturnLabelAction({ success: false }, { returnId });

                const labelUrl = getLabelUrl(result.data);

                if (result.success && labelUrl) {
                    window.open(labelUrl, '_blank', 'noopener,noreferrer');
                    success('Return label is ready to download.', { title: 'Label Ready' });
                } else {
                    error(result.error || 'Unable to generate label', { title: 'Label Error' });
                }
            } catch {
                error('An unexpected error occurred', { title: 'Label Error' });
            }
        });
    };

    return (
        <button
            type="button"
            onClick={handleDownload}
            disabled={isPending}
            className={cn(
                '@container w-full inline-flex items-center justify-center gap-2 rounded-button px-4 py-2 text-sm font-semibold bg-cta-primary text-on-primary shadow-button hover:bg-cta-primary-hover hover:shadow-button-hover transition-all disabled:opacity-50',
                className
            )}
        >
            <span className="material-symbols-outlined text-lg">download</span>
            {isPending ? 'Preparing label...' : 'Download Return Label'}
        </button>
    );
}
