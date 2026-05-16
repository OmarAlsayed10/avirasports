import Link from 'next/link';
import { prisma } from '@/infrastructure/db/prisma';
import { formatEgp } from '@/modules/_shared/utils/format-egp';
import { getOrderStatusLabels, ORDER_STATUS_COLORS } from '@/modules/_shared/constants/order-status.constants';
import type { Metadata } from 'next';
import type { OrderStatus } from '@prisma/client';
import { getT } from '@/modules/_shared/i18n/locale';

export const metadata: Metadata = { title: 'Orders' };

const STATUS_COLORS = ORDER_STATUS_COLORS;

interface Props {
  searchParams: { page?: string; status?: string };
}

export default async function AdminOrdersPage({ searchParams }: Props) {
  const page = Math.max(1, Number(searchParams.page ?? 1));
  const limit = 25;
  const statusFilter = searchParams.status as OrderStatus | undefined;

  const where = statusFilter ? { status: statusFilter } : {};

  const [orders, total] = await Promise.all([
    prisma.order.findMany({
      where,
      skip: (page - 1) * limit,
      take: limit,
      orderBy: { createdAt: 'desc' },
      include: {
        items: { take: 1, select: { productNameSnapshot: true } },
        fawryPayment: { select: { status: true, fawryRefNumber: true } },
      },
    }),
    prisma.order.count({ where }),
  ]);

  const totalPages = Math.ceil(total / limit);
  const { t } = getT();
  const STATUS_LABELS = getOrderStatusLabels(t);
  const allStatuses = Object.keys(STATUS_LABELS) as OrderStatus[];

  return (
    <div>
      <h1 className="text-2xl font-semibold text-gray-900 mb-6">{t.admin.orders}</h1>

      <div className="flex gap-2 mb-5 flex-wrap">
        <Link
          href="/admin/orders"
          className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${
            !statusFilter
              ? 'bg-primary text-white'
              : 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-50'
          }`}
        >
          {t.admin.all(total)}
        </Link>
        {allStatuses.map((s) => (
          <Link
            key={s}
            href={`/admin/orders?status=${s}`}
            className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${
              statusFilter === s
                ? 'bg-primary text-white'
                : 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-50'
            }`}
          >
            {STATUS_LABELS[s]}
          </Link>
        ))}
      </div>

      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="text-left px-4 py-3 font-medium text-gray-500 text-xs uppercase tracking-wide">
                  {t.admin.orderNumber}
                </th>
                <th className="text-left px-4 py-3 font-medium text-gray-500 text-xs uppercase tracking-wide">
                  {t.admin.customer}
                </th>
                <th className="text-left px-4 py-3 font-medium text-gray-500 text-xs uppercase tracking-wide">
                  {t.admin.date}
                </th>
                <th className="text-left px-4 py-3 font-medium text-gray-500 text-xs uppercase tracking-wide">
                  {t.admin.total}
                </th>
                <th className="text-left px-4 py-3 font-medium text-gray-500 text-xs uppercase tracking-wide">
                  {t.admin.status}
                </th>
                <th className="px-4 py-3" />
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {orders.map((order) => (
                <tr key={order.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-4 py-3 font-mono text-xs text-gray-700">
                    {order.orderNumber}
                  </td>
                  <td className="px-4 py-3">
                    <p className="font-medium text-gray-900">{order.shippingFullName}</p>
                    <p className="text-xs text-gray-400">{order.email}</p>
                  </td>
                  <td className="px-4 py-3 text-gray-500 text-xs whitespace-nowrap">
                    {new Date(order.createdAt).toLocaleDateString('en-EG', {
                      day: 'numeric',
                      month: 'short',
                      year: 'numeric',
                    })}
                  </td>
                  <td className="px-4 py-3 font-semibold text-gray-900">
                    {formatEgp(Number(order.totalEgp))}
                  </td>
                  <td className="px-4 py-3">
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-medium ${STATUS_COLORS[order.status] ?? 'bg-gray-100 text-gray-600'}`}
                    >
                      {STATUS_LABELS[order.status] ?? order.status}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-right">
                    <Link
                      href={`/admin/orders/${order.id}`}
                      className="text-xs text-primary-btn hover:underline font-medium"
                    >
                      {t.admin.view}
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {orders.length === 0 && (
          <div className="text-center py-12 text-gray-400 text-sm">{t.admin.noOrdersFound}</div>
        )}

        {totalPages > 1 && (
          <div className="flex items-center justify-between px-4 py-3 border-t border-gray-200">
            <p className="text-xs text-gray-500">
              {t.admin.ordersCount((page - 1) * limit + 1, Math.min(page * limit, total), total)}
            </p>
            <div className="flex gap-2">
              {page > 1 && (
                <Link
                  href={`/admin/orders?page=${page - 1}${statusFilter ? `&status=${statusFilter}` : ''}`}
                  className="px-3 py-1.5 text-xs border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
                >
                  {t.admin.previous}
                </Link>
              )}
              {page < totalPages && (
                <Link
                  href={`/admin/orders?page=${page + 1}${statusFilter ? `&status=${statusFilter}` : ''}`}
                  className="px-3 py-1.5 text-xs border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
                >
                  {t.admin.next}
                </Link>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
