import Link from 'next/link';
import { ROUTES } from '@/lib/utils/constants';

export function AccountSettingsBreadcrumbs() {
  return (
    <div className="flex items-center gap-2 text-sm text-text-muted">
      <Link href={ROUTES.HOME} className="font-medium transition hover:text-primary">
        Home
      </Link>
      <span className="material-symbols-outlined text-xs">chevron_right</span>
      <Link href={ROUTES.ACCOUNT} className="font-medium transition hover:text-primary">
        Account
      </Link>
      <span className="material-symbols-outlined text-xs">chevron_right</span>
      <span className="font-semibold text-primary">Identity settings</span>
    </div>
  );
}
