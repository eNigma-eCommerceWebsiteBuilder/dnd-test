import type { ReactNode } from 'react';

// Production-compatible copy. TemplateFrontend owns the same JSX shell.
export function AuthPageLayout({ content }: { content: ReactNode }) {
  return <main className="min-h-screen bg-bg-base px-4 py-10 text-text-base pt-[112px] @container"><div className="mx-auto max-w-[1180px]">{content}</div></main>;
}
