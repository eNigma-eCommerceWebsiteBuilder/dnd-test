interface PageHeaderViewProps {
  title: string;
  subtitle?: string;
  eyebrow?: string;
}

export const puckComponentName = 'PageHeader';
export const puckLabel = 'Page Header';
export const puckCategory = 'Layout';

export const puckFields = {
  eyebrow: { type: 'text' as const, label: 'Eyebrow' },
  title: { type: 'text' as const, label: 'Title' },
  subtitle: { type: 'textarea' as const, label: 'Subtitle' },
};

export const puckDefaults = {
  eyebrow: '',
  title: 'Page Title',
  subtitle: 'Helpful page context.',
};

export const puckAst = {
  kind: 'static',
  topLevel: true,
  matches: [
    { tag: 'h1', classIncludes: ['font-heading'], component: 'PageHeader' },
  ],
};

export function PageHeaderView({ eyebrow, title, subtitle }: PageHeaderViewProps) {
  return (
    <header className="@container mb-6 md:mb-8">
      {eyebrow ? (
        <p className="mb-2 text-xs font-semibold uppercase tracking-[0.3em] text-text-muted">
          {eyebrow}
        </p>
      ) : null}
      <h1 className="text-2xl font-bold font-heading text-text-base md:text-3xl">
        {title}
      </h1>
      {subtitle ? (
        <p className="mt-2 max-w-[68ch] text-sm leading-7 text-text-muted md:text-base">
          {subtitle}
        </p>
      ) : null}
    </header>
  );
}
