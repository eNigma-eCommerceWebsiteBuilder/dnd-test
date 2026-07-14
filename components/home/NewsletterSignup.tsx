'use client';

import { useActionState } from 'react';
import type { NewsletterContent } from '@/lib/content';
import { subscribeToNewsletter } from '@/lib/actions/newsletter-actions';
import { NewsletterSignupView } from './NewsletterSignupView';

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

  const formState: 'idle' | 'success' | 'error' = state?.success
    ? 'success'
    : state?.error
      ? 'error'
      : 'idle';

  return (
    <NewsletterSignupView
      title={content.title}
      description={content.description}
      disclaimer={content.disclaimer}
      className={className}
      formAction={formAction}
      formState={formState}
      formMessage={state?.message}
      formError={state?.error}
      isPending={isPending}
    />
  );
};
