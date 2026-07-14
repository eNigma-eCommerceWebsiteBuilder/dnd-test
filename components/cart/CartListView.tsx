import { cn } from '@/lib/utils/cn';
import { getCart } from '@/lib/api/services/cart';
import type { PuckFetcherContext } from '@/lib/puck-route-metadata';

interface CartItemViewProps {
  productName: string;
  productId: string;
  image: string;
  price: number;
  quantity: number;
  variantSize?: string;
  variantColor?: string;
  isLowStock?: string;
}

interface CartListViewProps {
  items: CartItemViewProps[];
  className?: string;
}

export const puckComponentName = 'CartList';
export const puckLabel = 'Cart Item List';
export const puckCategory = 'Cart';

export const puckFields = {
  items: {
    type: 'array' as const,
    label: 'Cart Items',
    arrayFields: {
      productName: { type: 'text' as const, label: 'Product Name' },
      productId: { type: 'text' as const, label: 'Product ID' },
      image: { type: 'text' as const, label: 'Image URL' },
      price: { type: 'number' as const, label: 'Price' },
      quantity: { type: 'number' as const, label: 'Quantity' },
      variantSize: { type: 'text' as const, label: 'Variant Size (optional)' },
      variantColor: { type: 'text' as const, label: 'Variant Color (optional)' },
      isLowStock: {
        type: 'select' as const,
        label: 'Low Stock Badge',
        options: [
          { label: 'No', value: 'false' },
          { label: 'Yes', value: 'true' },
        ],
      },
    },
    defaultItemProps: {
      productName: 'New Product',
      productId: 'product-1',
      image: 'https://images.unsplash.com/photo-1551488831-00ddcb6c6bd3?w=400&q=80',
      price: 0,
      quantity: 1,
      variantSize: '',
      variantColor: '',
      isLowStock: 'false',
    },
    getItemSummary: (item: CartItemViewProps) => `${item.productName} x${item.quantity}`,
    max: 50,
  },
};

export const puckDefaults = {
  items: [
    {
      productName: 'Premium Wool Coat',
      productId: 'product-1',
      image: 'https://images.unsplash.com/photo-1551488831-00ddcb6c6bd3?w=400&q=80',
      price: 1290,
      quantity: 1,
      variantSize: 'L',
      variantColor: 'Camel',
      isLowStock: 'false',
    },
    {
      productName: 'Cashmere Sweater',
      productId: 'product-2',
      image: 'https://images.unsplash.com/photo-1576566588028-4147f3842f27?w=400&q=80',
      price: 320,
      quantity: 2,
      variantSize: 'M',
      variantColor: 'Charcoal',
      isLowStock: 'true',
    },
  ],
};

export async function puckDataFetcher(
  _props: CartListViewProps,
  context?: PuckFetcherContext,
) {
  const cart = await getCart({ cookies: context?.metadata?.requestCookies });
  return {
    items: (cart.items || []).map((item) => {
      const product = item.product;
      const variantParts: string[] = [];
      if (item.variant?.size) variantParts.push(item.variant.size);
      if (item.variant?.color?.name) variantParts.push(item.variant.color.name);
      return {
        productName: product?.name || 'Product',
        productId: item.productId,
        image: product?.images?.[0] || product?.imageUrl || item.productSnapshot?.image || '',
        price: item.price,
        quantity: item.quantity,
        variantSize: item.variant?.size || '',
        variantColor: item.variant?.color?.name || '',
        isLowStock: (product?.stock ?? 999) <= 5 && (product?.stock ?? 999) > 0 ? 'true' : 'false',
      };
    }),
  };
}

export function CartListView({ items, className }: CartListViewProps) {
  if (!items || items.length === 0) return null;

  return (
    <div className={cn('@container w-full', className)}>
      <div className="flex flex-col border-t border-border">
        {items.map((item, index) => {
          const itemTotal = item.price * item.quantity;
          const variantParts: string[] = [];
          if (item.variantSize) variantParts.push(`Size: ${item.variantSize}`);
          if (item.variantColor) variantParts.push(`Color: ${item.variantColor}`);
          const variantDescription = variantParts.join(' • ');

          return (
            <div key={index} className="@container">
              <div className="flex flex-col @sm:flex-row items-start gap-4 @sm:gap-6 py-6 @sm:py-8 border-b border-divider">
                <div className="w-full @sm:w-28 @md:w-32 h-32 @sm:h-36 @md:h-40 relative rounded-image overflow-hidden shrink-0 bg-bg-sunken">
                  {item.image ? (
                    <div
                      className="absolute inset-0 bg-cover bg-center"
                      style={{ backgroundImage: `url('${item.image}')` }}
                      role="img"
                      aria-label={item.productName}
                    />
                  ) : null}
                </div>
                <div className="flex-1 flex flex-col justify-between min-h-[100px] @sm:h-36 @md:h-40 py-1 w-full">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="text-base @sm:text-lg font-semibold text-text-base mb-1">
                        {item.productName}
                      </h3>
                      {variantDescription ? (
                        <p className="text-xs @sm:text-sm text-text-muted">
                          {variantDescription}
                        </p>
                      ) : null}
                      {item.isLowStock === 'true' ? (
                        <div className="mt-2 inline-flex px-2 py-1 bg-stock-low/10 text-stock-low text-[10px] font-bold uppercase tracking-wider rounded-badge">
                          Low Stock
                        </div>
                      ) : null}
                    </div>
                    <p className="text-base @sm:text-lg font-bold text-price">
                      ${itemTotal.toFixed(2)}
                    </p>
                  </div>
                  <div className="flex justify-between items-center mt-3 @sm:mt-0">
                    <div className="flex items-center rounded-button border border-border bg-bg-sunken">
                      <button
                        type="button"
                        className="px-3 py-3 text-text-muted hover:text-text-base transition-colors"
                      >
                        <span className="material-symbols-outlined text-sm">remove</span>
                      </button>
                      <span className="min-w-[2rem] text-center text-sm font-semibold">
                        {item.quantity}
                      </span>
                      <button
                        type="button"
                        className="px-3 py-3 text-text-muted hover:text-text-base transition-colors"
                      >
                        <span className="material-symbols-outlined text-sm">add</span>
                      </button>
                    </div>
                    <button
                      type="button"
                      className="text-text-muted hover:text-text-base transition-colors"
                      aria-label="Remove item"
                    >
                      <span className="material-symbols-outlined text-lg">delete</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
