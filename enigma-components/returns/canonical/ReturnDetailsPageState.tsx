import type { ReactNode } from 'react';
import type { ReturnRequest } from '@/lib/api/types/returns';

export function ReturnDetailsPageState({
  returnDetails,
  notFound,
  content,
}: {
  returnDetails: ReturnRequest | null;
  notFound: ReactNode;
  content: ReactNode;
}) {
  return returnDetails ? <>{content}</> : <>{notFound}</>;
}
