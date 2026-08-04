import type { ReactNode } from 'react';

export function SharedWishlistPageState({
  valid,
  content,
  invalid,
}: {
  valid: boolean;
  content?: ReactNode;
  invalid?: ReactNode;
}) {
  return <>{valid ? content : invalid}</>;
}
