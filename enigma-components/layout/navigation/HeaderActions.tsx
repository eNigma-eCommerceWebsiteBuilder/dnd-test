'use client';

import { useMemo } from 'react';
import { cn } from '@/lib/utils/cn';
import type { MenuItem } from '@/lib/api/types/menu';
import { MobileNav } from '@/components/layout/navigation/MobileNav';
import { SearchInput } from '@/components/layout/navigation/SearchInput';
import { UserMenu } from '@/components/layout/navigation/UserMenu';
import { CartIndicator } from '@/components/layout/navigation/CartIndicator';
import { useOverlayStore } from '@/lib/stores/overlay-store';

interface HeaderActionsProps {
    menuItems: MenuItem[];
    className?: string;
}

export const HeaderActions = ({ menuItems, className }: HeaderActionsProps) => {
    const openOverlay = useOverlayStore((state) => state.openOverlay);

    const suggestions = useMemo(() => {
        return menuItems.map((item) => item.label).filter(Boolean);
    }, [menuItems]);

    return (
        <div className={cn("@container w-full flex items-center gap-4", className)}>
            <button
                type="button"
                aria-label="Open navigation"
                onClick={() => openOverlay('mobile-nav')}
                className="@lg:hidden rounded-button p-2 text-text-base hover:text-primary hover:bg-bg-hover transition-colors"
            >
                <span className="material-symbols-outlined">menu</span>
            </button>

            <div className="hidden @md:block flex-1 min-w-0">
                <SearchInput suggestions={suggestions} />
            </div>

            <UserMenu />
            <CartIndicator />

            <MobileNav menuItems={menuItems} />
        </div>
    );
};
