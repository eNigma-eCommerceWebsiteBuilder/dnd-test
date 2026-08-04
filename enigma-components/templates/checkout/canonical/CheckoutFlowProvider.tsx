'use client';

import {
  createContext,
  useContext,
  useState,
  type ReactNode,
} from 'react';

import { AnalyticsEventType } from '@/lib/api/types/analytics';
import type { Cart } from '@/lib/api/types/cart';
import { PaymentMethodId } from '@/lib/api/types/payments';
import { useAnalytics } from '@/lib/analytics';
import { useCheckoutPageState } from '../useCheckoutPageState';

type CheckoutFlow = ReturnType<typeof useCheckoutPageState> & {
  contactEmail: string;
  emailError: string | null;
  selectedPaymentMethodId: PaymentMethodId;
  setContactEmail: (value: string) => void;
  setSelectedPaymentMethodId: (value: PaymentMethodId) => void;
  continueToReview: () => void;
  completeCheckout: () => Promise<void>;
  scrollToTop: () => void;
};

const CheckoutFlowContext = createContext<CheckoutFlow | null>(null);

export function CheckoutFlowProvider({
  initialCart,
  initialEmail,
  children,
}: {
  initialCart: Cart;
  initialEmail?: string;
  children: ReactNode;
}) {
  const { trackEvent } = useAnalytics();
  const [emailError, setEmailError] = useState<string | null>(null);
  const [selectedPaymentMethodId, setSelectedPaymentMethodId] = useState<PaymentMethodId>(
    PaymentMethodId.STRIPE,
  );
  const [contactEmail, setContactEmail] = useState(initialEmail ?? '');
  const pageState = useCheckoutPageState({ initialCart, initialEmail });

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const continueToReview = () => {
    const trimmedEmail = contactEmail.trim();

    if (!trimmedEmail) {
      setEmailError('Email is required to continue.');
      return;
    }

    setEmailError(null);
    pageState.checkout.setEmail(trimmedEmail);
    pageState.checkout.nextStep();
    scrollToTop();
  };

  const completeCheckout = async () => {
    try {
      const order = await pageState.checkout.completeCheckout(selectedPaymentMethodId);
      void trackEvent(AnalyticsEventType.CHECKOUT_COMPLETED, {
        orderId: order._id,
        orderTotal: order.total,
        itemCount: order.items.length,
      });
      scrollToTop();
    } catch {
      // useCheckoutPageState already exposes checkout errors to the source UI.
    }
  };

  return (
    <CheckoutFlowContext.Provider
      value={{
        ...pageState,
        contactEmail,
        emailError,
        selectedPaymentMethodId,
        setContactEmail: (value) => {
          setEmailError(null);
          setContactEmail(value);
        },
        setSelectedPaymentMethodId,
        continueToReview,
        completeCheckout,
        scrollToTop,
      }}
    >
      {children}
    </CheckoutFlowContext.Provider>
  );
}

export function useCheckoutFlowContext(): CheckoutFlow {
  const flow = useContext(CheckoutFlowContext);

  if (!flow) {
    throw new Error('Checkout regions must be rendered inside CheckoutFlowProvider.');
  }

  return flow;
}
