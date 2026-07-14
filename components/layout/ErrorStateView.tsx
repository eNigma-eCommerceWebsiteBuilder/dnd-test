import Link from 'next/link';

interface ActionItem {
  label: string;
  href: string;
}

interface ErrorStateViewProps {
  icon?: string;
  title: string;
  message?: string;
  actions?: ActionItem[];
}

export const puckComponentName = 'ErrorState';
export const puckLabel = 'Error State';
export const puckCategory = 'Feedback';

export const puckFields = {
  icon: { type: 'text' as const, label: 'Icon' },
  title: { type: 'text' as const, label: 'Title' },
  message: { type: 'textarea' as const, label: 'Message' },
  actions: {
    type: 'array' as const,
    label: 'Actions',
    arrayFields: {
      label: { type: 'text' as const, label: 'Label' },
      href: { type: 'text' as const, label: 'URL' },
    },
    defaultItemProps: { label: 'Go home', href: '/' },
    getItemSummary: (item: ActionItem) => item.label,
  },
};

export const puckDefaults = {
  icon: 'error',
  title: 'Something went wrong',
  message: 'Please try again.',
  actions: [{ label: 'Go home', href: '/' }],
};

export const puckAst = {
  kind: 'static',
  topLevel: true,
  matches: [
    { textIncludes: ['Something went wrong'], component: 'ErrorState' },
  ],
};

export function ErrorStateView({ icon, title, message, actions = [] }: ErrorStateViewProps) {
  return (
    <section className="@container flex min-h-[60vh] items-center justify-center p-6 text-center">
      <div className="max-w-md">
        {icon ? (
          <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-danger-subtle text-danger">
            <span className="material-symbols-outlined text-4xl">{icon}</span>
          </div>
        ) : null}
        <h1 className="text-2xl font-bold text-text-base">{title}</h1>
        {message ? <p className="mt-3 text-text-muted">{message}</p> : null}
        {actions.length > 0 ? (
          <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
            {actions.map((action) => (
              <Link key={action.href} href={action.href} className="rounded-button bg-cta-primary px-5 py-3 text-sm font-semibold text-on-primary">
                {action.label}
              </Link>
            ))}
          </div>
        ) : null}
      </div>
    </section>
  );
}
