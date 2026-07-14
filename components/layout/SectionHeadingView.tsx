interface SectionHeadingViewProps {
  title: string;
  subtitle?: string;
}

export const puckComponentName = 'SectionHeading';
export const puckLabel = 'Section Heading';
export const puckCategory = 'Layout';

export const puckFields = {
  title: { type: 'text' as const, label: 'Title' },
  subtitle: { type: 'textarea' as const, label: 'Subtitle' },
};

export const puckDefaults = {
  title: 'Section Heading',
  subtitle: '',
};

export const puckAst = {
  kind: 'static',
  topLevel: true,
  matches: [
    { tag: 'h2', component: 'SectionHeading' },
    { tag: 'h3', component: 'SectionHeading' },
  ],
};

export function SectionHeadingView({ title, subtitle }: SectionHeadingViewProps) {
  return (
    <div className="@container mb-4">
      <h2 className="text-xl font-bold font-heading text-text-base md:text-2xl">
        {title}
      </h2>
      {subtitle ? <p className="mt-2 text-sm leading-7 text-text-muted">{subtitle}</p> : null}
    </div>
  );
}
