'use client';

import { useState } from 'react';
import type { Address } from '@/lib/api/types/orders';

const emptyAddress: Address = {
  street: '',
  city: '',
  state: '',
  zipCode: '',
  country: '',
};

type DraftAddressEditorProps = {
  address: Address | null | undefined;
  disabled?: boolean;
  onSave: (address: Address) => void;
};

export function DraftAddressEditor({ address, disabled = false, onSave }: DraftAddressEditorProps) {
  const [formState, setFormState] = useState<Address>(address || emptyAddress);

  const updateField = (field: keyof Address, value: string) => {
    setFormState((prev) => ({ ...prev, [field]: value }));
  };

  return (
    <div className="@container space-y-4 rounded-card border border-border bg-bg-elevated p-4">
      <div>
        <h4 className="text-sm font-semibold text-text-base">Shipping address</h4>
        <p className="text-xs text-text-muted">Update delivery address for this draft.</p>
      </div>
      <div className="grid grid-cols-1 @md:grid-cols-2 gap-3">
        <input
          type="text"
          value={formState.street}
          onChange={(event) => updateField('street', event.target.value)}
          className="w-full rounded-input border border-input-border bg-input-bg px-3 py-2 text-sm text-text-base"
          placeholder="Street"
          disabled={disabled}
        />
        <input
          type="text"
          value={formState.city}
          onChange={(event) => updateField('city', event.target.value)}
          className="w-full rounded-input border border-input-border bg-input-bg px-3 py-2 text-sm text-text-base"
          placeholder="City"
          disabled={disabled}
        />
        <input
          type="text"
          value={formState.state}
          onChange={(event) => updateField('state', event.target.value)}
          className="w-full rounded-input border border-input-border bg-input-bg px-3 py-2 text-sm text-text-base"
          placeholder="State"
          disabled={disabled}
        />
        <input
          type="text"
          value={formState.zipCode}
          onChange={(event) => updateField('zipCode', event.target.value)}
          className="w-full rounded-input border border-input-border bg-input-bg px-3 py-2 text-sm text-text-base"
          placeholder="Postal code"
          disabled={disabled}
        />
        <input
          type="text"
          value={formState.country}
          onChange={(event) => updateField('country', event.target.value)}
          className="w-full rounded-input border border-input-border bg-input-bg px-3 py-2 text-sm text-text-base"
          placeholder="Country"
          disabled={disabled}
        />
      </div>
      <div className="flex justify-end">
        <button
          type="button"
          onClick={() => onSave(formState)}
          disabled={disabled}
          className="px-4 py-2 rounded-button bg-cta-secondary text-on-secondary font-semibold hover:bg-cta-secondary-hover transition-colors disabled:opacity-disabled"
        >
          Save address
        </button>
      </div>
    </div>
  );
}
