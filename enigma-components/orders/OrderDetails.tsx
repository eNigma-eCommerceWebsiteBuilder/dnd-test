import { Order } from '@/lib/api/types';
import { cn } from '@/lib/utils/cn';
import { formatPrice } from '@/lib/utils/formatters';

/**
 * OrderDetails Component (Server)
 * 
 * Displays the financial breakdown of the order.
 * 
 * Per PAGE_AND_COMPONENTS_PLAN.md Section 2.4:
 * - Hardcoded labels (Subtotal, Shipping, etc.)
 */
interface OrderDetailsProps {
    order: Order;
    className?: string;
}

export function OrderDetails({ order, className }: OrderDetailsProps) {
    return (
        <div className={cn("@container bg-bg-surface rounded-card p-4 @md:p-6 shadow-card border border-border", className)}>
            <div className="space-y-3 @md:space-y-4">
                {/* Subtotal */}
                <div className="flex justify-between text-sm @md:text-base text-text-muted">
                    <span>Subtotal</span>
                    <span className="text-text-base">{formatPrice(order.subtotal)}</span>
                </div>

                {/* Tax */}
                <div className="flex justify-between text-sm @md:text-base text-text-muted">
                    <span>Tax</span>
                    <span className="text-text-base">{formatPrice(order.tax)}</span>
                </div>

                {/* Shipping */}
                <div className="flex justify-between text-sm @md:text-base text-text-muted">
                    <span>Shipping</span>
                    <span className={cn("text-text-base", order.shipping === 0 && "text-success font-medium")}>
                        {order.shipping === 0 ? 'Free' : formatPrice(order.shipping)}
                    </span>
                </div>

                {/* Total */}
                <div className="pt-3 @md:pt-4 border-t border-divider flex justify-between items-end">
                    <span className="text-base @md:text-lg font-bold text-text-base">Total</span>
                    <span className="text-xl @md:text-2xl font-bold text-primary">
                        {formatPrice(order.total)}
                    </span>
                </div>
            </div>
        </div>
    );
}
