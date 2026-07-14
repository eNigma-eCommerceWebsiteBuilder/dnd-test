'use client';

import { useState } from 'react';
import type { SubscriptionContract } from '@/lib/api/types/subscriptions';
import { DraftEditor } from '@/components/subscriptions/DraftEditor';

type ModifySubscriptionButtonProps = {
  subscription: SubscriptionContract;
};

export function ModifySubscriptionButton({ subscription }: ModifySubscriptionButtonProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="@container w-full">
      <button
        type="button"
        onClick={() => setIsOpen(true)}
        className="inline-flex items-center gap-2 text-sm font-semibold text-primary hover:underline"
      >
        <span className="material-symbols-outlined text-lg">edit_note</span>
        Modify items
      </button>
      {isOpen ? (
        <DraftEditor subscription={subscription} onClose={() => setIsOpen(false)} />
      ) : null}
    </div>
  );
}
