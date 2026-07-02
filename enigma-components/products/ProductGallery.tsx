'use client';

import Image from 'next/image';
import { useState } from 'react';
import { cn } from '@/lib/utils/cn';

interface ProductGalleryProps {
    images: string[];
    productName: string;
    className?: string;
}

export function ProductGallery({ images, productName, className }: ProductGalleryProps) {
    const [selectedIndex, setSelectedIndex] = useState(0);
    const [isZooming, setIsZooming] = useState(false);
    const [zoomPosition, setZoomPosition] = useState({ x: 50, y: 50 });

    const displayImages = images.length > 0 ? images : ['/product-placeholder.jpg'];
    const mainImage = displayImages[selectedIndex];

    const handleMouseMove = (event: React.MouseEvent<HTMLDivElement>) => {
        const rect = event.currentTarget.getBoundingClientRect();
        const x = ((event.clientX - rect.left) / rect.width) * 100;
        const y = ((event.clientY - rect.top) / rect.height) * 100;
        setZoomPosition({ x, y });
    };

    return (
        <div className={cn("@container flex flex-col gap-4 @md:flex-row", className)}>
            <div className="order-2 flex gap-4 overflow-x-auto pb-2 @md:order-1 @md:flex-col @md:overflow-y-auto @md:pb-0">
                {displayImages.map((image, index) => (
                    <button
                        key={`thumb-${index}`}
                        type="button"
                        onClick={() => setSelectedIndex(index)}
                        className={cn(
                            "size-20 shrink-0 overflow-hidden rounded-image border-2 bg-bg-surface transition-all @lg:size-24",
                            selectedIndex === index
                                ? "border-primary"
                                : "border-transparent hover:border-primary/30"
                        )}
                        aria-label={`View image ${index + 1}`}
                    >
                        <div className="relative h-full w-full">
                            <Image
                                src={image}
                                alt={`${productName} - view ${index + 1}`}
                                fill
                                sizes="96px"
                                className="object-cover"
                            />
                        </div>
                    </button>
                ))}
            </div>

            <div
                className="order-1 relative aspect-[3/4] flex-1 overflow-hidden rounded-image bg-bg-surface @md:order-2"
                onMouseEnter={() => setIsZooming(true)}
                onMouseLeave={() => setIsZooming(false)}
                onMouseMove={handleMouseMove}
            >
                <div
                    className={cn(
                        "h-full w-full transition-transform duration-700",
                        isZooming ? "scale-150 cursor-zoom-out" : "cursor-zoom-in"
                    )}
                    style={
                        isZooming
                            ? { transformOrigin: `${zoomPosition.x}% ${zoomPosition.y}%` }
                            : undefined
                    }
                >
                    <Image
                        src={mainImage}
                        alt={productName}
                        fill
                        sizes="(max-width: 768px) 100vw, 50vw"
                        className="object-cover"
                        priority
                    />
                </div>
            </div>
        </div>
    );
}

export default ProductGallery;
