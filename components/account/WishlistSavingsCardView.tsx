import { cn } from '@/lib/utils/cn';

interface WishlistSavingsCardViewProps {
  itemCount?: number;
  totalValue?: number;
  totalSavings?: number;
  className?: string;
}

export const puckComponentName = 'WishlistSavingsCard';
export const puckLabel = 'Wishlist Savings Card';
export const puckCategory = 'Account';

export const puckFields = {
  itemCount: { type: 'number' as const, label: 'Item Count' },
  totalValue: { type: 'number' as const, label: 'Total Value' },
  totalSavings: { type: 'number' as const, label: 'Total Savings' },
};

export const puckDefaults = {
  itemCount: 5,
  totalValue: 2480,
  totalSavings: 320,
};

export function WishlistSavingsCardView({ itemCount = 0, totalValue = 0, totalSavings = 0, className }: WishlistSavingsCardViewProps) {
  return (
    <div className={cn('@container bg-bg-surface rounded-card p-6 shadow-card border border-border', className)}>
      <div className="flex items-center gap-2 mb-4">
        <span className="material-symbols-outlined text-primary">savings</span>
        <h3 className="text-base font-bold text-text-base">Wishlist Summary</h3>
      </div>
      <div className="space-y-3">
        <div className="flex justify-between text-sm">
          <span className="text-text-muted">Items saved</span>
          <span className="font-medium text-text-base">{itemCount}</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-text-muted">Total value</span>
          <span className="font-medium text-text-base">${totalValue.toFixed(2)}</span>
        </div>
        {totalSavings > 0 && (
          <div className="flex justify-between text-sm">
            <span className="text-success">Potential savings</span>
            <span className="font-medium text-success">-${totalSavings.toFixed(2)}</span>
          </div>
        )}
      </div>
    </div>
  );
}
