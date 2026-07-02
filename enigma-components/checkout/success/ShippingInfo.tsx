import type { Order } from '@/lib/api/types';
import { cn } from '@/lib/utils/cn';

/**
 * ShippingInfo Component
 * 
 * Displays shipping address and methodology.
 * 
 * Design Principles:
 * - @container for adaptation
 * - Hardcoded headers
 * - Theme styling
 */
interface ShippingInfoProps {
    order: Order;
    className?: string;
}

export function ShippingInfo({ order, className }: ShippingInfoProps) {
    return (
        <div className={cn("@container", className)}>
            <div className="rounded-card border border-border bg-bg-surface p-4 shadow-card @md:p-6">
                <div className="mb-4 flex items-center gap-3">
                    <span className="material-symbols-outlined text-primary">local_shipping</span>
                    <h3 className="font-bold text-text-base">Shipping & Delivery</h3>
                </div>

                <div className="space-y-2 text-sm">
                    <p className="font-medium text-text-base">Standard Shipping</p>
                    <div className="text-text-muted">
                        <p>{order.customerName}</p>
                        <p>{order.shippingAddress.street}</p>
                        <p>
                            {order.shippingAddress.city}, {order.shippingAddress.state} {order.shippingAddress.zipCode}
                        </p>
                        <p>{order.shippingAddress.country}</p>
                    </div>
                </div>
            </div>
        </div>
    );
}
