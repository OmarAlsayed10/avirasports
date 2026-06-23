import { redirect } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { auth } from '@/infrastructure/auth/auth.config';
import { getOrderHistory } from '@/modules/order/order.queries';
import { Package, MapPin, User, ChevronRight } from 'lucide-react';
import { getOrderStatusLabels, ORDER_STATUS_COLORS } from '@/modules/_shared/constants/order-status.constants';
import { formatEgp } from '@/modules/_shared/utils/format-egp';
import { getT } from '@/modules/_shared/i18n/locale';
import type { Metadata } from 'next';

export const metadata: Metadata = { title: 'My Account' };

export default async function AccountPage() {
  const session = await auth();
  if (!session?.user?.id) return

  const { locale, t } = getT();
  const dateLocale = locale === 'ar' ? 'ar-EG' : 'en-EG';
  const STATUS_LABELS = getOrderStatusLabels(t);

  const recentOrders = await getOrderHistory(session.user.id);
  const previewOrders = recentOrders.slice(0, 3);
  const totalOrders = recentOrders.length;

  const { name, email, image } = session.user;

  const QUICK_LINKS = [
    { href: '/account/orders', label: t.account.orderHistory, icon: Package, desc: t.account.ordersCount(totalOrders) },
    { href: '/account/addresses', label: t.account.addresses, icon: MapPin, desc: t.account.manageAddresses },
    { href: '/account/profile', label: t.account.profile, icon: User, desc: t.account.editNamePassword },
  ];

  return (
    <div className="max-w-content mx-auto px-site py-12 space-y-8">
      <div className="flex items-center gap-4">
        <div className="w-16 h-16 rounded-full bg-primary-btn flex items-center justify-center overflow-hidden flex-shrink-0">
          {image ? (
            <Image src={image} alt={name ?? 'Avatar'} width={64} height={64} className="w-full h-full object-cover" />
          ) : (
            <User className="w-8 h-8 text-bg-dark" />
          )}
        </div>
        <div>
          <h1 className="text-section-heading font-semibold text-text-primary dark:text-text-on-dark">
            {name ?? t.account.title}
          </h1>
          <p className="text-nav-sm text-text-secondary dark:text-text-footer-link">{email}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {QUICK_LINKS.map(({ href, label, icon: Icon, desc }) => (
          <Link
            key={href}
            href={href}
            className="flex items-center gap-4 bg-bg-white dark:bg-bg-surface rounded-card-lg border border-border-primary/10 dark:border-white/10 p-5 hover:border-primary/40 dark:hover:border-primary-btn/40 transition-colors group"
          >
            <div className="w-10 h-10 rounded-full bg-bg-page dark:bg-bg-dark flex items-center justify-center flex-shrink-0">
              <Icon className="w-5 h-5 text-text-secondary dark:text-text-footer-link group-hover:text-primary dark:group-hover:text-primary-btn transition-colors" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-nav-sm font-semibold text-text-primary dark:text-text-on-dark">{label}</p>
              <p className="text-xs text-text-secondary dark:text-text-footer-link">{desc}</p>
            </div>
            <ChevronRight className="w-4 h-4 text-text-secondary opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0" />
          </Link>
        ))}
      </div>

      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-nav-sm font-semibold text-text-primary dark:text-text-on-dark">
            {t.account.orderHistory}
          </h2>
          {totalOrders > 0 && (
            <Link href="/account/orders" className="text-xs font-semibold text-primary dark:text-primary-btn hover:underline">
              {t.account.viewAll}
            </Link>
          )}
        </div>

        {previewOrders.length === 0 ? (
          <div className="bg-bg-white dark:bg-bg-surface rounded-card-lg border border-border-primary/10 dark:border-white/10 p-8 text-center">
            <p className="text-nav-sm font-semibold text-text-primary dark:text-text-on-dark mb-2">{t.account.noOrders}</p>
            <p className="text-xs text-text-secondary dark:text-text-footer-link mb-4">{t.account.noOrdersSub}</p>
            <Link
              href="/shop"
              className="inline-block px-5 py-2 bg-primary text-text-on-dark rounded-btn-sm text-nav-sm font-semibold hover:bg-primary/90 transition-colors"
            >
              {t.account.startShopping}
            </Link>
          </div>
        ) : (
          <div className="space-y-3">
            {previewOrders.map((order) => (
              <div key={order.id} className="bg-bg-white dark:bg-bg-surface rounded-card-lg border border-border-primary/10 dark:border-white/10 p-5">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div>
                    <p className="text-nav-sm font-semibold text-text-primary dark:text-text-on-dark">
                      {t.account.orderNumber(order.orderNumber)}
                    </p>
                    <p className="text-xs text-text-secondary dark:text-text-footer-link">
                      {new Date(order.createdAt).toLocaleDateString(dateLocale, {
                        day: 'numeric', month: 'long', year: 'numeric',
                      })}
                    </p>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className={`px-2.5 py-1 rounded-tag text-xs font-semibold ${ORDER_STATUS_COLORS[order.status] ?? 'bg-gray-100 text-gray-600'}`}>
                      {STATUS_LABELS[order.status] ?? order.status}
                    </span>
                    <span className="text-nav-sm font-semibold text-text-primary dark:text-text-on-dark">
                      {formatEgp(Number(order.totalEgp))}
                    </span>
                    <Link
                      href={`/account/orders/${order.id}`}
                      className="text-nav-sm font-semibold text-primary dark:text-primary-btn hover:underline"
                    >
                      {t.account.viewDetails}
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
