import Link from 'next/link';

interface CalloutCardViewProps {
  icon?: string;
  title: string;
  description?: string;
  actionLabel?: string;
  actionHref?: string;
}

export const puckComponentName = 'CalloutCard';
export const puckLabel = 'Callout Card';
export const puckCategory = 'Layout';

export const puckFields = {
  icon: { type: 'text' as const, label: 'Icon' },
  title: { type: 'text' as const, label: 'Title' },
  description: { type: 'textarea' as const, label: 'Description' },
  actionLabel: { type: 'text' as const, label: 'Action Label' },
  actionHref: { type: 'text' as const, label: 'Action URL' },
};

export const puckDefaults = {
  icon: 'info',
  title: 'Helpful information',
  description: 'Use this area for important supporting guidance.',
  actionLabel: '',
  actionHref: '',
};

export const puckAst = {
  kind: 'static',
  topLevel: true,
  matches: [
    { tag: 'div', classIncludes: ['bg-primary/5'], component: 'CalloutCard' },
  ],
};

export function CalloutCardView({ icon, title, description, actionLabel, actionHref }: CalloutCardViewProps) {
  return (
    <div className="@container rounded-card border border-primary/10 bg-primary/5 p-6 md:p-8">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div className="flex items-center gap-4">
          {icon ? (
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-bg-surface text-primary shadow-card">
              <span className="material-symbols-outlined text-2xl">{icon}</span>
            </div>
          ) : null}
          <div>
            <h3 className="font-bold text-text-base">{title}</h3>
            {description ? <p className="text-sm text-text-muted">{description}</p> : null}
          </div>
        </div>
        {actionLabel && actionHref ? (
          <Link href={actionHref} className="text-sm font-semibold text-primary underline-offset-4 hover:underline">
            {actionLabel}
          </Link>
        ) : null}
      </div>
    </div>
  );
}
