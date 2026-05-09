'use client';

import { useTransition } from 'react';
import { updateOrderStatus } from '@/lib/server-actions/admin/orders';
import type { OrderStatus } from '@prisma/client';
import { Loader2 } from 'lucide-react';
import { useLocale } from '@/lib/i18n/context';

export default function OrderStatusSelect({
  orderId,
  currentStatus,
}: {
  orderId: string;
  currentStatus: OrderStatus;
}) {
  const [isPending, startTransition] = useTransition();
  const { t } = useLocale();

  const STATUS_OPTIONS: { value: OrderStatus; label: string }[] = [
    { value: 'pending_payment', label: t.admin.statusPendingPayment },
    { value: 'paid', label: t.admin.statusPaid },
    { value: 'processing', label: t.admin.statusProcessing },
    { value: 'shipped', label: t.admin.statusShipped },
    { value: 'delivered', label: t.admin.statusDelivered },
    { value: 'cancelled', label: t.admin.statusCancelled },
  ];

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const status = e.target.value as OrderStatus;
    startTransition(async () => {
      await updateOrderStatus(orderId, status);
    });
  };

  return (
    <div className="flex items-center gap-2">
      <select
        defaultValue={currentStatus}
        onChange={handleChange}
        disabled={isPending}
        className="px-3 py-1.5 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary disabled:opacity-60 transition-colors"
      >
        {STATUS_OPTIONS.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
      {isPending && <Loader2 className="w-4 h-4 animate-spin text-gray-400" />}
    </div>
  );
}
