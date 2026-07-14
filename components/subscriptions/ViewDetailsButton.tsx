import Link from 'next/link';

type ViewDetailsButtonProps = {
  subscriptionId: string;
};

export function ViewDetailsButton({ subscriptionId }: ViewDetailsButtonProps) {
  return (
    <div className="@container">
      <Link
        href={`/account/subscriptions/${subscriptionId}`}
        className="inline-flex items-center justify-center rounded-button border border-border px-4 py-2 text-sm font-semibold text-text-base hover:bg-bg-hover transition-colors"
      >
        View details
      </Link>
    </div>
  );
}
