import type { CSSProperties } from 'react';
import Link from 'next/link';
import { ProductHotspot } from '@/components/collections/ProductHotspot';
import { InspirationCollection } from '@/lib/api/types';
import { InspirationContent } from '@/lib/content';
import { cn } from '@/lib/utils/cn';
import { formatPrice } from '@/lib/utils/formatters';

interface InspirationSectionProps {
    className?: string;
    collection: InspirationCollection | null;
    content: InspirationContent;
}

export const InspirationSection = ({
    className,
    collection,
    content
}: InspirationSectionProps) => {
    if (!collection) return null;

    const backgroundImage = collection.mainImage?.imageUrl || content.image || '/placeholder-inspiration.jpg';
    const description = collection.description || content.description;
    const title = collection.title || content.header;
    const productHotspots = content.hotspots.slice(0, collection.products.length).map((placement, index) => {
        const product = collection.products[index];

        if (!product) {
            return null;
        }

        const placementStyle = placement as Partial<Record<'top' | 'right' | 'bottom' | 'left', string>>;
        const style: CSSProperties = {};

        if (placementStyle.top) style.top = placementStyle.top;
        if (placementStyle.right) style.right = placementStyle.right;
        if (placementStyle.bottom) style.bottom = placementStyle.bottom;
        if (placementStyle.left) style.left = placementStyle.left;

        return {
            id: product._id,
            href: `/products/${product.slug}`,
            label: product.name,
            price: formatPrice(product.price),
            style
        };
    }).filter((hotspot): hotspot is {
        id: string;
        href: string;
        label: string;
        price: string;
        style: CSSProperties;
    } => hotspot !== null);

    return (
        <section className={cn("@container", className)}>
            <div className="relative flex min-h-[36rem] items-center overflow-hidden rounded-card bg-bg-surface shadow-card @lg:min-h-[40rem]">
                <div
                    className="absolute inset-0 bg-cover bg-center opacity-90"
                    style={{ backgroundImage: `url("${backgroundImage}")` }}
                    role="img"
                    aria-label={collection.mainImage?.alt || content.alt}
                />
                <div className="absolute inset-0 bg-gradient-to-r from-bg-overlay via-bg-overlay/70 to-transparent" />

                <div className="relative z-10 ml-auto mr-4 w-full max-w-xl rounded-card border border-border bg-bg-surface/92 p-6 shadow-card backdrop-blur-overlay @md:mr-6 @md:p-8 @lg:mr-12 @lg:p-10">
                    <span className="mb-4 block text-xs font-semibold uppercase tracking-[0.24em] text-primary">
                        {content.subheader}
                    </span>
                    <h2 className="mb-5 text-3xl font-extrabold tracking-tight text-text-base @lg:text-4xl">
                        {title}
                    </h2>
                    <p className="mb-8 text-base leading-relaxed text-text-muted @md:text-lg">
                        {description}
                    </p>
                    <Link
                        href={collection.mainImage?.ctaLink || '/collections/all'}
                        className="inline-flex w-full items-center justify-center rounded-button bg-cta-primary px-6 py-3 text-sm font-semibold text-on-primary shadow-button transition-all duration-normal hover:-translate-y-0.5 hover:bg-cta-primary-hover hover:shadow-button-hover"
                    >
                        {content.ctaText}
                    </Link>
                </div>

                {productHotspots.map((hotspot) => (
                    <div
                        key={hotspot.id}
                        className="absolute z-10"
                        style={hotspot.style}
                    >
                        <ProductHotspot
                            href={hotspot.href}
                            label={hotspot.label}
                            price={hotspot.price}
                        />
                    </div>
                ))}
            </div>
        </section>
    );
};
