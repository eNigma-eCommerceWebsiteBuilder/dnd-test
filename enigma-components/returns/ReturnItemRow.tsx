'use client';

import Image from 'next/image';
import type { OrderItem } from '@/lib/api/types/orders';
import { formatPrice } from '@/lib/utils/formatters';
import { QuantitySelector } from '@/enigma-components/returns/QuantitySelector';

interface ReturnItemRowProps {
    item: OrderItem;
    selected: boolean;
    quantity: number;
    onSelectChange: (selected: boolean) => void;
    onQuantityChange: (nextQuantity: number) => void;
}

function getVariantLabel(item: OrderItem): string | null {
    const variant = item.variant;
    if (variant?.name) return variant.name;

    const color = variant?.color?.name;
    const size = variant?.size;
    const attributes = variant?.attributes
        ? Object.values(variant.attributes).filter(Boolean).join(' / ')
        : '';

    if (color && size) return `${size} / ${color}`;
    if (size) return size;
    if (color) return color;
    if (attributes) return attributes;

    return null;
}

function getItemImage(item: OrderItem): { url: string | null; alt: string } {
    const product = item.product;
    const url = product.imageUrl || product.images?.[0] || null;
    return { url, alt: product.name };
}

export function ReturnItemRow({
    item,
    selected,
    quantity,
    onSelectChange,
    onQuantityChange,
}: ReturnItemRowProps) {
    const variantLabel = getVariantLabel(item);
    const image = getItemImage(item);
    const maxQuantity = item.quantity;

    return (
        <div className="@container w-full flex flex-col gap-4 rounded-card border border-border bg-surface p-4 shadow-card @md:flex-row @md:items-center">
            <label className="flex items-start gap-4">
                <input
                    type="checkbox"
                    className="mt-1 size-5 rounded border-border text-primary focus:ring-primary"
                    checked={selected}
                    onChange={(event) => onSelectChange(event.target.checked)}
                />
                <div className="flex items-start gap-4">
                    <div className="h-20 w-16 overflow-hidden rounded-image bg-sunken">
                        {image.url ? (
                            <Image
                                src={image.url}
                                alt={image.alt}
                                width={64}
                                height={80}
                                className="h-full w-full object-cover"
                            />
                        ) : (
                            <div className="h-full w-full bg-sunken" />
                        )}
                    </div>
                    <div className="flex flex-col gap-1">
                        <p className="text-sm font-semibold text-text-base">{item.product.name}</p>
                        {variantLabel ? (
                            <p className="text-xs text-text-muted">{variantLabel}</p>
                        ) : null}
                        <p className="text-xs text-text-muted">
                            Ordered quantity: {item.quantity}
                        </p>
                    </div>
                </div>
            </label>

            <div className="flex flex-1 flex-col gap-3 @md:items-end">
                <span className="text-sm font-semibold text-text-base">
                    {formatPrice(item.price)}
                </span>
                <div className="flex flex-col gap-2">
                    <span className="text-xs font-semibold uppercase tracking-wide text-text-muted">
                        Qty to return
                    </span>
                    <QuantitySelector
                        quantity={quantity}
                        min={1}
                        max={maxQuantity}
                        onChange={onQuantityChange}
                        disabled={!selected}
                    />
                </div>
            </div>
        </div>
    );
}
