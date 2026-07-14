import type { LicenseStatus } from '@/lib/api/types/digital-products';
import { formatLicenseStatus } from '@/lib/utils/digital-products';

interface LicenseStatusBadgeProps {
    status: LicenseStatus;
}

const STATUS_STYLES: Record<string, string> = {
    green: 'border-success bg-success-subtle text-success',
    yellow: 'border-warning bg-warning-subtle text-warning',
    red: 'border-danger bg-danger-subtle text-danger',
    gray: 'border-border bg-bg-elevated text-text-muted',
};

export function LicenseStatusBadge({ status }: LicenseStatusBadgeProps) {
    const statusDisplay = formatLicenseStatus(status);

    return (
        <span
            className={`@container inline-flex items-center rounded-badge border px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.2em] ${STATUS_STYLES[statusDisplay.color]}`}
        >
            {statusDisplay.label}
        </span>
    );
}
