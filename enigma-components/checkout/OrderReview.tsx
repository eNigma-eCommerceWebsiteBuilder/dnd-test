'use client';

import { cn } from '@/lib/utils/cn';

import type { CartItem } from '@/lib/api';
import type { AddressFormData } from './AddressForm';

interface OrderReviewProps {
    items: CartItem[];
    shippingAddress: AddressFormData;
    shippingMethodName: string;
    paymentMethodName: string;
    total: number;
    email: string;
    onEditStep: (stepId: string) => void;
    className?: string; // Additional CSS classes
}

/**
 * OrderReview Component (Client)
 * 
 * Summary of order details before final submission.
 * Shows: Ship to, Method, Payment, Items.
 * allows editing prior steps.
 * 
 * Component Design Rules (from PAGE_AND_COMPONENTS_PLAN.md):
 * - Section 2.3: Every structural component must have `@container` on root
 * - Section 2.4: Hardcode functional UI text ("Ship to", "Method", "Edit")
 * - Section 2.1: Use theme variables
 */
export function OrderReview({
    // items, // Prop available for future use if item list is needed inline
    shippingAddress,
    shippingMethodName,
    paymentMethodName,
    // total, // Prop available for future use
    email,
    onEditStep,
    className
}: OrderReviewProps) {
    return (
        <div className={cn("@container w-full space-y-4", className)}>
            {/* Contact & Shipping Info Card */}
            <div className="bg-bg-surface border border-border rounded-card divide-y divide-divider">
                {/* Contact */}
                <div className="p-4 flex justify-between items-start gap-4">
                    <div className="space-y-1">
                        <p className="text-xs text-text-muted uppercase tracking-wider font-semibold">Contact</p>
                        <p className="text-sm text-text-base font-medium">{email}</p>
                    </div>
                    <button
                        onClick={() => onEditStep('cart')}
                        className="text-sm text-primary hover:text-primary-dark font-medium underline-offset-2 hover:underline"
                    >
                        Change
                    </button>
                </div>

                {/* Ship To */}
                <div className="p-4 flex justify-between items-start gap-4">
                    <div className="space-y-1">
                        <p className="text-xs text-text-muted uppercase tracking-wider font-semibold">Ship To</p>
                        <p className="text-sm text-text-base">
                            {shippingAddress.fullName}<br />
                            {shippingAddress.addressLine1}
                            {shippingAddress.addressLine2 && <>, {shippingAddress.addressLine2}</>}
                            <br />
                            {shippingAddress.city}, {shippingAddress.state} {shippingAddress.postalCode}
                            <br />
                            {shippingAddress.country}
                        </p>
                    </div>
                    <button
                        onClick={() => onEditStep('shipping')}
                        className="text-sm text-primary hover:text-primary-dark font-medium underline-offset-2 hover:underline"
                    >
                        Change
                    </button>
                </div>

                {/* Method */}
                <div className="p-4 flex justify-between items-start gap-4">
                    <div className="space-y-1">
                        <p className="text-xs text-text-muted uppercase tracking-wider font-semibold">Method</p>
                        <p className="text-sm text-text-base font-medium">{shippingMethodName}</p>
                    </div>
                    <button
                        onClick={() => onEditStep('shipping')} // Navigation to shipping step includes method selection
                        className="text-sm text-primary hover:text-primary-dark font-medium underline-offset-2 hover:underline"
                    >
                        Change
                    </button>
                </div>

                {/* Payment */}
                <div className="p-4 flex justify-between items-start gap-4">
                    <div className="space-y-1">
                        <p className="text-xs text-text-muted uppercase tracking-wider font-semibold">Payment</p>
                        <p className="text-sm text-text-base font-medium">{paymentMethodName}</p>
                    </div>
                    <button
                        onClick={() => onEditStep('payment')}
                        className="text-sm text-primary hover:text-primary-dark font-medium underline-offset-2 hover:underline"
                    >
                        Change
                    </button>
                </div>
            </div>
        </div>
    );
}

export default OrderReview;
