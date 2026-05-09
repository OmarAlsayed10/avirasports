import Link from 'next/link';
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { Check } from 'lucide-react';
import { getOrderByNumber } from '@/lib/queries/orders';
import { formatEgpSimple } from '@/lib/utils/format-egp';
import { SHIPPING_METHODS } from '@/lib/constants/shipping-methods';
import { getT } from '@/lib/locale';

export const metadata: Metadata = {
  title: 'Order Confirmed',
};

interface SuccessPageProps {
  searchParams: { orderNumber?: string };
}

export default async function OrderSuccessPage({ searchParams }: SuccessPageProps) {
  const { orderNumber } = searchParams;
  if (!orderNumber) notFound();

  const order = await getOrderByNumber(orderNumber);
  if (!order) notFound();

  const { t } = getT();

  const estimatedDays = SHIPPING_METHODS.STANDARD.days;

  return (
    <div className="max-w-content mx-auto px-site py-12">
      <div className="max-w-xl mx-auto text-center">
        {/* Success icon */}
        <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-success/15 flex items-center justify-center">
          <Check className="w-10 h-10 text-success" strokeWidth={2.5} aria-hidden="true" />
        </div>

        <h1 className="text-section-heading font-semibold text-text-primary mb-2">
          {t.checkout.orderConfirmed}
        </h1>
        <p className="text-nav-sm text-text-secondary mb-8">
          {t.checkout.orderConfirmedSub}
        </p>

        {/* Order summary card */}
        <div className="bg-bg-white rounded-carousel border border-border-primary/10 p-6 text-start space-y-4 mb-8">
          <div className="flex justify-between">
            <span className="text-nav-sm text-text-secondary">{t.checkout.orderNumber}</span>
            <span className="text-nav-sm font-semibold text-text-primary">#{order.orderNumber}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-nav-sm text-text-secondary">{t.checkout.paymentMethodLabel}</span>
            <span className="text-nav-sm font-medium text-text-primary">
              Cash on Delivery
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-nav-sm text-text-secondary">{t.checkout.estimatedDelivery}</span>
            <span className="text-nav-sm font-medium text-text-primary">{estimatedDays}</span>
          </div>

          <hr className="border-border-primary/10" />

          {/* Items */}
          <div className="space-y-2">
            {order.items.map((item) => (
              <div key={item.id} className="flex justify-between">
                <span className="text-nav-sm text-text-primary">
                  {item.productNameSnapshot} × {item.quantity}
                </span>
                <span className="text-nav-sm font-medium text-text-primary">
                  {formatEgpSimple(Number(item.subtotalEgp))}
                </span>
              </div>
            ))}
          </div>

          <hr className="border-border-primary/10" />

          <div className="flex justify-between">
            <span className="text-nav-sm font-semibold text-text-primary">{t.checkout.total}</span>
            <span className="text-newsletter-sub font-semibold text-text-primary">
              {formatEgpSimple(Number(order.totalEgp))}
            </span>
          </div>
        </div>

        {/* CTAs */}
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link
            href="/shop"
            className="px-8 py-3 bg-primary-btn text-text-on-dark rounded-btn-sm text-nav-sm font-semibold hover:bg-primary transition-colors"
          >
            {t.checkout.continueShopping}
          </Link>
          <Link
            href={`/account/orders/${order.id}`}
            className="px-8 py-3 border border-border-primary text-text-primary rounded-btn-sm text-nav-sm font-semibold hover:bg-bg-page transition-colors"
          >
            {t.checkout.trackOrder}
          </Link>
        </div>
      </div>
    </div>
  );
}
