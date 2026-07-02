import Link from 'next/link';
import { ROUTES } from '@/lib/utils/constants';

type CreateSubscriptionCTAProps = {
  label?: string;
};

export function CreateSubscriptionCTA({
  label = 'Browse subscription products',
}: CreateSubscriptionCTAProps) {
  return (
    <div className="@container">
      <Link
        href={ROUTES.PRODUCTS}
        className="inline-flex items-center justify-center rounded-button bg-cta-primary px-5 py-2 text-sm font-semibold text-on-primary shadow-button hover:bg-cta-primary-hover hover:shadow-button-hover transition-all"
      >
        {label}
      </Link>
    </div>
  );
}
