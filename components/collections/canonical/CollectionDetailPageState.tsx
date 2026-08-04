import type { ReactNode } from 'react';

export function CollectionDetailPageState({
  hasCollection,
  content,
  notFound,
}: {
  hasCollection: boolean;
  content?: ReactNode;
  notFound?: ReactNode;
}) {
  return <>{hasCollection ? content : notFound}</>;
}
