'use client';

import { formatDate } from '@/lib/utils/formatters';
import { formatReturnStatus } from '@/lib/utils/returns';
import type { ReturnStatus } from '@/lib/api/types/returns';

interface ReturnStatusTimelineProps {
    status: ReturnStatus;
    requestedAt: string;
    approvedAt?: string;
    completedAt?: string;
    cancelledAt?: string;
    rejectedAt?: string;
}

interface TimelineStep {
    key: ReturnStatus;
    label: string;
    timestamp?: string;
}

function getStatusIndex(status: ReturnStatus, steps: TimelineStep[]): number {
    const index = steps.findIndex((step) => step.key === status);
    return index >= 0 ? index : 0;
}

export function ReturnStatusTimeline({
    status,
    requestedAt,
    approvedAt,
    completedAt,
    cancelledAt,
    rejectedAt,
}: ReturnStatusTimelineProps) {
    const baseSteps: TimelineStep[] = [
        { key: 'pending', label: 'Return Requested', timestamp: requestedAt },
        { key: 'approved', label: 'Approved', timestamp: approvedAt },
        { key: 'processing', label: 'Processing' },
        { key: 'completed', label: 'Completed', timestamp: completedAt },
    ];

    const finalStatus = status === 'cancelled' || status === 'rejected' ? status : null;

    const steps = finalStatus
        ? [...baseSteps, {
            key: finalStatus,
            label: formatReturnStatus(finalStatus).text,
            timestamp: finalStatus === 'cancelled' ? cancelledAt : rejectedAt,
        }]
        : baseSteps;

    const activeIndex = getStatusIndex(status, steps);
    const progressPercent = steps.length > 1
        ? (activeIndex / (steps.length - 1)) * 100
        : 0;

    return (
        <section className="@container w-full rounded-card border border-border bg-surface p-6 shadow-card">
            <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-heading font-semibold text-text-base">Return Progress</h2>
                <span className="text-sm text-text-muted">Status: {formatReturnStatus(status).text}</span>
            </div>
            <div className="relative flex flex-col @md:flex-row @md:justify-between gap-6">
                <div className="hidden @md:block absolute top-4 left-0 right-0 h-0.5 bg-divider" />
                <div
                    className="hidden @md:block absolute top-4 left-0 h-0.5 bg-primary"
                    style={{ width: `${progressPercent}%` }}
                />
                {steps.map((step, index) => {
                    const isComplete = index < activeIndex;
                    const isCurrent = index === activeIndex;

                    return (
                        <div key={step.key} className="relative z-10 flex flex-col items-start @md:items-center gap-2">
                            <div
                                className={`w-8 h-8 rounded-full flex items-center justify-center border ${
                                    isComplete || isCurrent
                                        ? 'bg-primary text-on-primary border-primary'
                                        : 'bg-sunken text-text-muted border-border'
                                }`}
                            >
                                <span className="material-symbols-outlined text-sm">
                                    {isComplete ? 'check' : isCurrent ? 'hourglass_top' : 'radio_button_unchecked'}
                                </span>
                            </div>
                            <div className="text-sm text-text-base font-medium text-left @md:text-center">
                                {step.label}
                            </div>
                            {step.timestamp ? (
                                <div className="text-xs text-text-muted">
                                    {formatDate(step.timestamp, { dateStyle: 'medium' })}
                                </div>
                            ) : null}
                        </div>
                    );
                })}
            </div>
        </section>
    );
}
