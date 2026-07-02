interface ReturnMethodInfoProps {
    method?: string | null;
    instructions?: string | null;
}

const methodMap: Record<string, { title: string; description: string; icon: string }> = {
    ship_back: {
        title: 'Ship Back',
        description: 'Use the provided label to ship the items back.',
        icon: 'local_shipping',
    },
    store_dropoff: {
        title: 'Store Drop-Off',
        description: 'Bring the items to the nearest store for processing.',
        icon: 'store',
    },
};

function formatMethodLabel(method: string): string {
    return method
        .replace(/_/g, ' ')
        .replace(/^\w/, (char) => char.toUpperCase());
}

export function ReturnMethodInfo({ method, instructions }: ReturnMethodInfoProps) {
    if (!method) return null;

    const display = methodMap[method] ?? {
        title: formatMethodLabel(method),
        description: '',
        icon: 'assignment_return',
    };

    return (
        <section className="@container w-full rounded-card border border-border bg-surface p-4 flex flex-col gap-3">
            <div className="flex items-center gap-2 text-text-base">
                <span className="material-symbols-outlined">{display.icon}</span>
                <h3 className="text-sm font-semibold">Return Method</h3>
            </div>
            <div className="flex flex-col gap-1 text-sm text-text-muted">
                <span className="text-text-base font-medium">{display.title}</span>
                {display.description ? <span>{display.description}</span> : null}
                {instructions ? <span>{instructions}</span> : null}
            </div>
        </section>
    );
}
