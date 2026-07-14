import { cn } from '@/lib/utils/cn';

interface AddressItem {
  label: string;
  name: string;
  street: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
  phone?: string;
  isDefault?: string;
}

interface AddressListViewProps {
  addresses: AddressItem[];
  className?: string;
}

export const puckComponentName = 'AddressList';
export const puckLabel = 'Address List';
export const puckCategory = 'Account';

export const puckFields = {
  addresses: {
    type: 'array' as const,
    label: 'Addresses',
    arrayFields: {
      label: { type: 'text' as const, label: 'Label (Home, Work, etc.)' },
      name: { type: 'text' as const, label: 'Full Name' },
      street: { type: 'text' as const, label: 'Street Address' },
      city: { type: 'text' as const, label: 'City' },
      state: { type: 'text' as const, label: 'State' },
      zipCode: { type: 'text' as const, label: 'ZIP Code' },
      country: { type: 'text' as const, label: 'Country' },
      phone: { type: 'text' as const, label: 'Phone (optional)' },
      isDefault: {
        type: 'select' as const,
        label: 'Default Address',
        options: [
          { label: 'No', value: 'false' },
          { label: 'Yes', value: 'true' },
        ],
      },
    },
    defaultItemProps: {
      label: 'Home',
      name: 'John Doe',
      street: '123 Main Street',
      city: 'New York',
      state: 'NY',
      zipCode: '10001',
      country: 'United States',
      phone: '',
      isDefault: 'false',
    },
    getItemSummary: (item: AddressItem) => `${item.label} — ${item.name}`,
    max: 10,
  },
};

export const puckDefaults = {
  addresses: [
    {
      label: 'Home',
      name: 'John Doe',
      street: '123 Main Street, Apt 4B',
      city: 'New York',
      state: 'NY',
      zipCode: '10001',
      country: 'United States',
      phone: '+1 (555) 123-4567',
      isDefault: 'true',
    },
    {
      label: 'Work',
      name: 'John Doe',
      street: '456 Business Ave, Suite 200',
      city: 'San Francisco',
      state: 'CA',
      zipCode: '94107',
      country: 'United States',
      phone: '+1 (555) 987-6543',
      isDefault: 'false',
    },
  ],
};

export function AddressListView({ addresses, className }: AddressListViewProps) {
  if (!addresses || addresses.length === 0) return null;

  return (
    <div className={cn('@container grid grid-cols-1 gap-4 @md:grid-cols-2', className)}>
      {addresses.map((addr, index) => (
        <div
          key={index}
          className={cn(
            'rounded-card border p-5 transition-all',
            addr.isDefault === 'true' ? 'border-primary bg-primary/5' : 'border-border bg-bg-surface',
          )}
        >
          <div className="mb-3 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-primary">
                {addr.label === 'Home' ? 'home' : addr.label === 'Work' ? 'work' : 'location_on'}
              </span>
              <p className="text-sm font-bold text-text-base">{addr.label}</p>
            </div>
            {addr.isDefault === 'true' && (
              <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-primary/10 text-primary">
                Default
              </span>
            )}
          </div>
          <div className="text-sm text-text-muted leading-relaxed space-y-1">
            <p className="text-text-base font-medium">{addr.name}</p>
            <p>{addr.street}</p>
            <p>{addr.city}{addr.city && addr.state ? ', ' : ''}{addr.state} {addr.zipCode}</p>
            <p>{addr.country}</p>
            {addr.phone && <p>{addr.phone}</p>}
          </div>
        </div>
      ))}
    </div>
  );
}
