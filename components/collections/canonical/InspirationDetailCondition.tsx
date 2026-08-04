import type { ReactNode } from 'react';

export function InspirationDetailCondition({
  visible,
  content,
}: {
  visible: boolean;
  content?: ReactNode;
}) {
  return visible ? content : null;
}
