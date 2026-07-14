import type { CSSProperties } from 'react';
import { InspirationCollection } from '@/lib/api/types';
import { InspirationContent } from '@/lib/content';
import { InspirationSectionView } from './InspirationSectionView';

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

    const productHotspots = content.hotspots.slice(0, collection.products.length).map((placement, index) => {
        const product = collection.products[index];

        if (!product) {
            return null;
        }

        const placementStyle = placement as Partial<Record<'top' | 'right' | 'bottom' | 'left', string>>;

        return {
            label: product.name,
            price: product.price,
            slug: product.slug,
            top: placementStyle.top || '',
            right: placementStyle.right || '',
            bottom: placementStyle.bottom || '',
            left: placementStyle.left || '',
        };
    }).filter((h): h is NonNullable<typeof h> => h !== null);

    return (
        <InspirationSectionView
            subheader={content.subheader}
            header={content.header}
            title={collection.title || ''}
            description={collection.description || content.description}
            ctaText={content.ctaText}
            ctaLink={collection.mainImage?.ctaLink || '/collections/all'}
            backgroundImage={collection.mainImage?.imageUrl || content.image || '/placeholder-inspiration.jpg'}
            imageAlt={collection.mainImage?.alt || content.alt}
            hotspots={productHotspots}
            className={className}
        />
    );
};
