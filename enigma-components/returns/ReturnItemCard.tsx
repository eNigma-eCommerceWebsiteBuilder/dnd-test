import Image from 'next/image';
import { cn } from '@/lib/utils/cn';
import type { OrderItem } from '@/lib/api/types/orders';
import type { ReturnItem } from '@/lib/api/types/returns';

interface ReturnItemCardProps {
    returnItem: ReturnItem;
    orderItem?: OrderItem | null;
    className?: string;
}

function formatReasonLabel(reason: string): string {
    return reason
        .replace(/_/g, ' ')
        .replace(/^\w/, (char) => char.toUpperCase());
}

export function ReturnItemCard({ returnItem, orderItem, className }: ReturnItemCardProps) {
    const productName = orderItem?.product?.name ?? `Product ${returnItem.productId}`;
    const variantSize = orderItem?.variant?.size;
    const variantColor = orderItem?.variant?.color?.name;
    const imageUrl =
        orderItem?.product?.imageUrl ||
        orderItem?.product?.images?.[0] ||
        returnItem.images?.[0];

    return (
        <article
            className={cn(
                '@container w-full rounded-card border border-border bg-surface p-4 shadow-card flex flex-col gap-4',
                className
            )}
        >
            <div className="flex flex-col @md:flex-row gap-4">
                <div className="relative w-20 h-24 rounded-image bg-sunken overflow-hidden flex-shrink-0">
                    {imageUrl ? (
                        <Image
                            src={imageUrl}
                            alt={productName}
                            fill
                            sizes="80px"
                            className="object-cover"
                        />
                    ) : (
                        <div className="w-full h-full flex items-center justify-center text-text-muted">
                            <span className="material-symbols-outlined">package</span>
                        </div>
                    )}
                </div>

                <div className="flex-1 flex flex-col gap-2">
                    <div className="flex flex-col gap-1">
                        <h4 className="text-base font-semibold text-text-base">{productName}</h4>
                        <p className="text-sm text-text-muted">Quantity: {returnItem.quantity}</p>
                    </div>

                    {(variantSize || variantColor) && (
                        <div className="flex flex-wrap gap-3 text-sm text-text-muted">
                            {variantSize ? (
                                <span>
                                    Size: <span className="text-text-base font-medium">{variantSize}</span>
                                </span>
                            ) : null}
                            {variantColor ? (
                                <span>
                                    Color: <span className="text-text-base font-medium">{variantColor}</span>
                                </span>
                            ) : null}
                        </div>
                    )}

                    <div className="inline-flex items-center gap-2 rounded-tag border border-border bg-sunken px-3 py-1 text-xs text-text-muted">
                        <span className="material-symbols-outlined text-sm text-accent">error</span>
                        <span className="font-semibold text-text-base">Reason:</span>
                        <span>{formatReasonLabel(returnItem.reason)}</span>
                    </div>

                    {returnItem.reasonDetails ? (
                        <p className="text-xs text-text-muted">{returnItem.reasonDetails}</p>
                    ) : null}
                </div>
            </div>
        </article>
    );
}
