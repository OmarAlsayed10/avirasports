'use client';

import { useState, useTransition, useEffect, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'sonner';
import { Loader2, Truck, ChevronDown } from 'lucide-react';
import { useCartStore } from '@/lib/stores/cart-store';
import { useHasMounted } from '@/lib/hooks/use-has-mounted';
import { shippingFormSchema, type ShippingFormInput } from '@/lib/validators/checkout';
import { placeOrder } from '@/lib/server-actions/checkout';
import { GOVERNORATES, GOVERNORATE_NAMES_AR } from '@/lib/constants/governorates';
import { OrderSummary } from '@/components/checkout/order-summary';
import { Breadcrumb } from '@/components/shared/breadcrumb';
import { useLocale } from '@/lib/i18n/context';
import { createZodErrorMap } from '@/lib/i18n/zod-error-map';
import { useSession } from 'next-auth/react';

interface SavedAddress {
  id: string;
  fullName: string;
  phone: string;
  addressLine: string;
  city: string;
  governorate: string;
  postalCode?: string | null;
  isDefault: boolean;
}

export default function CheckoutPage() {
  const hasMounted = useHasMounted();
  const router = useRouter();
  const { t } = useLocale();
  const isAr = t.dir === 'rtl';
  const { data: session } = useSession();
  const [isPending, startTransition] = useTransition();
  const [discountEgp, setDiscountEgp] = useState(0);
  const [appliedCoupon, setAppliedCoupon] = useState<string | null>(null);
  const [savedAddresses, setSavedAddresses] = useState<SavedAddress[]>([]);
  const [showAddresses, setShowAddresses] = useState(false);

  const items = useCartStore((s) => s.items);

  const resolver = useMemo(() => zodResolver(shippingFormSchema, { errorMap: createZodErrorMap(t) }), [t]);
  const form = useForm<ShippingFormInput>({ resolver });

  useEffect(() => {
    if (session?.user) {
      fetch('/api/account/addresses')
        .then((r) => r.json())
        .then((data: SavedAddress[]) => {
          if (Array.isArray(data)) setSavedAddresses(data);
        })
        .catch(() => {});
    }
  }, [session]);

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
    setShowAddresses(false);
  };

  const handleSubmit = form.handleSubmit((data) => {
    startTransition(async () => {
      const result = await placeOrder({
        contact: {
          email: data.email,
          fullName: data.fullName,
          phone: data.phone,
        },
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
        {/* Form */}
        <div className="flex-1">
          <form onSubmit={handleSubmit} noValidate>
            <div className="space-y-5">
              <h2 className="text-newsletter-sub font-semibold text-text-primary">
                {t.checkout.stepContact}
              </h2>

              {/* Saved addresses */}
              {savedAddresses.length > 0 && (
                <div>
                  <button
                    type="button"
                    onClick={() => setShowAddresses((v) => !v)}
                    className="flex items-center gap-2 text-nav-sm font-semibold text-primary hover:text-primary/80 transition-colors"
                  >
                    {t.checkout.savedAddresses}
                    <ChevronDown className={`w-4 h-4 transition-transform ${showAddresses ? 'rotate-180' : ''}`} />
                  </button>
                  {showAddresses && (
                    <div className="mt-2 space-y-2">
                      {savedAddresses.map((addr) => (
                        <div key={addr.id} className="flex items-start justify-between gap-3 p-3 border border-border-primary/20 rounded-btn-sm bg-bg-page">
                          <div className="text-xs text-text-primary leading-relaxed">
                            <p className="font-semibold">{addr.fullName}</p>
                            <p>{addr.addressLine}, {addr.city}</p>
                            <p>{isAr ? (GOVERNORATE_NAMES_AR[addr.governorate as keyof typeof GOVERNORATE_NAMES_AR] ?? addr.governorate) : addr.governorate}</p>
                          </div>
                          <button
                            type="button"
                            onClick={() => fillFromAddress(addr)}
                            className="flex-shrink-0 text-xs font-semibold text-primary hover:underline"
                          >
                            {t.checkout.useAddress}
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <FieldGroup label={t.checkout.fullName} error={form.formState.errors.fullName?.message} required>
                  <input
                    {...form.register('fullName')}
                    type="text"
                    placeholder={t.auth.fullNamePlaceholder}
                    className="field-input"
                  />
                </FieldGroup>
                <FieldGroup label={t.checkout.email} error={form.formState.errors.email?.message} required>
                  <input
                    {...form.register('email')}
                    type="email"
                    placeholder="you@example.com"
                    className="field-input"
                  />
                </FieldGroup>
                <FieldGroup label={t.checkout.phone} error={form.formState.errors.phone?.message} required className="sm:col-span-2">
                  <input
                    {...form.register('phone')}
                    type="tel"
                    placeholder="01xxxxxxxxx"
                    className="field-input"
                  />
                </FieldGroup>
                <FieldGroup label={t.checkout.address} error={form.formState.errors.addressLine?.message} required className="sm:col-span-2">
                  <input
                    {...form.register('addressLine')}
                    type="text"
                    placeholder="123 El Nasr Street, Apartment 5"
                    className="field-input"
                  />
                </FieldGroup>
                <FieldGroup label={t.checkout.city} error={form.formState.errors.city?.message} required>
                  <input
                    {...form.register('city')}
                    type="text"
                    placeholder="Cairo"
                    className="field-input"
                  />
                </FieldGroup>
                <FieldGroup label={t.checkout.governorate} error={form.formState.errors.governorate?.message} required>
                  <select {...form.register('governorate')} className="field-input">
                    <option value="">{t.checkout.selectGovernorate}</option>
                    {GOVERNORATES.map((g) => (
                      <option key={g} value={g}>
                        {isAr ? GOVERNORATE_NAMES_AR[g] : g}
                      </option>
                    ))}
                  </select>
                </FieldGroup>
                <FieldGroup label={t.checkout.postalCode} error={form.formState.errors.postalCode?.message}>
                  <input
                    {...form.register('postalCode')}
                    type="text"
                    placeholder={t.checkout.optional}
                    className="field-input"
                  />
                </FieldGroup>
              </div>

              {/* Payment info badge */}
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

        {/* Order Summary sidebar */}
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

function FieldGroup({
  label,
  error,
  required,
  children,
  className,
}: {
  label: string;
  error?: string;
  required?: boolean;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={className}>
      <label className="block text-xs font-semibold text-text-primary mb-1.5">
        {label}
        {required && <span className="text-color-error ml-0.5">*</span>}
      </label>
      {children}
      {error && <p className="text-xs text-color-error mt-1">{error}</p>}
    </div>
  );
}
