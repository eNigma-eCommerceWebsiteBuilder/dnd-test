import { formatPrice } from '@/lib/utils/formatters';

export function SharedWishlistSavingsCard({
  potentialValue,
  totalSavings,
}: {
  potentialValue: number;
  totalSavings: number;
}) {
  return (
    <div className="mb-8 rounded-card border border-border bg-bg-surface p-4">
      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div>
          <p className="text-sm text-text-muted">Total value</p>
          <p className="text-lg font-semibold text-text-base">
            {formatPrice(potentialValue)}
          </p>
        </div>
        <div>
          <p className="text-sm text-text-muted">Potential savings</p>
          <p className="text-lg font-semibold text-price-sale">
            {formatPrice(totalSavings)}
          </p>
        </div>
      </div>
    </div>
  );
}
