interface SectionHeaderWithDividerViewProps {
  title: string;
}

export const puckComponentName = 'SectionHeaderWithDivider';
export const puckLabel = 'Section Header With Divider';
export const puckCategory = 'Layout';

export const puckFields = {
  title: { type: 'text' as const, label: 'Title' },
};

export const puckDefaults = {
  title: 'Section',
};

export const puckAst = {
  kind: 'static',
  topLevel: true,
  matches: [
    { tag: 'div', classIncludes: ['bg-divider'], component: 'SectionHeaderWithDivider' },
  ],
};

export function SectionHeaderWithDividerView({ title }: SectionHeaderWithDividerViewProps) {
  return (
    <div className="@container mb-8 flex items-center gap-4">
      <h2 className="text-2xl font-bold tracking-tight text-text-base">{title}</h2>
      <div className="h-[2px] flex-1 bg-divider" />
    </div>
  );
}
