'use client';

import { useMemo, useState } from 'react';
import type { User, UserAddress } from '@/lib/api/types/auth';
import { useUserAddresses } from '@/lib/hooks';
import { AddressList } from '@/enigma-components/addresses/AddressList';
import { AddAddressButton } from '@/enigma-components/addresses/AddAddressButton';
import { AddAddressModal } from '@/enigma-components/addresses/AddAddressModal';

interface AddressManagerProps {
  user: User;
}

/**
 * Address Manager (Client Component)
 *
 * Per PAGE_AND_COMPONENTS_PLAN.md Section 1.2:
 * - Interactive UI lives in components and accepts props from the page.
 *
 * Per Section 2.3:
 * - Must include @container on root element.
 */
export function AddressManager({ user }: AddressManagerProps) {
  const {
    addresses,
    loading,
    error,
    refreshAddresses,
  } = useUserAddresses();
  const [isModalOpen, setIsModalOpen] = useState(false);

  const displayAddresses: UserAddress[] = useMemo(() => {
    const initialAddresses = user.addresses ?? [];
    if (addresses.length > 0) {
      return addresses;
    }

    return initialAddresses;
  }, [addresses, user.addresses]);

  return (
    <section className="@container w-full flex flex-col gap-6">
      <div className="flex items-center justify-between gap-4 pb-6 border-b border-divider">
        <div className="flex flex-col gap-1">
          <h3 className="text-lg font-bold font-heading text-text-base">
            Saved Addresses
          </h3>
          <p className="text-sm text-text-muted">
            Add and manage your delivery locations.
          </p>
        </div>
        <AddAddressButton onClick={() => setIsModalOpen(true)} />
      </div>
      <AddressList
        addresses={displayAddresses}
        loading={loading}
        error={error}
        onRefresh={refreshAddresses}
        onDeleted={refreshAddresses}
      />
      <AddAddressModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSuccess={refreshAddresses}
        fullName={`${user.firstName} ${user.lastName}`.trim()}
      />
    </section>
  );
}
