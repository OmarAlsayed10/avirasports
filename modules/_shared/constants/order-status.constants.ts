import type { Translations } from '@/modules/_shared/i18n/i18n.translations';

export const ORDER_STATUS_LABELS: Record<string, string> = {
  pending_payment: 'Pending Payment',
  paid: 'Paid',
  processing: 'Processing',
  shipped: 'Shipped',
  delivered: 'Delivered',
  cancelled: 'Cancelled',
};

export const ORDER_STATUS_COLORS: Record<string, string> = {
  pending_payment: 'bg-yellow-100 text-yellow-700',
  paid: 'bg-blue-100 text-blue-700',
  processing: 'bg-indigo-100 text-indigo-700',
  shipped: 'bg-purple-100 text-purple-700',
  delivered: 'bg-green-100 text-green-700',
  cancelled: 'bg-gray-100 text-gray-500',
};

export function getOrderStatusLabels(t: Translations): Record<string, string> {
  return {
    pending_payment: t.admin.statusPendingPayment,
    paid: t.admin.statusPaid,
    processing: t.admin.statusProcessing,
    shipped: t.admin.statusShipped,
    delivered: t.admin.statusDelivered,
    cancelled: t.admin.statusCancelled,
  };
}
