import Link from 'next/link';

interface AccountLink {
  title: string;
  description: string;
  href: string;
  icon?: string;
}

interface AccountLinkGridViewProps {
  links: AccountLink[];
}

export const puckComponentName = 'AccountLinkGrid';
export const puckLabel = 'Account Link Grid';
export const puckCategory = 'Account';

export const puckFields = {
  links: {
    type: 'array' as const,
    label: 'Links',
    arrayFields: {
      title: { type: 'text' as const, label: 'Title' },
      description: { type: 'textarea' as const, label: 'Description' },
      href: { type: 'text' as const, label: 'URL' },
      icon: { type: 'text' as const, label: 'Icon' },
    },
    defaultItemProps: {
      title: 'Account link',
      description: 'Manage this account area.',
      href: '/account',
      icon: 'chevron_right',
    },
    getItemSummary: (item: AccountLink) => item.title,
  },
};

export const puckDefaults = {
  links: [
    {
      href: '/account/orders',
      title: 'Orders',
      description: 'Track purchases, returns, and fulfillment updates.',
      icon: 'receipt_long',
    },
    {
      href: '/account/wishlist',
      title: 'Wishlist',
      description: 'Keep an eye on saved items and future picks.',
      icon: 'favorite',
    },
  ],
};

export const puckAst = {
  kind: 'static',
  topLevel: true,
  matches: [
    { identifier: 'accountLinks', component: 'AccountLinkGrid' },
  ],
};

export function AccountLinkGridView({ links }: AccountLinkGridViewProps) {
  return (
    <section className="@container grid grid-cols-1 gap-4 @3xl:grid-cols-2">
      {(links || []).map((link) => (
        <Link
          key={link.href}
          href={link.href}
          className="@container rounded-card border border-border bg-bg-surface p-6 shadow-card transition-transform duration-200 hover:-translate-y-0.5"
        >
          <div className="flex items-start gap-4">
            {link.icon ? (
              <span className="material-symbols-outlined text-primary">{link.icon}</span>
            ) : null}
            <div>
              <p className="text-lg font-bold text-text-base">{link.title}</p>
              <p className="mt-2 text-sm leading-7 text-text-muted">{link.description}</p>
            </div>
          </div>
        </Link>
      ))}
    </section>
  );
}
