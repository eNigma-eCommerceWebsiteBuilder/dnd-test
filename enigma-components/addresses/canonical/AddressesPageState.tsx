import type { ReactNode } from 'react';
import type { AddressesPageData } from './addressesRuntime';

export function AddressesPageState({ pageData, content }: { pageData: AddressesPageData; content: ReactNode }) {
  void pageData;
  return <>{content}</>;
}
