import { cn } from '@/lib/utils/cn';

interface SharedWishlistViewProps {
  title?: string;
  subtitle?: string;
  ownerName?: string;
  itemCount?: number;
  totalValue?: number;
  className?: string;
}

export const puckComponentName = 'SharedWishlist';
export const puckLabel = 'Shared Wishlist';
export const puckCategory = 'Account';

export const puckFields = {
  title: { type: 'text' as const, label: 'Title' },
  subtitle: { type: 'textarea' as const, label: 'Subtitle' },
  ownerName: { type: 'text' as const, label: 'Owner Name' },
  itemCount: { type: 'number' as const, label: 'Item Count' },
  totalValue: { type: 'number' as const, label: 'Total Value' },
};

export const puckDefaults = {
  title: 'Shared Wishlist',
  subtitle: 'Check out these items curated by a friend.',
  ownerName: 'Jane Doe',
  itemCount: 8,
  totalValue: 3200,
};

export function SharedWishlistView({ title = '', subtitle = '', ownerName = '', itemCount = 0, totalValue = 0, className }: SharedWishlistViewProps) {
  return (
    <div className={cn('@container', className)}>
      <div className="bg-bg-surface rounded-card border border-border p-6 @md:p-8 shadow-card">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
            <span className="material-symbols-outlined text-primary">favorite</span>
          </div>
          <div>
            <h1 className="text-2xl @md:text-3xl font-bold text-text-base">{title}</h1>
            <p className="text-sm text-text-muted">{subtitle}</p>
          </div>
        </div>
        <div className="mt-6 grid grid-cols-2 gap-4">
          <div className="rounded-card border border-border p-4">
            <p className="text-xs font-semibold uppercase tracking-wider text-text-muted">Curated by</p>
            <p className="mt-1 text-base font-semibold text-text-base">{ownerName}</p>
          </div>
          <div className="rounded-card border border-border p-4">
            <p className="text-xs font-semibold uppercase tracking-wider text-text-muted">Items</p>
            <p className="mt-1 text-base font-semibold text-text-base">{itemCount} products</p>
          </div>
        </div>
        <div className="mt-4 rounded-card border border-border p-4 bg-bg-base/50">
          <div className="flex justify-between items-center">
            <p className="text-sm text-text-muted">Total wishlist value</p>
            <p className="text-lg font-bold text-primary">${totalValue.toFixed(2)}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
