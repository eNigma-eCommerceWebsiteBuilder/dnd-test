'use client';

import { useState } from 'react';
import { cn } from '@/lib/utils/cn';

interface CustomerInfoFormValues {
    email: string;
    firstName: string;
    lastName: string;
}

interface CustomerInfoFormProps {
    defaultValues?: Partial<CustomerInfoFormValues>;
    onChange?: (values: CustomerInfoFormValues) => void;
    onSubmit?: (values: CustomerInfoFormValues) => void;
    className?: string;
}

export default function CustomerInfoForm({
    defaultValues,
    onChange,
    onSubmit,
    className,
}: CustomerInfoFormProps) {
    const [values, setValues] = useState<CustomerInfoFormValues>({
        email: defaultValues?.email || '',
        firstName: defaultValues?.firstName || '',
        lastName: defaultValues?.lastName || '',
    });

    const handleChange = (field: keyof CustomerInfoFormValues) =>
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
                <label className="text-sm font-semibold text-text-base">Email</label>
                <input
                    type="email"
                    value={values.email}
                    onChange={handleChange('email')}
                    className="w-full rounded-input border border-input-border bg-input-bg px-4 py-3.5 text-text-base outline-none transition-all focus:border-primary focus:ring-2 focus:ring-primary/20"
                    placeholder="you@example.com"
                />
            </div>
            <div className="grid grid-cols-1 @sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                    <label className="text-sm font-semibold text-text-base">First name</label>
                    <input
                        type="text"
                        value={values.firstName}
                        onChange={handleChange('firstName')}
                        className="w-full rounded-input border border-input-border bg-input-bg px-4 py-3.5 text-text-base outline-none transition-all focus:border-primary focus:ring-2 focus:ring-primary/20"
                        placeholder="Alex"
                    />
                </div>
                <div className="space-y-2">
                    <label className="text-sm font-semibold text-text-base">Last name</label>
                    <input
                        type="text"
                        value={values.lastName}
                        onChange={handleChange('lastName')}
                        className="w-full rounded-input border border-input-border bg-input-bg px-4 py-3.5 text-text-base outline-none transition-all focus:border-primary focus:ring-2 focus:ring-primary/20"
                        placeholder="Rivera"
                    />
                </div>
            </div>
        </form>
    );
}
