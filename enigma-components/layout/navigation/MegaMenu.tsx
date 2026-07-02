import Link from 'next/link';
import { cn } from '@/lib/utils/cn';
import type { MenuItem } from '@/lib/api/types/menu';
import { MegaMenuCategory } from '@/components/layout/navigation/MegaMenuCategory';

interface MegaMenuProps {
    menuItems: MenuItem[];
    className?: string;
}

export const MegaMenu = ({ menuItems, className }: MegaMenuProps) => {
    if (!menuItems || menuItems.length === 0) return null;

    const itemsWithMegaMenu = menuItems.filter((item) => item.megaMenu);

    if (itemsWithMegaMenu.length === 0) return null;

    return (
        <div
            className={cn(
                "@container w-full bg-surface/90 backdrop-blur-nav border border-border rounded-card shadow-dropdown",
                className
            )}
        >
            <div className="p-6 @lg:p-8 flex flex-col gap-8">
                {itemsWithMegaMenu.map((item) => (
                    <div key={item.label} className="w-full border-t border-divider first:border-t-0 pt-6 first:pt-0">
                        <div className="grid grid-cols-1 @lg:grid-cols-[minmax(0,2fr)_minmax(0,1fr)] gap-6">
                            <div className="w-full">
                                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-text-muted mb-4">
                                    {item.label}
                                </p>
                                <ul className="grid grid-cols-1 @md:grid-cols-2 gap-2">
                                    {item.megaMenu?.categories?.map((category) => (
                                        <MegaMenuCategory key={`${item.label}-${category.href}`} category={category} />
                                    ))}
                                </ul>
                            </div>
                            {item.megaMenu?.featured && item.megaMenu.featured.length > 0 ? (
                                <div className="w-full grid grid-cols-1 gap-4">
                                    {item.megaMenu.featured.map((featured) => (
                                        <Link
                                            key={featured.id}
                                            href={featured.link}
                                            className="group rounded-card border border-border bg-bg-elevated/60 hover:bg-bg-hover transition-colors overflow-hidden"
                                        >
                                            <div className="aspect-[4/3] w-full overflow-hidden">
                                                <div
                                                    className="h-full w-full bg-cover bg-center transition-transform duration-300 group-hover:scale-105"
                                                    style={{ backgroundImage: `url(${featured.imageUrl})` }}
                                                    role="img"
                                                    aria-label={featured.title}
                                                />
                                            </div>
                                            <div className="p-4">
                                                <p className="text-sm font-semibold text-text-base">{featured.title}</p>
                                                <p className="text-xs text-text-muted mt-1">Explore collection</p>
                                            </div>
                                        </Link>
                                    ))}
                                </div>
                            ) : null}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};
