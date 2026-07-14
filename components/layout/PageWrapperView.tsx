import type { ReactNode } from 'react';

interface PageWrapperViewProps {
  maxWidth?: string;
  paddingY?: string;
  children?: (props?: Record<string, unknown>) => ReactNode;
}

export const puckComponentName = 'PageWrapper';
export const puckLabel = 'Page Wrapper';
export const puckCategory = 'Layout';

export const puckFields = {
  maxWidth: {
    type: 'select' as const,
    label: 'Max Width',
    options: [
      { label: '1440px', value: '1440' },
      { label: '1280px', value: '1280' },
      { label: '1180px', value: '1180' },
      { label: '980px', value: '980' },
    ],
  },
  paddingY: {
    type: 'select' as const,
    label: 'Vertical Padding',
    options: [
      { label: 'Tight', value: 'tight' },
      { label: 'Normal', value: 'normal' },
      { label: 'Large', value: 'large' },
    ],
  },
  children: { type: 'slot' as const },
};

export const puckDefaults = {
  maxWidth: '1440',
  paddingY: 'normal',
};

export const puckAst = {
  kind: 'static',
  topLevel: true,
  slots: ['children'],
  matches: [
    { tag: 'main', component: 'PageWrapper' },
  ],
};

export function PageWrapperView({ maxWidth = '1440', paddingY = 'normal', children }: PageWrapperViewProps) {
  const widthClass = {
    '1440': 'max-w-[1440px]',
    '1280': 'max-w-[1280px]',
    '1180': 'max-w-[1180px]',
    '980': 'max-w-[980px]',
  }[maxWidth] || 'max-w-[1440px]';

  const paddingClass = {
    tight: 'py-6',
    normal: 'py-8 md:py-12',
    large: 'py-12 md:py-16',
  }[paddingY] || 'py-8 md:py-12';

  return (
    <main className="@container min-h-screen bg-bg-base text-text-base">
      <div className={`${widthClass} mx-auto w-full px-4 sm:px-6 lg:px-12 ${paddingClass}`}>
        {children?.()}
      </div>
    </main>
  );
}
