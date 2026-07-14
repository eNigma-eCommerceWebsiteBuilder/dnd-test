import { cn } from '@/lib/utils/cn';

interface FeatureCardItem {
  title: string;
  description: string;
}

interface AuthEntryCardViewProps {
  mode?: 'login' | 'register';
  storefrontEyebrow: string;
  continueEyebrow: string;
  loginHeroTitle: string;
  loginHeroSubtitle: string;
  loginHeroImage: string;
  loginHeroImageAlt: string;
  registerHeroTitle: string;
  registerHeroSubtitle: string;
  registerHeroImage: string;
  registerHeroImageAlt: string;
  loginTitle: string;
  registerTitle: string;
  description: string;
  footerNote: string;
  featureCards: FeatureCardItem[];
  onSignIn?: () => void;
  onCreateAccount?: () => void;
  className?: string;
}

export const puckComponentName = 'AuthEntryCard';
export const puckLabel = 'Auth Entry Card';
export const puckCategory = 'Auth';

export const puckFields = {
  mode: {
    type: 'select' as const,
    label: 'Preview Mode',
    options: [
      { label: 'Login', value: 'login' },
      { label: 'Register', value: 'register' },
    ],
  },
  storefrontEyebrow: { type: 'text' as const, label: 'Storefront Eyebrow' },
  continueEyebrow: { type: 'text' as const, label: 'Continue Eyebrow' },
  loginHeroTitle: { type: 'text' as const, label: 'Login Hero Title' },
  loginHeroSubtitle: { type: 'textarea' as const, label: 'Login Hero Subtitle' },
  loginHeroImage: { type: 'text' as const, label: 'Login Hero Image URL' },
  loginHeroImageAlt: { type: 'text' as const, label: 'Login Hero Image Alt' },
  registerHeroTitle: { type: 'text' as const, label: 'Register Hero Title' },
  registerHeroSubtitle: { type: 'textarea' as const, label: 'Register Hero Subtitle' },
  registerHeroImage: { type: 'text' as const, label: 'Register Hero Image URL' },
  registerHeroImageAlt: { type: 'text' as const, label: 'Register Hero Image Alt' },
  loginTitle: { type: 'text' as const, label: 'Login Title' },
  registerTitle: { type: 'text' as const, label: 'Register Title' },
  description: { type: 'textarea' as const, label: 'Description' },
  footerNote: { type: 'textarea' as const, label: 'Footer Note' },
  featureCards: {
    type: 'array' as const,
    label: 'Feature Cards',
    arrayFields: {
      title: { type: 'text' as const, label: 'Title' },
      description: { type: 'textarea' as const, label: 'Description' },
    },
    defaultItemProps: {
      title: 'New Feature',
      description: 'Feature description.',
    },
    getItemSummary: (item: FeatureCardItem) => item.title,
  },
};

export const puckDefaults = {
  mode: 'login' as const,
  storefrontEyebrow: 'Storefront Identity',
  continueEyebrow: 'Continue Securely',
  loginHeroTitle: 'Redefining Elegance',
  loginHeroSubtitle:
    'Join our exclusive community and access curated luxury collections from around the globe.',
  loginHeroImage:
    'https://lh3.googleusercontent.com/aida-public/AB6AXuDOhFWViWGcd7-qkYBD1vhGK4PdvG5ocHFtmKXPajNifVZQSVX4MUoF3eRCaXCgJ5x4eHuTaegApBlb3ZlOVcgws9r-q9NxREE7zUXyERMOokmvIlyKzPhYTGOZyQZGzu3X7gZDfmGC9ny77vecfgMJlMnc_UmUi4rIhdRjqRgnG8Wt07fAKwvJy984ef-7vviskhMjCppHc3UQdTCpMv0xi34Ei3QFu43Nz5oSS5SAJRya-rHjltI4ukkC6MwArvptoRMAsI6qqnA7',
  loginHeroImageAlt: 'Luxury minimalist fashion store interior with soft lighting',
  registerHeroTitle: 'Redefining Modern Luxury',
  registerHeroSubtitle:
    'Experience a curated collection of world-class design and craftsmanship.',
  registerHeroImage:
    'https://lh3.googleusercontent.com/aida-public/AB6AXuDw9Dfl-hrxzGp-zBz1y8pJR_McT_2DQZcNTS2WVj2JCx6ImZNb3kqC51vxp4lxs_LFEyY1QQV0kIC8d41rDTIZOAXigBW5WXkMFZaJtpipggrE-m5RjguRk6nPb-49oMjhs7gd97NIemx-QDAOOT-VBNBCLSfeTkhtMPM2GTmwPcyROnaKPZzhA2chxiL9oOKYs9UfYpNt5-2h0nGSaFJT-9NdL8Nq2QhcHZDQBQDOaR7FmGcKVN_jShyM0d9zbHyOccw9QdGKXoI',
  registerHeroImageAlt: 'Modern high-end luxury boutique interior with minimalist aesthetic',
  loginTitle: 'Access your account',
  registerTitle: 'Start your account',
  description:
    'Sign in or create your account using the hosted identity flow. Registration, password recovery, and social login all stay inside eNigma Identity.',
  footerNote:
    'Your shopping identity is now handled by eNigma Identity. If you are already signed in there, you will come straight back here.',
  featureCards: [
    {
      title: 'Hosted login',
      description:
        'Passwords, social login, verification, and recovery stay inside eNigma Identity.',
    },
    {
      title: 'Unified sessions',
      description:
        'The storefront only keeps a secure session cookie and never stores tokens in browser storage.',
    },
  ],
};


export function AuthEntryCardView({
  mode = 'login',
  storefrontEyebrow,
  continueEyebrow,
  loginHeroTitle,
  loginHeroSubtitle,
  registerHeroTitle,
  registerHeroSubtitle,
  loginTitle,
  registerTitle,
  description,
  footerNote,
  featureCards,
  onSignIn,
  onCreateAccount,
  className,
}: AuthEntryCardViewProps) {
  const isRegisterMode = mode === 'register';
  const heroTitle = isRegisterMode ? registerHeroTitle : loginHeroTitle;
  const heroSubtitle = isRegisterMode ? registerHeroSubtitle : loginHeroSubtitle;
  const heading = isRegisterMode ? registerTitle : loginTitle;

  return (
    <section
      className={cn(
        '@container relative overflow-hidden rounded-card border border-border bg-bg-surface shadow-card',
        className,
      )}
    >
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,var(--tw-gradient-stops))] from-primary/12 via-transparent to-accent/12" />
      <div className="relative grid grid-cols-1 @4xl:grid-cols-[minmax(0,1.2fr)_minmax(0,0.8fr)]">
        <div className="flex flex-col justify-between gap-10 border-b border-border p-8 @md:p-10 @4xl:border-b-0 @4xl:border-r">
          <div className="space-y-4">
            <p className="text-xs font-semibold uppercase tracking-[0.35em] text-text-muted">
              {storefrontEyebrow}
            </p>
            <h1 className="max-w-[14ch] text-4xl font-heading font-black tracking-tight text-text-base @md:text-5xl">
              {heroTitle}
            </h1>
            <p className="max-w-[56ch] text-sm leading-7 text-text-muted @md:text-base">
              {heroSubtitle}
            </p>
          </div>
          <div className="grid gap-4 text-sm text-text-muted @md:grid-cols-2">
            {featureCards.map((card, index) => (
              <div
                key={index}
                className="rounded-card border border-border bg-bg-base/80 p-4"
              >
                <p className="font-semibold text-text-base">{card.title}</p>
                <p className="mt-2">{card.description}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="flex flex-col justify-center gap-6 p-8 @md:p-10">
          <div className="space-y-3">
            <p className="text-xs font-semibold uppercase tracking-[0.35em] text-text-muted">
              {continueEyebrow}
            </p>
            <h2 className="text-2xl font-heading font-bold text-text-base">
              {heading}
            </h2>
            <p className="text-sm leading-7 text-text-muted">
              {description}
            </p>
          </div>

          <div className="flex flex-col gap-3">
            {isRegisterMode ? (
              <>
                <button
                  type="button"
                  onClick={onCreateAccount}
                  className="rounded-button bg-primary px-5 py-3 text-sm font-semibold text-on-primary transition-transform duration-200 hover:-translate-y-0.5 hover:bg-primary/90"
                >
                  Create account
                </button>
                <button
                  type="button"
                  onClick={onSignIn}
                  className="rounded-button border border-border bg-bg-base px-5 py-3 text-sm font-semibold text-text-base transition-transform duration-200 hover:-translate-y-0.5 hover:border-primary"
                >
                  Sign in instead
                </button>
              </>
            ) : (
              <>
                <button
                  type="button"
                  onClick={onSignIn}
                  className="rounded-button bg-primary px-5 py-3 text-sm font-semibold text-on-primary transition-transform duration-200 hover:-translate-y-0.5 hover:bg-primary/90"
                >
                  Sign in
                </button>
                <button
                  type="button"
                  onClick={onCreateAccount}
                  className="rounded-button border border-border bg-bg-base px-5 py-3 text-sm font-semibold text-text-base transition-transform duration-200 hover:-translate-y-0.5 hover:border-primary"
                >
                  Create account
                </button>
              </>
            )}
          </div>

          <p className="text-xs leading-6 text-text-muted">
            {footerNote}
          </p>
        </div>
      </div>
    </section>
  );
}
