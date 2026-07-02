'use client';

import type { UserAddress } from '@/lib/api/types/auth';
import { AddressInfo } from '@/components/addresses/AddressInfo';
import { DefaultBadge } from '@/components/addresses/DefaultBadge';
import { DeleteButton } from '@/components/addresses/DeleteButton';

interface AddressCardProps {
  address: UserAddress;
  onDeleted?: () => void | Promise<void>;
}

/**
 * Address Card
 *
 * Per PAGE_AND_COMPONENTS_PLAN.md Section 2.3:
 * - Must include @container on root element.
 */
export function AddressCard({ address, onDeleted }: AddressCardProps) {
  const cardClasses = address.isDefault
    ? '@container group relative w-full bg-bg-surface border border-primary rounded-card p-6 shadow-card-hover transition-all'
    : '@container group relative w-full bg-bg-surface border border-border rounded-card p-6 shadow-card transition-all hover:border-primary/40 hover:shadow-card-hover';

  return (
    <article className={cardClasses}>
      <div className="flex items-start justify-between gap-4 mb-4 min-h-[28px]">
        {address.isDefault ? <DefaultBadge /> : <span className="h-6" />}
        <DeleteButton addressId={address._id} onDeleted={onDeleted} />
      </div>
      <AddressInfo address={address} />
    </article>
  );
}
