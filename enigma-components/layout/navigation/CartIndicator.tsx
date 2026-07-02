'use client';

import { cn } from '@/lib/utils/cn';
import { useCartCount } from '@/lib/hooks';
import { useOverlayStore } from '@/lib/stores/overlay-store';

interface CartIndicatorProps {
    className?: string;
}

export const CartIndicator = ({ className }: CartIndicatorProps) => {
    const { count } = useCartCount();
    const openOverlay = useOverlayStore((state) => state.openOverlay);

    return (
        <button
            type="button"
            className={cn("@container relative inline-flex items-center justify-center rounded-button p-2 text-text-base hover:text-primary hover:bg-bg-hover transition-colors", className)}
            aria-label="Open mini cart"
            onClick={() => openOverlay('mini-cart')}
        >
            <span className="material-symbols-outlined">shopping_bag</span>
            {count > 0 ? (
                <span className="absolute -top-1 -right-1 min-w-[1rem] h-4 px-1 rounded-badge bg-primary text-on-primary text-[10px] font-bold flex items-center justify-center">
                    {count}
                </span>
            ) : null}
        </button>
    );
};
