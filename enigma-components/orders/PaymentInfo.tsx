import { Order } from '@/lib/api/types';
import { cn } from '@/lib/utils/cn';
import { PAYMENT_METHODS } from '@/lib/utils/constants';

/**
 * PaymentInfo Component (Server)
 * 
 * Displays payment method and status.
 */
interface PaymentInfoProps {
    order: Order;
    className?: string;
}

export function PaymentInfo({ order, className }: PaymentInfoProps) {
    const paymentMethodLabel = PAYMENT_METHODS.find(
        m => m.value === order.paymentMethod
    )?.label || order.paymentMethod || 'Unknown Payment Method';

    const isPaid = order.paymentStatus === 'paid';
    const isRefunded = order.paymentStatus === 'refunded';
    const isPartiallyRefunded = order.paymentStatus === 'partially_refunded';

    return (
        <div className={cn("@container bg-bg-surface rounded-card p-4 @md:p-6 shadow-card border border-border", className)}>
            <div className="flex items-center gap-3 mb-4">
                <span className="material-symbols-outlined text-primary">payments</span>
                <h3 className="font-bold text-text-base">Payment Information</h3>
            </div>

            <div className="space-y-3">
                <div className="flex justify-between items-center">
                    <span className="text-sm @md:text-base text-text-muted">Method</span>
                    <span className="text-sm @md:text-base font-medium text-text-base">
                        {paymentMethodLabel}
                    </span>
                </div>

                <div className="flex justify-between items-center">
                    <span className="text-sm @md:text-base text-text-muted">Status</span>
                    <span
                        className={cn(
                            "text-sm @md:text-base px-2 py-0.5 rounded-full font-medium",
                            isPaid && "bg-success-subtle text-success-dark",
                            isRefunded && "bg-warning-subtle text-warning-dark",
                            isPartiallyRefunded && "bg-warning-subtle text-warning-dark",
                            order.paymentStatus === 'unpaid' && "bg-danger-subtle text-danger-dark"
                        )}
                    >
                        {order.paymentStatus ? (
                            order.paymentStatus.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())
                        ) : 'Pending'}
                    </span>
                </div>
            </div>
        </div>
    );
}
