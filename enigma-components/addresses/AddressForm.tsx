'use client';

import { useState, useTransition } from 'react';
import { addAddressAction } from '@/lib/actions/auth-actions';
import { cn } from '@/lib/utils/cn';
import { COUNTRIES } from '@/lib/utils/constants';
import { StreetInput } from '@/enigma-components/addresses/StreetInput';
import { CityInput } from '@/enigma-components/addresses/CityInput';
import { StateSelector } from '@/enigma-components/addresses/StateSelector';
import { PostalCodeInput } from '@/enigma-components/addresses/PostalCodeInput';
import { CountrySelector } from '@/enigma-components/addresses/CountrySelector';
import { IsDefaultCheckbox } from '@/enigma-components/addresses/IsDefaultCheckbox';
import { SaveButton } from '@/enigma-components/addresses/SaveButton';
import {
  DEFAULT_ADDRESS_FORM_STATE,
  validateAddressForm,
  type AddressFormState,
} from './addressFormUtils';

interface AddressFormProps {
  fullName: string;
  onCancel: () => void;
  onSuccess: () => void | Promise<void>;
  className?: string;
}

export function AddressForm({ fullName, onCancel, onSuccess, className }: AddressFormProps) {
  const [formState, setFormState] = useState<AddressFormState>(DEFAULT_ADDRESS_FORM_STATE);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [formError, setFormError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const updateField = (field: keyof AddressFormState, value: string | boolean) => {
    setFormState((prev) => ({ ...prev, [field]: value }));
    setErrors((prev) => {
      if (!prev[field]) return prev;
      const next = { ...prev };
      delete next[field];
      return next;
    });
  };

  const validateForm = () => {
    const nextErrors = validateAddressForm(fullName, formState);
    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setFormError(null);

    if (!validateForm()) {
      return;
    }

    startTransition(async () => {
      const payload = new FormData();
      payload.set('street', formState.street.trim());
      payload.set('city', formState.city.trim());
      payload.set('state', formState.state.trim());
      payload.set('zipCode', formState.zipCode.trim());
      payload.set('country', formState.country.trim());
      payload.set('isDefault', formState.isDefault ? 'true' : 'false');

      const result = await addAddressAction(null, payload);
      if (!result.success) {
        setFormError(result.error || 'Failed to add address.');
        return;
      }

      await onSuccess();
      setFormState(DEFAULT_ADDRESS_FORM_STATE);
    });
  };

  return (
    <form className={cn("@container flex w-full flex-col gap-6", className)} onSubmit={handleSubmit}>
      <div className="@container grid grid-cols-1 @md:grid-cols-2 gap-5">
        <StreetInput
          value={formState.street}
          error={errors.street}
          onChange={(value) => updateField('street', value)}
        />
        <CityInput
          value={formState.city}
          error={errors.city}
          onChange={(value) => updateField('city', value)}
        />
        <StateSelector
          value={formState.state}
          error={errors.state}
          onChange={(value) => updateField('state', value)}
        />
        <PostalCodeInput
          value={formState.zipCode}
          error={errors.zipCode}
          onChange={(value) => updateField('zipCode', value)}
        />
        <CountrySelector
          value={formState.country}
          error={errors.country}
          options={COUNTRIES}
          onChange={(value) => updateField('country', value)}
        />
      </div>

      <IsDefaultCheckbox
        checked={formState.isDefault}
        onChange={(value) => updateField('isDefault', value)}
      />

      {formError && (
        <p className="text-sm text-danger">{formError}</p>
      )}

      <div className="flex flex-col gap-3 @sm:flex-row @sm:items-center @sm:justify-end">
        <button
          type="button"
          onClick={onCancel}
          className="inline-flex items-center justify-center rounded-button px-4 py-2 text-sm font-semibold text-text-base bg-bg-sunken hover:bg-bg-hover transition-colors"
        >
          Cancel
        </button>
        <SaveButton isLoading={isPending} />
      </div>
    </form>
  );
}
