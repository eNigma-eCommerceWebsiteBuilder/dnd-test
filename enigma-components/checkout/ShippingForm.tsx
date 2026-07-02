'use client';

import { cn } from '@/lib/utils/cn';
import { AddressForm } from './AddressForm';
import type { AddressFormData } from './AddressForm';

interface ShippingFormProps {
    /** Initial shipping address values */
    initialData?: Partial<AddressFormData>;
    /** Callback when form is submitted with valid data */
    onSubmit: (data: AddressFormData) => void;
    /** Custom submit button label */
    submitLabel?: string;
    /** Whether form is in loading state */
    isLoading?: boolean;
    /** Additional CSS classes */
    className?: string;
}

/**
 * ShippingForm Component (Client)
 * 
 * Shipping address form wrapper that:
 * - Uses AddressForm component for input fields
 * - Provides shipping-specific context and labeling
 * 
 * Component Design Rules (from PAGE_AND_COMPONENTS_PLAN.md):
 * - Section 2.3: Every structural component must have `@container` on root
 * - Section 2.4: Hardcode functional UI text (section headers)
 * - Section 2.1: Use theme variables from tailwind.config.ts
 */
export function ShippingForm({
    initialData,
    onSubmit,
    submitLabel = "Continue to Payment",
    isLoading = false,
    className
}: ShippingFormProps) {
    return (
        <div className={cn("@container w-full", className)}>
            {/* Section Header - Hardcoded functional UI */}
            <div className="mb-4 @sm:mb-6">
                <h3 className="text-lg @sm:text-xl font-bold text-text-base">
                    Shipping Address
                </h3>
                <p className="text-sm text-text-muted mt-1">
                    Where should we deliver your order?
                </p>
            </div>

            {/* Address Form */}
            <AddressForm
                initialData={initialData}
                onSubmit={onSubmit}
                isLoading={isLoading}
                submitLabel={submitLabel}
            />
        </div>
    );
}

export default ShippingForm;
