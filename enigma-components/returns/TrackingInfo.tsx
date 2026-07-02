'use client';

import { useState, useTransition } from 'react';
import { cn } from '@/lib/utils/cn';
import { useToast } from '@/lib/hooks';
import { trackReturnShipmentAction } from '@/lib/actions/returns-actions';

interface TrackingInfoProps {
    returnId: string;
    className?: string;
}

interface TrackingData {
    trackingNumber: string | null;
    carrier: string | null;
    status?: string | null;
}

export function TrackingInfo({ returnId, className }: TrackingInfoProps) {
    const [tracking, setTracking] = useState<TrackingData | null>(null);
    const [isPending, startTransition] = useTransition();
    const { error } = useToast();

    const handleTracking = () => {
        startTransition(async () => {
            try {
                const result = await trackReturnShipmentAction({ success: false }, { returnId });

                if (result.success && result.data) {
                    setTracking(result.data as TrackingData);
                } else {
                    error(result.error || 'Failed to load tracking info', { title: 'Tracking Error' });
                }
            } catch {
                error('An unexpected error occurred', { title: 'Tracking Error' });
            }
        });
    };

    return (
        <section className={cn('@container w-full rounded-card border border-border bg-surface p-4 shadow-card flex flex-col gap-4', className)}>
            <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-text-muted">local_shipping</span>
                <h3 className="text-sm font-semibold text-text-base">Shipment Tracking</h3>
            </div>

            <div className="flex flex-col gap-2 text-sm">
                <div className="flex items-center justify-between">
                    <span className="text-text-muted">Carrier</span>
                    <span className="text-text-base font-medium">{tracking?.carrier || 'Not available'}</span>
                </div>
                <div className="flex items-center justify-between">
                    <span className="text-text-muted">Tracking Number</span>
                    <span className="text-text-base font-medium">{tracking?.trackingNumber || 'Not available'}</span>
                </div>
                {tracking?.status ? (
                    <div className="flex items-center justify-between">
                        <span className="text-text-muted">Status</span>
                        <span className="text-text-base font-medium">{tracking.status}</span>
                    </div>
                ) : null}
            </div>

            <button
                type="button"
                onClick={handleTracking}
                disabled={isPending}
                className="w-full inline-flex items-center justify-center gap-2 rounded-button px-4 py-2 text-sm font-semibold bg-sunken text-text-base hover:bg-hover transition-colors disabled:opacity-50"
            >
                <span className="material-symbols-outlined text-lg">near_me</span>
                {isPending ? 'Checking...' : 'Track Shipment'}
            </button>
        </section>
    );
}
