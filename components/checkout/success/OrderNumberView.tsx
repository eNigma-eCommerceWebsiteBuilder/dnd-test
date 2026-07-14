import { cn } from '@/lib/utils/cn';

interface OrderNumberViewProps {
  orderNumber: string;
  className?: string;
}

export const puckComponentName = 'OrderNumber';
export const puckLabel = 'Order Number';
export const puckCategory = 'Checkout';

export const puckFields = {
  orderNumber: { type: 'text' as const, label: 'Order Number' },
};

export const puckDefaults = {
  orderNumber: 'ORD-001234',
};


export function OrderNumberView({ orderNumber, className }: OrderNumberViewProps) {
  return (
    <div className={cn('@container', className)}>
      <p className="text-sm font-medium tracking-wide text-primary @md:text-base">
        CONFIRMATION #{orderNumber}
      </p>
    </div>
  );
}
