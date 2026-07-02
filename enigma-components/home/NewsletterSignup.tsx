'use client';

import { useActionState } from 'react';
import type { NewsletterContent } from '@/lib/content';
import { cn } from '@/lib/utils/cn';
import { subscribeToNewsletter } from '@/lib/actions/newsletter-actions';

interface NewsletterSignupProps {
  className?: string;
  content: NewsletterContent;
}

export const NewsletterSignup = ({
  className,
  content,
}: NewsletterSignupProps) => {
  const [state, formAction, isPending] = useActionState(
    subscribeToNewsletter,
    null,
  );

  return (
    <section className={cn('@container', className)}>
      <div className="relative overflow-hidden rounded-card bg-primary p-8 text-center text-on-primary @lg:p-20">
        <div className="absolute -top-24 -right-24 size-96 rounded-full bg-on-primary/10 blur-3xl" />
        <div className="absolute -bottom-24 -left-24 size-96 rounded-full bg-on-primary/10 blur-3xl" />

        <div className="relative z-10 mx-auto flex max-w-2xl flex-col gap-6">
          <div className="space-y-4">
            <h2 className="text-4xl font-black @lg:text-5xl">{content.title}</h2>
            <p className="text-lg text-on-primary/80">{content.description}</p>
          </div>

          {state?.success ? (
            <div className="rounded-card border border-on-primary/20 bg-on-primary/10 p-6 animate-fade-in">
              <span className="material-symbols-outlined mb-2 text-4xl">
                check_circle
              </span>
              <p className="text-xl font-bold">{state.message}</p>
            </div>
          ) : (
            <form
              action={formAction}
              className="flex flex-col gap-4 @md:flex-row"
            >
              <input
                name="email"
                type="email"
                placeholder="Enter your email address"
                required
                className="flex-1 rounded-input border border-on-primary/30 bg-on-primary/10 px-6 py-4 text-on-primary outline-none placeholder:text-on-primary/50 focus:border-on-primary focus:ring-2 focus:ring-on-primary/30"
              />
              <button
                type="submit"
                disabled={isPending}
                className="rounded-button bg-bg-surface px-10 py-4 text-sm font-black uppercase tracking-widest text-primary transition-all hover:bg-bg-elevated disabled:cursor-not-allowed disabled:opacity-70"
              >
                {isPending ? 'Subscribing...' : 'Subscribe'}
              </button>
            </form>
          )}

          {state?.error ? (
            <p className="rounded-card bg-danger-subtle/20 p-2 font-bold text-danger">
              {state.error}
            </p>
          ) : null}

          <p className="text-xs text-on-primary/60">{content.disclaimer}</p>
        </div>
      </div>
    </section>
  );
};
