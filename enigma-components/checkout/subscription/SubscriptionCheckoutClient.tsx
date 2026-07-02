'use client';

import { cn } from '@/lib/utils/cn';
import { CHECKOUT_STEPS } from '@/lib/utils/constants';
import SubscriptionCheckoutLayout from '@/components/checkout/subscription/SubscriptionCheckoutLayout';
import CheckoutSteps, { type SubscriptionCheckoutStep } from '@/components/checkout/subscription/CheckoutSteps';
import CustomerInfoForm from '@/components/checkout/subscription/CustomerInfoForm';
import ShippingAddressForm from '@/components/checkout/subscription/ShippingAddressForm';
import BillingTerms from '@/components/checkout/subscription/BillingTerms';
import CheckoutButton from '@/components/checkout/subscription/CheckoutButton';
import StripeRedirectMessage from '@/components/checkout/subscription/StripeRedirectMessage';
import { useSubscriptionCheckoutFlow } from './useSubscriptionCheckoutFlow';
import type { SubscriptionCheckoutClientProps } from './subscriptionCheckoutUtils';

export default function SubscriptionCheckoutClient({
    cart,
    sellingPlans,
    pricingPreview,
    summaryPanel,
    pricingPanel,
    subscriptionSummaryPanel,
}: SubscriptionCheckoutClientProps) {
    const {
        displayError,
        handleCheckout,
        isProcessing,
        policyText,
        setCustomerInfo,
        setShippingAddress,
        setTermsAccepted,
        termsAccepted,
        termsText,
    } = useSubscriptionCheckoutFlow({
        cart,
        sellingPlans,
        pricingPreview,
    });

    const steps: SubscriptionCheckoutStep[] = [
        { id: CHECKOUT_STEPS.CART, name: 'Information', completed: false, current: true },
        { id: CHECKOUT_STEPS.SHIPPING, name: 'Shipping', completed: false, current: false },
        { id: CHECKOUT_STEPS.PAYMENT, name: 'Payment', completed: false, current: false },
    ];

    return (
        <SubscriptionCheckoutLayout
            header={(
                <div className="space-y-2">
                    <h1 className="text-2xl font-bold tracking-tight @md:text-3xl">Subscription Checkout</h1>
                    <p className="text-sm text-text-muted @md:text-base">
                        Complete your subscription checkout.
                    </p>
                </div>
            )}
            steps={<CheckoutSteps steps={steps} currentStepId={steps[0].id} />}
            leftColumn={(
                <div className="space-y-10">
                    <section className="space-y-4">
                        <h2 className="text-xl font-semibold text-text-base">Customer information</h2>
                        <CustomerInfoForm
                            onChange={setCustomerInfo}
                        />
                    </section>
                    <section className="space-y-4">
                        <h2 className="text-xl font-semibold text-text-base">Shipping address</h2>
                        <ShippingAddressForm
                            onChange={setShippingAddress}
                        />
                    </section>
                    <section className="space-y-4 border-t border-border pt-6">
                        <h2 className="text-xl font-semibold text-text-base">Billing terms</h2>
                        <BillingTerms
                            checked={termsAccepted}
                            termsText={termsText}
                            policyText={policyText}
                            onChange={setTermsAccepted}
                        />
                    </section>
                    {displayError ? (
                        <div className={cn('@container w-full rounded-card border border-danger bg-danger-subtle px-4 py-3 text-sm text-danger')}>
                            {displayError}
                        </div>
                    ) : null}
                </div>
            )}
            rightColumn={(
                <div className="space-y-6 @lg:sticky @lg:top-28">
                    {summaryPanel}
                    {pricingPanel}
                    {subscriptionSummaryPanel}
                    <div className="space-y-3">
                        <CheckoutButton
                            onClick={handleCheckout}
                            isLoading={isProcessing}
                            disabled={!termsAccepted}
                        />
                        <StripeRedirectMessage />
                    </div>
                </div>
            )}
        />
    );
}
