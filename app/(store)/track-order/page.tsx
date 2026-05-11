import Link from 'next/link';
import { Package, Search } from 'lucide-react';
import { getOrderByNumber } from '@/lib/queries/orders';
import { ORDER_STATUS_COLORS, getOrderStatusLabels } from '@/lib/constants/order-status';
import { formatEgp } from '@/lib/utils/format-egp';
import { getT } from '@/lib/locale';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Track Your Order',
  description: 'Enter your order number to track the status of your Avira order.',
};

interface TrackOrderPageProps {
  searchParams: { order?: string };
}

export default async function TrackOrderPage({ searchParams }: TrackOrderPageProps) {
  const { locale, t } = getT();
  const tr = t.trackOrder;

  const STATUS_STEPS = [
    { key: 'pending_payment', label: tr.stepPendingPayment },
    { key: 'paid',            label: tr.stepPaid },
    { key: 'processing',      label: tr.stepProcessing },
    { key: 'shipped',         label: tr.stepShipped },
    { key: 'delivered',       label: tr.stepDelivered },
  ];

  const STATUS_LABELS = getOrderStatusLabels(t);

  const rawOrderNumber = searchParams.order?.trim().toUpperCase() ?? '';
  const order = rawOrderNumber ? await getOrderByNumber(rawOrderNumber) : null;
  const notFound = rawOrderNumber && !order;

  const isCancelled = order?.status === 'cancelled';
  const currentStepIdx = order && !isCancelled
    ? STATUS_STEPS.findIndex((s) => s.key === order.status)
    : -1;

  const dateLocale = locale === 'ar' ? 'ar-EG' : 'en-EG';

  return (
    <div className="max-w-2xl mx-auto px-site py-12">
      <div className="mb-8">
        <h1 className="text-section-heading font-semibold text-text-primary dark:text-text-on-dark mb-1">
          {tr.heading}
        </h1>
        <p className="text-nav-sm text-text-secondary dark:text-text-footer-link">
          {tr.sub}
        </p>
      </div>

      {/* Search form */}
      <form method="GET" className="flex gap-2 mb-8">
        <input
          name="order"
          type="text"
          defaultValue={rawOrderNumber}
          placeholder={tr.placeholder}
          className="field-input flex-1"
          aria-label={tr.heading}
          autoComplete="off"
        />
        <button
          type="submit"
          className="flex items-center gap-2 px-5 h-12 bg-primary text-text-on-dark rounded-btn-sm text-nav-sm font-semibold hover:bg-primary/90 transition-colors flex-shrink-0"
        >
          <Search className="w-4 h-4" aria-hidden="true" />
          {tr.track}
        </button>
      </form>

      {/* Not found */}
      {notFound && (
        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-card-lg p-6 text-center">
          <Package className="w-10 h-10 text-red-400 mx-auto mb-3" />
          <p className="text-nav-sm font-semibold text-red-700 dark:text-red-400 mb-1">
            {tr.notFound}
          </p>
          <p className="text-xs text-red-600 dark:text-red-500">
            {tr.notFoundSub}
          </p>
        </div>
      )}

      {/* Order found */}
      {order && (
        <div className="space-y-4">
          {/* Header card */}
          <div className="bg-bg-white dark:bg-bg-surface rounded-card-lg border border-border-primary/10 dark:border-white/10 p-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <p className="text-nav-sm font-semibold text-text-primary dark:text-text-on-dark">
                  {t.account.orderNumber(order.orderNumber)}
                </p>
                <p className="text-xs text-text-secondary dark:text-text-footer-link">
                  {tr.placedOn}{' '}
                  {new Date(order.createdAt).toLocaleDateString(dateLocale, {
                    day: 'numeric', month: 'long', year: 'numeric',
                  })}
                </p>
              </div>
              <span className={`self-start sm:self-auto px-3 py-1 rounded-tag text-xs font-semibold ${ORDER_STATUS_COLORS[order.status] ?? 'bg-gray-100 text-gray-600'}`}>
                {STATUS_LABELS[order.status] ?? order.status}
              </span>
            </div>
          </div>

          {/* Status timeline */}
          {!isCancelled && (
            <div className="bg-bg-white dark:bg-bg-surface rounded-card-lg border border-border-primary/10 dark:border-white/10 p-6">
              <h2 className="text-nav-sm font-semibold text-text-primary dark:text-text-on-dark mb-6">
                {tr.deliveryProgress}
              </h2>
              <div className="flex items-start overflow-hidden">
                {STATUS_STEPS.map((step, idx) => (
                  <div key={step.key} className="flex-1 flex flex-col items-center text-center">
                    <div className="relative w-full flex items-center justify-center">
                      {idx > 0 && (
                        <div className={`absolute right-1/2 top-3 w-full h-0.5 ${idx <= currentStepIdx ? 'bg-primary' : 'bg-border-primary/20 dark:bg-white/10'}`} />
                      )}
                      <div className={`relative z-10 w-6 h-6 rounded-full flex items-center justify-center text-xs font-semibold ${
                        idx < currentStepIdx  ? 'bg-primary text-text-on-dark' :
                        idx === currentStepIdx ? 'bg-primary text-text-on-dark ring-2 ring-primary/30' :
                        'bg-bg-page dark:bg-bg-dark border border-border-primary/20 dark:border-white/20 text-text-secondary dark:text-text-footer-link'
                      }`}>
                        {idx < currentStepIdx ? '✓' : idx + 1}
                      </div>
                    </div>
                    <p className={`text-xs mt-2 leading-tight ${idx <= currentStepIdx ? 'text-text-primary dark:text-text-on-dark font-semibold' : 'text-text-secondary dark:text-text-footer-link'}`}>
                      {step.label}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {isCancelled && (
            <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-card-lg p-4">
              <p className="text-nav-sm font-semibold text-red-700 dark:text-red-400">
                {tr.cancelled}
              </p>
            </div>
          )}

          {/* Fawry reference */}
          {order.status === 'pending_payment' && order.fawryPayment?.fawryRefNumber && (
            <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-card-lg p-4">
              <p className="text-nav-sm font-semibold text-yellow-800 dark:text-yellow-400 mb-1">
                {tr.awaitingPayment}
              </p>
              <p className="text-xs text-yellow-700 dark:text-yellow-500">
                {tr.fawryRefLabel}{' '}
                <strong className="font-mono">{order.fawryPayment.fawryRefNumber}</strong>
              </p>
              {order.fawryPayment.expiryAt && (
                <p className="text-xs text-yellow-700 dark:text-yellow-500 mt-1">
                  {tr.payBy} {new Date(order.fawryPayment.expiryAt).toLocaleString(dateLocale)}
                </p>
              )}
            </div>
          )}

          {/* Items summary */}
          <div className="bg-bg-white dark:bg-bg-surface rounded-card-lg border border-border-primary/10 dark:border-white/10 p-6">
            <h2 className="text-nav-sm font-semibold text-text-primary dark:text-text-on-dark mb-4">
              {tr.items(order.items.length)}
            </h2>
            <div className="space-y-3">
              {order.items.map((item) => (
                <div key={item.id} className="flex items-center justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <p className="text-nav-sm font-medium text-text-primary dark:text-text-on-dark truncate">
                      {item.productNameSnapshot}
                    </p>
                    <p className="text-xs text-text-secondary dark:text-text-footer-link">
                      {tr.itemMeta(item.productBrandSnapshot, item.quantity)}
                    </p>
                  </div>
                  <span className="text-nav-sm font-semibold text-text-primary dark:text-text-on-dark flex-shrink-0">
                    {formatEgp(Number(item.subtotalEgp))}
                  </span>
                </div>
              ))}
            </div>
            <div className="border-t border-border-primary/10 dark:border-white/10 mt-4 pt-3 flex justify-between text-nav-sm font-semibold text-text-primary dark:text-text-on-dark">
              <span>{tr.total}</span>
              <span>{formatEgp(Number(order.totalEgp))}</span>
            </div>
          </div>

          <p className="text-xs text-text-secondary dark:text-text-footer-link text-center">
            {tr.haveAccount}{' '}
            <Link href="/login" className="text-primary dark:text-primary-btn hover:underline font-medium">
              {tr.signIn}
            </Link>{' '}
            {tr.toSeeDetails}
          </p>
        </div>
      )}

      {!rawOrderNumber && (
        <div className="text-center py-8 text-text-secondary dark:text-text-footer-link">
          <Package className="w-14 h-14 mx-auto mb-4 opacity-30" />
          <p className="text-nav-sm">{tr.enterNumber}</p>
        </div>
      )}
    </div>
  );
}
