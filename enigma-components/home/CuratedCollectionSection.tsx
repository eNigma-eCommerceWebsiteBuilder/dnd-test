import Link from 'next/link';
import Image from 'next/image';
import { cn } from '@/lib/utils/cn';
import { ProductCard } from '@/components/ui/ProductCard';
import { CuratedCollection } from '@/lib/api/types';
import { CuratedCollectionContent } from '@/lib/content';

interface CuratedCollectionSectionProps {
    className?: string;
    collection: CuratedCollection | null;
    content: CuratedCollectionContent;
}

export const CuratedCollectionSection = ({
    className,
    collection,
    content
}: CuratedCollectionSectionProps) => {
    if (!collection) return null;

    return (
        <section className={cn("@container flex flex-col gap-8", className)}>
            <div className="flex flex-col items-center gap-8 overflow-hidden rounded-card border border-border bg-bg-surface p-6 shadow-card @lg:flex-row @lg:p-10">
                <div className="flex-1 space-y-5">
                    <span className="block text-xs font-semibold uppercase tracking-[0.24em] text-primary">
                        {content.eyebrow}
                    </span>
                    <h2 className="text-3xl font-black tracking-tight text-text-base @md:text-4xl">
                        {collection.name}
                    </h2>
                    <p className="text-base leading-relaxed text-text-muted @md:text-lg">
                        {collection.description}
                    </p>
                    <Link
                        href={`/collections/${collection.slug}`}
                        className="inline-flex items-center justify-center rounded-button bg-cta-primary px-6 py-3 text-sm font-semibold text-on-primary shadow-button transition-all duration-normal hover:-translate-y-0.5 hover:bg-cta-primary-hover hover:shadow-button-hover"
                    >
                        {content.ctaText}
                    </Link>
                </div>

                {collection.mainProduct && (
                    <div className="relative aspect-square w-full max-w-xl flex-1 overflow-hidden rounded-image border border-border bg-bg-sunken">
                        <Image
                            src={collection.mainProduct.images?.[0] || '/placeholder.jpg'}
                            alt={collection.mainProduct.name}
                            fill
                            sizes="(max-width: 768px) 100vw, 50vw"
                            className="object-cover"
                        />
                    </div>
                )}
            </div>

            {collection.relatedProducts && collection.relatedProducts.length > 0 && (
                <div className="grid grid-cols-2 @md:grid-cols-4 gap-6">
                    {collection.relatedProducts.slice(0, 4).map(product => (
                        <ProductCard
                            key={product._id}
                            product={product}
                            showWishlist={false}
                            showQuickAdd={true}
                        />
                    ))}
                </div>
            )}
        </section>
    );
};
