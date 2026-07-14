import { cn } from '@/lib/utils/cn';
import { formatPrice } from '@/lib/utils/formatters';

interface OrderItem {
  productName: string;
  variantName: string;
  quantity: number;
  price: number;
  image: string;
}

interface OrderItemListViewProps {
  items: OrderItem[];
  className?: string;
}

export const puckComponentName = 'OrderItemList';
export const puckLabel = 'Order Item List';
export const puckCategory = 'Checkout';

export const puckFields = {
  items: {
    type: 'array' as const,
    label: 'Items',
    arrayFields: {
      productName: { type: 'text' as const, label: 'Product Name' },
      variantName: { type: 'text' as const, label: 'Variant Name' },
      quantity: { type: 'number' as const, label: 'Quantity' },
      price: { type: 'number' as const, label: 'Price' },
      image: { type: 'text' as const, label: 'Image URL' },
    },
    defaultItemProps: {
      productName: 'Product',
      variantName: '',
      quantity: 1,
      price: 0,
      image: '',
    },
    getItemSummary: (item: OrderItem) => `${item.productName} x${item.quantity}`,
  },
};

export const puckDefaults = {
  items: [
    { productName: 'Premium Wool Coat', variantName: 'Size M', quantity: 1, price: 450, image: 'https://images.unsplash.com/photo-1539533018447-63fcce2678e3?w=200&q=80' },
    { productName: 'Silk Blend Shirt', variantName: 'Size S', quantity: 2, price: 180, image: 'https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?w=200&q=80' },
  ],
};


export function OrderItemListView({ items, className }: OrderItemListViewProps) {
  return (
    <div className={cn('@container bg-bg-surface rounded-card shadow-card overflow-hidden divide-y divide-divider', className)}>
      {items.map((item, index) => (
        <div key={index} className="flex items-center gap-4 p-4 @md:gap-6 @md:p-6">
          <div
            className="h-16 w-16 flex-shrink-0 rounded-image bg-bg-skeleton bg-cover bg-center bg-no-repeat aspect-square @md:h-20 @md:w-20"
            style={{
              backgroundImage: item.image ? `url("${item.image}")` : undefined,
            }}
            aria-label={item.productName}
          />
          <div className="flex flex-1 justify-between items-start">
            <div>
              <h3 className="text-base font-semibold text-text-base @md:text-lg">
                {item.productName}
              </h3>
              {item.variantName && (
                <p className="text-xs text-text-muted @md:text-sm">
                  {item.variantName}
                </p>
              )}
              <p className="mt-1 text-xs text-text-muted @md:text-sm">
                Qty: {item.quantity}
              </p>
            </div>
            <p className="text-base font-medium text-text-base @md:text-lg">
              {formatPrice(item.price * item.quantity)}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
}
