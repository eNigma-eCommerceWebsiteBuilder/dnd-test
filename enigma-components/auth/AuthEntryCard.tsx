'use client';

import { useSearchParams } from 'next/navigation';
import { signIn } from 'next-auth/react';
import {
  AUTH_PROVIDER_ID,
  getLoginOptions,
  getRegisterAuthorizationParams,
  getRegisterOptions,
} from '@/lib/auth/client';
import type { AuthContent } from '@/lib/content';
import { normalizeReturnUrl } from '@/lib/auth/return-url';
import { cn } from '@/lib/utils/cn';

interface AuthEntryCardProps {
  className?: string;
  content: AuthContent;
}

export function AuthEntryCard({ className, content }: AuthEntryCardProps) {
  const searchParams = useSearchParams();
  const mode = searchParams.get('mode');
  const returnUrl = normalizeReturnUrl(searchParams.get('returnUrl'));
  const isRegisterMode = mode === 'register';
  const hero = isRegisterMode ? content.register.hero : content.login.hero;
  const entryCard = content.entryCard;
  const heading = isRegisterMode
    ? entryCard.registerTitle
    : entryCard.loginTitle;

  const handleContinue = async () => {
    await signIn(AUTH_PROVIDER_ID, getLoginOptions(returnUrl));
  };

  const handleCreateAccount = async () => {
    await signIn(
      AUTH_PROVIDER_ID,
      getRegisterOptions(returnUrl),
      getRegisterAuthorizationParams(),
    );
  };

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
              {entryCard.storefrontEyebrow}
            </p>
            <h1 className="max-w-[14ch] text-4xl font-heading font-black tracking-tight text-text-base @md:text-5xl">
              {hero.title}
            </h1>
            <p className="max-w-[56ch] text-sm leading-7 text-text-muted @md:text-base">
              {hero.subtitle}
            </p>
          </div>
          <div className="grid gap-4 text-sm text-text-muted @md:grid-cols-2">
            {entryCard.featureCards.map((featureCard) => (
              <div
                key={featureCard.title}
                className="rounded-card border border-border bg-bg-base/80 p-4"
              >
                <p className="font-semibold text-text-base">{featureCard.title}</p>
                <p className="mt-2">{featureCard.description}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="flex flex-col justify-center gap-6 p-8 @md:p-10">
          <div className="space-y-3">
            <p className="text-xs font-semibold uppercase tracking-[0.35em] text-text-muted">
              {entryCard.continueEyebrow}
            </p>
            <h2 className="text-2xl font-heading font-bold text-text-base">
              {heading}
            </h2>
            <p className="text-sm leading-7 text-text-muted">
              {entryCard.description}
            </p>
          </div>

          <div className="flex flex-col gap-3">
            {isRegisterMode ? (
              <>
                <button
                  type="button"
                  onClick={handleCreateAccount}
                  className="rounded-button bg-primary px-5 py-3 text-sm font-semibold text-on-primary transition-transform duration-200 hover:-translate-y-0.5 hover:bg-primary/90"
                >
                  Create account
                </button>
                <button
                  type="button"
                  onClick={handleContinue}
                  className="rounded-button border border-border bg-bg-base px-5 py-3 text-sm font-semibold text-text-base transition-transform duration-200 hover:-translate-y-0.5 hover:border-primary"
                >
                  Sign in instead
                </button>
              </>
            ) : (
              <>
                <button
                  type="button"
                  onClick={handleContinue}
                  className="rounded-button bg-primary px-5 py-3 text-sm font-semibold text-on-primary transition-transform duration-200 hover:-translate-y-0.5 hover:bg-primary/90"
                >
                  Sign in
                </button>
                <button
                  type="button"
                  onClick={handleCreateAccount}
                  className="rounded-button border border-border bg-bg-base px-5 py-3 text-sm font-semibold text-text-base transition-transform duration-200 hover:-translate-y-0.5 hover:border-primary"
                >
                  Create account
                </button>
              </>
            )}
          </div>

          <p className="text-xs leading-6 text-text-muted">
            {entryCard.footerNote}
          </p>
        </div>
      </div>
    </section>
  );
}
