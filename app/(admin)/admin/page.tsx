import { prisma } from '@/infrastructure/db/prisma';
import { formatEgp } from '@/modules/_shared/utils/format-egp';
import Link from 'next/link';
import { getOrderStatusLabels } from '@/modules/_shared/constants/order-status.constants';
import type { Metadata } from 'next';
import { getT } from '@/modules/_shared/i18n/locale';

export const metadata: Metadata = { title: 'Dashboard' };

export default async function AdminDashboardPage() {
  const [totalProducts, activeProducts, totalOrders, ordersByStatus, revenueResult] =
    await Promise.all([
      prisma.product.count(),
      prisma.product.count({ where: { isActive: true } }),
      prisma.order.count(),
      prisma.order.groupBy({ by: ['status'], _count: true }),
      prisma.order.aggregate({
        where: { status: { in: ['paid', 'processing', 'shipped', 'delivered'] } },
        _sum: { totalEgp: true },
      }),
    ]);

  const { t } = getT();
  const STATUS_LABELS = getOrderStatusLabels(t);

  const stats = [
    { label: t.admin.totalProducts, value: String(totalProducts), href: '/admin/products' },
    { label: t.admin.activeProducts, value: String(activeProducts), href: '/admin/products' },
    { label: t.admin.totalOrders, value: String(totalOrders), href: '/admin/orders' },
    {
      label: t.admin.confirmedRevenue,
      value: formatEgp(Number(revenueResult._sum.totalEgp ?? 0)),
      href: '/admin/orders',
    },
  ];

  return (
    <div>
      <h1 className="text-2xl font-semibold text-gray-900 mb-6">{t.admin.dashboard}</h1>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {stats.map((stat) => (
          <Link
            key={stat.label}
            href={stat.href}
            className="bg-white rounded-lg border border-gray-200 p-5 hover:border-primary/30 transition-colors"
          >
            <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">{stat.label}</p>
            <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
          </Link>
        ))}
      </div>

      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-sm font-semibold text-gray-900 uppercase tracking-wide">
            {t.admin.ordersByStatus}
          </h2>
          <Link href="/admin/orders" className="text-xs text-primary-btn hover:underline font-medium">
            {t.admin.viewAll} →
          </Link>
        </div>
        <div className="divide-y divide-gray-100">
          {ordersByStatus.length === 0 ? (
            <p className="text-sm text-gray-400 py-2 italic">{t.admin.noOrdersYet}</p>
          ) : (
            ordersByStatus.map((row) => (
              <Link
                key={row.status}
                href={`/admin/orders?status=${row.status}`}
                className="flex items-center justify-between py-3 hover:text-primary transition-colors"
              >
                <span className="text-sm text-gray-600">
                  {STATUS_LABELS[row.status] ?? row.status}
                </span>
                <span className="text-sm font-semibold text-gray-900">{row._count}</span>
              </Link>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
