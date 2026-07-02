'use client';

import { useCallback, useState, type HTMLInputTypeAttribute } from 'react';
import { cn } from '@/lib/utils/cn';
import { COUNTRIES } from '@/lib/utils/constants';
import type { ValidationErrors } from '@/lib/utils/validation';
import { AddressFormControl } from './AddressFormControl';
import {
  createInitialAddressFormData,
  createTouchedAddressFields,
  validateAddressForm,
  validateAddressFormField,
  type AddressFormData,
  type AddressFormField,
  type AddressFormTouchedState,
} from './addressFormUtils';

interface AddressFormProps {
  initialData?: Partial<AddressFormData>;
  onSubmit: (data: AddressFormData) => void;
  onChange?: (data: AddressFormData) => void;
  isLoading?: boolean;
  submitLabel?: string;
  showSubmitButton?: boolean;
  className?: string;
}

interface AddressFieldConfig {
  field: AddressFormField;
  label: string;
  placeholder?: string;
  type?: HTMLInputTypeAttribute;
  optional?: boolean;
  options?: { label: string; value: string }[];
}

const COUNTRY_OPTIONS = COUNTRIES.map(({ code, name }) => ({ label: name, value: code }));
const ADDRESS_FORM_ROWS: AddressFieldConfig[][] = [
  [{ field: 'fullName', label: 'Full Name', placeholder: 'John Doe' }],
  [{ field: 'addressLine1', label: 'Street Address', placeholder: '123 Main Street' }],
  [{ field: 'addressLine2', label: 'Apartment, suite, etc.', placeholder: 'Apt 4B', optional: true }],
  [
    { field: 'city', label: 'City', placeholder: 'New York' },
    { field: 'state', label: 'State / Province', placeholder: 'NY' },
  ],
  [
    { field: 'postalCode', label: 'Postal / ZIP Code', placeholder: '10001' },
    { field: 'country', label: 'Country', options: COUNTRY_OPTIONS },
  ],
  [{ field: 'phone', label: 'Phone Number', placeholder: '+1 (555) 123-4567', type: 'tel', optional: true }],
];

export function AddressForm({
  initialData = {},
  onSubmit,
  onChange,
  isLoading = false,
  submitLabel = 'Continue',
  showSubmitButton = true,
  className,
}: AddressFormProps) {
  const [formData, setFormData] = useState<AddressFormData>(() => createInitialAddressFormData(initialData));
  const [errors, setErrors] = useState<ValidationErrors>({});
  const [touched, setTouched] = useState<AddressFormTouchedState>({});

  const handleChange = useCallback((field: AddressFormField, value: string) => {
    setFormData((prev) => {
      const nextData = { ...prev, [field]: value };
      onChange?.(nextData);
      return nextData;
    });
    setErrors((prev) => {
      if (!prev[field]) return prev;
      const nextErrors = { ...prev };
      delete nextErrors[field];
      return nextErrors;
    });
  }, [onChange]);

  const handleBlur = useCallback((field: AddressFormField) => {
    setTouched((prev) => ({ ...prev, [field]: true }));
    const error = validateAddressFormField(field, formData);
    setErrors((prev) => {
      if (!error) {
        if (!prev[field]) return prev;
        const nextErrors = { ...prev };
        delete nextErrors[field];
        return nextErrors;
      }

      return { ...prev, [field]: error };
    });
  }, [formData]);

  const handleSubmit = useCallback((event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const validationResult = validateAddressForm(formData);
    if (!validationResult.valid) {
      setErrors(validationResult.errors);
      setTouched(createTouchedAddressFields());
      return;
    }

    onSubmit(formData);
  }, [formData, onSubmit]);

  const inputBaseClasses = cn(
    'w-full rounded-input border bg-input-bg px-3 py-2.5 text-sm transition-colors',
    '@sm:py-3',
    'outline-none placeholder:text-input-placeholder',
    'focus:border-input-border-focus focus:ring-1 focus:ring-primary',
    'disabled:cursor-not-allowed disabled:opacity-disabled',
  );

  const renderField = ({ field, ...config }: AddressFieldConfig) => (
    <AddressFormControl
      key={field}
      id={field}
      value={formData[field]}
      disabled={isLoading}
      error={errors[field]}
      showError={Boolean(touched[field])}
      inputClassName={cn(inputBaseClasses, errors[field] && touched[field] ? 'border-border-error' : 'border-input-border')}
      onChange={(value) => handleChange(field, value)}
      onBlur={['fullName', 'addressLine1', 'city', 'state', 'postalCode'].includes(field) ? () => handleBlur(field) : undefined}
      {...config}
    />
  );

  return (
    <form onSubmit={handleSubmit} className={cn('@container w-full', className)}>
      <div className="space-y-4 @sm:space-y-5">
        {ADDRESS_FORM_ROWS.map((row) => row.length === 1 ? renderField(row[0]) : (
          <div key={row.map(({ field }) => field).join('-')} className="grid grid-cols-1 gap-4 @sm:grid-cols-2">
            {row.map(renderField)}
          </div>
        ))}
        {showSubmitButton ? (
          <button
            type="submit"
            disabled={isLoading}
            className={cn(
              'w-full rounded-button bg-primary py-3 font-semibold text-on-primary shadow-button transition-all',
              '@sm:py-3.5',
              'hover:bg-primary-dark hover:shadow-button-hover',
              'disabled:cursor-not-allowed disabled:opacity-disabled',
            )}
          >
            {isLoading ? 'Processing...' : submitLabel}
          </button>
        ) : null}
      </div>
    </form>
  );
}

export type { AddressFormData };
export default AddressForm;
