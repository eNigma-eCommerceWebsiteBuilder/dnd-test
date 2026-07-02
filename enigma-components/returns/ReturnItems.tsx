import Image from 'next/image';
import { cn } from '@/lib/utils/cn';

export interface ReturnItemSummary {
    id?: string;
    name: string;
    quantity: number;
    imageUrl?: string;
}

interface ReturnItemsProps {
    items: ReturnItemSummary[];
    className?: string;
}

export function ReturnItems({ items, className }: ReturnItemsProps) {
    if (items.length === 0) return null;

    return (
        <div className={cn('@container w-full flex flex-col gap-3', className)}>
            <p className="text-sm font-semibold text-text-base">Items</p>
            <div className="grid grid-cols-1 @md:grid-cols-2 gap-3">
                {items.map((item) => (
                    <div
                        key={item.id || `${item.name}-${item.quantity}`}
                        className="flex items-center gap-3 rounded-card border border-border bg-surface p-3"
                    >
                        <div className="relative w-12 h-12 rounded-image bg-sunken overflow-hidden flex-shrink-0">
                            {item.imageUrl ? (
                                <Image
                                    src={item.imageUrl}
                                    alt={item.name}
                                    fill
                                    className="object-cover"
                                    sizes="48px"
                                />
                            ) : (
                                <div className="w-full h-full flex items-center justify-center text-text-muted">
                                    <span className="material-symbols-outlined text-lg">package</span>
                                </div>
                            )}
                        </div>
                        <div className="flex flex-col">
                            <p className="text-sm font-medium text-text-base">{item.name}</p>
                            <p className="text-xs text-text-muted">Qty {item.quantity}</p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
