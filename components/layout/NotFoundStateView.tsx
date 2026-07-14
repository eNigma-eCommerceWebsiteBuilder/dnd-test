import Link from 'next/link';

interface ActionItem {
  label: string;
  href: string;
}

interface NotFoundStateViewProps {
  icon?: string;
  title: string;
  message?: string;
  actions?: ActionItem[];
}

export const puckComponentName = 'NotFoundState';
export const puckLabel = 'Not Found State';
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
  icon: 'search_off',
  title: 'Page not found',
  message: 'The page you are looking for is not available.',
  actions: [{ label: 'Go home', href: '/' }],
};

export const puckAst = {
  kind: 'static',
  topLevel: true,
  matches: [
    { textIncludes: ['not found'], component: 'NotFoundState' },
  ],
};

export function NotFoundStateView({ icon, title, message, actions = [] }: NotFoundStateViewProps) {
  return (
    <section className="@container mx-auto flex min-h-[70vh] max-w-[1440px] flex-col items-center justify-center px-6 py-16 text-center">
      {icon ? (
        <div className="rounded-full bg-bg-sunken p-4 text-text-muted">
          <span className="material-symbols-outlined text-4xl">{icon}</span>
        </div>
      ) : null}
      <h1 className="mt-6 text-3xl font-bold text-text-base">{title}</h1>
      {message ? <p className="mt-3 max-w-lg text-text-muted">{message}</p> : null}
      {actions.length > 0 ? (
        <div className="mt-8 flex flex-col gap-3 sm:flex-row">
          {actions.map((action) => (
            <Link key={action.href} href={action.href} className="rounded-button border border-border px-5 py-3 text-sm font-semibold text-text-base">
              {action.label}
            </Link>
          ))}
        </div>
      ) : null}
    </section>
  );
}
