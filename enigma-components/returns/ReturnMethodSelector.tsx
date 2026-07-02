'use client';

interface ReturnMethodSelectorProps {
    value: 'ship_back' | 'store_dropoff' | '';
    onChange: (nextValue: 'ship_back' | 'store_dropoff') => void;
}

const METHODS: Array<{ value: 'ship_back' | 'store_dropoff'; title: string; description: string }> = [
    {
        value: 'ship_back',
        title: 'Ship back',
        description: 'Use the provided label to send your items back.',
    },
    {
        value: 'store_dropoff',
        title: 'Store drop-off',
        description: 'Bring your items to the nearest store for processing.',
    },
];

export function ReturnMethodSelector({ value, onChange }: ReturnMethodSelectorProps) {
    return (
        <section className="@container w-full rounded-card border border-border bg-surface p-4 shadow-card flex flex-col gap-3">
            <h3 className="text-sm font-semibold text-text-base">Return method</h3>
            <div className="flex flex-col gap-3">
                {METHODS.map((method) => (
                    <label
                        key={method.value}
                        className="flex items-start gap-3 rounded-card border border-border bg-sunken p-3 text-sm"
                    >
                        <input
                            type="radio"
                            name="return-method"
                            className="mt-1 size-4 text-primary"
                            checked={value === method.value}
                            onChange={() => onChange(method.value)}
                        />
                        <span className="flex flex-col gap-1">
                            <span className="font-semibold text-text-base">{method.title}</span>
                            <span className="text-xs text-text-muted">{method.description}</span>
                        </span>
                    </label>
                ))}
            </div>
        </section>
    );
}
