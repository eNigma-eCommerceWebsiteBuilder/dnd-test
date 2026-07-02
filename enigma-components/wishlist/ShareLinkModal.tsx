'use client';

import { useEffect, useId, useRef } from 'react';

interface ShareLinkModalProps {
  isOpen: boolean;
  shareUrl: string | null;
  onClose: () => void;
}

export function ShareLinkModal({ isOpen, shareUrl, onClose }: ShareLinkModalProps) {
  const inputRef = useRef<HTMLInputElement | null>(null);
  const titleId = useId();
  const descriptionId = useId();

  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
      inputRef.current.select();
    }
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) {
    return null;
  }

  return (
    <div className="@container fixed inset-0 z-modal flex items-center justify-center px-4">
      <div
        className="absolute inset-0 bg-bg-overlay/80 backdrop-blur-overlay"
        onClick={onClose}
      />
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        aria-describedby={descriptionId}
        className="relative w-full max-w-md bg-bg-surface border border-border rounded-modal shadow-modal p-6"
      >
        <div className="flex items-center justify-between mb-4">
          <h2 id={titleId} className="text-lg font-semibold text-text-base">
            Share Wishlist
          </h2>
          <button
            type="button"
            onClick={onClose}
            className="rounded-full p-1 text-text-muted hover:text-text-base transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-border-focus focus-visible:ring-offset-2 focus-visible:ring-offset-bg-surface"
            aria-label="Close share modal"
          >
            <span className="material-symbols-outlined text-lg">close</span>
          </button>
        </div>

        <p id={descriptionId} className="text-sm text-text-muted mb-4">
          Copy the link below to share your wishlist.
        </p>

        <div className="flex items-center gap-2">
          <input
            ref={inputRef}
            readOnly
            value={shareUrl || ''}
            aria-label="Share link"
            className="w-full bg-bg-sunken border border-border rounded-input px-3 py-2 text-sm text-text-base focus:outline-none focus:border-border-focus"
          />
          <button
            type="button"
            onClick={() => shareUrl && navigator.clipboard.writeText(shareUrl)}
            className="bg-cta-primary hover:bg-cta-primary-hover text-on-primary px-3 py-2 rounded-button text-sm font-semibold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-border-focus focus-visible:ring-offset-2 focus-visible:ring-offset-bg-surface"
          >
            Copy
          </button>
        </div>
      </div>
    </div>
  );
}
