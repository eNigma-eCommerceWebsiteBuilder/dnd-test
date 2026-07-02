'use client';

import { useState } from 'react';
import { cn } from '@/lib/utils/cn';

interface ShippingAddressValues {
    addressLine1: string;
    addressLine2: string;
    city: string;
    state: string;
    postalCode: string;
    country: string;
}

interface ShippingAddressFormProps {
    defaultValues?: Partial<ShippingAddressValues>;
    onChange?: (values: ShippingAddressValues) => void;
    onSubmit?: (values: ShippingAddressValues) => void;
    className?: string;
}

export default function ShippingAddressForm({
    defaultValues,
    onChange,
    onSubmit,
    className,
}: ShippingAddressFormProps) {
    const [values, setValues] = useState<ShippingAddressValues>({
        addressLine1: defaultValues?.addressLine1 || '',
        addressLine2: defaultValues?.addressLine2 || '',
        city: defaultValues?.city || '',
        state: defaultValues?.state || '',
        postalCode: defaultValues?.postalCode || '',
        country: defaultValues?.country || '',
    });

    const handleChange = (field: keyof ShippingAddressValues) =>
        (event: React.ChangeEvent<HTMLInputElement>) => {
            const nextValues = { ...values, [field]: event.target.value };
            setValues(nextValues);
            if (onChange) {
                onChange(nextValues);
            }
        };

    const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        if (onSubmit) {
            onSubmit(values);
        }
    };

    return (
        <form className={cn('@container w-full space-y-4', className)} onSubmit={handleSubmit}>
            <div className="space-y-2">
                <label className="text-sm font-semibold text-text-base">Address</label>
                <input
                    type="text"
                    value={values.addressLine1}
                    onChange={handleChange('addressLine1')}
                    className="w-full rounded-input border border-input-border bg-input-bg px-4 py-3.5 text-text-base outline-none transition-all focus:border-primary focus:ring-2 focus:ring-primary/20"
                    placeholder="123 Main Street"
                />
            </div>
            <div className="space-y-2">
                <label className="text-sm font-semibold text-text-base">Apartment, suite, etc.</label>
                <input
                    type="text"
                    value={values.addressLine2}
                    onChange={handleChange('addressLine2')}
                    className="w-full rounded-input border border-input-border bg-input-bg px-4 py-3.5 text-text-base outline-none transition-all focus:border-primary focus:ring-2 focus:ring-primary/20"
                    placeholder="Unit 4B"
                />
            </div>
            <div className="grid grid-cols-1 @sm:grid-cols-3 gap-4">
                <div className="space-y-2">
                    <label className="text-sm font-semibold text-text-base">City</label>
                    <input
                        type="text"
                        value={values.city}
                        onChange={handleChange('city')}
                        className="w-full rounded-input border border-input-border bg-input-bg px-4 py-3.5 text-text-base outline-none transition-all focus:border-primary focus:ring-2 focus:ring-primary/20"
                        placeholder="San Francisco"
                    />
                </div>
                <div className="space-y-2">
                    <label className="text-sm font-semibold text-text-base">State</label>
                    <input
                        type="text"
                        value={values.state}
                        onChange={handleChange('state')}
                        className="w-full rounded-input border border-input-border bg-input-bg px-4 py-3.5 text-text-base outline-none transition-all focus:border-primary focus:ring-2 focus:ring-primary/20"
                        placeholder="CA"
                    />
                </div>
                <div className="space-y-2">
                    <label className="text-sm font-semibold text-text-base">ZIP code</label>
                    <input
                        type="text"
                        value={values.postalCode}
                        onChange={handleChange('postalCode')}
                        className="w-full rounded-input border border-input-border bg-input-bg px-4 py-3.5 text-text-base outline-none transition-all focus:border-primary focus:ring-2 focus:ring-primary/20"
                        placeholder="94103"
                    />
                </div>
            </div>
            <div className="space-y-2">
                <label className="text-sm font-semibold text-text-base">Country</label>
                <input
                    type="text"
                    value={values.country}
                    onChange={handleChange('country')}
                    className="w-full rounded-input border border-input-border bg-input-bg px-4 py-3.5 text-text-base outline-none transition-all focus:border-primary focus:ring-2 focus:ring-primary/20"
                    placeholder="United States"
                />
            </div>
        </form>
    );
}
