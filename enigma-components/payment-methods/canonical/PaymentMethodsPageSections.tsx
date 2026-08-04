import type { ReactNode } from 'react';
import { AddCardButton } from '@/enigma-components/payment-methods/AddCardButton';
import { EmptyPaymentMethods } from '@/enigma-components/payment-methods/EmptyPaymentMethods';
import { PaymentMethodList } from '@/enigma-components/payment-methods/PaymentMethodList';
import { StripeCardForm } from '@/enigma-components/payment-methods/StripeCardForm';
import type { PaymentMethodsPageData } from './paymentMethodsRuntime';

export function PaymentMethodsPageLayout({ header, cardForm, savedCards, help }: {
  header: ReactNode;
  cardForm: ReactNode;
  savedCards: ReactNode;
  help: ReactNode;
}) {
  return (
    <main className="min-h-screen bg-bg-base text-text-base">
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-12 py-8 md:py-12">
        {header}
        {cardForm}
        {savedCards}
        {help}
      </div>
    </main>
  );
}

export function PaymentMethodsHeaderLayout({ addCard }: { addCard: ReactNode }) {
  return (
    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 md:gap-6 mb-6 md:mb-8">
      <div>
        <h1 className="text-2xl md:text-3xl font-bold font-heading">Payment Methods</h1>
        <p className="text-sm md:text-base text-text-muted mt-1">
          Securely manage your saved cards and payment preferences
        </p>
      </div>
      {addCard}
    </div>
  );
}

export function PaymentMethodsAddCardAction() {
  return <AddCardButton />;
}

export function PaymentMethodsStripeConfigCondition({ pageData, content }: { pageData: PaymentMethodsPageData; content: ReactNode }) {
  return pageData.stripeConfig ? <div className="mb-8">{content}</div> : null;
}

export function PaymentMethodsStripeCardForm({ pageData }: { pageData: PaymentMethodsPageData }) {
  return pageData.stripeConfig ? <StripeCardForm stripeConfig={pageData.stripeConfig} /> : null;
}

export function PaymentMethodsSavedCardsSection({ state }: { state: ReactNode }) {
  return (
    <div>
      <h2 className="text-lg font-bold font-heading mb-4">Saved Cards</h2>
      {state}
    </div>
  );
}

export function PaymentMethodsListState({ pageData, list, empty }: { pageData: PaymentMethodsPageData; list: ReactNode; empty: ReactNode }) {
  return pageData.paymentMethods.length > 0 ? <>{list}</> : <>{empty}</>;
}

export function PaymentMethodsListRegion({ pageData }: { pageData: PaymentMethodsPageData }) {
  return <PaymentMethodList paymentMethods={pageData.paymentMethods} />;
}

export function PaymentMethodsEmptyStateRegion() {
  return <EmptyPaymentMethods />;
}

export function PaymentMethodsHelpFooter() {
  return (
    <div className="mt-8 p-6 md:p-8 bg-primary/5 rounded-card border border-primary/10 flex flex-col md:flex-row items-center gap-4 md:gap-6 justify-between">
      <div className="flex items-center gap-4 text-center md:text-left">
        <div className="w-10 h-10 md:w-12 md:h-12 rounded-full bg-bg-surface flex items-center justify-center text-primary shadow-card flex-shrink-0">
          <span className="material-symbols-outlined text-xl md:text-2xl">help</span>
        </div>
        <div>
          <h3 className="font-bold text-text-base">Need help with your payments?</h3>
          <p className="text-sm text-text-muted">Our support team is available 24/7 to assist with any billing questions.</p>
        </div>
      </div>
      <a href="/support" className="text-primary font-semibold text-sm border-b-2 border-primary/20 hover:border-primary transition-all">
        Contact Support
      </a>
    </div>
  );
}
