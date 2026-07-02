import Link from 'next/link';
import { cn } from '@/lib/utils/cn';
import type { HeroProduct } from '@/lib/api/types/menu';

interface FeaturedProductCardProps {
    heroProduct: HeroProduct | null;
    className?: string;
}

const formatPrice = (price: number) => {
    if (Number.isNaN(price)) return '';
    return new Intl.NumberFormat(undefined, {
        minimumFractionDigits: 0,
        maximumFractionDigits: 2,
    }).format(price);
};

export const FeaturedProductCard = ({ heroProduct, className }: FeaturedProductCardProps) => {
    if (!heroProduct) return null;

    const imageUrl = heroProduct.imageUrl || heroProduct.images?.[0] || '';
    const displayPrice = heroProduct.salePrice ?? heroProduct.price;

    return (
        <div className={cn("@container w-full", className)}>
            <Link
                href={`/products/${heroProduct.slug}`}
                className="group w-full rounded-card border border-border bg-bg-elevated/70 hover:bg-bg-hover transition-colors overflow-hidden"
            >
                <div className="aspect-[4/3] w-full overflow-hidden">
                    <div
                        className="h-full w-full bg-cover bg-center transition-transform duration-300 group-hover:scale-105"
                        style={{ backgroundImage: imageUrl ? `url(${imageUrl})` : undefined }}
                        role="img"
                        aria-label={heroProduct.name}
                    />
                </div>
                <div className="p-5 flex flex-col gap-2">
                    {heroProduct.badge ? (
                        <span className="inline-flex w-fit rounded-badge bg-accent/10 text-accent text-[10px] font-bold uppercase tracking-[0.2em] px-2 py-1">
                            {heroProduct.badge}
                        </span>
                    ) : null}
                    <div className="flex items-start justify-between gap-4">
                        <div className="min-w-0">
                            <p className="text-base font-semibold text-text-base truncate">{heroProduct.name}</p>
                            <p className="text-xs text-text-muted mt-1">Featured pick</p>
                        </div>
                        <div className="text-right">
                            <p className="text-sm font-semibold text-text-base">{formatPrice(displayPrice)}</p>
                            {heroProduct.compareAtPrice && heroProduct.compareAtPrice > displayPrice ? (
                                <p className="text-xs text-text-muted line-through">{formatPrice(heroProduct.compareAtPrice)}</p>
                            ) : null}
                        </div>
                    </div>
                    <span className="text-xs font-semibold text-primary">Shop now</span>
                </div>
            </Link>
        </div>
    );
};
