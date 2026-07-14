'use client';

import { useState } from 'react';
import { SkipConfirmModal } from '@/components/subscriptions/SkipConfirmModal';

type SkipDeliveryButtonProps = {
  subscriptionId: string;
  disabled?: boolean;
};

export function SkipDeliveryButton({ subscriptionId, disabled = false }: SkipDeliveryButtonProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="@container w-full">
      <button
        type="button"
        onClick={() => setIsOpen(true)}
        disabled={disabled}
        className="inline-flex items-center justify-center rounded-button border border-border px-4 py-2 text-sm font-semibold text-text-base transition-colors hover:bg-bg-hover disabled:opacity-disabled disabled:cursor-not-allowed"
      >
        Skip delivery
      </button>
      <SkipConfirmModal
        isOpen={isOpen}
        subscriptionId={subscriptionId}
        onClose={() => setIsOpen(false)}
      />
    </div>
  );
}
