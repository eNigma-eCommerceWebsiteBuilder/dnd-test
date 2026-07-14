interface FeatureItem {
  icon: string;
  label: string;
}

interface FeatureIconListViewProps {
  columns?: number;
  items: FeatureItem[];
}

export const puckComponentName = 'FeatureIconList';
export const puckLabel = 'Feature Icon List';
export const puckCategory = 'Layout';

export const puckFields = {
  columns: { type: 'number' as const, label: 'Columns' },
  items: {
    type: 'array' as const,
    label: 'Features',
    arrayFields: {
      icon: { type: 'text' as const, label: 'Icon' },
      label: { type: 'text' as const, label: 'Label' },
    },
    defaultItemProps: { icon: 'check_circle', label: 'Feature' },
    getItemSummary: (item: FeatureItem) => item.label,
  },
};

export const puckDefaults = {
  columns: 2,
  items: [
    { icon: 'local_shipping', label: 'Free Global Shipping' },
    { icon: 'assignment_return', label: '30-Day Easy Returns' },
  ],
};

export const puckAst = {
  kind: 'static',
  topLevel: true,
  matches: [
    { tag: 'div', classIncludes: ['grid', 'grid-cols-2'], textIncludes: ['Free Global Shipping', '30-Day Easy Returns'], component: 'FeatureIconList' },
  ],
};

export function FeatureIconListView({ columns = 2, items }: FeatureIconListViewProps) {
  const gridClass = Number(columns) === 1 ? 'grid-cols-1' : 'grid-cols-2';

  return (
    <div className={`@container grid ${gridClass} gap-4`}>
      {(items || []).map((item, index) => (
        <div key={index} className="flex items-center gap-3 text-xs font-semibold text-text-muted">
          <span className="material-symbols-outlined text-primary">{item.icon}</span>
          {item.label}
        </div>
      ))}
    </div>
  );
}
