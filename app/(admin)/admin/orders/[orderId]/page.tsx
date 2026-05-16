import { prisma } from '@/infrastructure/db/prisma';
import { formatEgp } from '@/modules/_shared/utils/format-egp';
import OrderStatusSelect from '@/modules/admin/orders/components/order-status-select';
import { OrderItemImage } from '@/modules/admin/orders/components/order-item-image';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { getOrderStatusLabels, ORDER_STATUS_COLORS } from '@/modules/_shared/constants/order-status.constants';
import type { Prisma } from '@prisma/client';
import type { Metadata } from 'next';
import { getT } from '@/modules/_shared/i18n/locale';

type OrderItem = Prisma.OrderItemGetPayload<Record<string, never>>;

export const metadata: Metadata = { title: 'Order Detail' };

const STATUS_COLORS = ORDER_STATUS_COLORS;

export default async function AdminOrderDetailPage({
  params,
}: {
  params: { orderId: string };
}) {
  const order = await prisma.order.findUnique({
    where: { id: params.orderId },
    include: {
      items: true,
      fawryPayment: true,
      coupon: { select: { code: true } },
      user: { select: { name: true, email: true } },
    },
  });

  if (!order) notFound();

  const { t } = getT();
  const STATUS_LABELS = getOrderStatusLabels(t);
  const shippingMethodLabel = order.shippingMethod === 'EXPRESS' ? t.admin.express : t.admin.standard;

  const PAYMENT_METHOD_LABELS: Record<string, string> = {
    PAY_AT_FAWRY: t.admin.payAtFawry,
    CASH_ON_DELIVERY: t.admin.cashOnDelivery,
    CARD: t.admin.card,
  };

  return (
    <div className="max-w-3xl">
      <div className="flex items-center gap-2 mb-6 text-sm">
        <Link href="/admin/orders" className="text-gray-400 hover:text-gray-600 transition-colors">
          {t.admin.ordersLink}
        </Link>
        <span className="text-gray-300">/</span>
        <span className="font-mono text-gray-700">{order.orderNumber}</span>
      </div>

      <div className="bg-white rounded-lg border border-gray-200 p-6 mb-4">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <h1 className="text-lg font-semibold text-gray-900">{order.orderNumber}</h1>
              <span
                className={`px-2 py-0.5 rounded-full text-xs font-medium ${STATUS_COLORS[order.status] ?? 'bg-gray-100 text-gray-600'}`}
              >
                {STATUS_LABELS[order.status] ?? order.status}
              </span>
            </div>
            <p className="text-sm text-gray-400">
              {t.admin.placed}{' '}
              {new Date(order.createdAt).toLocaleDateString('en-EG', {
                weekday: 'long',
                day: 'numeric',
                month: 'long',
                year: 'numeric',
              })}
            </p>
          </div>
          <div>
            <p className="text-xs text-gray-500 mb-1.5">{t.admin.updateStatus}</p>
            <OrderStatusSelect orderId={order.id} currentStatus={order.status} />
          </div>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-4 mb-4">
        <div className="bg-white rounded-lg border border-gray-200 p-5">
          <h2 className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-3">
            {t.admin.shippingAddress}
          </h2>
          <div className="text-sm space-y-1">
            <p className="font-medium text-gray-900">{order.shippingFullName}</p>
            <p className="text-gray-600">{order.shippingPhone}</p>
            <p className="text-gray-600">{order.shippingAddressLine}</p>
            <p className="text-gray-600">
              {order.shippingCity}, {order.shippingGovernorate}
            </p>
            {order.shippingPostalCode && (
              <p className="text-gray-400 text-xs">{t.admin.postalLabel(order.shippingPostalCode)}</p>
            )}
            <p className="text-gray-400 text-xs mt-1">
              {t.admin.shippingMethodLabel(shippingMethodLabel)}
            </p>
          </div>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 p-5">
          <h2 className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-3">
            {t.admin.paymentCustomer}
          </h2>
          <div className="text-sm space-y-1.5">
            <div className="flex justify-between">
              <span className="text-gray-500">{t.admin.email}</span>
              <span className="text-gray-900">{order.email}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">{t.admin.method}</span>
              <span className="text-gray-900">
                {PAYMENT_METHOD_LABELS[order.paymentMethod] ?? t.admin.card}
              </span>
            </div>
            {order.coupon && (
              <div className="flex justify-between">
                <span className="text-gray-500">{t.admin.coupon}</span>
                <span className="font-mono text-xs bg-gray-100 px-1.5 py-0.5 rounded">
                  {order.coupon.code}
                </span>
              </div>
            )}
            {order.fawryPayment && (
              <>
                <div className="flex justify-between">
                  <span className="text-gray-500">{t.admin.fawryStatus}</span>
                  <span className="text-gray-900">{order.fawryPayment.status}</span>
                </div>
                {order.fawryPayment.fawryRefNumber && (
                  <div className="flex justify-between gap-2">
                    <span className="text-gray-500 shrink-0">{t.admin.fawryRef}</span>
                    <span className="font-mono text-xs text-gray-700 truncate">
                      {order.fawryPayment.fawryRefNumber}
                    </span>
                  </div>
                )}
              </>
            )}
            {order.paidAt && (
              <div className="flex justify-between">
                <span className="text-gray-500">{t.admin.paidAt}</span>
                <span className="text-gray-900 text-xs">
                  {new Date(order.paidAt).toLocaleString('en-EG')}
                </span>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden mb-4">
        <div className="px-5 py-4 border-b border-gray-100">
          <h2 className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
            {t.admin.orderItems(order.items.length)}
          </h2>
        </div>
        <div className="divide-y divide-gray-100">
          {order.items.map((item: OrderItem) => (
            <div key={item.id} className="flex items-center gap-3 px-5 py-4">
              {item.imageUrlSnapshot && (
                <div className="w-12 h-12 rounded-md bg-gray-100 overflow-hidden shrink-0">
                  <OrderItemImage src={item.imageUrlSnapshot} alt={item.productNameSnapshot} />
                </div>
              )}
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900 line-clamp-1">
                  {item.productNameSnapshot}
                </p>
                <p className="text-xs text-gray-400">{item.productBrandSnapshot}</p>
                {item.variantAttributesSnapshot &&
                  Object.keys(item.variantAttributesSnapshot as Record<string, string>).length >
                    0 && (
                    <div className="flex items-center gap-2 flex-wrap mt-0.5">
                      {Object.entries(item.variantAttributesSnapshot as Record<string, string>).map(
                        ([k, v]) =>
                          k.toLowerCase() === 'color' ? (
                            <div
                              key={k}
                              className="w-5 h-5 rounded-full border-2 border-gray-200 shrink-0"
                              style={{ backgroundColor: v }}
                              title={v}
                            />
                          ) : (
                            <span key={k} className="text-xs text-gray-400">
                              {k}: {v}
                            </span>
                          ),
                      )}
                    </div>
                  )}
              </div>
              <div className="text-right shrink-0">
                <p className="text-sm font-semibold text-gray-900">
                  {formatEgp(Number(item.subtotalEgp))}
                </p>
                <p className="text-xs text-gray-400">
                  {item.quantity} × {formatEgp(Number(item.unitPriceEgp))}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-white rounded-lg border border-gray-200 p-5">
        <div className="space-y-2 text-sm max-w-xs ml-auto">
          <div className="flex justify-between text-gray-600">
            <span>{t.admin.subtotal}</span>
            <span>{formatEgp(Number(order.subtotalEgp))}</span>
          </div>
          <div className="flex justify-between text-gray-600">
            <span>{t.admin.shipping}</span>
            <span>{formatEgp(Number(order.shippingCostEgp))}</span>
          </div>
          {Number(order.discountEgp) > 0 && (
            <div className="flex justify-between text-green-600">
              <span>{t.admin.discount}</span>
              <span>−{formatEgp(Number(order.discountEgp))}</span>
            </div>
          )}
          <div className="flex justify-between font-bold text-gray-900 text-base pt-2 border-t border-gray-200">
            <span>{t.admin.total}</span>
            <span>{formatEgp(Number(order.totalEgp))}</span>
          </div>
        </div>
      </div>
    </div>
  );
}