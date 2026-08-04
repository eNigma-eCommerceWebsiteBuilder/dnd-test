import type { PaymentMethodsPageData } from './paymentMethodsRuntime';
import { PaymentMethodsPageState } from './PaymentMethodsPageState';
import {
  PaymentMethodsAddCardAction,
  PaymentMethodsEmptyStateRegion,
  PaymentMethodsHeaderLayout,
  PaymentMethodsHelpFooter,
  PaymentMethodsListRegion,
  PaymentMethodsListState,
  PaymentMethodsPageLayout,
  PaymentMethodsSavedCardsSection,
  PaymentMethodsStripeCardForm,
  PaymentMethodsStripeConfigCondition,
} from './PaymentMethodsPageSections';

export function PaymentMethodsPage({ pageData }: { pageData: PaymentMethodsPageData }) {
  return (
    <PaymentMethodsPageState
      pageData={pageData}
      content={(
        <PaymentMethodsPageLayout
          header={(
            <PaymentMethodsHeaderLayout addCard={<PaymentMethodsAddCardAction />} />
          )}
          cardForm={(
            <PaymentMethodsStripeConfigCondition
              pageData={pageData}
              content={<PaymentMethodsStripeCardForm pageData={pageData} />}
            />
          )}
          savedCards={(
            <PaymentMethodsSavedCardsSection
              state={(
                <PaymentMethodsListState
                  pageData={pageData}
                  list={<PaymentMethodsListRegion pageData={pageData} />}
                  empty={<PaymentMethodsEmptyStateRegion />}
                />
              )}
            />
          )}
          help={<PaymentMethodsHelpFooter />}
        />
      )}
    />
  );
}
