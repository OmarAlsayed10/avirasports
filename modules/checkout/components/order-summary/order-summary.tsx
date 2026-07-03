'use client';

import Image from 'next/image';
import { formatEgpSimple } from '@/modules/_shared/utils/format-egp';
import { CouponInput } from '../coupon-input/coupon-input';
import { useLocale } from '@/modules/_shared/i18n/i18n.context';
import { orderSummaryTokens } from './order-summary.tokens';
import type { OrderSummaryProps } from './order-summary.types';

export function OrderSummary({
  items,
  discountEgp,
  appliedCoupon,
  onCouponApplied,
  shippingEgp,
}: OrderSummaryProps) {
  const { t } = useLocale();
  const isAr = t.dir === 'rtl';
  const subtotal = items.reduce((sum, i) => sum + i.unitPriceEgp * i.quantity, 0);
  const total = Math.max(0, subtotal + (shippingEgp ?? 0) - discountEgp);

  return (
    <div className={orderSummaryTokens.root}>
      <h2 className={orderSummaryTokens.title}>{t.checkout.orderSummary}</h2>

      <div className={orderSummaryTokens.itemsList}>
        {items.map((item) => (
          <div key={`${item.productId}-${item.variantId ?? ''}`} className={orderSummaryTokens.itemRow}>
            <div className={orderSummaryTokens.itemImageWrapper}>
              <Image
                src={item.imageUrl || '/placeholder-product.jpg'}
                alt={item.name}
                fill
                className="object-contain p-1"
                sizes="48px"
              />
              <span className={orderSummaryTokens.itemQtyBadge}>
                {item.quantity}
              </span>
            </div>
            <div className="flex-1 min-w-0">
              <p className={orderSummaryTokens.itemName}>
                {isAr && item.nameAr ? item.nameAr : item.name}
              </p>
            </div>
            <p className={orderSummaryTokens.itemPrice}>
              {formatEgpSimple(item.unitPriceEgp * item.quantity)}
            </p>
          </div>
        ))}
      </div>

      <hr className={orderSummaryTokens.divider} />

      <div>
        <p className={orderSummaryTokens.couponLabel}>{t.checkout.discountCode}</p>
        <CouponInput
          subtotalEgp={subtotal}
          onApplied={onCouponApplied}
          appliedCode={appliedCoupon}
        />
      </div>

      <hr className={orderSummaryTokens.divider} />

      <div className="space-y-2">
        <div className={orderSummaryTokens.totalsRow}>
          <span className={orderSummaryTokens.totalsLabel}>{t.checkout.subtotal}</span>
          <span>{formatEgpSimple(subtotal)}</span>
        </div>
        <div className={orderSummaryTokens.totalsRow}>
          <span className={orderSummaryTokens.totalsLabel}>{t.checkout.shipping}</span>
          <span>{shippingEgp === null ? t.checkout.selectGovernorate : formatEgpSimple(shippingEgp)}</span>
        </div>
        {discountEgp > 0 && (
          <div className={orderSummaryTokens.discountRow}>
            <span>{t.checkout.discount}</span>
            <span>- {formatEgpSimple(discountEgp)}</span>
          </div>
        )}
        <hr className={orderSummaryTokens.divider} />
        <div className={orderSummaryTokens.totalRow}>
          <span>{t.checkout.total}</span>
          <span>{formatEgpSimple(total)}</span>
        </div>
      </div>
    </div>
  );
}
