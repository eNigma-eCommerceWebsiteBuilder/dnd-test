'use client';

import { createPortal } from 'react-dom';
import { cn } from '@/lib/utils/cn';
import { CategoryFilter } from './CategoryFilter';
import { PriceRangeSlider } from './PriceRangeSlider';
import { AvailabilityFilter } from './AvailabilityFilter';
import type { Category } from '@/lib/api/types';
import { useOverlayStore } from '@/lib/stores/overlay-store';

interface MobileFilterDrawerProps {
    categories: Category[];
    className?: string;
}

export function MobileFilterDrawer({ categories, className }: MobileFilterDrawerProps) {
    const activeOverlay = useOverlayStore((state) => state.activeOverlay);
    const openOverlay = useOverlayStore((state) => state.openOverlay);
    const closeOverlay = useOverlayStore((state) => state.closeOverlay);
    const isOpen = activeOverlay === 'product-filters';
    const canUsePortal = typeof document !== 'undefined';

    const handleClose = () => closeOverlay('product-filters');

    const drawer = (
        <>
            <button
                type="button"
                className={cn(
                    "fixed inset-0 z-drawer bg-bg-overlay transition-opacity duration-300",
                    isOpen ? "opacity-100" : "pointer-events-none opacity-0"
                )}
                onClick={handleClose}
                aria-label="Close filters"
            />

            <div
                className={cn(
                    "fixed inset-y-0 left-0 z-drawer flex w-[85%] max-w-[320px] transform flex-col bg-bg-surface shadow-modal transition-transform duration-300 ease-out",
                    isOpen ? "translate-x-0" : "-translate-x-full"
                )}
                role="dialog"
                aria-modal="true"
                aria-label="Filter products"
            >
                <div className="flex items-center justify-between border-b border-border px-6 py-4">
                    <h2 className="text-lg font-bold text-text-base">Filters</h2>
                    <button
                        type="button"
                        onClick={handleClose}
                        className="rounded-full p-2 transition-colors hover:bg-bg-hover"
                        aria-label="Close filters"
                    >
                        <span className="material-symbols-outlined text-text-muted">close</span>
                    </button>
                </div>

                <div className="flex-1 space-y-8 overflow-y-auto px-6 py-6">
                    <CategoryFilter categories={categories} />
                    <PriceRangeSlider minValue={0} maxValue={5000} />
                    <AvailabilityFilter />
                </div>

                <div className="border-t border-border bg-bg-surface px-6 py-4">
                    <button
                        type="button"
                        onClick={handleClose}
                        className="w-full rounded-button bg-cta-primary py-3 font-semibold text-on-primary transition-colors hover:bg-cta-primary-hover"
                    >
                        Apply Filters
                    </button>
                </div>
            </div>
        </>
    );

    return (
        <>
            <button
                type="button"
                onClick={() => openOverlay('product-filters')}
                className={cn(
                    "@container @lg:hidden flex items-center gap-2 rounded-button border border-border bg-bg-surface px-4 py-2.5",
                    "text-sm font-semibold text-text-base transition-colors hover:border-primary hover:text-primary",
                    className
                )}
            >
                <span className="material-symbols-outlined text-lg">tune</span>
                Filters
            </button>

            {canUsePortal ? createPortal(drawer, document.body) : null}
        </>
    );
}

export default MobileFilterDrawer;
