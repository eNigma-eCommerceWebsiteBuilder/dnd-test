'use client';

import type { UserAddress } from '@/lib/api/types/auth';

interface AddressInfoProps {
  address: UserAddress;
}

/**
 * Address Info
 *
 * Per PAGE_AND_COMPONENTS_PLAN.md Section 2.3:
 * - Must include @container on root element.
 */
export function AddressInfo({ address }: AddressInfoProps) {
  return (
    <div className="@container w-full text-sm text-text-muted">
      <div className="flex items-start gap-3">
        <span className="material-symbols-outlined text-lg text-text-muted mt-0.5">
          location_on
        </span>
        <div className="leading-relaxed">
          <p className="text-text-base font-semibold">
            {address.street}
          </p>
          <p>
            {address.city}, {address.state} {address.zipCode}
          </p>
          <p>
            {address.country}
          </p>
        </div>
      </div>
    </div>
  );
}
