import type { ReactNode } from 'react';

interface TwoColumnDetailViewProps {
  mainSpan?: number;
  sidebarSpan?: number;
  gap?: string;
  main?: (props?: Record<string, unknown>) => ReactNode;
  sidebar?: (props?: Record<string, unknown>) => ReactNode;
}

export const puckComponentName = 'TwoColumnDetail';
export const puckLabel = 'Two Column Detail';
export const puckCategory = 'Layout';

export const puckFields = {
  mainSpan: { type: 'number' as const, label: 'Main Column Span' },
  sidebarSpan: { type: 'number' as const, label: 'Sidebar Column Span' },
  gap: {
    type: 'select' as const,
    label: 'Gap',
    options: [
      { label: 'Normal', value: 'normal' },
      { label: 'Large', value: 'large' },
    ],
  },
  main: { type: 'slot' as const },
  sidebar: { type: 'slot' as const },
};

export const puckDefaults = {
  mainSpan: 7,
  sidebarSpan: 5,
  gap: 'large',
};

export const puckAst = {
  kind: 'static',
  topLevel: true,
  slots: ['main', 'sidebar'],
  matches: [
    { tag: 'div', classIncludes: ['grid', 'lg:grid-cols-12'], component: 'TwoColumnDetail' },
  ],
};

export function TwoColumnDetailView({ mainSpan = 7, sidebarSpan = 5, gap = 'large', main, sidebar }: TwoColumnDetailViewProps) {
  const gapClass = gap === 'normal' ? 'gap-6 lg:gap-8' : 'gap-8 lg:gap-12';
  const mainClass = mainSpan === 8 ? 'lg:col-span-8' : mainSpan === 6 ? 'lg:col-span-6' : 'lg:col-span-7';
  const sideClass = sidebarSpan === 6 ? 'lg:col-span-6' : sidebarSpan === 4 ? 'lg:col-span-4' : 'lg:col-span-5';

  return (
    <div className={`grid grid-cols-1 lg:grid-cols-12 ${gapClass}`}>
      <div className={mainClass}>{main?.()}</div>
      <aside className={sideClass}>{sidebar?.()}</aside>
    </div>
  );
}
