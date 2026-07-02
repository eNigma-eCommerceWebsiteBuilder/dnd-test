import { cn } from '@/lib/utils/cn';
import { ORDER_STATUS_LABELS, type OrderStatus } from '@/lib/utils/constants';

/**
 * OrderStatusBadge Component (Server)
 * 
 * Displays a colored badge for order status.
 * 
 * Per PAGE_AND_COMPONENTS_PLAN.md Section 2.3:
 * - Uses @container on root element
 * - Uses container queries for responsive logic
 * 
 * Per Section 2.1:
 * - Uses theme variables from tailwind.config.ts
 * 
 * Per Section 2.4:
 * - Status labels from constants (functional data)
 */
interface OrderStatusBadgeProps {
    status: OrderStatus | string;
    className?: string;
}

export function OrderStatusBadge({ status, className }: OrderStatusBadgeProps) {
    const validStatus = status as OrderStatus;
    const label = ORDER_STATUS_LABELS[validStatus] || status;

    // Map status to theme-consistent colors
    const getStatusStyles = (status: string): string => {
        switch (status) {
            case 'pending':
                return 'bg-warning-subtle text-warning-dark';
            case 'processing':
                return 'bg-info-subtle text-info-dark';
            case 'shipped':
                return 'bg-primary-100 text-primary-dark';
            case 'delivered':
                return 'bg-success-subtle text-success-dark';
            case 'cancelled':
                return 'bg-danger-subtle text-danger-dark';
            default:
                return 'bg-bg-sunken text-text-muted';
        }
    };

    // Map status to icon
    const getStatusIcon = (status: string): string => {
        switch (status) {
            case 'pending':
                return 'schedule';
            case 'processing':
                return 'sync';
            case 'shipped':
                return 'local_shipping';
            case 'delivered':
                return 'check_circle';
            case 'cancelled':
                return 'cancel';
            default:
                return 'help';
        }
    };

    return (
        <span
            className={cn(
                '@container inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold',
                getStatusStyles(validStatus),
                className
            )}
        >
            <span className="material-symbols-outlined text-sm" style={{ fontSize: '14px' }}>
                {getStatusIcon(validStatus)}
            </span>
            {label}
        </span>
    );
}
