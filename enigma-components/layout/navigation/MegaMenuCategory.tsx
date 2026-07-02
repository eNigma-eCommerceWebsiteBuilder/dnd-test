import Link from 'next/link';
import { cn } from '@/lib/utils/cn';
import type { MegaMenuCategory as MegaMenuCategoryType } from '@/lib/api/types/menu';

interface MegaMenuCategoryProps {
    category: MegaMenuCategoryType;
    className?: string;
}

export const MegaMenuCategory = ({ category, className }: MegaMenuCategoryProps) => {
    return (
        <li className={cn("@container w-full", className)}>
            <Link
                href={category.href}
                className="flex items-center justify-between w-full rounded-card px-3 py-2 text-sm font-medium text-text-base hover:text-primary hover:bg-bg-hover transition-colors"
            >
                <span>{category.name}</span>
                <span className="material-symbols-outlined text-sm text-text-muted">chevron_right</span>
            </Link>
        </li>
    );
};
