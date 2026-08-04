export function AccountIdentityExplanation() {
  return (
    <div className="space-y-4">
      <p className="text-xs font-semibold uppercase tracking-[0.35em] text-text-muted">
        Hosted identity
      </p>
      <h1 className="text-3xl font-heading font-black tracking-tight text-text-base">
        Sign-in is managed outside the storefront.
      </h1>
      <p className="text-sm leading-7 text-text-muted">
        We have fully removed the local storefront password, reset, and verification flow. Customer
        authentication now lives in eNigma Identity so the storefront can stay lightweight and secure.
      </p>
    </div>
  );
}
