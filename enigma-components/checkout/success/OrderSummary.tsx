import type { Order } from '@/lib/api/types';
import { cn } from '@/lib/utils/cn';
import { formatPrice } from '@/lib/utils/formatters';

/**
 * OrderSummary Component
 * 
 * Displays the financial breakdown of the order.
 * 
 * Design Principles:
 * - @container for internal responsiveness
 * - Theme colors for borders, backgrounds, and text
 * - Hardcoded labels per Section 2.4
 */
interface OrderSummaryProps {
    order: Order;
    className?: string;
}

export function OrderSummary({ order, className }: OrderSummaryProps) {
    return (
        <div className={cn("@container", className)}>
            <div className="rounded-card border border-border bg-bg-surface p-4 shadow-card @md:p-6">
                <div className="space-y-3 @md:space-y-4">
                    <div className="flex justify-between text-sm text-text-muted">
                        <span>Subtotal</span>
                        <span>{formatPrice(order.subtotal)}</span>
                    </div>

                    <div className="flex justify-between text-sm text-text-muted">
                        <span>Tax</span>
                        <span>{formatPrice(order.tax)}</span>
                    </div>

                    <div className="flex justify-between text-sm text-text-muted">
                        <span>Shipping</span>
                        <span className={order.shipping === 0 ? 'font-medium text-primary' : ''}>
                            {order.shipping === 0 ? 'Free' : formatPrice(order.shipping)}
                        </span>
                    </div>

                    <div className="flex items-end justify-between border-t border-divider pt-3 @md:pt-4">
                        <span className="text-base font-bold text-text-base @md:text-lg">Total</span>
                        <span className="text-xl font-bold text-primary @md:text-2xl">
                            {formatPrice(order.total)}
                        </span>
                    </div>
                </div>
            </div>
        </div>
    );
}
