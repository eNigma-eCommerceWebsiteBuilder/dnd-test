'use client';

import Link from 'next/link';
import { cn } from '@/lib/utils/cn';
import type { MenuItem } from '@/lib/api/types/menu';
import { useOverlayStore } from '@/lib/stores/overlay-store';

interface MobileNavProps {
    menuItems: MenuItem[];
    className?: string;
}

export const MobileNav = ({ menuItems, className }: MobileNavProps) => {
    const activeOverlay = useOverlayStore((state) => state.activeOverlay);
    const closeOverlay = useOverlayStore((state) => state.closeOverlay);
    const isOpen = activeOverlay === 'mobile-nav';

    if (!isOpen) return null;

    return (
        <div className={cn("@container fixed inset-0 z-drawer", className)}>
            <button
                type="button"
                aria-label="Close navigation"
                className="absolute inset-0 bg-bg-overlay/80 backdrop-blur-overlay"
                onClick={() => closeOverlay('mobile-nav')}
            />
            <aside className="relative h-full w-full max-w-[360px] bg-bg-surface shadow-modal border-r border-border p-6 flex flex-col">
                <div className="flex items-center justify-between mb-6">
                    <span className="text-lg font-semibold text-text-base">Menu</span>
                    <button
                        type="button"
                        aria-label="Close menu"
                        onClick={() => closeOverlay('mobile-nav')}
                        className="rounded-button p-2 text-text-muted hover:text-text-base hover:bg-bg-hover transition-colors"
                    >
                        <span className="material-symbols-outlined">close</span>
                    </button>
                </div>

                <nav className="flex flex-col gap-2">
                    {menuItems.map((item) => (
                        <Link
                            key={item.label}
                            href={item.href || '#'}
                            onClick={() => closeOverlay('mobile-nav')}
                            className="rounded-button px-3 py-2 text-sm font-semibold text-text-base hover:text-primary hover:bg-bg-hover transition-colors"
                        >
                            {item.label}
                        </Link>
                    ))}
                </nav>
            </aside>
        </div>
    );
};
