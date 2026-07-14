'use client';

import Image from 'next/image';
import type { SubscriptionLine } from '@/lib/api/types/subscriptions';
import { formatPrice } from '@/lib/utils/formatters';
import { DraftQuantityInput } from '@/components/subscriptions/DraftQuantityInput';
import { DraftRemoveButton } from '@/components/subscriptions/DraftRemoveButton';

const fallbackImage = '/product-placeholder.jpg';

type DraftLineItemProps = {
  line: SubscriptionLine;
  draftId?: string;
  onUpdateQuantity: (lineId: string, quantity: number) => void;
  onRemove: (lineId: string) => void;
};

export function DraftLineItem({ line, draftId, onUpdateQuantity, onRemove }: DraftLineItemProps) {
  const title = getLineTitle(line);
  const imageUrl = getLineImage(line);
  const lineTotal = formatPrice(line.price * line.quantity);

  return (
    <div className="@container space-y-3 rounded-card border border-border bg-bg-elevated p-4">
      <div className="@container flex flex-wrap items-center gap-4">
        <div className="relative h-20 w-20 rounded-image overflow-hidden border border-border bg-bg-sunken flex-shrink-0">
          <Image
            src={imageUrl}
            alt={title}
            fill
            className="object-cover"
            sizes="80px"
          />
        </div>
        <div className="flex-1 min-w-[180px]">
          <p className="text-sm font-semibold text-text-base">{title}</p>
          {line.variant?.name ? (
            <p className="text-xs text-text-muted">{line.variant.name}</p>
          ) : null}
          <p className="text-xs text-text-muted">Quantity: {line.quantity}</p>
        </div>
        <p className="text-sm font-semibold text-text-base">{lineTotal}</p>
      </div>
      <div className="flex flex-wrap items-center gap-3">
        <DraftQuantityInput
          quantity={line.quantity}
          disabled={!draftId}
          onUpdate={(nextQuantity) => onUpdateQuantity(line._id, nextQuantity)}
        />
        <DraftRemoveButton
          disabled={!draftId}
          onRemove={() => onRemove(line._id)}
        />
      </div>
    </div>
  );
}

function getLineTitle(line: SubscriptionLine): string {
  if (line.productId && typeof line.productId === 'object' && 'name' in line.productId) {
    const name = line.productId.name;
    if (typeof name === 'string' && name.length > 0) return name;
  }

  if (line.variant && line.variant.name) {
    return line.variant.name;
  }

  return 'Subscription item';
}

function getLineImage(line: SubscriptionLine): string {
  if (line.productId && typeof line.productId === 'object' && 'images' in line.productId) {
    const images = line.productId.images;
    if (Array.isArray(images) && images.length > 0) return images[0];
  }

  return fallbackImage;
}
