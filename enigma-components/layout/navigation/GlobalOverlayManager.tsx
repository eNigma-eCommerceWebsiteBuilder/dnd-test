'use client';

import { useEffect } from 'react';
import { MiniCartDrawer } from '@/components/cart/MiniCartDrawer';
import { useOverlayStore } from '@/lib/stores/overlay-store';

const SCROLL_LOCKED_OVERLAYS = new Set(['mini-cart', 'mobile-nav', 'product-filters']);

export function GlobalOverlayManager() {
  const activeOverlay = useOverlayStore((state) => state.activeOverlay);
  const closeOverlay = useOverlayStore((state) => state.closeOverlay);

  useEffect(() => {
    const shouldLockScroll = activeOverlay ? SCROLL_LOCKED_OVERLAYS.has(activeOverlay) : false;
    document.body.style.overflow = shouldLockScroll ? 'hidden' : '';

    return () => {
      document.body.style.overflow = '';
    };
  }, [activeOverlay]);

  useEffect(() => {
    if (!activeOverlay) {
      return;
    }

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        closeOverlay();
      }
    };

    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [activeOverlay, closeOverlay]);

  return <MiniCartDrawer />;
}
