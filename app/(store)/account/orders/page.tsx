import { redirect } from 'next/navigation';
import Link from 'next/link';
import { auth } from '@/lib/auth';
import { getOrderHistory } from '@/lib/queries/orders';
import { formatEgp } from '@/lib/utils/format-egp';
import { getOrderStatusLabels, ORDER_STATUS_COLORS } from '@/lib/constants/order-status';
import { getT } from '@/lib/locale';
import type { Metadata } from 'next';

export const metadata: Metadata = { title: 'Order History' };

export default async function OrdersPage() {
  const session = await auth();
  if (!session?.user?.id) redirect('/login?callbackUrl=/account/orders');

  const orders = await getOrderHistory(session.user.id);
  const { locale, t } = getT();
  const dateLocale = locale === 'ar' ? 'ar-EG' : 'en-EG';
  const STATUS_LABELS = getOrderStatusLabels(t);

  return (
    <div className="max-w-content mx-auto px-site py-12">
      <div className="mb-8 flex items-center gap-4">
        <Link href="/account" className="text-nav-sm text-text-secondary hover:text-primary transition-colors">
          ← {t.account.title}
        </Link>
        <span className="text-text-secondary">/</span>
        <h1 className="text-section-heading font-semibold text-text-primary">{t.account.orderHistory}</h1>
      </div>

      {orders.length === 0 ? (
        <div className="bg-bg-white rounded-card-lg border border-border-primary/10 p-12 text-center">
          <p className="text-section-heading font-semibold text-text-primary mb-2">{t.account.noOrders}</p>
          <p className="text-nav-sm text-text-secondary mb-6">{t.account.noOrdersSub}</p>
          <Link
            href="/shop"
            className="inline-block px-6 py-3 bg-primary text-text-on-dark rounded-btn-sm text-nav-sm font-semibold hover:bg-primary/90 transition-colors"
          >
            {t.account.startShopping}
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => (
            <div key={order.id} className="bg-bg-white rounded-card-lg border border-border-primary/10 p-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
                <div>
                  <p className="text-nav-sm font-semibold text-text-primary">
                    {t.account.orderNumber(order.orderNumber)}
                  </p>
                  <p className="text-xs text-text-secondary">
                    {new Date(order.createdAt).toLocaleDateString(dateLocale, {
                      day: 'numeric',
                      month: 'long',
                      year: 'numeric',
                    })}
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <span className={`px-2.5 py-1 rounded-tag text-xs font-semibold ${ORDER_STATUS_COLORS[order.status] ?? 'bg-gray-100 text-gray-600'}`}>
                    {STATUS_LABELS[order.status] ?? order.status}
                  </span>
                  <span className="text-nav-sm font-semibold text-text-primary">
                    {formatEgp(Number(order.totalEgp))}
                  </span>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <p className="text-xs text-text-secondary">
                  {t.account.items(order.items.length)}
                  {order.items.length > 0 && ` — ${order.items[0].productNameSnapshot}${order.items.length > 1 ? ` ${t.account.andMore(order.items.length - 1)}` : ''}`}
                </p>
                <Link
                  href={`/account/orders/${order.id}`}
                  className="text-nav-sm font-semibold text-primary hover:underline"
                >
                  {t.account.viewDetails}
                </Link>
              </div>

              {order.status === 'pending_payment' && order.fawryPayment?.fawryRefNumber && (
                <div className="mt-3 p-3 bg-yellow-50 rounded-md border border-yellow-200">
                  <p className="text-xs text-yellow-800">
                    {t.account.fawryRef} <strong>{order.fawryPayment.fawryRefNumber}</strong>
                    {order.fawryPayment.expiryAt && (
                      <> — {t.account.payBy} {new Date(order.fawryPayment.expiryAt).toLocaleString(dateLocale)}</>
                    )}
                  </p>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
