'use client';

import type { UserAddress } from '@/lib/api/types/auth';
import { AddressCard } from '@/components/addresses/AddressCard';

interface AddressListProps {
  addresses: UserAddress[];
  loading: boolean;
  error: string | null;
  onRefresh: () => Promise<void>;
  onDeleted?: () => void | Promise<void>;
}

/**
 * Address List (Client Component)
 *
 * Per PAGE_AND_COMPONENTS_PLAN.md Section 2.3:
 * - Must include @container on root element.
 */
export function AddressList({ addresses, loading, error, onRefresh, onDeleted }: AddressListProps) {
  if (loading && addresses.length === 0) {
    return (
      <div className="@container w-full bg-bg-surface border border-border rounded-card p-6 shadow-card">
        <p className="text-sm text-text-muted">Loading addresses...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="@container w-full bg-bg-surface border border-border rounded-card p-6 shadow-card">
        <p className="text-sm text-danger">{error}</p>
        <button
          type="button"
          onClick={onRefresh}
          className="mt-4 inline-flex items-center justify-center px-4 py-2 rounded-button bg-primary text-on-primary text-sm font-semibold shadow-button hover:bg-primary-dark hover:shadow-button-hover transition-all"
        >
          Try Again
        </button>
      </div>
    );
  }

  if (addresses.length === 0) {
    return (
      <div className="@container w-full bg-bg-surface border border-dashed border-border rounded-card p-6 text-center">
        <p className="text-sm text-text-muted">
          You don&apos;t have any saved addresses yet.
        </p>
      </div>
    );
  }

  return (
    <div className="@container w-full grid grid-cols-1 @md:grid-cols-2 @xl:grid-cols-3 gap-6">
      {addresses.map((address) => (
        <AddressCard key={address._id} address={address} onDeleted={onDeleted} />
      ))}
    </div>
  );
}
