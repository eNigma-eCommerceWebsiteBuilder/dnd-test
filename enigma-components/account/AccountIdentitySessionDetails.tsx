interface AccountIdentitySessionDetailsProps {
  fullName: string;
  email?: string | null;
  emailVerified?: boolean | Date | null;
}

export function AccountIdentitySessionDetails({
  fullName,
  email,
  emailVerified,
}: AccountIdentitySessionDetailsProps) {
  return (
    <div className="space-y-4 rounded-card border border-border bg-bg-base/80 p-6">
      <div>
        <p className="text-xs font-semibold uppercase tracking-[0.3em] text-text-muted">Display name</p>
        <p className="mt-2 text-lg font-semibold text-text-base">{fullName}</p>
      </div>
      <div>
        <p className="text-xs font-semibold uppercase tracking-[0.3em] text-text-muted">Email</p>
        <p className="mt-2 text-lg font-semibold text-text-base">{email || 'Unavailable'}</p>
      </div>
      <div>
        <p className="text-xs font-semibold uppercase tracking-[0.3em] text-text-muted">Verification</p>
        <p className="mt-2 text-sm leading-7 text-text-muted">
          {emailVerified
            ? 'Your identity provider has marked this email as verified.'
            : 'Verification is controlled by the identity provider and no longer handled inside the storefront.'}
        </p>
      </div>
    </div>
  );
}
