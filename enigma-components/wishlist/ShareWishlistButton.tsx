'use client';

import { useState, useTransition } from 'react';
import { cn } from '@/lib/utils/cn';
import { useToast } from '@/lib/hooks';
import { useWishlistShare } from '@/lib/hooks';
import { ShareLinkModal } from '@/enigma-components/wishlist/ShareLinkModal';

interface ShareWishlistButtonProps {
  className?: string;
  itemCount?: number;
  disabled?: boolean;
}

export function ShareWishlistButton({
  className,
  disabled,
}: ShareWishlistButtonProps) {
  const { success, error } = useToast();
  const { generateShareLink, generating, shareUrl } = useWishlistShare();
  const [isOpen, setIsOpen] = useState(false);
  const [isPending, startTransition] = useTransition();

  const handleShare = () => {
    startTransition(async () => {
      try {
        const url = await generateShareLink();
        await navigator.clipboard.writeText(url);
        success('Share link copied');
        setIsOpen(true);
      } catch {
        error('Failed to generate share link');
      }
    });
  };

  const isDisabled = Boolean(disabled) || generating || isPending;

  return (
    <>
      <button
        type="button"
        onClick={handleShare}
        disabled={isDisabled}
        className={cn(
          '@container inline-flex items-center gap-2 bg-bg-sunken hover:bg-bg-hover text-text-base px-4 py-2 rounded-button text-sm font-semibold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-border-focus focus-visible:ring-offset-2 focus-visible:ring-offset-bg-surface disabled:opacity-50 disabled:cursor-not-allowed',
          className
        )}
      >
        <span className="material-symbols-outlined text-lg">share</span>
        Share List
      </button>

      <ShareLinkModal
        isOpen={isOpen}
        shareUrl={shareUrl}
        onClose={() => setIsOpen(false)}
      />
    </>
  );
}
