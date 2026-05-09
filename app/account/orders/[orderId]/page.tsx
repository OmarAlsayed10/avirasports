import { notFound, redirect } from 'next/navigation';
import Link from 'next/link';
import { auth } from '@/lib/auth';
import { getOrder } from '@/lib/queries/orders';
import { formatEgp } from '@/lib/utils/format-egp';
import { getT } from '@/lib/locale';
import type { Metadata } from 'next';

export const metadata: Metadata = { title: 'Order Details' };

export default async function OrderDetailPage({ params }: { params: { orderId: string } }) {
  const session = await auth();
  if (!session?.user?.id) redirect('/login?callbackUrl=/account');

  const order = await getOrder(params.orderId, session.user.id);
  if (!order) notFound();

  const { locale, t } = getT();
  const tr = t.trackOrder;

  const STATUS_STEPS = [
    { key: 'pending_payment', label: tr.stepPendingPayment },
    { key: 'paid',            label: tr.stepPaid },
    { key: 'processing',      label: tr.stepProcessing },
    { key: 'shipped',         label: tr.stepShipped },
    { key: 'delivered',       label: tr.stepDelivered },
  ];

  const isCancelled = order.status === 'cancelled';
  const currentStepIdx = isCancelled ? -1 : STATUS_STEPS.findIndex((s) => s.key === order.status);

  const dateLocale = locale === 'ar' ? 'ar-EG' : 'en-EG';

  return (
    <div className="max-w-2xl mx-auto px-site py-12">
      <div className="flex items-center gap-4 mb-8">
        <Link href="/account" className="text-nav-sm text-text-secondary hover:text-primary">
          {tr.backToOrders}
        </Link>
      </div>

      <h1 className="text-section-heading font-semibold text-text-primary mb-1">
        {t.account.orderNumber(order.orderNumber)}
      </h1>
      <p className="text-nav-sm text-text-secondary mb-8">
        {tr.placedOn}{' '}
        {new Date(order.createdAt).toLocaleDateString(dateLocale, { day: 'numeric', month: 'long', year: 'numeric' })}
      </p>

      {/* Status timeline */}
      {!isCancelled && (
        <div className="bg-bg-white rounded-card-lg border border-border-primary/10 p-6 mb-6">
          <h2 className="text-nav-sm font-semibold text-text-primary mb-4">{tr.orderStatus}</h2>
          <div className="flex items-start overflow-hidden">
            {STATUS_STEPS.map((step, idx) => (
              <div key={step.key} className="flex-1 flex flex-col items-center text-center">
                <div className="relative w-full flex items-center justify-center">
                  {idx > 0 && (
                    <div className={`absolute right-1/2 top-3 w-full h-0.5 ${idx <= currentStepIdx ? 'bg-primary' : 'bg-border-primary/20'}`} />
                  )}
                  <div className={`relative z-10 w-6 h-6 rounded-full flex items-center justify-center text-xs font-semibold ${
                    idx < currentStepIdx ? 'bg-primary text-text-on-dark' :
                    idx === currentStepIdx ? 'bg-primary text-text-on-dark ring-2 ring-primary/30' :
                    'bg-bg-page border border-border-primary/20 text-text-secondary'
                  }`}>
                    {idx < currentStepIdx ? '✓' : idx + 1}
                  </div>
                </div>
                <p className={`text-xs mt-2 leading-tight ${idx <= currentStepIdx ? 'text-text-primary font-semibold' : 'text-text-secondary'}`}>
                  {step.label}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

      {isCancelled && (
        <div className="bg-red-50 border border-red-200 rounded-card-lg p-4 mb-6">
          <p className="text-nav-sm font-semibold text-red-700">{tr.cancelled}</p>
        </div>
      )}

      {/* Fawry reference if pending */}
      {order.status === 'pending_payment' && order.fawryPayment?.fawryRefNumber && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-card-lg p-4 mb-6">
          <p className="text-nav-sm font-semibold text-yellow-800 mb-1">{tr.awaitingPayment}</p>
          <p className="text-xs text-yellow-700">
            {tr.fawryRefLabel} <strong className="font-mono">{order.fawryPayment.fawryRefNumber}</strong>
          </p>
          {order.fawryPayment.expiryAt && (
            <p className="text-xs text-yellow-700 mt-1">
              {tr.payBy} {new Date(order.fawryPayment.expiryAt).toLocaleString(dateLocale)}
            </p>
          )}
        </div>
      )}

      {/* Items */}
      <div className="bg-bg-white rounded-card-lg border border-border-primary/10 p-6 mb-6">
        <h2 className="text-nav-sm font-semibold text-text-primary mb-4">{tr.itemsHeading}</h2>
        <div className="space-y-3">
          {order.items.map((item) => (
            <div key={item.id} className="flex items-center justify-between gap-4">
              <div className="flex-1 min-w-0">
                <p className="text-nav-sm font-semibold text-text-primary truncate">
                  {item.productNameSnapshot}
                </p>
                <p className="text-xs text-text-secondary">
                  {tr.itemMeta(item.productBrandSnapshot, item.quantity)}
                </p>
              </div>
              <span className="text-nav-sm font-semibold text-text-primary flex-shrink-0">
                {formatEgp(Number(item.subtotalEgp))}
              </span>
            </div>
          ))}
        </div>

        <div className="border-t border-border-primary/10 mt-4 pt-4 space-y-1">
          <div className="flex justify-between text-nav-sm text-text-secondary">
            <span>{tr.subtotal}</span>
            <span>{formatEgp(Number(order.subtotalEgp))}</span>
          </div>
          <div className="flex justify-between text-nav-sm text-text-secondary">
            <span>{tr.shipping}</span>
            <span>{formatEgp(Number(order.shippingCostEgp))}</span>
          </div>
          <div className="flex justify-between text-nav-sm font-semibold text-text-primary">
            <span>{tr.total}</span>
            <span>{formatEgp(Number(order.totalEgp))}</span>
          </div>
        </div>
      </div>

      {/* Shipping address */}
      <div className="bg-bg-white rounded-card-lg border border-border-primary/10 p-6">
        <h2 className="text-nav-sm font-semibold text-text-primary mb-3">{tr.shippingAddress}</h2>
        <p className="text-nav-sm text-text-primary">{order.shippingFullName}</p>
        <p className="text-nav-sm text-text-secondary">{order.shippingAddressLine}</p>
        <p className="text-nav-sm text-text-secondary">{order.shippingCity}, {order.shippingGovernorate}</p>
        <p className="text-nav-sm text-text-secondary">{order.shippingPhone}</p>
      </div>
    </div>
  );
}
