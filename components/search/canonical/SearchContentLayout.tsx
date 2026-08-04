import type { ReactNode } from 'react';

export function SearchContentLayout({ sidebar, results }: { sidebar?: ReactNode; results?: ReactNode }) {
  return <div className="flex flex-col lg:flex-row gap-8 lg:gap-12 mt-10">{sidebar}{results}</div>;
}
