'use client';

import { useEffect } from 'react';
import { trackPixelEvent } from '@/modules/_shared/analytics/meta-pixel-events';

export function OrderSuccessTracker({
  orderNumber,
  totalEgp,
  items,
}: {
  orderNumber: string;
  totalEgp: number;
  items: Array<{ productId: string; name: string; unitPriceEgp: number; quantity: number }>;
}) {
  useEffect(() => {
    const trackedKey = `pixel_purchased_${orderNumber}`;
    if (sessionStorage.getItem(trackedKey)) return; // Prevent double firing on refresh

    trackPixelEvent.purchase(
      orderNumber,
      totalEgp,
      items.map((item) => ({
        content_id: item.productId,
        content_name: item.name,
        price: item.unitPriceEgp,
        quantity: item.quantity,
      }))
    );
    sessionStorage.setItem(trackedKey, 'true');
  }, [orderNumber, totalEgp, items]);

  return null;
}
