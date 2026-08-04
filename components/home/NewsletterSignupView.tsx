import type { NewsletterContent } from '@/lib/content';
import { NewsletterSignup } from '@/enigma-components/home/NewsletterSignup';

interface NewsletterSignupViewProps {
  title: string;
  description: string;
  disclaimer: string;
  className?: string;
  formAction?: (formData: FormData) => void;
  formState?: 'idle' | 'success' | 'error';
  formMessage?: string;
  formError?: string;
  isPending?: boolean;
}

export const puckComponentName = 'NewsletterSignup';
export const puckLabel = 'Newsletter Signup';
export const puckCategory = 'Home';

export const puckFields = {
  title: { type: 'text' as const, label: 'Title' },
  description: { type: 'textarea' as const, label: 'Description' },
  disclaimer: { type: 'textarea' as const, label: 'Disclaimer' },
};

export const puckDefaults = {
  title: 'Join the Inner Circle',
  description:
    'Sign up for early access to new drops, curated seasonal guides, and exclusive editorial content.',
  disclaimer:
    'By subscribing, you agree to our Privacy Policy and Terms of Service.',
};
export const puckAst = { kind: 'runtime', sourceJsxNames: ['NewsletterSignup'], sourceImportPaths: ['@/components/home/NewsletterSignup'], role: 'home-newsletter-signup', runtimeSignals: ['homepage.newsletter'] };

export function NewsletterSignupView({
  title,
  description,
  disclaimer,
  className,
  formAction,
  formState = 'idle',
  formMessage,
  formError,
  isPending = false,
}: NewsletterSignupViewProps) {
  const content = { title, description, disclaimer } as NewsletterContent;
  return <NewsletterSignup content={content} className={className} />;
}
