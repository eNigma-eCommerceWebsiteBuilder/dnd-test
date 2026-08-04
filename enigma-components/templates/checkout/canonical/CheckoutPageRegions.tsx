'use client';

import type { ReactNode } from 'react';
import { CheckoutSteps } from '@/enigma-components/checkout/CheckoutSteps';
import { OrderReview } from '@/enigma-components/checkout/OrderReview';
import { OrderSummary } from '@/enigma-components/checkout/OrderSummary';
import { PlaceOrderButton } from '@/enigma-components/checkout/PlaceOrderButton';
import { SecureBadges } from '@/enigma-components/checkout/SecureBadges';
import { ShippingForm } from '@/enigma-components/checkout/ShippingForm';
import { ShippingMethodSelector } from '@/enigma-components/checkout/ShippingMethodSelector';
import { CheckoutStepCode } from '@/lib/utils/constants';
import { formatPrice } from '@/lib/utils/formatters';
import { CheckoutConfirmation } from '../CheckoutConfirmation';
import { CheckoutErrorAlert } from '../CheckoutErrorAlert';
import { CheckoutPaymentStep } from '../CheckoutPaymentStep';
import { getPaymentMethodLabel, toAddressFormData } from '../checkoutPageUtils';
import { useCheckoutFlowContext } from './CheckoutFlowProvider';

export function CheckoutStepsRegion() {
  const { checkout } = useCheckoutFlowContext();

  return (
    <CheckoutSteps
      steps={checkout.steps}
      currentStepId={checkout.currentStepId}
      onStepClick={checkout.goToStep}
      className="mb-6 md:mb-8"
    />
  );
}

export function CheckoutPageHeader() {
  return (
    <div>
      <h1 className="mb-2 text-2xl font-bold tracking-tight md:text-3xl">Checkout</h1>
      <p className="text-sm text-text-muted md:text-base">
        Complete your order by providing your shipping and payment details.
      </p>
    </div>
  );
}

export function CheckoutErrorCondition({ content }: { content?: ReactNode }) {
  const { checkout } = useCheckoutFlowContext();

  if (!checkout.error) {
    return null;
  }

  return <>{content ?? <CheckoutErrorAlert message={checkout.error} onDismiss={checkout.clearError} />}</>;
}

export function CheckoutShippingSection({
  form,
  shippingMethod,
}: {
  form?: ReactNode;
  shippingMethod?: ReactNode;
}) {
  const { checkout } = useCheckoutFlowContext();

  if (
    checkout.currentStepId !== CheckoutStepCode.CART
    && checkout.currentStepId !== CheckoutStepCode.SHIPPING
  ) {
    return null;
  }

  return (
    <div className="space-y-8 animate-fade-in">
      {form ?? <CheckoutShippingForm />}
      {shippingMethod ?? <CheckoutShippingMethodCondition content={<CheckoutShippingMethod />} />}
    </div>
  );
}

export function CheckoutShippingForm() {
  const { checkout } = useCheckoutFlowContext();

  return (
    <ShippingForm
      initialData={toAddressFormData(checkout.shippingAddress)}
      onSubmit={async (data) => {
        await checkout.setShippingAddress(data);
      }}
      submitLabel="Save Shipping Address"
      isLoading={checkout.loading}
    />
  );
}

export function CheckoutShippingMethodCondition({ content }: { content?: ReactNode }) {
  const { checkout } = useCheckoutFlowContext();

  if (!checkout.shippingAddress) {
    return null;
  }

  return <>{content ?? <CheckoutShippingMethod />}</>;
}

export function CheckoutShippingMethod() {
  const { checkout, scrollToTop } = useCheckoutFlowContext();

  return (
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
  );
}

export function CheckoutPaymentCondition({ content }: { content?: ReactNode }) {
  const { checkout } = useCheckoutFlowContext();

  if (checkout.currentStepId !== CheckoutStepCode.PAYMENT) {
    return null;
  }

  return <>{content ?? <CheckoutPaymentStepRegion />}</>;
}

export function CheckoutPaymentStepRegion() {
  const {
    checkout,
    contactEmail,
    emailError,
    selectedPaymentMethodId,
    setContactEmail,
    setSelectedPaymentMethodId,
    continueToReview,
    scrollToTop,
  } = useCheckoutFlowContext();

  return (
    <CheckoutPaymentStep
      contactEmail={contactEmail}
      emailError={emailError}
      isLoading={checkout.loading}
      paymentMethodId={selectedPaymentMethodId}
      onBack={() => {
        checkout.prevStep();
        scrollToTop();
      }}
      onContactEmailChange={setContactEmail}
      onContinue={continueToReview}
      onPaymentMethodChange={(value) => setSelectedPaymentMethodId(value as typeof selectedPaymentMethodId)}
    />
  );
}

export function CheckoutReviewCondition({ content }: { content?: ReactNode }) {
  const { checkout } = useCheckoutFlowContext();

  if (
    checkout.currentStepId !== CheckoutStepCode.REVIEW
    || !checkout.shippingAddress
  ) {
    return null;
  }

  return <>{content ?? <CheckoutReviewSection />}</>;
}

export function CheckoutReviewSection() {
  const {
    activeItems,
    checkout,
    contactEmail,
    selectedPaymentMethodId,
    totals,
    totalWithTax,
    completeCheckout,
    scrollToTop,
  } = useCheckoutFlowContext();

  return (
    <div className="space-y-8 animate-fade-in">
      <h2 className="text-2xl font-bold">Review Your Order</h2>

      <OrderReview
        items={activeItems}
        shippingAddress={toAddressFormData(checkout.shippingAddress)!}
        shippingMethodName={checkout.selectedShippingMethod?.name || 'Standard Shipping'}
        paymentMethodName={getPaymentMethodLabel(selectedPaymentMethodId)}
        total={totals.total}
        email={checkout.orderData.email || contactEmail.trim()}
        onEditStep={(stepId) => {
          checkout.goToStep(stepId);
          scrollToTop();
        }}
      />

      <PlaceOrderButton
        onClick={completeCheckout}
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
  );
}

export function CheckoutConfirmationCondition({ content }: { content?: ReactNode }) {
  const { checkout } = useCheckoutFlowContext();

  if (checkout.currentStepId !== CheckoutStepCode.CONFIRMATION) {
    return null;
  }

  return <>{content ?? <CheckoutConfirmation orderId={checkout.orderId} />}</>;
}

export function CheckoutOrderSummaryPanel() {
  const {
    activeItemCount,
    activeItems,
    checkout,
    taxAmount,
    totals,
    totalWithTax,
  } = useCheckoutFlowContext();

  return (
    <OrderSummary
      items={activeItems}
      subtotal={totals.subtotal}
      shippingMethod={checkout.selectedShippingMethod}
      tax={taxAmount}
      total={totalWithTax}
      itemCount={activeItemCount}
    />
  );
}
