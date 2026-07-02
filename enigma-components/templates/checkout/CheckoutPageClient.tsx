'use client';

import { useState } from 'react';
import { AnalyticsEventType } from '@/lib/api/types/analytics';
import { useAnalytics } from '@/lib/analytics';
import { CheckoutSteps } from '@/components/checkout/CheckoutSteps';
import { OrderReview } from '@/components/checkout/OrderReview';
import { OrderSummary } from '@/components/checkout/OrderSummary';
import { PlaceOrderButton } from '@/components/checkout/PlaceOrderButton';
import { SecureBadges } from '@/components/checkout/SecureBadges';
import { ShippingForm } from '@/components/checkout/ShippingForm';
import { ShippingMethodSelector } from '@/components/checkout/ShippingMethodSelector';
import type { Cart } from '@/lib/api/types/cart';
import { CheckoutStepCode } from '@/lib/utils/constants';
import { formatPrice } from '@/lib/utils/formatters';
import { CheckoutConfirmation } from './CheckoutConfirmation';
import { CheckoutErrorAlert } from './CheckoutErrorAlert';
import { CheckoutPaymentStep } from './CheckoutPaymentStep';
import { getPaymentMethodLabel, toAddressFormData } from './checkoutPageUtils';
import { useCheckoutPageState } from './useCheckoutPageState';

interface CheckoutPageClientProps {
  initialCart: Cart;
  initialEmail?: string;
}

export default function CheckoutPageClient({
  initialCart,
  initialEmail,
}: CheckoutPageClientProps) {
  const { trackEvent } = useAnalytics();
  const [emailError, setEmailError] = useState<string | null>(null);
  const {
    activeItemCount,
    activeItems,
    checkout,
    contactEmail,
    selectedPaymentMethodId,
    setContactEmail,
    setSelectedPaymentMethodId,
    taxAmount,
    totals,
    totalWithTax,
  } = useCheckoutPageState({ initialCart, initialEmail });

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const trimmedEmail = contactEmail.trim();

  const handleContinueToReview = () => {
    if (!trimmedEmail) {
      setEmailError('Email is required to continue.');
      return;
    }

    setEmailError(null);
    checkout.setEmail(trimmedEmail);
    checkout.nextStep();
    scrollToTop();
  };

  return (
    <main className="min-h-screen bg-bg-base text-text-base">
      <div className="mx-auto max-w-[1440px] px-4 py-6 sm:px-6 sm:py-8 md:px-12 md:py-12 lg:px-20">
        <CheckoutSteps
          steps={checkout.steps}
          currentStepId={checkout.currentStepId}
          onStepClick={checkout.goToStep}
          className="mb-6 md:mb-8"
        />

        <div className="flex flex-col gap-8 lg:flex-row lg:gap-12">
          <div className="flex-1 space-y-8 md:space-y-12">
            <div>
              <h1 className="mb-2 text-2xl font-bold tracking-tight md:text-3xl">Checkout</h1>
              <p className="text-sm text-text-muted md:text-base">
                Complete your order by providing your shipping and payment details.
              </p>
            </div>

            {checkout.error ? (
              <CheckoutErrorAlert
                message={checkout.error}
                onDismiss={checkout.clearError}
              />
            ) : null}

            {(checkout.currentStepId === CheckoutStepCode.CART || checkout.currentStepId === CheckoutStepCode.SHIPPING) ? (
              <div className="space-y-8 animate-fade-in">
                <ShippingForm
                  initialData={toAddressFormData(checkout.shippingAddress)}
                  onSubmit={async (data) => {
                    await checkout.setShippingAddress(data);
                  }}
                  submitLabel="Save Shipping Address"
                  isLoading={checkout.loading}
                />

                {checkout.shippingAddress ? (
                  <div className="animate-slide-up">
                    <ShippingMethodSelector
                      methods={checkout.shippingMethods}
                      selectedMethodId={checkout.selectedShippingMethod?.id}
                      onSelect={checkout.selectShippingMethod}
                      isLoading={checkout.loading}
                    />

                    <div className="mt-6 flex justify-end">
                      <button
                        type="button"
                        onClick={() => {
                          if (checkout.selectedShippingMethod) {
                            checkout.nextStep();
                            scrollToTop();
                          }
                        }}
                        disabled={!checkout.selectedShippingMethod}
                        className="rounded-button bg-primary px-8 py-3 font-bold text-on-primary shadow-button transition-all hover:bg-primary-dark hover:shadow-button-hover disabled:cursor-not-allowed disabled:bg-bg-disabled disabled:text-text-disabled"
                      >
                        Continue to Payment
                      </button>
                    </div>
                  </div>
                ) : null}
              </div>
            ) : null}

            {checkout.currentStepId === CheckoutStepCode.PAYMENT ? (
              <CheckoutPaymentStep
                contactEmail={contactEmail}
                emailError={emailError}
                isLoading={checkout.loading}
                paymentMethodId={selectedPaymentMethodId}
                onBack={() => {
                  checkout.prevStep();
                  scrollToTop();
                }}
                onContactEmailChange={(value) => {
                  setEmailError(null);
                  setContactEmail(value);
                }}
                onContinue={handleContinueToReview}
                onPaymentMethodChange={(value) => setSelectedPaymentMethodId(value as typeof selectedPaymentMethodId)}
              />
            ) : null}

            {checkout.currentStepId === CheckoutStepCode.REVIEW && checkout.shippingAddress ? (
              <div className="space-y-8 animate-fade-in">
                <h2 className="text-2xl font-bold">Review Your Order</h2>

                <OrderReview
                  items={activeItems}
                  shippingAddress={toAddressFormData(checkout.shippingAddress)!}
                  shippingMethodName={checkout.selectedShippingMethod?.name || 'Standard Shipping'}
                  paymentMethodName={getPaymentMethodLabel(selectedPaymentMethodId)}
                  total={totals.total}
                  email={checkout.orderData.email || trimmedEmail}
                  onEditStep={(stepId) => {
                    checkout.goToStep(stepId);
                    scrollToTop();
                  }}
                />

                <PlaceOrderButton
                  onClick={async () => {
                    try {
                      const order = await checkout.completeCheckout(selectedPaymentMethodId);
                      void trackEvent(AnalyticsEventType.CHECKOUT_COMPLETED, {
                        orderId: order._id,
                        orderTotal: order.total,
                        itemCount: order.items.length,
                      });
                      scrollToTop();
                    } catch {
                      // Hook state already surfaces the checkout error.
                    }
                  }}
                  isLoading={checkout.loading}
                  totalAmount={formatPrice(totalWithTax)}
                  disabled={checkout.loading || !checkout.orderData.email}
                />

                <SecureBadges variant="detailed" />

                <button
                  type="button"
                  onClick={() => {
                    checkout.prevStep();
                    scrollToTop();
                  }}
                  className="text-sm text-text-muted transition-colors hover:text-primary hover:underline"
                >
                  &larr; Back to Payment
                </button>
              </div>
            ) : null}

            {checkout.currentStepId === CheckoutStepCode.CONFIRMATION ? (
              <CheckoutConfirmation orderId={checkout.orderId} />
            ) : null}
          </div>

          <div className="w-full flex-shrink-0 lg:w-[400px]">
            <div className="lg:sticky lg:top-24">
              <OrderSummary
                items={activeItems}
                subtotal={totals.subtotal}
                shippingMethod={checkout.selectedShippingMethod}
                tax={taxAmount}
                total={totalWithTax}
                itemCount={activeItemCount}
              />
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
