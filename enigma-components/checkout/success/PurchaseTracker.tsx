'use client';

import { useEffect, useRef } from 'react';
import { AnalyticsEventType } from '@/lib/api/types/analytics';
import { useAnalytics } from '@/lib/analytics';
import type { Order } from '@/lib/api/types/orders';

interface PurchaseTrackerProps {
    order: Order;
}

/**
 * Tracks documented purchase events on the client once the success page mounts.
 */
export function PurchaseTracker({ order }: PurchaseTrackerProps) {
    const { trackEvent } = useAnalytics();
    const trackedRef = useRef(false);

    useEffect(() => {
        if (trackedRef.current) return;

        void trackEvent(AnalyticsEventType.PURCHASE, {
            orderId: order._id,
            orderNumber: order.orderNumber,
            orderTotal: order.total,
            itemCount: order.items.length,
            items: order.items.map((item) => ({
                orderItemId: item._id,
                productId: item.productId,
                productName: item.product.name,
                price: item.price,
                quantity: item.quantity,
                variantId: item.variantId,
            })),
        });

        trackedRef.current = true;
    }, [order, trackEvent]);

    return null;
}
