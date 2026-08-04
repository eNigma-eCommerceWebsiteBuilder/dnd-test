import { AuthEntryCard } from '@/enigma-components/auth/AuthEntryCard';
import { AuthPageLayout } from '@/enigma-components/auth/AuthPageLayout';
import { AuthPageState } from '@/enigma-components/auth/canonical/AuthPageState';
import { siteContent } from '@/lib/content';

export default function AuthPage({
  searchParams,
}: {
  searchParams: Promise<{ returnUrl?: string }>;
}) {
  return (
    <AuthPageState
      searchParams={searchParams}
      content={<AuthPageLayout content={<AuthEntryCard content={siteContent.auth} />} />}
    />
  );
}
