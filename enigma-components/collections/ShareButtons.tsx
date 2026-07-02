'use client';

import { useState } from 'react';
import { cn } from '@/lib/utils/cn';
import { useToast } from '@/lib/hooks';

interface ShareButtonsProps {
  url: string;
  title?: string;
  className?: string;
}

export function ShareButtons({ url, title, className }: ShareButtonsProps) {
  const { success, error: showError } = useToast();
  const [isSharing, setIsSharing] = useState(false);

  const handleShare = async () => {
    setIsSharing(true);

    try {
      if (navigator.share) {
        await navigator.share({ title, url });
        success('Shared successfully');
      } else if (navigator.clipboard) {
        await navigator.clipboard.writeText(url);
        success('Link copied');
      } else {
        showError('Sharing not supported');
      }
    } catch {
      showError('Failed to share');
    } finally {
      setIsSharing(false);
    }
  };

  return (
    <button
      type="button"
      onClick={handleShare}
      disabled={isSharing}
      className={cn(
        '@container inline-flex items-center justify-center rounded-button border border-border bg-bg-surface px-4 py-2 text-sm font-semibold text-text-base transition-colors hover:bg-bg-hover',
        'disabled:cursor-not-allowed disabled:opacity-50',
        className
      )}
    >
      <span className="material-symbols-outlined text-base">share</span>
      <span className="ml-2">Share</span>
    </button>
  );
}

export default ShareButtons;
