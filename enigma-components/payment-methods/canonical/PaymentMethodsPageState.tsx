import type { ReactNode } from 'react';
import type { PaymentMethodsPageData } from './paymentMethodsRuntime';

export function PaymentMethodsPageState({ pageData, content }: { pageData: PaymentMethodsPageData; content: ReactNode }) {
  void pageData;
  return <>{content}</>;
}
