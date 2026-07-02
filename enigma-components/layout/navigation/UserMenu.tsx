'use client';

import Link from 'next/link';
import { useState } from 'react';
import { cn } from '@/lib/utils/cn';
import { useAuth } from '@/lib/hooks';
import { ROUTES } from '@/lib/utils/constants';

interface UserMenuProps {
    className?: string;
}

export const UserMenu = ({ className }: UserMenuProps) => {
    const [open, setOpen] = useState(false);
    const { user, isAuthenticated, authEnabled, logout } = useAuth();

    if (!authEnabled) return null;

    const initials = user
        ? `${user.firstName.charAt(0) || ''}${user.lastName.charAt(0) || ''}`.toUpperCase() || 'AC'
        : 'GU';

    return (
        <div className={cn("@container relative", className)}>
            <button
                type="button"
                onClick={() => setOpen((prev) => !prev)}
                aria-expanded={open}
                aria-haspopup="menu"
                className="flex items-center gap-2 rounded-button px-2 py-1 text-text-base hover:text-primary hover:bg-bg-hover transition-colors"
            >
                <span className="material-symbols-outlined">person</span>
                <span className="hidden @lg:inline text-sm font-medium">Account</span>
            </button>

            {open ? (
                <div className="absolute right-0 mt-2 min-w-[200px] rounded-dropdown border border-border bg-bg-surface shadow-dropdown overflow-hidden">
                    {isAuthenticated && user ? (
                        <div className="p-4 border-b border-divider">
                            <div className="flex items-center gap-3">
                                <div className="size-10 rounded-avatar bg-primary/10 text-primary flex items-center justify-center text-sm font-semibold">
                                    {initials}
                                </div>
                                <div>
                                    <p className="text-sm font-semibold text-text-base">{user.firstName} {user.lastName}</p>
                                    <p className="text-xs text-text-muted">{user.email}</p>
                                </div>
                            </div>
                        </div>
                    ) : null}

                    <div className="py-2">
                        {isAuthenticated ? (
                            <>
                                <Link
                                    href={ROUTES.ACCOUNT}
                                    className="block px-4 py-2 text-sm text-text-base hover:bg-bg-hover"
                                    onClick={() => setOpen(false)}
                                >
                                    Account Dashboard
                                </Link>
                                <button
                                    type="button"
                                    onClick={() => {
                                        void logout();
                                        setOpen(false);
                                    }}
                                    className="w-full text-left px-4 py-2 text-sm text-text-base hover:bg-bg-hover"
                                >
                                    Sign out
                                </button>
                            </>
                        ) : (
                            <>
                                <Link
                                    href={ROUTES.LOGIN}
                                    className="block px-4 py-2 text-sm text-text-base hover:bg-bg-hover"
                                    onClick={() => setOpen(false)}
                                >
                                    Sign in
                                </Link>
                                <Link
                                    href={ROUTES.SIGNUP}
                                    className="block px-4 py-2 text-sm text-text-base hover:bg-bg-hover"
                                    onClick={() => setOpen(false)}
                                >
                                    Create account
                                </Link>
                            </>
                        )}
                    </div>
                </div>
            ) : null}
        </div>
    );
};
