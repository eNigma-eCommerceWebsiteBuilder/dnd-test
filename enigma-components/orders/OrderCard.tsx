import Link from 'next/link';
import Image from 'next/image';
import { cn } from '@/lib/utils/cn';
import { formatOrderNumber, formatDate, formatPrice } from '@/lib/utils/formatters';
import { OrderStatusBadge } from './OrderStatusBadge';
import type { Order } from '@/lib/api/types';

/**
 * OrderCard Component (Server)
 * 
 * Displays a summary card for an order in the orders list.
 * 
 * Per PAGE_AND_COMPONENTS_PLAN.md Section 2.3:
 * - Uses @container on root element
 * - Uses container queries (@md:, @lg:) for responsive internal layout
 * 
 * Per Section 2.2:
 * - Fluid: uses w-full, no fixed widths
 * - Shape agnostic with object-cover for images
 * 
 * Per Section 2.4:
 * - Button labels hardcoded (functional UI)
 * - Order data from props
 */
interface OrderCardProps {
    order: Order;
    className?: string;
}

export function OrderCard({ order, className }: OrderCardProps) {
    // Get first item image for preview
    const firstItem = order.items[0];
    const previewImage = firstItem?.product?.images?.[0] || '/product-placeholder.jpg';
    const itemCount = order.items.length;

    // Format date for display
    const orderDate = formatDate(order.createdAt, { dateStyle: 'medium' });

    // Get delivery/status date
    const getStatusDate = () => {
        if (order.status === 'delivered' && order.deliveredAt) {
            return `Arrived ${formatDate(order.deliveredAt, { dateStyle: 'medium' })}`;
        }
        if (order.status === 'shipped' && order.shippedAt) {
            return `Shipped ${formatDate(order.shippedAt, { dateStyle: 'medium' })}`;
        }
        return null;
    };

    const statusDate = getStatusDate();

    return (
        <article
            className={cn(
                '@container group flex flex-col @md:flex-row items-stretch justify-between gap-4 @md:gap-6 rounded-card bg-bg-surface p-4 @md:p-6 shadow-card border border-border hover:shadow-card-hover transition-shadow w-full',
                className
            )}
        >
            {/* Content Section */}
            <div className="flex flex-1 flex-col justify-between gap-4">
                <div className="flex flex-col gap-2">
                    {/* Status Row */}
                    <div className="flex items-center gap-2 flex-wrap">
                        <OrderStatusBadge status={order.status} />
                        {statusDate && (
                            <>
                                <span className="text-text-muted text-xs">•</span>
                                <p className="text-text-muted text-xs">{statusDate}</p>
                            </>
                        )}
                    </div>

                    {/* Order Info */}
                    <div className="flex flex-col gap-0.5">
                        <h3 className="text-text-base text-base @md:text-lg font-bold leading-tight">
                            {formatOrderNumber(order.orderNumber)}
                        </h3>
                        <p className="text-text-muted text-sm">
                            Placed on {orderDate} • {itemCount} {itemCount === 1 ? 'item' : 'items'} •{' '}
                            <span className="font-semibold text-text-base">
                                {formatPrice(order.total)}
                            </span>
                        </p>
                    </div>
                </div>

                {/* Action Buttons */}
                <div className="flex flex-wrap gap-3 mt-2">
                    <Link
                        href={`/account/orders/${order._id}`}
                        className="inline-flex min-w-[120px] cursor-pointer items-center justify-center rounded-button h-10 px-4 bg-primary text-on-primary gap-2 text-sm font-bold hover:bg-primary-dark transition-colors shadow-button"
                    >
                        <span className="truncate">View Details</span>
                        <span className="material-symbols-outlined text-lg">arrow_forward</span>
                    </Link>
                </div>
            </div>

            {/* Image Section */}
            <div className="relative w-full @md:w-48 @lg:w-64 aspect-[4/3] bg-bg-sunken rounded-image overflow-hidden flex-shrink-0">
                <Image
                    src={previewImage}
                    alt={`Order ${order.orderNumber} items`}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-300"
                    sizes="(max-width: 768px) 100vw, 256px"
                />
                <div className="absolute inset-0 bg-bg-overlay/5 group-hover:bg-transparent transition-colors" />

                {/* Item count badge if multiple items */}
                {itemCount > 1 && (
                    <div className="absolute bottom-2 right-2 px-2 py-1 bg-bg-overlay/80 backdrop-blur-sm rounded-badge text-xs font-semibold text-text-inverse">
                        +{itemCount - 1} more
                    </div>
                )}
            </div>
        </article>
    );
}
