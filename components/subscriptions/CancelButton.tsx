'use client';

import { useState } from 'react';
import { CancelModal } from '@/components/subscriptions/CancelModal';

type CancelButtonProps = {
  subscriptionId: string;
  disabled?: boolean;
};

export function CancelButton({ subscriptionId, disabled = false }: CancelButtonProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="@container w-full">
      <button
        type="button"
        onClick={() => setIsOpen(true)}
        disabled={disabled}
        className="inline-flex items-center justify-center rounded-button border border-danger px-4 py-2 text-sm font-semibold text-danger transition-colors hover:bg-danger-subtle disabled:opacity-disabled disabled:cursor-not-allowed"
      >
        Cancel
      </button>
      <CancelModal
        isOpen={isOpen}
        subscriptionId={subscriptionId}
        onClose={() => setIsOpen(false)}
      />
    </div>
  );
}
