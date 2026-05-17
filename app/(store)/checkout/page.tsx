'use client';

import { useState, useTransition, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'sonner';
import { Loader2, Truck } from 'lucide-react';
import { useCartStore } from '@/modules/cart/cart.store';
import { useHasMounted } from '@/modules/_shared/hooks/use-has-mounted';
import { shippingFormSchema, type ShippingFormInput } from '@/modules/checkout/checkout.validators';
import { placeOrder } from '@/modules/checkout/checkout.service';
import { OrderSummary } from '@/modules/checkout/components/order-summary';
import { SavedAddressPicker } from '@/modules/checkout/components/saved-address-picker';
import { ShippingFields } from '@/modules/checkout/components/shipping-fields';
import { Breadcrumb } from '@/modules/_shared/ui/breadcrumb';
import { useLocale } from '@/modules/_shared/i18n/i18n.context';
import { createZodErrorMap } from '@/modules/_shared/i18n/i18n.zod-error-map';
import { useAddresses, type SavedAddress } from '@/modules/checkout/hooks/use-addresses';

export default function CheckoutPage() {
  const hasMounted = useHasMounted();
  const router = useRouter();
  const { t } = useLocale();
  const [isPending, startTransition] = useTransition();
  const [discountEgp, setDiscountEgp] = useState(0);
  const [appliedCoupon, setAppliedCoupon] = useState<string | null>(null);
  const savedAddresses = useAddresses();
  const items = useCartStore((s) => s.items);

  const resolver = useMemo(() => zodResolver(shippingFormSchema, { errorMap: createZodErrorMap(t) }), [t]);
  const form = useForm<ShippingFormInput>({ resolver });

  const handleCouponApplied = ({ discountEgp: d, code }: { discountEgp: number; code: string }) => {
    if (code) {
      setDiscountEgp(d);
      setAppliedCoupon(code);
    } else {
      setDiscountEgp(0);
      setAppliedCoupon(null);
    }
  };

  const fillFromAddress = (addr: SavedAddress) => {
    form.setValue('fullName', addr.fullName);
    form.setValue('phone', addr.phone);
    form.setValue('addressLine', addr.addressLine);
    form.setValue('city', addr.city);
    form.setValue('governorate', addr.governorate as ShippingFormInput['governorate']);
    if (addr.postalCode) form.setValue('postalCode', addr.postalCode);
  };

  const handleSubmit = form.handleSubmit((data) => {
    startTransition(async () => {
      const result = await placeOrder({
        contact: { email: data.email, fullName: data.fullName, phone: data.phone },
        shipping: {
          addressLine: data.addressLine,
          city: data.city,
          governorate: data.governorate,
          postalCode: data.postalCode,
        },
        couponCode: appliedCoupon ?? undefined,
        cartItems: items.map((item) => ({
          productId: item.productId,
          variantId: item.variantId,
          quantity: item.quantity,
          note: item.note,
        })),
      });

      if (!result.ok) {
        toast.error(result.error);
        return;
      }

      router.push(result.data.redirectTo);
    });
  });

  if (!hasMounted) return null;

  if (items.length === 0) {
    return (
      <div className="max-w-content mx-auto px-site py-16 text-center">
        <p className="text-newsletter-sub font-semibold text-text-primary mb-4">{t.checkout.emptyCart}</p>
        <a href="/shop" className="text-nav-sm text-primary hover:underline">
          {t.checkout.continueShopping}
        </a>
      </div>
    );
  }

  return (
    <div className="max-w-content mx-auto px-site py-8">
      <Breadcrumb items={[{ label: t.checkout.breadcrumb }]} />

      <h1 className="text-section-heading font-semibold text-text-primary mt-4 mb-8">{t.checkout.title}</h1>

      <div className="flex flex-col lg:flex-row gap-8">
        <div className="flex-1">
          <form onSubmit={handleSubmit} noValidate>
            <div className="space-y-5">
              <h2 className="text-newsletter-sub font-semibold text-text-primary">
                {t.checkout.stepContact}
              </h2>

              <SavedAddressPicker addresses={savedAddresses} onSelect={fillFromAddress} />

              <ShippingFields form={form} />

              <div className="flex items-center gap-3 p-4 rounded-carousel border border-border-primary/20 bg-bg-page">
                <Truck className="w-5 h-5 text-primary flex-shrink-0" />
                <div>
                  <p className="text-nav-sm font-semibold text-text-primary">{t.checkout.cashOnDelivery}</p>
                  <p className="text-xs text-text-secondary">{t.checkout.codSub}</p>
                </div>
              </div>

              <button
                type="submit"
                disabled={isPending}
                className="w-full flex items-center justify-center gap-2 py-3 bg-primary-btn text-text-on-dark rounded-btn-sm text-nav-sm font-semibold disabled:opacity-60 hover:bg-primary transition-colors"
              >
                {isPending && <Loader2 className="w-4 h-4 animate-spin" />}
                {isPending ? t.checkout.placingOrder : t.checkout.placeOrder}
              </button>
            </div>
          </form>
        </div>

        <div className="w-full lg:w-96 flex-shrink-0">
          <OrderSummary
            items={items}
            discountEgp={discountEgp}
            appliedCoupon={appliedCoupon}
            onCouponApplied={handleCouponApplied}
          />
        </div>
      </div>
    </div>
  );
}
