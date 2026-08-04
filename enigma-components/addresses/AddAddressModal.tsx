'use client';

import { cn } from '@/lib/utils/cn';
import { AddressForm } from '@/enigma-components/addresses/AddressForm';

interface AddAddressModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void | Promise<void>;
  fullName: string;
  className?: string;
}

export function AddAddressModal({
  isOpen,
  onClose,
  onSuccess,
  fullName,
  className,
}: AddAddressModalProps) {
  if (!isOpen) {
    return null;
  }

  return (
    <div className="@container fixed inset-0 z-modal flex items-center justify-center">
      <button
        type="button"
        aria-label="Close modal"
        onClick={onClose}
        className="absolute inset-0 z-modal-backdrop bg-bg-overlay opacity-overlay backdrop-blur-modal"
      />
      <div
        className={cn(
          "relative z-modal mx-4 w-full max-w-[640px] rounded-modal border border-border bg-bg-surface p-6 shadow-modal @md:p-8",
          className
        )}
      >
        <div className="mb-6 flex items-start justify-between gap-4">
          <div>
            <h3 className="text-xl font-bold font-heading text-text-base @md:text-2xl">
              Add New Address
            </h3>
            <p className="text-sm text-text-muted">
              Save a new delivery location to your account.
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="inline-flex items-center justify-center rounded-button px-3 py-2 text-text-muted hover:text-text-base hover:bg-bg-hover transition-colors"
          >
            <span className="material-symbols-outlined text-lg">close</span>
          </button>
        </div>

        <AddressForm
          fullName={fullName}
          onCancel={onClose}
          onSuccess={async () => {
            await onSuccess();
            onClose();
          }}
        />
      </div>
    </div>
  );
}
