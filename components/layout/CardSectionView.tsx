import type { ReactNode } from 'react';

interface CardSectionViewProps {
  title?: string;
  variant?: string;
  children?: (props?: Record<string, unknown>) => ReactNode;
}

export const puckComponentName = 'CardSection';
export const puckLabel = 'Card Section';
export const puckCategory = 'Layout';

export const puckFields = {
  title: { type: 'text' as const, label: 'Title' },
  variant: {
    type: 'select' as const,
    label: 'Variant',
    options: [
      { label: 'Default', value: 'default' },
      { label: 'Surface', value: 'surface' },
      { label: 'Subtle', value: 'subtle' },
    ],
  },
  children: { type: 'slot' as const },
};

export const puckDefaults = {
  title: '',
  variant: 'default',
};

export const puckAst = {
  kind: 'static',
  topLevel: true,
  slots: ['children'],
  matches: [
    { tag: 'section', classIncludes: ['rounded-card'], component: 'CardSection' },
    { tag: 'div', classIncludes: ['rounded-card'], component: 'CardSection' },
  ],
};

export function CardSectionView({ title, variant = 'default', children }: CardSectionViewProps) {
  const variantClass = variant === 'subtle'
    ? 'bg-bg-base/80'
    : variant === 'surface'
      ? 'bg-bg-surface'
      : 'bg-bg-surface shadow-card';

  return (
    <section className={`@container rounded-card border border-border p-4 md:p-6 ${variantClass}`}>
      {title ? <h2 className="mb-4 text-lg font-semibold text-text-base">{title}</h2> : null}
      {children?.()}
    </section>
  );
}
